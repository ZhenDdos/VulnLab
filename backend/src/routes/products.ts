import { Router, type Request, type Response } from "express";
import { pool } from "../db.js";

const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  try {
    const sortBy =
      typeof req.query.sortBy === "string"
        ? req.query.sortBy.toLowerCase()
        : "";
    const sortDirection = sortBy === "desc" ? "DESC" : "ASC";
    const query = `SELECT * FROM products ORDER BY name ${sortDirection}`;
    const result = await pool.query(query);
    return res.status(200).json(result.rows);
  } catch {
    return res.status(500).json({ error: "Ошибка получения списка товаров" });
  }
});

export default router;
