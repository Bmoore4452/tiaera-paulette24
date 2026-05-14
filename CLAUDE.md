# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A professional site for **Tiaera Paulette, LMSW** — therapist, adjunct professor (University of Tennessee CSW), incoming PhD student (Clark Atlanta, Fall 2026), speaker, podcast host (_Uncensored Wellness_), and author. The site supports:

- Public speaking bookings on her Google Calendar (`tiaerapaulette24@gmail.com`)
- Free + paid masterclass registration
- Book and apparel sales (currently stubbed — products are placeholders until inventory and fulfillment finalize)

## Stack

- **Vite + React 18 + TypeScript** (path alias `@/*` → `src/*`)
- **Tailwind CSS v4** via `@tailwindcss/vite` plugin. Theme tokens live in `src/index.css` under `@theme` — palette colors are `ink` `#1A181B`, `ink-soft`, `bone` `#D6D6D6`, `paper` `#FFFFFF`, `flame` `#F2052C`, `flame-deep`. Use these utility classes (`bg-ink`, `text-flame`, etc.) — do not hard-code hex values in components.
- **React Router v6** with `AnimatePresence` route transitions (see `src/App.tsx`, `src/components/layout/PageTransition.tsx`)
- **Framer Motion** for hero entrance choreography, scroll reveals (`src/components/Reveal.tsx`), nav underline, marquee
- **Stripe Checkout** via Vercel serverless functions in `api/`. Client helper at `src/lib/stripe.ts` posts to `/api/create-checkout-session` and redirects.
- Fonts: **Fraunces** (serif, headlines) + **Inter** (sans, body) loaded from Google Fonts in `index.html`

## Commands

```bash
npm install
npm run dev        # Vite dev server on :5173
npm run build      # tsc -b && vite build
npm run preview    # serve dist/
npm run typecheck  # tsc --noEmit
```

Vercel serverless functions (`api/*.ts`) only run under `vercel dev` or in production. Local `npm run dev` will return 404 for `/api/*`. To exercise checkout locally, install Vercel CLI and run `vercel dev` instead of `npm run dev`.

## Architecture notes

- **Routing & transitions**: `App.tsx` wraps `<Routes>` in `AnimatePresence mode="wait"`. Each page is its own component under `src/pages/*` and must wrap its return in `<PageTransition>` so the exit/enter animation fires on navigation.
- **Hero / billboard tagline** (`src/pages/Home.tsx` → `Hero`): two-line serif display ("Your 24 / is a gift."), staggered entrance, a headshot card on the right, and a floating quote card overlapping the headshot (mirrors the architectural reference style she liked). Headshot expected at `public/images/headshot.jpg` — there's a visible placeholder caption in the card until that file exists.
- **Data**: masterclasses and products are typed arrays in `src/data/`. Each paid item has an optional `stripePriceId` placeholder (`price_REPLACE_ME_*`). The Stripe serverless function supports both modes: `priceId` (preferred — uses the dashboard product) or inline `price_data` fallback using `amountCents` + `name`.
- **Booking embed** (`src/pages/Speaking.tsx`): reads `VITE_BOOKING_EMBED_URL`. If unset, the page shows an inline help panel explaining where to get the URL from Google Calendar's Appointment Schedule sharing dialog. The URL should end with `?gv=true` so Google renders the embed-friendly view.
- **Free signup** (`api/register-free.ts`): currently a `console.log` stub. Wire to Resend/Mailchimp/Supabase before launch.

## Environment

See `.env.example`. Required:

- `STRIPE_SECRET_KEY` (server, Vercel only) — `sk_test_...` in dev, `sk_live_...` in prod
- `VITE_STRIPE_PUBLISHABLE_KEY` (client) — corresponding `pk_*`
- `VITE_BOOKING_EMBED_URL` (client) — Google Appointment Schedule URL with `?gv=true`

## Personal source material

`personal_docs/` is gitignored and contains résumé/CV documents (`Resume2026.docx`, `Paulette_CV2_Edited.docx`). They are the authoritative source for biographical content in `About.tsx`. Keep gitignored — these are personal documents.
