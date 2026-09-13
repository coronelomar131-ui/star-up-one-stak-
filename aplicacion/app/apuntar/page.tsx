import { clienteServidor } from "@/lib/supabase/servidor";
import { sesionActual } from "@/lib/negocio";
import Formulario, { type Companero } from "./formulario";

export const dynamic = "force-dynamic";

export default async function Apuntar() {
  const s = await sesionActual();
  const supabase = await clienteServidor();

  const { data } = await supabase
    .from("miembros")
    .select("id, nombre")
    .eq("negocio_id", s.negocioId)
    .eq("activo", true)
    .order("nombre");

  const equipo = (data ?? []) as Companero[];

  return (
    <main className="pantalla" style={{ ["--acento" as string]: s.voz.acento }}>
      <header className="encabezado">
        <p className="marca">{s.voz.accion}</p>
      </header>

      <Formulario voz={s.voz} equipo={equipo} yo={s.miembroId} />
    </main>
  );
}
