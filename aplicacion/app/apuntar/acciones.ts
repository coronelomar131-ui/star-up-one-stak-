"use server";

import { redirect } from "next/navigation";
import { clienteServidor } from "@/lib/supabase/servidor";
import { sesionActual } from "@/lib/negocio";

export type Estado = { error?: string };

export async function apuntar(_previo: Estado, datos: FormData): Promise<Estado> {
  const s = await sesionActual();

  const concepto = String(datos.get("concepto") ?? "").trim();
  const crudo = String(datos.get("monto") ?? "").replace(/[^\d.]/g, "");
  const monto = Number(crudo);
  const miembroId = String(datos.get("miembro") ?? "").trim();
  const yaPago = datos.get("pagado") === "si";

  if (!concepto) return { error: "Escribe qué fue." };
  if (!crudo || !Number.isFinite(monto) || monto < 0) {
    return { error: "El monto no se entiende. Solo números." };
  }
  if (monto > 9_999_999) return { error: "Ese monto es demasiado grande." };

  const supabase = await clienteServidor();
  const { error } = await supabase.from("apuntes").insert({
    // negocio_id sale de la sesión, no del formulario.
    negocio_id: s.negocioId,
    miembro_id: miembroId || s.miembroId,
    tipo: s.voz.tipo,
    concepto: concepto.slice(0, 200),
    monto,
    pagado: yaPago ? monto : 0,
    estado: "cerrado",
  });

  if (error) return { error: "No se pudo guardar. Vuelve a intentarlo." };
  redirect("/hoy");
}
