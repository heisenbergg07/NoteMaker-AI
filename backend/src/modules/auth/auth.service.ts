import { env } from "../../config/env.js";
import { AppError } from "../../middlewares/app-error.js";
import { createUser, findUserByEmail, findUserById } from "./auth.repository.js";
import { LoginInput, RegisterInput } from "./auth.schemas.js";

import bycrypt from "bcrypt";
import jwt from 'jsonwebtoken';

export const registerUser = async (input: RegisterInput) => {
    // Check if user already exists
    const existingUser = await findUserByEmail(input.email);

    if (existingUser) {
        throw new AppError(
            "User with this email already exists",
            409
        );
    }

    // Create hashed password 
    const hashedPassword = await bycrypt.hash(input.password, 12);

    // Create user
    const newUser = await createUser({
        name: input.name,
        email: input.email,
        password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign(
        {
            userId: newUser.id
        },
        env.JWT_SECRET,
        {
            expiresIn: env.JWT_EXPIRES_IN as any
        }
    );

    // 5. Never return password
  return {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    },
    token
  };
}

export const loginUser = async (input: LoginInput) => {
    const user = await findUserByEmail(input.email);

    if (!user) {
        throw new AppError("Invalid email or password", 401);
    }

    const isPasswordValid = await bycrypt.compare(
        input.password,
        user.password
    );

    if (!isPasswordValid) {
        throw new AppError("Invalid email or password", 401);
    }

    const token = jwt.sign(
    {
      userId: user.id
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN as any
    }
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    token
  };
};

export const getMe = async (userId: string) => {
    const user = await findUserById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email
  };
};
