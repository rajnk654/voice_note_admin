"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";

type AuthFormState = {
  error?: string;
};

export async function loginAction(
  _previousState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid credentials." };
  }

  try {
    await auth.api.signInUsername({
      body: {
        username: parsed.data.username,
        password: parsed.data.password,
        rememberMe: true,
      },
      headers: await headers(),
    });
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Unable to sign in with those credentials.",
    };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/login");
}
