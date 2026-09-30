import api from "../../services/api";
import type { ApiResponse } from "../../types/ApiResponse";
import type { AuthResponse, LoginInput, RegisterInput, User } from "./auth.types";

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

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get<ApiResponse<User>>(
    "/api/v1/auth/me"
  );

  return response.data.data;
};
