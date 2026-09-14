// Supabase connection details.
//
// These two values are PUBLIC by design: the publishable key ships inside
// every visitor's browser bundle, and the same pair already sits in plain
// sight in the marketing page at the repository root. Nothing here is a
// secret, and treating it as one would be theatre.
//
// What actually protects the data is row level security: the key alone
// buys no read access to any table. See docs/data-model.md.
//
// They are hardcoded so the app deploys with zero configuration. The
// environment variables still win when present, so a different
// deployment can point at its own project without touching this file.

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://hvhwauommivdxbvtbbow.supabase.co";

export const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_KEY ??
  "sb_publishable_8wvzr-THxvqB8O8mQYzeMA_iz7tf4KT";
