import api from "../../services/api";
import type { AuthResponse, LoginInput, RegisterInput } from "./auth.types";

type ApiResponse<T> = {
    success: boolean;
    message?: string;
    data: T;
};

export const registerUser = async (input: RegisterInput): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>("api/v1/auth/register", input);

    return response.data.data;
};

export const loginUser = async (
  input: LoginInput
): Promise<AuthResponse> => {
  const response = await api.post<ApiResponse<AuthResponse>>(
    "/api/v1/auth/login",
    input
  );

  return response.data.data;
};
