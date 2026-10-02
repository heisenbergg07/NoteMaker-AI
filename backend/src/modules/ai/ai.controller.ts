import type {
    NextFunction,
  Request,
  Response,
} from "express";
import { aiCommandSchema } from "./ai.schemas.js";

export const handleAICommand =async (req: Request, res: Response, next: NextFunction) => {
  try {
    const input = aiCommandSchema.parse(req.body);

    if (!input || !input.message) {
        return res.status(400).json({
            success: false,
            message: "Invalid AI command",
            errors: "Message is required"
        });
    }

    const message = input.message;

    const userId = req.user?.userId;

    console.log("AI command:", {
        userId,
        message,
    });

    return res.status(200).json({
        success: true,
        message: "AI endpoint is ready",
        data: {
            input: message,
        },
    });
  } catch (error) {
     next(error);
  }
};
