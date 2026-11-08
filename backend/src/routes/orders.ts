import { Router, type Response } from "express";
import type { PoolClient } from "pg";
import { pool } from "../db.js";
import type { AuthRequest } from "../middlewares/authMiddleware.js";

const router: Router = Router();

router.post("/", async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Ошибка авторизации" });
  }

  let client: PoolClient | undefined;
  let transactionStarted = false;

  try {
    client = await pool.connect();
    await client.query("BEGIN");
    transactionStarted = true;

    const cartResult = await client.query<{ id: number }>(
      `SELECT ci.id
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = $1
       ORDER BY ci.id
       FOR UPDATE OF ci, p`,
      [userId],
    );
    if (cartResult.rows.length === 0) {
      await client.query("ROLLBACK");
      transactionStarted = false;
      return res.status(400).json({ error: "Корзина пуста" });
    }

    const cartItemIds = cartResult.rows.map((item) => item.id);
    const orderResult = await client.query<{
      id: number;
      user_id: number;
      total_price: string;
      status: string;
      created_at: Date;
    }>(
      `INSERT INTO orders (user_id, total_price)
       SELECT $1, COALESCE(SUM(p.price * ci.quantity), 0)
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = $1 AND ci.id = ANY($2::int[])
       RETURNING id, user_id, total_price, status, created_at`,
      [userId, cartItemIds],
    );

    const order = orderResult.rows[0];
    if (!order) {
      throw new Error("Заказ не был создан");
    }

    const itemsResult = await client.query(
      `INSERT INTO order_items
        (order_id, product_id, quantity, price_at_purchase)
       SELECT $1, ci.product_id, ci.quantity, p.price
       FROM cart_items ci
       JOIN products p ON p.id = ci.product_id
       WHERE ci.user_id = $2 AND ci.id = ANY($3::int[])`,
      [order.id, userId, cartItemIds],
    );

    if (itemsResult.rowCount !== cartItemIds.length) {
      throw new Error("Не все товары заказа удалось сохранить");
    }

    const deleteResult = await client.query(
      `DELETE FROM cart_items
       WHERE user_id = $1 AND id = ANY($2::int[])`,
      [userId, cartItemIds],
    );
    if (deleteResult.rowCount !== cartItemIds.length) {
      throw new Error("Не все товары удалось удалить из корзины");
    }

    await client.query("COMMIT");
    transactionStarted = false;

    return res.status(201).json({
      message: "Заказ создан",
      order,
    });
  } catch (error) {
    console.error("Ошибка создания заказа:", error);

    if (client && transactionStarted) {
      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error("Ошибка отката транзакции заказа:", rollbackError);
      }
    }

    return res.status(500).json({ error: "Ошибка создания заказа" });
  } finally {
    client?.release();
  }
});

export default router;
