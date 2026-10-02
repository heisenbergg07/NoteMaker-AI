import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { handleAICommand } from "./ai.controller.js";
const router = Router();

router.post(
  "/command",
  authMiddleware,
  handleAICommand
);

export default router;
