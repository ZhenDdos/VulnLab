import express, { type Express, type Request, type Response } from "express";
import { pool } from "../db.js";

const app: Express = express();

app.get("/", async (_: Request, res: Response) => {
  try {
    const query = "SELECT * FROM products";
    const result = await pool.query(query);
    return res.status(200).json(result.rows);
  } catch {
    return res.status(500).json({ error: "Ошибка получения списка товаров" });
  }
});

export default app;
