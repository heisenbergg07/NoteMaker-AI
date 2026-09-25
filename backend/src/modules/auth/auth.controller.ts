import { NextFunction, Request, Response } from "express";
import { registerSchema } from "./auth.schemas.js";
import { registerUser } from "./auth.service.js";

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate and transform request body
        const input = registerSchema.parse(req.body);

        // Business logic
        const result = await registerUser(input);

        // Send create response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result
        })
    } catch (error) {
        next(error);
    }
}