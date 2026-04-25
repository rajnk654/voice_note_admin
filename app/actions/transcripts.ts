"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { transcribeAudioFile } from "@/lib/gemini";
import { transcripts } from "@/lib/schema";
import { requireSession } from "@/lib/session";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const SUPPORTED_AUDIO_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
  "audio/webm",
  "audio/ogg",
]);

export type TranscriptFormState = {
  error?: string;
  success?: string;
};

export async function createTranscriptAction(
  _previousState: TranscriptFormState,
  formData: FormData,
): Promise<TranscriptFormState> {
  const session = await requireSession();
  const file = formData.get("audio");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please choose an audio file before uploading." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: "Audio files must be 20 MB or smaller." };
  }

  if (file.type && !SUPPORTED_AUDIO_TYPES.has(file.type)) {
    return { error: "Please upload MP3, WAV, M4A, OGG, or WebM audio." };
  }

  let transcriptText: string;

  try {
    transcriptText = await transcribeAudioFile(file);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("503") || message.includes("UNAVAILABLE") || message.includes("high demand")) {
      return {
        error:
          "Gemini is temporarily overloaded right now. Please wait a moment and try again.",
      };
    }

    return {
      error: "Transcription failed. Please try again in a moment.",
    };
  }

  if (!transcriptText) {
    return { error: "Gemini returned an empty transcript. Please try again." };
  }

  await db.insert(transcripts).values({
    id: randomUUID(),
    userId: session.user.id,
    sourceFileName: file.name,
    transcriptText,
    createdAt: new Date(),
  });

  revalidatePath("/dashboard");

  return { success: "Transcript saved successfully." };
}
