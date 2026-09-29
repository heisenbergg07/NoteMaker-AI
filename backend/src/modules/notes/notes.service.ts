import { AppError } from "../../middlewares/app-error.js";
import { createNote, findNoteById, findNotesByUserId, updateNote } from "./notes.repository.js";
import { CreateNoteInput, NoteStatusInput, UpdateNoteInput } from "./notes.schemas.js";

export const createUserNote = async (userId: string, input: CreateNoteInput) => {
    return createNote({
        userId,
        title: input.title,
        content: input.content
    });
};

export const getUserNotes = async (
  userId: string,
  status?: NoteStatusInput
) => {
  return findNotesByUserId(userId, status);
};

export const getUserNote = async ( userId: string, noteId: string) => {
    const note = await findNoteById(noteId, userId);

    if (!note){
        throw new AppError("Note not found", 404);
    }

    return note;
};

export const updateUserNote = async (
  userId: string,
  noteId: string,
  input: UpdateNoteInput
) => {
  const result = await updateNote(
    noteId,
    userId,
    input
  );

  if (result.count === 0) {
    throw new AppError(
      "Note not found",
      404
    );
  }

  return getUserNote(userId, noteId);
};