"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Vocabulary } from "@/lib/trades";
import { record, type FormState } from "./actions";

const empty: FormState = {};

export type Teammate = { id: string; name: string };

export default function EntryForm({
  words,
  team,
  me,
}: {
  words: Vocabulary;
  team: Teammate[];
  me: string;
}) {
  const [state, submit, pending] = useActionState(record, empty);

  return (
    <form action={submit}>
      <div>
        <label htmlFor="amount">¿De cuánto?</label>
        <input
          id="amount"
          name="amount"
          inputMode="decimal"
          placeholder={words.sampleAmount}
          autoFocus
          required
        />
      </div>

      <div>
        <label htmlFor="description">¿Qué fue?</label>
        <input
          id="description"
          name="description"
          type="text"
          placeholder={words.sampleDescription}
          required
        />
      </div>

      {team.length > 1 && (
        <div>
          <label htmlFor="member">{words.whoServed}</label>
          <select id="member" name="member" defaultValue={me}>
            {team.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <label
        style={{ display: "flex", gap: ".7rem", alignItems: "center", fontWeight: 400 }}
      >
        <input
          type="checkbox"
          name="paid"
          value="yes"
          defaultChecked
          style={{ width: "1.4rem", height: "1.4rem" }}
        />
        Ya me pagó
      </label>

      {state.error && <p className="callout">{state.error}</p>}

      <button className="button" type="submit" disabled={pending}>
        {pending ? "Apuntando…" : "Apuntar"}
      </button>

      <Link className="button ghost" href="/today">
        Cancelar
      </Link>
    </form>
  );
}
