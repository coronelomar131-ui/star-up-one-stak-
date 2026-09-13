import Link from "next/link";
import { clienteServidor } from "@/lib/supabase/servidor";
import { sesionActual } from "@/lib/negocio";
import { pesos, hora } from "@/lib/giros";

export const dynamic = "force-dynamic";

type Apunte = {
  id: string;
  ocurre_en: string;
  concepto: string;
  monto: number;
  pagado: number;
  quien: string | null;
  cliente: string | null;
};

export default async function Hoy() {
  const s = await sesionActual();
  const supabase = await clienteServidor();

  const { data, error } = await supabase.rpc("apuntes_de_hoy", {
    p_negocio: s.negocioId,
  });

  const apuntes = (data ?? []) as Apunte[];
  const total = apuntes.reduce((suma, a) => suma + Number(a.monto), 0);
  const debido = apuntes.reduce(
    (suma, a) => suma + Math.max(0, Number(a.monto) - Number(a.pagado)),
    0,
  );

  return (
    <main className="pantalla" style={{ ["--acento" as string]: s.voz.acento }}>
      <header className="encabezado">
        <p className="marca">{s.negocioNombre}</p>
        <p className="tenue">{s.miembroNombre}</p>
      </header>

      {error ? (
        <p className="aviso">
          No se pudo cargar el día. Revisa tu conexión y vuelve a entrar.
        </p>
      ) : (
        <>
          <section className="corte">
            <span className="etiqueta">Vendido hoy</span>
            <strong className="cifra">{pesos(total)}</strong>
            <div className="resumen">
              <span>
                <b>{apuntes.length}</b>{" "}
                {apuntes.length === 1 ? "apunte" : "apuntes"}
              </span>
              {debido > 0 && (
                <span>
                  Te deben <b>{pesos(debido)}</b>
                </span>
              )}
            </div>
          </section>

          {apuntes.length === 0 ? (
            <div className="vacio">
              <h2>Todavía no apuntas nada hoy.</h2>
              <p>
                Apunta {s.voz.unaCosa} en cuanto cobres. Al cerrar el día las
                cuentas ya están hechas.
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ marginTop: "2rem" }}>{s.voz.deHoy}</h2>
              <ul className="apuntes">
                {apuntes.map((a) => {
                  const falta = Number(a.monto) - Number(a.pagado);
                  return (
                    <li key={a.id}>
                      <span className="hora">{hora(a.ocurre_en)}</span>
                      <span className="que">
                        {a.concepto}
                        <em>
                          {a.quien ?? "Sin asignar"}
                          {a.cliente ? ` · ${a.cliente}` : ""}
                          {falta > 0 ? ` · debe ${pesos(falta)}` : ""}
                        </em>
                      </span>
                      <span className="monto">{pesos(Number(a.monto))}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </>
      )}

      <div className="flotante">
        <Link className="boton" href="/apuntar">
          {s.voz.accion}
        </Link>
      </div>
    </main>
  );
}
