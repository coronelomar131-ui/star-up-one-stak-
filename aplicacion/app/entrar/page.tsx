"use client";

import { useActionState, useState } from "react";
import { entrar, crearCuenta, type Estado } from "./acciones";

const vacio: Estado = {};

export default function Entrar() {
  const [nuevo, setNuevo] = useState(false);
  const [estado, enviar, trabajando] = useActionState(
    nuevo ? crearCuenta : entrar,
    vacio,
  );

  return (
    <main className="pantalla">
      <header className="encabezado">
        <p className="marca">Apúntalo</p>
      </header>

      <h1>{nuevo ? "Abre tu cuenta." : "Entra a tu negocio."}</h1>
      <p className="tenue" style={{ marginTop: ".6rem" }}>
        {nuevo
          ? "Con esto llevas las cuentas de tu negocio desde el teléfono."
          : "Lo de siempre: tu correo y tu contraseña."}
      </p>

      <form action={enviar}>
        <div>
          <label htmlFor="correo">Correo</label>
          <input
            id="correo"
            name="correo"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            required
          />
        </div>

        <div>
          <label htmlFor="clave">Contraseña</label>
          <input
            id="clave"
            name="clave"
            type="password"
            autoComplete={nuevo ? "new-password" : "current-password"}
            required
          />
        </div>

        {estado.error && <p className="aviso">{estado.error}</p>}
        {estado.aviso && <p className="aviso bien">{estado.aviso}</p>}

        <button className="boton" type="submit" disabled={trabajando}>
          {trabajando ? "Un momento…" : nuevo ? "Abrir mi cuenta" : "Entrar"}
        </button>
      </form>

      <p className="tenue" style={{ marginTop: "1.5rem" }}>
        {nuevo ? "¿Ya tienes cuenta? " : "¿Es tu primera vez? "}
        <button className="enlace" type="button" onClick={() => setNuevo(!nuevo)}>
          {nuevo ? "Entra aquí" : "Abre tu cuenta"}
        </button>
      </p>
    </main>
  );
}
