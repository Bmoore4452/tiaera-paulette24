import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <Marquee />
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
            Therapist · Professor · Speaker · Author · Life Coach
          </motion.p>

          <h1 className="display mt-6 text-paper text-[clamp(2.25rem,8vw,8rem)]">
            <motion.span
              initial={prefersReduced ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease }}
              className="block"
            >
             Each day has a gift of  
            </motion.span>
            <motion.span
              initial={prefersReduced ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.18, ease }}
              className="block italic text-flame"
            >
             24 hours.
            </motion.span>
          </h1>

          <motion.p
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="mt-8 max-w-xl text-balance text-lg text-bone md:text-xl"
          >
             Don’t allow one bad one to consume the other 23. I&apos;m Tiaera —
            and I've made it my life's mission to help people unpack, heal, and evolve into their healthiest and most empowered selves.
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
            <Stat label="University of Tennessee  40 Under 40" value="2024" />
            <Stat label="Adjunct Professor" value="Tennessee BSW" />
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
          <div className="relative mx-auto aspect-2/3 w-full max-w-md overflow-hidden rounded-4xl border border-bone/10 bg-ink-soft">
            {/* Headshot placeholder — replace public/images/headshot.jpg */}
            <img
              src="/images/brand/black_white_headshot.jpg"
              alt="Tiaera Paulette headshot"
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-linear-to-t from-ink/90 via-ink/0 to-transparent" />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6">
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
              {/* <p className="rounded-full bg-ink/70 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-bone backdrop-blur">
                Drop headshot at public/images/headshot.jpg
              </p> */}
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
    'Life Coach'
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

