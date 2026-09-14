import Link from "next/link";
import { serverClient } from "@/lib/supabase/server";
import { currentSession } from "@/lib/session";
import { money, clockTime } from "@/lib/trades";

export const dynamic = "force-dynamic";

type Entry = {
  id: string;
  occurred_at: string;
  description: string;
  amount: number;
  paid: number;
  who: string | null;
  customer: string | null;
};

export default async function Today() {
  const s = await currentSession();
  const supabase = await serverClient();

  const { data, error } = await supabase.rpc("today_entries", {
    p_business: s.businessId,
  });

  const entries = (data ?? []) as Entry[];
  const total = entries.reduce((sum, e) => sum + Number(e.amount), 0);
  const owed = entries.reduce(
    (sum, e) => sum + Math.max(0, Number(e.amount) - Number(e.paid)),
    0,
  );

  return (
    <main className="screen" style={{ ["--accent" as string]: s.words.accent }}>
      <header className="topbar">
        <p className="wordmark">{s.businessName}</p>
        <p className="muted">{s.memberName}</p>
      </header>

      {error ? (
        <p className="callout">
          No se pudo cargar el día. Revisa tu conexión y vuelve a entrar.
        </p>
      ) : (
        <>
          <section className="tally">
            <span className="label">Vendido hoy</span>
            <strong className="figure">{money(total)}</strong>
            <div className="summary">
              <span>
                <b>{entries.length}</b>{" "}
                {entries.length === 1 ? "apunte" : "apuntes"}
              </span>
              {owed > 0 && (
                <span>
                  Te deben <b>{money(owed)}</b>
                </span>
              )}
            </div>
          </section>

          {entries.length === 0 ? (
            <div className="blank">
              <h2>Todavía no apuntas nada hoy.</h2>
              <p>
                Apunta {s.words.oneThing} en cuanto cobres. Al cerrar el día las
                cuentas ya están hechas.
              </p>
            </div>
          ) : (
            <>
              <h2 style={{ marginTop: "2rem" }}>{s.words.todayHeading}</h2>
              <ul className="entries">
                {entries.map((e) => {
                  const missing = Number(e.amount) - Number(e.paid);
                  return (
                    <li key={e.id}>
                      <span className="at">{clockTime(e.occurred_at)}</span>
                      <span className="what">
                        {e.description}
                        <em>
                          {e.who ?? "Sin asignar"}
                          {e.customer ? ` · ${e.customer}` : ""}
                          {missing > 0 ? ` · debe ${money(missing)}` : ""}
                        </em>
                      </span>
                      <span className="amount">{money(Number(e.amount))}</span>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </>
      )}

      <div className="docked">
        <Link className="button" href="/new">
          {s.words.action}
        </Link>
      </div>
    </main>
  );
}
