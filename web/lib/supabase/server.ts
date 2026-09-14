import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { SUPABASE_URL, SUPABASE_KEY } from "./config";

export async function serverClient() {
  const store = await cookies();

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_KEY,
    {
      cookies: {
        getAll() {
          return store.getAll();
        },
        setAll(list) {
          // Cookies are read-only inside a Server Component. The
          // middleware already refreshed the session, so swallowing
          // this is correct, not a patch.
          try {
            list.forEach(({ name, value, options }) =>
              store.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );
}
