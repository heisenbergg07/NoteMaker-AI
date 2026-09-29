import { Router } from "express";
import { authMiddleware } from "../auth/auth.middleware.js";
import { completeNoteController, createNoteController, getAllNotesController, getOneNoteController, removeNoteController, updateNoteController } from "./notes.controller.js";

const router = Router();

router.use(authMiddleware);

// Create new note
router.post("/", createNoteController);

// Get all notes
router.get("/", getAllNotesController);

// Get single note
router.get("/:id", getOneNoteController);

// Update the note
router.patch("/:id", updateNoteController);

// Mark note as completed
router.patch("/:id/complete", completeNoteController);

// Delete the note
router.delete("/:id", removeNoteController);

export default router;
