import { Router } from "express";
import { loginController, meController, registerController } from "./auth.controller.js";
import { authMiddleware } from "./auth.middleware.js";

const router = Router();

// sign-up
router.post("/register", registerController);

// login
router.post("/login", loginController);

router.get("/me", authMiddleware, meController);

export default router;
