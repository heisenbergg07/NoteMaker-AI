import api from "../../services/api"
import { type ApiResponse } from "../../types/ApiResponse"
import type { Note, NoteStatus } from "./note.types"

export type CreateNoteInput = {
   title: string;
  content?: string;
};

export type UpdateNoteInput = {
  title?: string;
  content?: string;
  status?: NoteStatus;
};

// Get all notes
export const getNotes = async (): Promise<Note[]> => {
    const response = await api.get<ApiResponse<Note[]>>("/api/v1/notes");
    return response.data.data;
};

// Create a note
export const createNote = async (
  input: CreateNoteInput
): Promise<Note> => {
  const response = await api.post<ApiResponse<Note>>(
    "/api/v1/notes",
    input
  );

  return response.data.data;
};

// UPDATE NOTE
export const updateNote = async (
  noteId: string,
  input: UpdateNoteInput
): Promise<Note> => {
  const response = await api.patch<ApiResponse<Note>>(
    `/api/v1/notes/${noteId}`,
    input
  );

   console.log("Update response:", response.data);

  return response.data.data;
};

// Mark note completed
export const completeNote = async (
  noteId: string
): Promise<Note> => {
  const response = await api.patch<ApiResponse<Note>>(
    `/api/v1/notes/${noteId}/complete`
  );

  return response.data.data;
};

// DELETE NOTE

export const deleteNote = async (
  noteId: string
): Promise<void> => {
  await api.delete(
    `/api/v1/notes/${noteId}`
  );
};
