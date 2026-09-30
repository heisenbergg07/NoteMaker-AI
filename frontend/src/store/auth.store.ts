import { create } from "zustand";
import type { User } from "../features/auth/auth.types"

type AuthState = {
    user: User | null;
    token: string | null;

    setAuth: (user: User, token: string) => void;
    setUser: (user: User) => void;
    logout: () => void;
};

const getStoredUser = (): User | null => {
    const user = localStorage.getItem("user");

    if (!user) {
        return null;
    }

    try {
       return JSON.parse(user);
    } catch {
        return null;
    }
};

export const useAuthStore = create<AuthState>((set) => ({
    user: getStoredUser(),
    token: localStorage.getItem('token'),

    setAuth: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      user,
      token,
    });
  },

    setUser: (user) => {
    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );

    set({
      user,
    });
  },   

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      user: null,
      token: null,
    });
  },
}));;