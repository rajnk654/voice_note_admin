"use client";

import { useActionState } from "react";

import { loginAction } from "@/app/actions/auth";

const initialState: { error?: string } = {};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="stack">
      <div className="field">
        <label htmlFor="username">Username</label>
        <input
          className="input"
          id="username"
          name="username"
          placeholder="admin"
          required
          autoComplete="username"
        />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input
          className="input"
          id="password"
          name="password"
          placeholder="Your password"
          type="password"
          required
          autoComplete="current-password"
        />
      </div>

      {state.error ? <div className="error">{state.error}</div> : null}

      <div className="actions">
        <button className="button" type="submit" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </form>
  );
}
