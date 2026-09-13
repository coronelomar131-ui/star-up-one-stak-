import { redirect } from "next/navigation";
import { clienteServidor } from "./supabase/servidor";
import { GIROS, type Giro, type Vocabulario } from "./giros";

export type Sesion = {
  miembroId: string;
  miembroNombre: string;
  esDueno: boolean;
  negocioId: string;
  negocioNombre: string;
  giro: Giro;
  voz: Vocabulario;
};

type Fila = {
  id: string;
  nombre: string;
  papel: string;
  negocio_id: string;
  negocios: { nombre: string; giro: Giro } | null;
};

// El negocio SIEMPRE sale de aquí, nunca de un campo del formulario.
// Si el navegador pudiera mandar negocio_id, mandaría el de otro.
export async function sesionActual(): Promise<Sesion> {
  const supabase = await clienteServidor();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/entrar");

  const { data } = await supabase
    .from("miembros")
    .select("id, nombre, papel, negocio_id, negocios(nombre, giro)")
    .eq("usuario_id", user.id)
    .eq("activo", true)
    .limit(1)
    .maybeSingle();

  const fila = data as unknown as Fila | null;
  if (!fila || !fila.negocios) redirect("/empezar");

  const giro = fila.negocios.giro;
  return {
    miembroId: fila.id,
    miembroNombre: fila.nombre,
    esDueno: fila.papel === "dueno",
    negocioId: fila.negocio_id,
    negocioNombre: fila.negocios.nombre,
    giro,
    voz: GIROS[giro],
  };
}
