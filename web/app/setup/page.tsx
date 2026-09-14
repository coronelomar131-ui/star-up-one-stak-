"use client";

import { useActionState, useState } from "react";
import { TRADE_LIST, TRADES, type Trade } from "@/lib/trades";
import { openBusiness, type FormState } from "./actions";

const empty: FormState = {};

export default function Setup() {
  const [trade, setTrade] = useState<Trade>("barbershop");
  const [state, submit, pending] = useActionState(openBusiness, empty);

  return (
    <main className="screen" style={{ ["--accent" as string]: TRADES[trade].accent }}>
      <header className="topbar">
        <p className="wordmark">Apúntalo</p>
      </header>

      <h1>Cuéntame de tu negocio.</h1>
      <p className="muted" style={{ marginTop: ".6rem" }}>
        Con esto queda listo. Se configura una vez y ya.
      </p>

      <form action={submit}>
        <div>
          <label htmlFor="name">¿Cómo se llama?</label>
          <input id="name" name="name" type="text" placeholder="Barbería El Águila" required />
        </div>

        <div>
          <label id="trade-label">¿A qué se dedica?</label>
          <input type="hidden" name="trade" value={trade} />
          <div className="trades" role="group" aria-labelledby="trade-label">
            {TRADE_LIST.map((t) => (
              <button
                key={t.key}
                type="button"
                className="trade"
                aria-pressed={trade === t.key}
                onClick={() => setTrade(t.key)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="your_name">¿Cómo te llamas?</label>
          <input id="your_name" name="your_name" type="text" placeholder="Omar" required />
          <p className="muted" style={{ marginTop: ".4rem", fontSize: ".85rem" }}>
            Va a aparecer como quién atendió, para las comisiones.
          </p>
        </div>

        {state.error && <p className="callout">{state.error}</p>}

        <button className="button" type="submit" disabled={pending}>
          {pending ? "Abriendo…" : "Abrir mi negocio"}
        </button>
      </form>
    </main>
  );
}
