import { serverClient } from "@/lib/supabase/server";
import { currentSession } from "@/lib/session";
import EntryForm, { type Teammate } from "./form";

export const dynamic = "force-dynamic";

export default async function NewEntry() {
  const s = await currentSession();
  const supabase = await serverClient();

  const { data } = await supabase
    .from("members")
    .select("id, name")
    .eq("business_id", s.businessId)
    .eq("active", true)
    .order("name");

  const team = (data ?? []) as Teammate[];

  return (
    <main className="screen" style={{ ["--accent" as string]: s.words.accent }}>
      <header className="topbar">
        <p className="wordmark">{s.words.action}</p>
      </header>

      <EntryForm words={s.words} team={team} me={s.memberId} />
    </main>
  );
}
