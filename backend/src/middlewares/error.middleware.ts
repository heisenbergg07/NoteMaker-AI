import { NextFunction, Request, Response } from "express";
import { AppError } from "./app-error.js";
import { ZodError } from "zod";

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    try {
        if (error instanceof AppError) {
            res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
            return;
        }

         // Zod validation errors
        if (error instanceof ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
                }))
            });
            return;
        }

        // Unknown/unhandled errors
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    } catch (error){
        next(error);
    }
}
