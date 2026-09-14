import { redirect } from "next/navigation";
import { serverClient } from "./supabase/server";
import { TRADES, type Trade, type Vocabulary } from "./trades";

export type Session = {
  memberId: string;
  memberName: string;
  isOwner: boolean;
  businessId: string;
  businessName: string;
  trade: Trade;
  words: Vocabulary;
};

type Row = {
  id: string;
  name: string;
  role: string;
  business_id: string;
  businesses: { name: string; trade: Trade } | null;
};

// The business ALWAYS comes from here, never from a form field. A
// business_id the browser can send is a business_id that can belong to
// someone else.
export async function currentSession(): Promise<Session> {
  const supabase = await serverClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("members")
    .select("id, name, role, business_id, businesses(name, trade)")
    .eq("user_id", user.id)
    .eq("active", true)
    .limit(1)
    .maybeSingle();

  const row = data as unknown as Row | null;
  if (!row || !row.businesses) redirect("/setup");

  const trade = row.businesses.trade;
  return {
    memberId: row.id,
    memberName: row.name,
    isOwner: row.role === "owner",
    businessId: row.business_id,
    businessName: row.businesses.name,
    trade,
    words: TRADES[trade],
  };
}
