# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A professional site for **Tiaera Paulette, LMSW** — therapist, adjunct professor (University of Tennessee CSW), incoming PhD student (Clark Atlanta, Fall 2026), speaker, podcast host (_Uncensored Wellness_), and author. The site supports:

- Public speaking bookings on her Google Calendar (`tiaerapaulette24@gmail.com`)
- Free + paid masterclass registration
- Book and apparel sales (currently stubbed — products are placeholders until inventory and fulfillment finalize)
- Interactive **course POC** at `/courses` — two digitized masterclasses (the 8-week _Time Mastery_ and the 6-week _Master Me_) running locally with no backend (see Course POC under Architecture notes)

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
- **Course POC** (`src/pages/course/*`, `src/components/course/*`): a local, no-backend proof of concept digitizing two masterclasses — the 8-week _Time Mastery_ and the 6-week _Master Me_. Built to demo the experience before backend budget is finalized. Deliberately scoped: no Supabase/auth/drip/instructor feedback (those remain paused pending client decisions). Key conventions:
  - **Two masterclass shapes, one schema.** Time Mastery uses `topics[]` + `activities[]` per week (parallel, ungated). Master Me uses an ordered `teachingPoints[]` + `activities[]` + `discussion[]` + `journal` per week, with `gatedByTeaching: true`. The teaching points are sequential — each one unlocks the next when marked complete, and only when **every** point in a week is complete do that week's activities, discussion, and journal unlock. `TeachingPoint` is a type alias for `Topic` (same fields: id, title, body[], takeaways[]); the distinct field name carries the sequencing semantics. The unified types live in `src/data/course.ts` — most week-level fields are optional so each course only fills in what it has.
  - **Content as data.** Each course is its own JSON file in `src/data/` (`time-mastery.content.json`, `master-me.content.json`) and is registered in the `courses` export from `course.ts`. Selectors: `getCourse(courseId)`, `getWeek(course, weekId)`, `getTopic`, `getActivity`, `getDiscussion`, `weekSteps`, `courseTotalItems`. Edit content in the JSON, not in components. **The Time Mastery topic copy and the Master Me teaching points are AI-drafted placeholders — flag for Tiaera's review before launch.**
  - **Routes** (kept out of the main `Nav`; entry is the "Preview both digital masterclasses" link on `Masterclasses.tsx`): `/courses` (picker), `/courses/:courseId` (course home), `/courses/:courseId/:weekId` (week), and the per-item routes `…/topic/:topicId`, `…/teaching/:teachingId`, `…/activity/:activityId`, `…/discussion/:discussionId`, `…/journal/:journalId`. The teaching route enforces sequential gating: `TeachingPointPage` renders a "read the previous teaching first" lock if any prior point in the week is incomplete. Old `/course/*` paths redirect to `/courses/time-mastery/*` for back-compat.
  - **Persistence**: `src/hooks/useLocalStorage.ts` (keys namespaced `tp24:`) is the only persistence layer — swap it for Supabase later. Three classes of state, each with its own key shape: progress (`tp24:course:progress`, set of `courseId:weekId:kind:id` strings) lives in the `CourseProgress` context that wraps the app; per-activity work (`tp24:course:work:<courseId>:<weekId>:<activityId>`) is owned by each activity via `useWork(courseId, weekId, activityId, initial)`; discussion threads (`tp24:discussion:<courseId>:<weekId>:<questionId>`) are intentionally **not** user-scoped — they simulate the future shared cohort feed and will map to a Supabase table 1:1. User identity for discussion is gathered inline via `useProfile` (`tp24:profile`) — name + pronouns only, no auth.
  - **Activities**: 14 bespoke interactives total — 8 for Time Mastery (Time Audit, Time-Blocking, Boundary-Setting, Distraction Mapping, Energy Rhythms, Pareto/80-20, Work-Life Integration, Mastery Roadmap) and 6 for Master Me (Identity Inventory, Time & Energy Audit, Self-Sabotage Assessment, Habit Builder, Vision Casting, Bridge to the Future). `src/components/course/activities/index.tsx` maps each `ActivityKind` to its component; reflection/discussion kinds fall back to the generic `Reflection` worksheet. Always build new fields from the shared themed primitives in `components/course/fields.tsx` (`TextInput`, `TextArea`, `Segmented`, `Panel`, etc.) — don't hand-roll inputs.
  - **Discussion + journal** are first-class kinds for Master Me. The `DiscussionPage` (`src/pages/course/DiscussionPage.tsx`) shows the question, the open thread, and a profile-gated submit + comment composer. The `JournalPage` mirrors the prompts from the printed Master Me Journal PDF as fillable textareas. Both are gated by the week's Core Teaching when `course.gatedByTeaching` is true.

## Environment

See `.env.example`. Required:

- `STRIPE_SECRET_KEY` (server, Vercel only) — `sk_test_...` in dev, `sk_live_...` in prod
- `VITE_STRIPE_PUBLISHABLE_KEY` (client) — corresponding `pk_*`
- `VITE_BOOKING_EMBED_URL` (client) — Google Appointment Schedule URL with `?gv=true`

## Personal source material

`personal_docs/` is gitignored and contains résumé/CV documents (`Resume2026.docx`, `Paulette_CV2_Edited.docx`). They are the authoritative source for biographical content in `About.tsx`. Keep gitignored — these are personal documents.
