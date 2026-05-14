import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, CalendarDays, Sparkles } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import Reveal from '../components/Reveal';
import { masterclasses } from '../data/masterclasses';
import { formatCents } from '../lib/format';

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <Marquee />
      <AboutTeaser />
      <FeaturedMasterclass />
      <SpeakingCTA />
      <ShopTeaser />
    </PageTransition>
  );
}

function Hero() {
  const prefersReduced = useReducedMotion();
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24 md:min-h-[100svh] md:pt-40">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_20%_-10%,#2a2729_0%,#1A181B_55%,#0d0c0e_100%)]" />
        <div className="absolute -right-32 top-1/3 h-[520px] w-[520px] rounded-full bg-flame/15 blur-3xl" />
        <div className="absolute left-1/4 top-2/3 h-72 w-72 rounded-full bg-flame/10 blur-3xl" />
      </div>

      <div className="container-x grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="eyebrow"
          >
            Therapist · Professor · Speaker · Author
          </motion.p>

          <h1 className="display mt-6 text-paper text-[clamp(3.25rem,9vw,8rem)]">
            <motion.span
              initial={prefersReduced ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease }}
              className="block"
            >
              Your 24
            </motion.span>
            <motion.span
              initial={prefersReduced ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease }}
              className="block italic text-flame"
            >
              is a gift.
            </motion.span>
          </h1>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="mt-8 max-w-xl text-balance text-lg text-bone md:text-xl"
          >
            Don&apos;t let one bad moment own the whole day. I&apos;m Tiaera —
            a licensed therapist, professor, and speaker helping people protect their peace
            and stay encouraged.
          </motion.p>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link to="/speaking" className="btn-primary group">
              Book Tiaera to speak
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link to="/masterclasses" className="btn-ghost">
              Join a masterclass
            </Link>
          </motion.div>

          <motion.div
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 text-sm text-bone"
          >
            <Stat label="UT 40 Under 40" value="2024" />
            <Stat label="Adjunct Professor" value="UTK CSW" />
            <Stat label="Incoming PhD" value="Clark Atlanta '26" />
          </motion.div>
        </div>

        {/* Headshot billboard card */}
        <motion.div
          initial={prefersReduced ? false : { opacity: 0, x: 40, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease }}
          className="relative lg:col-span-5"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-bone/10 bg-ink-soft">
            {/* Headshot placeholder — replace public/images/headshot.jpg */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/images/headshot.jpg)' }}
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/0 to-transparent" />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-paper/10 px-3 py-1 text-xs uppercase tracking-widest text-paper backdrop-blur">
                <Sparkles size={12} className="text-flame" /> Now booking 2026
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="font-serif text-2xl leading-tight text-paper">
                Tiaera Paulette, <span className="italic text-flame">LMSW</span>
              </p>
              <p className="mt-1 text-sm text-bone">Atlanta, GA · Available worldwide</p>
            </div>
            {/* Headshot caption */}
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <p className="rounded-full bg-ink/70 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-bone backdrop-blur">
                Drop headshot at public/images/headshot.jpg
              </p>
            </div>
          </div>

          {/* Floating quote card, ref-style */}

        </motion.div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-serif text-2xl text-paper">{value}</p>
      <p className="text-xs uppercase tracking-widest text-bone">{label}</p>
    </div>
  );
}

