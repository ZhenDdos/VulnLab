import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: { userId: number; email: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Ошибка авторизации" });
  }

  try {
    const jwtDecode = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: number;
      email: string;
    };
    req.user = jwtDecode;
    next();
  } catch {
    return res.status(401).json({ error: "Недействительный токен" });
  }
};
