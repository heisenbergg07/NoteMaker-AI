import express from "express";
import healthRouter from "./routes/health.routes.js";
import helmet from "helmet";
import cors from 'cors';
import { env } from "./config/env.js";
import cookieParser from "cookie-parser";
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

// Security middleware
app.use(helmet());

// Cross-origin requests
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true
  })
);

// Global middleware
app.use(express.json());
app.use(cookieParser());

// health check routes
app.use("/health", healthRouter);

// 404 handler
app.use(notFoundMiddleware);

// Global error handler
app.use(errorMiddleware);

export default app;
