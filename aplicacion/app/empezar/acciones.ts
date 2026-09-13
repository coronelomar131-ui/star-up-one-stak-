"use server";

import { redirect } from "next/navigation";
import { clienteServidor } from "@/lib/supabase/servidor";
import { esGiro } from "@/lib/giros";

export type Estado = { error?: string };

export async function abrirNegocio(_previo: Estado, datos: FormData): Promise<Estado> {
  const nombre = String(datos.get("nombre") ?? "").trim();
  const giro = String(datos.get("giro") ?? "");
  const tuNombre = String(datos.get("tu_nombre") ?? "").trim();

  if (!nombre) return { error: "Ponle nombre a tu negocio." };
  if (!tuNombre) return { error: "Falta tu nombre." };
  if (!esGiro(giro)) return { error: "Elige a qué se dedica tu negocio." };

  const supabase = await clienteServidor();
  const { error } = await supabase.rpc("crear_negocio", {
    p_nombre: nombre,
    p_giro: giro,
    p_tu_nombre: tuNombre,
  });

  if (error) return { error: "No se pudo abrir el negocio. Vuelve a intentarlo." };
  redirect("/hoy");
}
