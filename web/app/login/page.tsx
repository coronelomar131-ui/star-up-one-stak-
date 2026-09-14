"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, type FormState } from "./actions";

const empty: FormState = {};

export default function Login() {
  const [creating, setCreating] = useState(false);
  const [state, submit, pending] = useActionState(
    creating ? signUp : signIn,
    empty,
  );

  return (
    <main className="screen">
      <header className="topbar">
        <p className="wordmark">Apúntalo</p>
      </header>

      <h1>{creating ? "Abre tu cuenta." : "Entra a tu negocio."}</h1>
      <p className="muted" style={{ marginTop: ".6rem" }}>
        {creating
          ? "Con esto llevas las cuentas de tu negocio desde el teléfono."
          : "Lo de siempre: tu correo y tu contraseña."}
      </p>

      <form action={submit}>
        <div>
          <label htmlFor="email">Correo</label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={creating ? "new-password" : "current-password"}
            required
          />
        </div>

        {state.error && <p className="callout">{state.error}</p>}
        {state.notice && <p className="callout good">{state.notice}</p>}

        <button className="button" type="submit" disabled={pending}>
          {pending ? "Un momento…" : creating ? "Abrir mi cuenta" : "Entrar"}
        </button>
      </form>

      <p className="muted" style={{ marginTop: "1.5rem" }}>
        {creating ? "¿Ya tienes cuenta? " : "¿Es tu primera vez? "}
        <button className="linkish" type="button" onClick={() => setCreating(!creating)}>
          {creating ? "Entra aquí" : "Abre tu cuenta"}
        </button>
      </p>
    </main>
  );
}
