import { useState } from 'react';
import { ArrowRight, CalendarDays, CheckCircle2, Loader2 } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import Reveal from '../components/Reveal';
import { masterclasses, type Masterclass } from '../data/masterclasses';
import { formatCents } from '../lib/format';
import { startCheckout } from '../lib/stripe';

export default function Masterclasses() {
  return (
    <PageTransition>
      <section className="container-x pt-36 pb-16 md:pt-48">
        <p className="eyebrow">Masterclasses</p>
        <h1 className="mt-6 max-w-4xl text-balance text-6xl md:text-8xl">
          Learn live. <span className="italic text-flame">Leave changed.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-balance text-lg text-bone md:text-xl">
          Clinician-led sessions on trauma, family dynamics, and protecting your peace.
          Some are free. Others are deep dives with materials and follow-up.
        </p>
      </section>

      <section className="container-x py-12 grid gap-6">
        {masterclasses.map((m, i) => (
          <Reveal key={m.id} delay={i * 0.05}>
            <Card m={m} />
          </Reveal>
        ))}
      </section>
    </PageTransition>
  );
}

function Card({ m }: { m: Masterclass }) {
  const isFree = m.priceCents === null;
  return (
    <div className="card group overflow-hidden p-8 md:p-12">
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-bone">
            <span className={`rounded-full px-3 py-1 ${isFree ? 'bg-flame text-paper' : 'border border-bone/20'}`}>
              {isFree ? 'Free' : 'Paid'}
            </span>
            <span className="rounded-full border border-bone/20 px-3 py-1">{m.format}</span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={12} /> {m.date}
            </span>
            <span>{m.duration}</span>
          </div>
          <h3 className="mt-6 max-w-2xl text-4xl text-balance md:text-5xl">{m.title}</h3>
          <p className="mt-4 max-w-2xl text-bone">{m.blurb}</p>
          {m.seats && <p className="mt-4 text-xs uppercase tracking-widest text-bone">{m.seats}</p>}
        </div>
        <div className="flex flex-col justify-between gap-6 lg:col-span-4">
          <div className="rounded-2xl border border-bone/10 bg-ink p-6">
            <p className="text-xs uppercase tracking-widest text-bone">Tuition</p>
            <p className="mt-2 font-serif text-5xl text-paper">
              {isFree ? 'Free' : formatCents(m.priceCents!)}
            </p>
          </div>
          {isFree ? <FreeSignup id={m.id} title={m.title} /> : <PaidRegister m={m} />}
        </div>
      </div>
    </div>
  );
}

function FreeSignup({ id, title }: { id: string; title: string }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('submitting');
    setError(null);
    try {
      const res = await fetch('/api/register-free', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ masterclassId: id, masterclassTitle: title, email }),
      });
      if (!res.ok) throw new Error(await res.text());
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-flame/40 bg-flame/10 px-5 py-4 text-sm">
        <CheckCircle2 size={18} className="text-flame" />
        <span>You&apos;re in. Watch your inbox.</span>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <label className="text-xs uppercase tracking-widest text-bone">Email to reserve</label>
      <div className="flex gap-2">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-full border border-bone/20 bg-ink px-4 py-3 text-sm text-paper placeholder:text-bone/60 focus:border-flame focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === 'submitting'}
          className="btn-primary shrink-0 disabled:opacity-60"
        >
          {state === 'submitting' ? <Loader2 size={16} className="animate-spin" /> : 'Reserve'}
        </button>
      </div>
      {error && <p className="text-xs text-flame">{error}</p>}
    </form>
  );
}

function PaidRegister({ m }: { m: Masterclass }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function go() {
    setLoading(true);
    setErr(null);
    try {
      await startCheckout({
        priceId: m.stripePriceId,
        name: m.title,
        amountCents: m.priceCents!,
      });
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Checkout error');
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={go} disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
        {loading ? <Loader2 size={16} className="animate-spin" /> : (
          <>
            Register <ArrowRight size={16} />
          </>
        )}
      </button>
      {err && <p className="mt-2 text-xs text-flame">{err}</p>}
    </div>
  );
}
