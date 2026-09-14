"use server";

import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";
import { isTrade } from "@/lib/trades";

export type FormState = { error?: string };

export async function openBusiness(_prev: FormState, data: FormData): Promise<FormState> {
  const name = String(data.get("name") ?? "").trim();
  const trade = String(data.get("trade") ?? "");
  const yourName = String(data.get("your_name") ?? "").trim();

  if (!name) return { error: "Ponle nombre a tu negocio." };
  if (!yourName) return { error: "Falta tu nombre." };
  if (!isTrade(trade)) return { error: "Elige a qué se dedica tu negocio." };

  const supabase = await serverClient();
  const { error } = await supabase.rpc("create_business", {
    p_name: name,
    p_trade: trade,
    p_your_name: yourName,
  });

  if (error) return { error: "No se pudo abrir el negocio. Vuelve a intentarlo." };
  redirect("/today");
}
