import { redirect } from "next/navigation";
import { clienteServidor } from "@/lib/supabase/servidor";

// Una sola puerta: según en qué punto vas, te manda a donde toca.
export default async function Inicio() {
  const supabase = await clienteServidor();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/entrar");

  const { data: miembro } = await supabase
    .from("miembros")
    .select("negocio_id")
    .limit(1)
    .maybeSingle();

  redirect(miembro ? "/hoy" : "/empezar");
}
