import { prisma } from "../../config/database.js";
import { NoteStatus } from "../../generated/prisma/enums.js";
import { AppError } from "../../middlewares/app-error.js";
import { getUserNote } from "./notes.service.js";

export const createNote = async (data: {
    userId: string;
    title: string;
    content?: string
}) => {
    return prisma.note.create({
      data: {
        userId: data.userId,
        title: data.title,
        content: data.content
      }
    });
};

export const findNotesByUserId = async (userId: string, status?: NoteStatus) => {
    return prisma.note.findMany({
        where: {
            userId,
            ...(status ? { status } : {})
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};

export const findNoteById = async (noteId: string, userId: string) => {
    return prisma.note.findFirst({
        where: {
            id: noteId,
            userId
        }
    });
};

export const updateNote = async (
  noteId: string,
  userId: string,
  data: {
    title?: string;
    content?: string;
  }
) => {
  return prisma.note.updateMany({
    where: {
      id: noteId,
      userId
    },
    data
  });
};

export const completeNote = async (noteId: string, userId: string) => {
    return prisma.note.updateMany({
        where: {
            id: noteId,
            userId
        },
        data: {
            status: NoteStatus.COMPLETED,
            completedAt: new Date()
        }
    });
};

export const deleteNote = async (noteId: string, userId: string) => {
    return prisma.note.deleteMany({
        where: {
            id: noteId,
            userId
        }
    });
};

export const completeUserNote = async (
  userId: string,
  noteId: string
) => {
  const result = await completeNote(
    noteId,
    userId
  );

  if (result.count === 0) {
    throw new AppError(
      "Note not found",
      404
    );
  }

  return getUserNote(userId, noteId);
};

export const deleteUserNote = async (
  userId: string,
  noteId: string
) => {
  const result = await deleteNote(
    noteId,
    userId
  );

  if (result.count === 0) {
    throw new AppError(
      "Note not found",
      404
    );
  }

  return {
    message: "Note deleted successfully"
  };
};
