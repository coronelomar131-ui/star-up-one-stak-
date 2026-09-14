import { redirect } from "next/navigation";
import { serverClient } from "@/lib/supabase/server";

// One door: it sends you wherever you actually are in the flow.
export default async function Home() {
  const supabase = await serverClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: member } = await supabase
    .from("members")
    .select("business_id")
    .limit(1)
    .maybeSingle();

  redirect(member ? "/today" : "/setup");
}
