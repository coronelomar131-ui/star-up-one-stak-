# Apúntalo — the app

Next.js 15 (App Router) + Supabase. Built for the phone.

**Code in English, product in Spanish.** Identifiers, tables and comments
follow the convention; every string the shop owner reads stays in Spanish,
because that is the language they speak.

## Run it locally

```bash
npm install
npm run dev
```

No configuration needed. The Supabase URL and publishable key live in
`lib/supabase/config.ts`, hardcoded on purpose: both are public by
design — the key ships inside every visitor's browser bundle, and the
same pair already sits in plain sight in the marketing page. What
protects the data is row level security, not hiding the key.

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_KEY` to point a
deployment at a different project; the environment wins when present.

## Layout

```
lib/trades.ts         The wording for each trade. Here and nowhere else:
                      a fifth trade is one more entry in this file.
lib/session.ts        Where the user's business comes from. ALWAYS the
                      session, never a form field.
lib/supabase/         Browser and server clients.
middleware.ts         Refreshes the session on every request.

app/login             Email and password.
app/setup             Opens the business. Calls create_business().
app/today             The day's close: total, what you are owed, the list.
app/new               Record a sale, job or order.
```

## Two decisions that hold the rest up

**The business never travels in the form.** `currentSession()` reads it
from the session. A `business_id` the browser can send is a `business_id`
that can belong to someone else.

**"Today" is computed in the database, not the browser.** `today_entries()`
cuts the day at midnight in the business's own timezone. Done in
JavaScript it drifts with daylight saving and with the server clock.

## Tested end to end

With a real browser (`playwright`), walking the owner's path: no session
routes to `/login`; no business routes to `/setup`; opening the business;
empty day showing the trade's own wording ("Cobrar un corte"); recording
250 shows up with who served it; recording 600 unpaid takes the total to
850 and shows "Te deben $600".

## Not built yet

- Customers and credit by name (the schema already allows it).
- Adding staff from inside the app.
- Week and month, not just the day.
- Phone sign-in instead of email, once there is budget for SMS.
