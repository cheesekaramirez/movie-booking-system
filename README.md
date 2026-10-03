# CinemaWorld

CinemaWorld is a responsive cinema discovery and ticket-booking site built with Next.js App Router, Tailwind CSS, and Supabase.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The Webpack scripts are used for compatibility with Windows environments where the Next.js native SWC binding is unavailable.

## Supabase

1. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from your Supabase project.
2. Run `supabase-schema.sql` in the Supabase SQL editor to create the bookings table and row-level security policies.
3. Enable email magic links under Supabase Authentication.

Without Supabase credentials, the catalog and booking confirmation flow run in demo mode; sign-in and booking persistence remain disabled.

Run `npm run lint` and `npm run build` to validate the app.
