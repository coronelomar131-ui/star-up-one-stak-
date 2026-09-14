import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_KEY } from "./config";

export function browserClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_KEY);
}
