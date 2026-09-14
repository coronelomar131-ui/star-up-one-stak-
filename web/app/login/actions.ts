"use server";

import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";

export type FormState = { error?: string; notice?: string };

function read(data: FormData) {
  return {
    email: String(data.get("email") ?? "").trim().toLowerCase(),
    password: String(data.get("password") ?? ""),
  };
}

export async function signIn(_prev: FormState, data: FormData): Promise<FormState> {
  const { email, password } = read(data);
  if (!email || !password) return { error: "Escribe tu correo y tu contraseña." };

  const supabase = await serverClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  // Deliberately vague about which one is wrong: saying so would reveal
  // which addresses have an account.
  if (error) return { error: "Ese correo y esa contraseña no coinciden." };
  redirect("/");
}

export async function signUp(_prev: FormState, data: FormData): Promise<FormState> {
  const { email, password } = read(data);
  if (!email) return { error: "Escribe tu correo." };
  if (password.length < 8) {
    return { error: "La contraseña necesita 8 letras o números, cuando menos." };
  }

  const supabase = await serverClient();
  const { data: result, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("already")) {
      return { error: "Ya hay una cuenta con ese correo. Entra con tu contraseña." };
    }
    return { error: "No se pudo crear la cuenta. Vuelve a intentarlo." };
  }

  // When the project requires email confirmation, signUp returns no session.
  if (!result.session) {
    return { notice: "Te mandamos un correo para confirmar tu cuenta. Ábrelo y regresa aquí." };
  }

  redirect("/");
}
