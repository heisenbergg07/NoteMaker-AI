import { env } from "../../config/env.js";
import { AppError } from "../../middlewares/app-error.js";
import { createUser, findUserByEmail } from "./auth.repository.js";
import { RegisterInput } from "./auth.schemas.js";

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