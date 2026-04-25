import { desc, eq } from "drizzle-orm";

import { LogoutButton } from "@/components/logout-button";
import { UploadForm } from "@/components/upload-form";
import { db } from "@/lib/db";
import { transcripts } from "@/lib/schema";
import { requireSession } from "@/lib/session";
import { formatDateTime } from "@/lib/utils";

export default async function DashboardPage() {
  const session = await requireSession();
  const items = await db
    .select()
    .from(transcripts)
    .where(eq(transcripts.userId, session.user.id))
    .orderBy(desc(transcripts.createdAt));

  return (
    <main className="shell">
      <section className="hero">
        <div className="row">
          <div className="stack">
            <div className="pill">Logged in as {session.user.username}</div>
            <h1>Transcript workspace</h1>
            <p>
              Upload short audio clips, transcribe them with Gemini, and review the
              saved transcript history below.
            </p>
          </div>
          <LogoutButton />
        </div>
      </section>

      <section className="grid two">
        <article className="card stack">
          <h2>Upload audio</h2>
          <p className="muted">
            Audio files are used only for transcription and are not stored in the
            database.
          </p>
          <UploadForm />
        </article>

        <article className="card stack">
          <h2>Account details</h2>
          <div className="stack">
            <div>
              <strong>Name</strong>
              <div className="muted">{session.user.name}</div>
            </div>
            <div>
              <strong>Email</strong>
              <div className="muted">{session.user.email}</div>
            </div>
            <div>
              <strong>Saved transcripts</strong>
              <div className="muted">{items.length}</div>
            </div>
          </div>
        </article>
      </section>

      <section className="card stack">
        <h2>Transcript history</h2>
        {items.length ? (
          <div className="transcriptList">
            {items.map((item) => (
              <article className="transcriptItem" key={item.id}>
                <div className="row">
                  <div>
                    <h3>{item.sourceFileName}</h3>
                    <div className="muted">{formatDateTime(item.createdAt)}</div>
                  </div>
                </div>
                <pre>{item.transcriptText}</pre>
              </article>
            ))}
          </div>
        ) : (
          <p className="muted">
            No transcripts yet. Upload your first audio clip to populate this list.
          </p>
        )}
      </section>
    </main>
  );
}
