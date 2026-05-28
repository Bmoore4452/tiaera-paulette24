# tiaera-paulette24

The professional site for **Tiaera Paulette, LMSW** — therapist, adjunct professor (University of Tennessee
College of Social Work), incoming PhD student (Clark Atlanta, Fall 2026), speaker,
podcast host (_Uncensored Wellness_), and author.

The site supports:

- Public speaking bookings via **Cal.com** (synced to her Google Calendar)
- **Free + paid masterclass** registration (Stripe Checkout for paid)
- **Books & apparel** sales (stubbed — placeholders until inventory and fulfillment finalize)
- **Interactive course POC** at `/course` — a local, no-backend mockup of the digitized
  8-week masterclass (see [Course POC](#course-poc-time-mastery))

## Stack

- **Vite 6 + React 18 + TypeScript** — path alias `@/*` → `src/*`
- **Tailwind CSS v4** via `@tailwindcss/vite` — palette tokens (`ink`, `bone`, `paper`,
  `flame`) defined in `src/index.css` under `@theme`
- **React Router v6** with `AnimatePresence` route transitions
- **Framer Motion** for hero choreography, scroll reveals, nav underline, marquee
- **Cal.com** (`@calcom/embed-react`) for the speaking booking widget, themed via
  `cssVarsPerTheme.dark`
- **Stripe Checkout** via Vercel serverless functions in `api/`
- **Fraunces** (serif) + **Inter** (sans) from Google Fonts

## Quick start

```bash
npm install
cp .env.example .env   # then fill in real values
npm run dev            # http://localhost:5173
```

For Stripe to work locally, use `vercel dev` instead of `npm run dev` — Vite alone
won't run the `api/*.ts` serverless functions and `/api/*` calls will 404.

## Scripts

| Command             | What it does                       |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Vite dev server on `:5173`         |
| `npm run build`     | `tsc -b && vite build` → `dist/`   |
| `npm run preview`   | Serve the production build locally |
| `npm run typecheck` | `tsc --noEmit`                     |

## Environment

Copy `.env.example` to `.env` (or set in Vercel project settings).

| Var                           | Where  | Purpose                                                                                     |
| ----------------------------- | ------ | ------------------------------------------------------------------------------------------- |
| `VITE_CAL_LINK`               | client | Cal.com booking link — everything after `cal.com/`, e.g. `tiaera-paulette/speaking-inquiry` |
| `VITE_STRIPE_PUBLISHABLE_KEY` | client | `pk_test_…` / `pk_live_…`                                                                   |
| `STRIPE_SECRET_KEY`           | server | `sk_test_…` / `sk_live_…` — Vercel only                                                     |

## Project structure

```text
api/                              Vercel serverless functions
  create-checkout-session.ts        Stripe Checkout session for masterclasses/products
  register-free.ts                  Free-masterclass signup stub (wire to Resend/Mailchimp)

src/
  components/
    layout/{Nav,Footer,PageTransition}.tsx
    Reveal.tsx                    Scroll-reveal wrapper
    course/                       Course POC — see "Course POC" below
      CourseProgress.tsx            Progress context (localStorage-backed)
      ui.tsx, fields.tsx            Shared themed UI + form primitives
      activities/                   8 interactive activities + generic reflection
  data/
    programs.ts                   Typed array — paid items reference Stripe price IDs
    products.ts                   Stubbed books/apparel
    course.content.json           Course POC content (8 weeks, topics, activities)
    course.ts                     Types + selectors over course.content.json
  hooks/
    useLocalStorage.ts            Namespaced (tp24:) persisted state
  lib/
    stripe.ts                     Client-side checkout helper
    format.ts                     Currency formatter
  pages/
    Home, About, Speaking, Masterclasses, Shop, Contact,
    CheckoutSuccess, CheckoutCancel, NotFound
    course/                       CourseHome, WeekDetail, TopicPage, ActivityPage
```

## Course POC (Time Mastery)

A local, high-quality proof of concept that fully digitizes Tiaera's 8-week _Time
Mastery Masterclass_ — built to demo the experience before committing to backend
budget. **No backend yet:** all content is local and all student work persists to
`localStorage`. The plan is to swap the persistence layer for Supabase later.

- **Routes** (intentionally kept out of the main nav; entered via a "Preview the
  digital course experience" link on the Masterclasses page):
  `/course`, `/course/:weekId`, `/course/:weekId/topic/:topicId`,
  `/course/:weekId/activity/:activityId`
- **Content** lives in `src/data/course.content.json` so it can be edited without
  touching components. `src/data/course.ts` types it and exposes selectors. The JSON
  shape maps cleanly onto a future course/week/topic/activity DB.
- **Progress & saved work** persist via `useLocalStorage` (keys namespaced `tp24:`)
  and the `CourseProgress` context. Each activity owns its own saved-work key.
- **8 bespoke interactive activities** in `src/components/course/activities/`
  (Time Audit, Time-Blocking, Boundary-Setting, Distraction Mapping, Energy Rhythms,
  80/20 Analysis, Work-Life Integration, Mastery Roadmap). Reflection/discussion
  activities use the generic `Reflection` worksheet. `activities/index.tsx` maps each
  activity `kind` to its component.

> The per-topic teaching copy in `course.content.json` is placeholder content — it
> should be reviewed/rewritten in Tiaera's own voice before anything ships.

## Pre-launch checklist

- [ ] Drop her real headshot at `public/images/headshot.jpg` (4:5 aspect)
- [ ] Move Cal.com from the test account onto `tiaerapaulette24@gmail.com`, connect her
      Google Calendar, update `VITE_CAL_LINK`
- [ ] Create real Stripe products for masterclasses + replace `price_REPLACE_ME_*` IDs
      in `src/data/programs.ts`
- [ ] Wire `api/register-free.ts` to a real mailer / list (Resend, Mailchimp, etc.)
- [ ] Finalize book & apparel SKUs and decide on fulfillment (POD vs manual)
- [ ] Set Stripe env vars and `VITE_CAL_LINK` in Vercel
- [ ] Connect a custom domain in Vercel

## Source material

`personal_docs/` is gitignored and contains Tiaera's résumé / CV. Those are the
authoritative source for biographical content on `About.tsx`. Keep gitignored — they
are personal documents.
