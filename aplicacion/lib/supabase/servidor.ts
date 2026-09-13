import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function clienteServidor() {
  const almacen = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      cookies: {
        getAll() {
          return almacen.getAll();
        },
        setAll(lista) {
          // En un Server Component las cookies son de solo lectura. El
          // middleware ya refrescó la sesión, así que ignorar aquí es
          // correcto, no un parche.
          try {
            lista.forEach(({ name, value, options }) =>
              almacen.set(name, value, options),
            );
          } catch {}
        },
      },
    },
  );
}
