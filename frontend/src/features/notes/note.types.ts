export type NoteStatus =
  | "PENDING"
  | "COMPLETED";

export type Note = {
  id: string;
  title: string;
  content: string | null;
  status: NoteStatus;
  createdAt: string;
  updatedAt: string;
};
