
import OpenAI from "openai";
import { z } from "zod";

import { env } from "../../config/env.js";
import { createNote } from "../notes/notes.repository.js";

/* -----------------------------------
   OpenAI Client
------------------------------------ */

const client = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

/* -----------------------------------
   Tool Argument Schemas
------------------------------------ */

const createNoteArgumentsSchema = z.object({
  title: z.string().trim().min(1),
  content: z.string().nullable(),
});

type CreateNoteArguments = z.infer<
  typeof createNoteArgumentsSchema
>;

/* -----------------------------------
   OpenAI Tools
------------------------------------ */

const tools: OpenAI.Responses.Tool[] = [
  {
    type: "function",

    name: "create_note",

    description:
      "Create a new note for the authenticated user.",

    parameters: {
      type: "object",

      properties: {
        title: {
          type: "string",
          description:
            "A short and meaningful title for the note.",
        },

        content: {
          type: ["string", "null"],
          description:
            "Additional content for the note. Use null if no additional content is provided.",
        },
      },

      required: ["title", "content"],

      additionalProperties: false,
    },

    strict: true,
  },
];

/* -----------------------------------
   Process AI Command
------------------------------------ */

export const processAICommand = async (
  message: string,
  userId: string
) => {
  const response =
    await client.responses.create({
      model: "gpt-6-luna",

      instructions: `
You are the AI assistant for NoteMaker AI.

Your job is to understand the user's request and use the
available tools when the user wants to perform an action
on their notes.

Currently you can create notes.

When creating a note:
- Generate a short and meaningful title.
- Put additional information in content.
- If there is no additional content, use null.

Do not invent note IDs or user information.

The authenticated user's identity is handled by the
application and must never be inferred from the message.
      `.trim(),

      input: message,

      tools,
    });

  /* -----------------------------------
     Find Tool Call
  ------------------------------------ */

  const toolCall = response.output.find(
    (item) =>
      item.type === "function_call"
  );

  /*
   * The model may decide that no tool
   * needs to be called.
   */
  if (!toolCall) {
    return {
      type: "message",
      message:
        response.output_text ||
        "I couldn't determine an action to perform.",
    };
  }

  /* -----------------------------------
     CREATE NOTE
  ------------------------------------ */

  if (toolCall.name === "create_note") {
    let rawArguments: unknown;

    try {
      rawArguments = JSON.parse(
        toolCall.arguments
      );
    } catch {
      throw new Error(
        "AI returned invalid JSON arguments."
      );
    }

    /*
     * Never trust LLM-generated data
     * directly.
     */
    const args =
      createNoteArgumentsSchema.parse(
        rawArguments
      );

    const note = await createNote({
      userId,

      title: args.title,

      content:
        args.content ?? undefined,
    });

    return {
      type: "tool_result",

      action: "create_note",

      message:
        "Note created successfully",

      data: note,
    };
  }

  /* -----------------------------------
     Unsupported Tool
  ------------------------------------ */

  return {
    type: "message",

    message:
      "I couldn't determine a supported action.",
  };
};

