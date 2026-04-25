import { GoogleGenAI } from "@google/genai";

import { env } from "@/lib/env";

const ai = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

const RETRYABLE_STATUS_CODES = new Set([429, 500, 503]);
const MAX_ATTEMPTS = 3;

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function getStatusCode(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return undefined;
  }

  const maybeError = error as {
    status?: number;
    code?: number;
    error?: { code?: number; status?: string; message?: string };
  };

  return maybeError.status ?? maybeError.code ?? maybeError.error?.code;
}

function isRetryableError(error: unknown) {
  const statusCode = getStatusCode(error);
  const message = getErrorMessage(error);

  return (
    (typeof statusCode === "number" && RETRYABLE_STATUS_CODES.has(statusCode)) ||
    message.includes("UNAVAILABLE") ||
    message.includes("high demand")
  );
}

async function wait(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

export async function transcribeAudioFile(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  data: buffer.toString("base64"),
                  mimeType: file.type || "audio/mpeg",
                },
              },
              {
                text: "Transcribe this audio exactly. Return only the transcript text with speaker labels only if they are clearly distinct.",
              },
            ],
          },
        ],
      });

      return response.text?.trim() ?? "";
    } catch (error) {
      lastError = error;

      if (!isRetryableError(error) || attempt === MAX_ATTEMPTS) {
        break;
      }

      await wait(500 * attempt);
    }
  }

  throw new Error(getErrorMessage(lastError));
}
