import { z } from "zod";

export const aiCommandSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(1000, "Message is too long"),
});

export type AICommandInput = z.infer<
  typeof aiCommandSchema
>;
