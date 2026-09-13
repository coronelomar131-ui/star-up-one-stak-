"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Vocabulario } from "@/lib/giros";
import { apuntar, type Estado } from "./acciones";

const vacio: Estado = {};

export type Companero = { id: string; nombre: string };

export default function Formulario({
  voz,
  equipo,
  yo,
}: {
  voz: Vocabulario;
  equipo: Companero[];
  yo: string;
}) {
  const [estado, enviar, trabajando] = useActionState(apuntar, vacio);

  return (
    <form action={enviar}>
      <div>
        <label htmlFor="monto">¿De cuánto?</label>
        <input
          id="monto"
          name="monto"
          inputMode="decimal"
          placeholder={voz.ejemploMonto}
          autoFocus
          required
        />
      </div>

      <div>
        <label htmlFor="concepto">¿Qué fue?</label>
        <input
          id="concepto"
          name="concepto"
          type="text"
          placeholder={voz.ejemploConcepto}
          required
        />
      </div>

      {equipo.length > 1 && (
        <div>
          <label htmlFor="miembro">{voz.quienAtendio}</label>
          <select id="miembro" name="miembro" defaultValue={yo}>
            {equipo.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>
        </div>
      )}

      <label
        style={{
          display: "flex",
          gap: ".7rem",
          alignItems: "center",
          fontWeight: 400,
        }}
      >
        <input
          type="checkbox"
          name="pagado"
          value="si"
          defaultChecked
          style={{ width: "1.4rem", height: "1.4rem" }}
        />
        Ya me pagó
      </label>

      {estado.error && <p className="aviso">{estado.error}</p>}

      <button className="boton" type="submit" disabled={trabajando}>
        {trabajando ? "Apuntando…" : "Apuntar"}
      </button>

      <Link className="boton hueco" href="/hoy">
        Cancelar
      </Link>
    </form>
  );
}
