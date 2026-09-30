import api from "../../services/api"
import { type ApiResponse } from "../../types/ApiResponse"
import type { Note } from "./note.types"

export const getNotes = async (): Promise<Note[]> => {
    const response = await api.get<ApiResponse<Note[]>>("/api/v1/notes");
    return response.data.data;
};
