import express, { type Express, type Request, type Response } from "express";
import { pool } from "../db.js";
import { getSortDirection } from "../utils/sortDirection.js";

const app: Express = express();

app.get("/", async (req: Request, res: Response) => {
  try {
    const sortDirection = getSortDirection(req.query.sortBy);
    const query = `SELECT * FROM products ORDER BY name ${sortDirection}`;
    const result = await pool.query(query);
    return res.status(200).json(result.rows);
  } catch {
    return res.status(500).json({ error: "Ошибка получения списка товаров" });
  }
});

export default app;
