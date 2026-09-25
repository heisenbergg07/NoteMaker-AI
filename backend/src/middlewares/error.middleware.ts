import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
    try {
        let err = { ...error }

        err.message = error.message;

        console.error(err);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    } catch (error){
        next(error);
    }
}
