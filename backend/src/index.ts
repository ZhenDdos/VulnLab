import express, { type Express, type Request, type Response } from "express";
import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";
import cartRouter from "./routes/cart.js";
import ordersRouter from "./routes/orders.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { swaggerSpec } from "./swagger.js";
import swaggerUi from "swagger-ui-express";
import { authMiddleware } from "./middlewares/authMiddleware.js";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/products", authMiddleware, productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", authMiddleware, cartRouter);
app.use("/api/orders", authMiddleware, ordersRouter);

app.get("/api/health", (req: Request, res: Response) => {
  res.send({ status: "ok", message: "backend is working" });
});

app.listen(8000, "0.0.0.0");
