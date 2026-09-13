"use server";

import { redirect } from "next/navigation";
import { clienteServidor } from "@/lib/supabase/servidor";

export type Estado = { error?: string; aviso?: string };

function leer(datos: FormData) {
  return {
    correo: String(datos.get("correo") ?? "").trim().toLowerCase(),
    clave: String(datos.get("clave") ?? ""),
  };
}

export async function entrar(_previo: Estado, datos: FormData): Promise<Estado> {
  const { correo, clave } = leer(datos);
  if (!correo || !clave) return { error: "Escribe tu correo y tu contraseña." };

  const supabase = await clienteServidor();
  const { error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: clave,
  });

  // A propósito no se dice cuál de los dos está mal: eso revelaría qué
  // correos tienen cuenta.
  if (error) return { error: "Ese correo y esa contraseña no coinciden." };
  redirect("/");
}

export async function crearCuenta(_previo: Estado, datos: FormData): Promise<Estado> {
  const { correo, clave } = leer(datos);
  if (!correo) return { error: "Escribe tu correo." };
  if (clave.length < 8) return { error: "La contraseña necesita 8 letras o números, cuando menos." };

  const supabase = await clienteServidor();
  const { data, error } = await supabase.auth.signUp({ email: correo, password: clave });

  if (error) {
    if (error.message.toLowerCase().includes("already")) {
      return { error: "Ya hay una cuenta con ese correo. Entra con tu contraseña." };
    }
    return { error: "No se pudo crear la cuenta. Vuelve a intentarlo." };
  }

  // Si el proyecto pide confirmar el correo, signUp no devuelve sesión.
  if (!data.session) {
    return { aviso: "Te mandamos un correo para confirmar tu cuenta. Ábrelo y regresa aquí." };
  }

  redirect("/");
}
