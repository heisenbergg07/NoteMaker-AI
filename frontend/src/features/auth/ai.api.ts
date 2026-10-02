import api from "../../services/api";
import type { ApiResponse } from "../../types/ApiResponse";
import type { Note } from "../notes/note.types";

type AICommandResponse = {
  type: "message" | "tool_result";
  action?: "create_note";
  message: string;
  data?: Note;
};

export const sendAICommand = async (
  message: string
): Promise<AICommandResponse> => {
  const response = await api.post<
    ApiResponse<AICommandResponse>
  >("/api/v1/ai/command", {
    message,
  });

  return response.data.data;
};
