import { Router, type Response } from "express";
import { pool } from "../db.js";
import { type AuthRequest } from "../middlewares/authMiddleware.js";

const router: Router = Router();

router.post("/add", async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.body;
    const userId = req.user?.userId;
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({ error: "A valid productId is required" });
    }

    const query = `
      INSERT INTO cart_items (user_id, product_id, quantity) 
      SELECT $1, id, 1
      FROM products
      WHERE id = $2
      ON CONFLICT (user_id, product_id) 
      DO UPDATE SET quantity = cart_items.quantity + 1
      RETURNING *;
    `;
    const values = [userId, productId];
    const result = await pool.query(query, values);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Товар не найден" });
    }

    return res.status(201).json({ message: "Товар добавлен в корзину" });
  } catch (error) {
    console.error("Ошибка добавления в корзину:", error);
    res.status(500).json({ error: "Ошибка добавления товара в корзину" });
  }
});

router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const query = `
      SELECT 
        ci.id AS cart_item_id, 
        ci.quantity, 
        p.id AS product_id, 
        p.name, 
        p.price, 
        p.image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = $1
    `;
    const values = [userId];
    const result = await pool.query(query, values);
    return res.status(200).json(result.rows);
  } catch (error) {
    console.error("Ошибка получения корзины:", error);
    return res.status(500).json({ error: "Ошибка получения корзины" });
  }
});

router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    const cartItemId = req.params.id;
    const userId = req.user?.userId;

    const query =
      "DELETE FROM cart_items WHERE id = $1 AND user_id = $2 RETURNING *";
    const result = await pool.query(query, [cartItemId, userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Товар в корзине не найден" });
    }

    return res.status(200).json({ message: "Товар удален из корзины" });
  } catch (error) {
    console.error("Ошибка удаления из корзины:", error);
    return res.status(500).json({ error: "Ошибка удаления товара" });
  }
});

router.put("/:id/decrement", async (req: AuthRequest, res: Response) => {
  try {
    const cartItemId = req.params.id;
    const userId = req.user?.userId;

    const updateQuery = `
      UPDATE cart_items 
      SET quantity = quantity - 1 
      WHERE id = $1 AND user_id = $2 
      RETURNING quantity
    `;
    const updateResult = await pool.query(updateQuery, [cartItemId, userId]);

    if (updateResult.rowCount === 0) {
      return res.status(404).json({ error: "Товар не найден в вашей корзине" });
    }

    const newQuantity = updateResult.rows[0].quantity;
    if (newQuantity <= 0) {
      await pool.query("DELETE FROM cart_items WHERE id = $1", [cartItemId]);
      return res.status(200).json({ message: "Товар удален из корзины" });
    }

    return res.status(200).json({
      message: "Количество уменьшено",
      quantity: newQuantity,
    });
  } catch (error) {
    console.error("Ошибка уменьшения количества:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

router.put("/:id/increment", async (req: AuthRequest, res: Response) => {
  try {
    const cartItemId = req.params.id;
    const userId = req.user?.userId;

    const result = await pool.query(
      `UPDATE cart_items
       SET quantity = quantity + 1
       WHERE id = $1 AND user_id = $2
       RETURNING quantity`,
      [cartItemId, userId],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Товар не найден в вашей корзине" });
    }

    return res.status(200).json({
      message: "Количество увеличено",
      quantity: result.rows[0].quantity,
    });
  } catch (error) {
    console.error("Ошибка увеличения количества:", error);
    return res.status(500).json({ error: "Ошибка сервера" });
  }
});

export default router;