function Marquee() {
  const items = [
    'Trauma-informed',
    'LMSW',
    'Adjunct Professor',
    'Author',
    'Speaker',
    'Podcast Host',
    'Stay Encouraged',
  ];
  return (
    <div className="border-y border-bone/10 bg-ink py-6 overflow-hidden">
      <motion.div
        className="flex gap-12 whitespace-nowrap text-bone"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {[...items, ...items, ...items].map((it, i) => (
          <span key={i} className="inline-flex items-center gap-12 font-serif text-2xl italic">
            {it}
            <span className="text-flame">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function AboutTeaser() {
  return (
    <section className="container-x py-24 md:py-32">
      <div className="grid items-start gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow">About</p>
          <h2 className="mt-6 text-5xl text-balance md:text-6xl">
            Clinically grounded.
            <br />
            <span className="italic text-flame">Personally felt.</span>
          </h2>
        </div>
        <div className="lg:col-span-7">
          <Reveal>
            <p className="text-balance text-lg text-bone md:text-xl">
              Tiaera is a licensed master social worker with over 15 years of experience
              in trauma-focused clinical care. She teaches the next generation of clinicians
              as an Adjunct Professor at the University of Tennessee College of Social Work,
              hosts the <em>Uncensored Wellness</em> podcast, and leads retreats and
              masterclasses on family dynamics, identity, and recovery.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-6">
            <p className="text-bone">
              She begins a PhD at Clark Atlanta&apos;s Whitney M. Young Jr. School of Social
              Work in Fall 2026, researching racial disparities in higher academia, sexual
              abuse trauma, and culturally responsive psychotherapy.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-10">
            <Link to="/about" className="inline-flex items-center gap-2 text-paper hover:text-flame">
              Read her full story <ArrowUpRight size={16} />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FeaturedMasterclass() {
  const featured = masterclasses[1];
  return (
    <section className="container-x py-24 md:py-32">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Upcoming masterclass</p>
          <h2 className="mt-6 max-w-2xl text-5xl text-balance md:text-6xl">
            Learn from a clinician you actually trust.
          </h2>
        </div>
        <Link to="/masterclasses" className="hidden text-sm text-bone hover:text-flame md:inline-flex items-center gap-2">
          See all <ArrowUpRight size={14} />
        </Link>
      </div>

      <Reveal className="mt-14">
        <div className="card group relative overflow-hidden p-8 md:p-12">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-bone">
                <span className="rounded-full border border-bone/20 px-3 py-1">
                  {featured.format}
                </span>
                <span className="inline-flex items-center gap-1">
                  <CalendarDays size={12} /> {featured.date}
                </span>
                <span>{featured.duration}</span>
              </div>
              <h3 className="mt-6 max-w-2xl text-4xl text-balance md:text-5xl">
                {featured.title}
              </h3>
              <p className="mt-5 max-w-xl text-bone">{featured.blurb}</p>
            </div>
            <div className="flex flex-col justify-between gap-6 lg:col-span-4">
              <div className="rounded-2xl border border-bone/10 bg-ink p-6">
                <p className="text-xs uppercase tracking-widest text-bone">Tuition</p>
                <p className="mt-2 font-serif text-5xl text-paper">
                  {featured.priceCents ? formatCents(featured.priceCents) : 'Free'}
                </p>
                <p className="mt-1 text-sm text-bone">{featured.seats}</p>
              </div>
              <Link to="/masterclasses" className="btn-primary justify-center">
                Reserve a seat
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function SpeakingCTA() {
  return (
    <section className="container-x py-24 md:py-32">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] bg-flame text-paper">
          <div className="relative grid gap-10 p-10 md:grid-cols-12 md:p-16">
            <div className="md:col-span-8">
              <p className="text-xs uppercase tracking-[0.22em] text-paper/70">
                Speaking · Workshops · Keynotes
              </p>
              <h2 className="mt-6 max-w-2xl text-5xl text-balance text-paper md:text-7xl">
                Book Tiaera for your next event.
              </h2>
              <p className="mt-5 max-w-xl text-paper/80">
                Conferences, universities, faith communities, corporate wellness — Tiaera
                speaks where the work is hardest and the message lands clearest.
              </p>
            </div>
            <div className="flex items-end md:col-span-4 md:justify-end">
              <Link to="/speaking" className="btn-dark">
                Check her calendar
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-paper/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-ink/30 blur-3xl" />
        </div>
      </Reveal>
    </section>
  );
}

function ShopTeaser() {
  return (
    <section className="container-x pb-24 md:pb-32">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Shop</p>
          <h2 className="mt-6 max-w-2xl text-5xl text-balance md:text-6xl">
            Books, tees, and a daily reminder.
          </h2>
        </div>
        <Link to="/shop" className="hidden text-sm text-bone hover:text-flame md:inline-flex items-center gap-2">
          Browse <ArrowUpRight size={14} />
        </Link>
      </div>
      <Reveal className="mt-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {['Stay Encouraged Book', '"Your 24" Tee', 'Billboard Crewneck'].map((name, i) => (
            <div
              key={name}
              className="card group relative aspect-[4/5] overflow-hidden p-6"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-flame/20 to-ink-soft transition-opacity duration-500 group-hover:opacity-80" />
              <div className="relative flex h-full flex-col justify-between">
                <span className="rounded-full border border-bone/20 bg-ink/40 px-3 py-1 text-[10px] uppercase tracking-widest text-bone backdrop-blur">
                  Coming soon
                </span>
                <div>
                  <p className="font-serif text-3xl text-paper">{name}</p>
                  <p className="mt-2 text-sm text-bone">Drop {i + 1} · 2026</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
