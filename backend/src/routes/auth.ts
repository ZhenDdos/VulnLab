import { Router, type Request, type Response } from "express";
import { pool } from "../db.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  authMiddleware,
  type AuthRequest,
} from "../middlewares/authMiddleware.js";

const router: Router = Router();
dotenv.config();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Регистрация нового пользователя
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@test.com
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *       500:
 *         description: Ошибка сервера
 */
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email и пароль обязательны" });
    }
    const query =
      "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email";
    const values = [email, await bcrypt.hash(password, 10)];
    await pool.query(query, values);
    return res.status(201).json({ message: "Пользователь создан" });
  } catch (error) {
    console.error("Ошибка регистрации:", error);
    // Обязательно отвечаем клиенту при ошибке!
    return res
      .status(500)
      .json({ error: "Ошибка при регистрации (возможно, email занят)" });
  }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Авторизация пользователя
 *     description: Проверяет email и пароль, возвращает ID пользователя в случае успеха.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@test.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Успешный вход
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Успешный вход"
 *                 userId:
 *                   type: integer
 *                   example: 1
 *       401:
 *         description: Неверный email или пароль
 *       500:
 *         description: Ошибка сервера
 */
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email и пароль обязательны" });
    }

    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    const token = jwt.sign(
      { email, userId: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: Math.floor(Date.now() / 1000) + 60 * 60,
        algorithm: "HS256",
      },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 3600000,
      path: "/",
    });

    return res.status(200).json({ message: "Успешный вход", userId: user.id });
  } catch (error) {
    console.error("Ошибка логина:", error);
    return res.status(500).json({ error: "Ошибка сервера при входе" });
  }
});

router.get("/me", authMiddleware, (req: AuthRequest, res: Response) => {
  return res.json({
    userId: req.user!.userId,
    email: req.user!.email,
  });
});

router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });
  return res.status(200).json({ message: "Успешный выход" });
});

export default router;
