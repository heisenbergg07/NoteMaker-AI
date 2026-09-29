import { z } from "zod";

export const createNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must be at most 200 characters"),

  content: z
    .string()
    .trim()
    .max(10000, "Content must be at most 10000 characters")
    .optional()
});

export const updateNoteSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(200, "Title must be at most 200 characters")
    .optional(),

  content: z
    .string()
    .trim()
    .max(10000, "Content must be at most 10000 characters")
    .optional()
});

export const noteStatusSchema = z.enum([
  "PENDING",
  "COMPLETED"
]);

export type CreateNoteInput = z.infer<
  typeof createNoteSchema
>;

export type UpdateNoteInput = z.infer<
  typeof updateNoteSchema
>;

export type NoteStatusInput = z.infer<
  typeof noteStatusSchema
>;
