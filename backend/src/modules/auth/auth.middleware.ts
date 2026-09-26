import { NextFunction, Request, Response } from "express";
import { AppError } from "../../middlewares/app-error.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../../config/env.js";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError("Authentication required", 401);
        }

        const [scheme, token] = authHeader.split(" ");

        if (scheme !== 'Bearer' || !token) {
            throw new AppError("Invalid authorization header", 401);
        }

        const decoded = jwt.verify(
            token,
            env.JWT_SECRET
        ) as JwtPayload;

        req.user = {
            userId: decoded.userId
        };

        next();
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
            return;
        }

        next(new AppError("Invalid or expired token", 401));
    }
}