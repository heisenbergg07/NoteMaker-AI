export type AIAction =
  | "create_note"
  | "list_notes"
  | "update_note"
  | "complete_note"
  | "delete_note";

export type CreateNoteAICommand = {
  action: "create_note";
  arguments: {
    title: string;
    content?: string;
  };
};

export type ListNotesAICommand = {
  action: "list_notes";
  arguments: {
    status?: "PENDING" | "COMPLETED";
  };
};

export type CompleteNoteAICommand = {
  action: "complete_note";
  arguments: {
    noteId?: string;
    searchText?: string;
  };
};

export type DeleteNoteAICommand = {
  action: "delete_note";
  arguments: {
    noteId?: string;
    searchText?: string;
  };
};

export type UpdateNoteAICommand = {
  action: "update_note";
  arguments: {
    noteId?: string;
    searchText?: string;
    title?: string;
    content?: string;
  };
};

export type ParsedAICommand =
  | CreateNoteAICommand
  | ListNotesAICommand
  | CompleteNoteAICommand
  | DeleteNoteAICommand
  | UpdateNoteAICommand;
