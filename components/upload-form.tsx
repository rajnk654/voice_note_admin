"use client";

import { useActionState, useMemo, useState } from "react";

import {
  createTranscriptAction,
  type TranscriptFormState,
} from "@/app/actions/transcripts";

const initialState: TranscriptFormState = {};

export function UploadForm() {
  const [state, formAction, isPending] = useActionState(
    createTranscriptAction,
    initialState,
  );
  const [clientError, setClientError] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<string>("");

  const message = useMemo(
    () => clientError ?? state.error ?? state.success,
    [clientError, state.error, state.success],
  );

  return (
    <form action={formAction} className="stack">
      <div className="field">
        <label htmlFor="audio">Audio file</label>
        <input
          className="fileInput"
          id="audio"
          name="audio"
          type="file"
          accept="audio/*"
          required
          onChange={async (event) => {
            const file = event.currentTarget.files?.[0];

            setClientError(undefined);
            setSelectedFile(file?.name ?? "");

            if (!file) {
              return;
            }

            try {
              const duration = await getAudioDuration(file);
              if (duration > 60) {
                setClientError("Please upload audio shorter than 60 seconds.");
                event.currentTarget.value = "";
                setSelectedFile("");
              }
            } catch {
              setClientError(
                "We could not verify the audio duration. Short files under 1 minute work best.",
              );
            }
          }}
        />
      </div>

      {selectedFile ? <div className="pill">{selectedFile}</div> : null}

      {message ? (
        <div className={state.success && !clientError ? "success" : "error"}>
          {message}
        </div>
      ) : null}

      <div className="actions">
        <button className="button" type="submit" disabled={isPending || !!clientError}>
          {isPending ? "Uploading and transcribing..." : "Upload and transcribe"}
        </button>
      </div>
    </form>
  );
}

async function getAudioDuration(file: File) {
  return new Promise<number>((resolve, reject) => {
    const audio = document.createElement("audio");
    audio.preload = "metadata";
    audio.src = URL.createObjectURL(file);
    audio.onloadedmetadata = () => {
      const duration = audio.duration;
      URL.revokeObjectURL(audio.src);
      resolve(duration);
    };
    audio.onerror = () => {
      URL.revokeObjectURL(audio.src);
      reject(new Error("Unable to read audio metadata."));
    };
  });
}
