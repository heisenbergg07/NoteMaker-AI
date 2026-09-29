import { NextFunction, Request, Response } from "express";
import { createNoteSchema, noteStatusSchema, updateNoteSchema } from "./notes.schemas.js";
import { createUserNote, getUserNote, getUserNotes, updateUserNote } from "./notes.service.js";
import { completeUserNote, deleteUserNote } from "./notes.repository.js";

export const createNoteController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const input = createNoteSchema.parse(req.body);

        const note = await createUserNote(req.user!.userId, input);

        res.status(201).json({
            success: true,
            message: "Note created successfully",
            data: note
        });
    } catch (error) {
        next(error);
    }
}

export const getAllNotesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
         const status = req.query.status
      ? noteStatusSchema.parse(req.query.status)
      : undefined;

    const notes = await getUserNotes(
      req.user!.userId,
      status
    );

    res.status(200).json({
      success: true,
      data: notes
    });
    } catch (error) {
        next(error);
    }
};

export const getOneNoteController = async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    try {
        const note = await getUserNote(
            req.user!.userId,
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: note
        });
    } catch (error) {
        next(error);
    }
}

export const updateNoteController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const input = updateNoteSchema.parse(req.body);

    const note = await updateUserNote(
      req.user!.userId,
      req.params.id,
      input
    );

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note
    });
  } catch (error) {
    next(error);
  }
};

export const completeNoteController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const note = await completeUserNote(
      req.user!.userId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Note completed successfully",
      data: note
    });
  } catch (error) {
    next(error);
  }
};

export const removeNoteController = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await deleteUserNote(
      req.user!.userId,
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
};
