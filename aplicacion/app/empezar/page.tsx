"use client";

import { useActionState, useState } from "react";
import { LISTA_GIROS, GIROS, type Giro } from "@/lib/giros";
import { abrirNegocio, type Estado } from "./acciones";

const vacio: Estado = {};

export default function Empezar() {
  const [giro, setGiro] = useState<Giro>("barberia");
  const [estado, enviar, trabajando] = useActionState(abrirNegocio, vacio);

  return (
    <main className="pantalla" style={{ ["--acento" as string]: GIROS[giro].acento }}>
      <header className="encabezado">
        <p className="marca">Apúntalo</p>
      </header>

      <h1>Cuéntame de tu negocio.</h1>
      <p className="tenue" style={{ marginTop: ".6rem" }}>
        Con esto queda listo. Se configura una vez y ya.
      </p>

      <form action={enviar}>
        <div>
          <label htmlFor="nombre">¿Cómo se llama?</label>
          <input id="nombre" name="nombre" type="text" placeholder="Barbería El Águila" required />
        </div>

        <div>
          <label id="rotulo-giro">¿A qué se dedica?</label>
          <input type="hidden" name="giro" value={giro} />
          <div className="giros" role="group" aria-labelledby="rotulo-giro">
            {LISTA_GIROS.map((g) => (
              <button
                key={g.clave}
                type="button"
                className="giro"
                aria-pressed={giro === g.clave}
                onClick={() => setGiro(g.clave)}
              >
                {g.nombre}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="tu_nombre">¿Cómo te llamas?</label>
          <input id="tu_nombre" name="tu_nombre" type="text" placeholder="Omar" required />
          <p className="tenue" style={{ marginTop: ".4rem", fontSize: ".85rem" }}>
            Va a aparecer como quién atendió, para las comisiones.
          </p>
        </div>

        {estado.error && <p className="aviso">{estado.error}</p>}

        <button className="boton" type="submit" disabled={trabajando}>
          {trabajando ? "Abriendo…" : "Abrir mi negocio"}
        </button>
      </form>
    </main>
  );
}
