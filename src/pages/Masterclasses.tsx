import { useState } from 'react';
import { ArrowRight, Check, Clock, Loader2, Sparkles } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import Reveal from '../components/Reveal';
import { programs, type Program, type Tier } from '../data/programs';
import { formatCents } from '../lib/format';
import { startCheckout } from '../lib/stripe';

export default function Masterclasses() {
  return (
    <PageTransition>
      <section className="container-x pt-36 pb-12 md:pt-48">
        <p className="eyebrow">Masterclasses</p>
        <h1 className="mt-6 max-w-4xl text-balance text-6xl md:text-8xl">
          Pick your pace. <span className="italic text-flame">Pick your tier.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-balance text-lg text-bone md:text-xl">
          Two programs — one self-paced, one live with a cohort — each with three tiers
          of access. Move at your own speed or commit to a group; either way, the work
          meets you where you are.
        </p>
      </section>

      <section className="container-x py-12 md:py-16 space-y-24 md:space-y-32">
        {programs.map((program, i) => (
          <ProgramBlock key={program.id} program={program} index={i} />
        ))}
      </section>
    </PageTransition>
  );
}

function ProgramBlock({ program, index }: { program: Program; index: number }) {
  return (
    <Reveal delay={index * 0.04}>
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <header className="lg:col-span-5">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-bone">
            <span className="rounded-full border border-bone/20 px-3 py-1">{program.format}</span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {program.duration}
            </span>
          </div>
          <h2 className="mt-6 text-balance text-4xl md:text-5xl lg:text-6xl">
            {program.title}
          </h2>
          <p className="mt-5 max-w-lg text-bone">{program.blurb}</p>
        </header>

        <div className="lg:col-span-7">
          <div className="grid gap-5 md:grid-cols-3">
            {program.tiers.map((tier) => (
              <TierCard key={tier.name} tier={tier} programTitle={program.title} />
            ))}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function TierCard({ tier, programTitle }: { tier: Tier; programTitle: string }) {
  const isPremium = tier.highlight === true;
  return (
    <article
      className={[
        'relative flex flex-col rounded-3xl p-6 transition-all duration-500 md:p-7',
        isPremium
          ? 'border-2 border-flame bg-ink-soft shadow-2xl shadow-flame/20 md:-translate-y-2'
          : 'border border-bone/10 bg-ink-soft/40 hover:border-bone/30',
      ].join(' ')}
    >
      {isPremium && (
        <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-flame px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-paper">
          <Sparkles size={11} /> Best value
        </span>
      )}

      <div className="flex items-center justify-between">
        <p className="font-serif text-xl text-paper">{tier.name}</p>
        {tier.badge && (
          <span
            className={[
              'rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-[0.22em]',
              isPremium ? 'bg-paper/10 text-paper' : 'border border-bone/20 text-bone',
            ].join(' ')}
          >
            {tier.badge}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="font-serif text-5xl text-paper">{formatCents(tier.priceCents)}</span>
        <span className="text-xs uppercase tracking-widest text-bone">one-time</span>
      </div>

      <ul className="mt-6 flex-1 space-y-3 text-sm text-bone">
        {tier.perks.map((perk) => (
          <li key={perk} className="flex gap-3">
            <Check size={16} className="mt-0.5 shrink-0 text-flame" />
            <span>{perk}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-4">
        <RegisterButton tier={tier} programTitle={programTitle} primary={isPremium} />
      </div>
    </article>
  );
}

function RegisterButton({
  tier,
  programTitle,
  primary,
}: {
  tier: Tier;
  programTitle: string;
  primary: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setLoading(true);
    setError(null);
    try {
      await startCheckout({
        priceId: tier.stripePriceId,
        name: `${programTitle} — ${tier.name}${tier.badge ? ` (${tier.badge})` : ''}`,
        amountCents: tier.priceCents,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Checkout error');
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={onClick}
        disabled={loading}
        className={`w-full justify-center ${primary ? 'btn-primary' : 'btn-ghost'} disabled:opacity-60`}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            Register <ArrowRight size={16} />
          </>
        )}
      </button>
      {error && <p className="mt-2 text-xs text-flame">{error}</p>}
    </div>
  );
}
