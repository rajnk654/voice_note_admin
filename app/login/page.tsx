import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { getSession } from "@/lib/session";

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main className="shell">
      <section className="hero">
        <div className="pill">Single-admin transcription console</div>
        <h1>Turn short voice notes into saved transcripts.</h1>
        <p>
          Sign in with the admin username and password, upload an audio clip under a
          minute, and store only the transcript in PostgreSQL.
        </p>
      </section>

      <section className="grid two">
        <article className="card stack">
          <h2>Admin login</h2>
          <p className="muted">
            Username-based login is powered by Better Auth with a single seeded admin
            account.
          </p>
          <LoginForm />
        </article>

        <article className="card stack">
          <h2>How it works</h2>
          <div className="stack muted">
            <p>1. Sign in with the admin account.</p>
            <p>2. Upload a short audio file.</p>
            <p>3. Gemini transcribes the audio on the server.</p>
            <p>4. Only the transcript text is saved.</p>
          </div>
        </article>
      </section>
    </main>
  );
}
