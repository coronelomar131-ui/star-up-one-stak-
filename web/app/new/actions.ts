"use server";

import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { currentSession } from "@/lib/session";

export type FormState = { error?: string };

export async function record(_prev: FormState, data: FormData): Promise<FormState> {
  const s = await currentSession();

  const description = String(data.get("description") ?? "").trim();
  const raw = String(data.get("amount") ?? "").replace(/[^\d.]/g, "");
  const amount = Number(raw);
  const memberId = String(data.get("member") ?? "").trim();
  const alreadyPaid = data.get("paid") === "yes";

  if (!description) return { error: "Escribe qué fue." };
  if (!raw || !Number.isFinite(amount) || amount < 0) {
    return { error: "El monto no se entiende. Solo números." };
  }
  if (amount > 9_999_999) return { error: "Ese monto es demasiado grande." };

  const supabase = await serverClient();
  const { error } = await supabase.from("entries").insert({
    // business_id comes from the session, never from the form.
    business_id: s.businessId,
    member_id: memberId || s.memberId,
    kind: s.words.kind,
    description: description.slice(0, 200),
    amount,
    paid: alreadyPaid ? amount : 0,
    status: "closed",
  });

  if (error) return { error: "No se pudo guardar. Vuelve a intentarlo." };
  redirect("/today");
}
