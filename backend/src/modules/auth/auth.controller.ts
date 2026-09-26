import { NextFunction, Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.schemas.js";
import { getMe, loginUser, registerUser } from "./auth.service.js";

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
        });
    } catch (error) {
        next(error);
    }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate and transform request body
        const input = loginSchema.parse(req.body);

        // Business logic
        const result = await loginUser(input);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result
        });
    } catch (error) {
        next (error);
    }
};

export const meController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await getMe(req.user!.userId);

        res.status(200).json({
          success: true,
          data: user
        });
    } catch (error) {
        next(error);
    }
}