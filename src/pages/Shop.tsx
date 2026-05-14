import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import Reveal from '../components/Reveal';
import { products, type Product } from '../data/products';
import { formatCents } from '../lib/format';
import { startCheckout } from '../lib/stripe';

export default function Shop() {
  return (
    <PageTransition>
      <section className="container-x pt-36 pb-12 md:pt-48">
        <p className="eyebrow">Shop</p>
        <h1 className="mt-6 max-w-4xl text-balance text-6xl md:text-8xl">
          Wear the message. <span className="italic text-flame">Read the work.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-balance text-lg text-bone md:text-xl">
          Books, tees, and a few daily reminders. Drops will go live as inventory and
          fulfillment finalize — sign up below to be first in line.
        </p>
      </section>

      <section className="container-x py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.05}>
              <Card p={p} />
            </Reveal>
          ))}
        </div>
      </section>
    </PageTransition>
  );
}

function Card({ p }: { p: Product }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const comingSoon = p.status === 'coming-soon';

  async function buy() {
    setLoading(true);
    setErr(null);
    try {
      await startCheckout({
        priceId: p.stripePriceId,
        name: p.name,
        amountCents: p.priceCents,
      });
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Checkout error');
      setLoading(false);
    }
  }

  return (
    <div className="card group overflow-hidden">
      <div className="relative aspect-[4/5] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-flame/30 via-ink-soft to-ink transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 grid place-items-center p-6 text-center">
          <p className="font-serif text-3xl text-paper">{p.name}</p>
        </div>
        {comingSoon && (
          <span className="absolute left-5 top-5 rounded-full border border-bone/20 bg-ink/70 px-3 py-1 text-[10px] uppercase tracking-widest text-bone backdrop-blur">
            Coming soon
          </span>
        )}
        <span className="absolute right-5 top-5 rounded-full bg-ink/70 px-3 py-1 text-[10px] uppercase tracking-widest text-bone backdrop-blur">
          {p.category}
        </span>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-serif text-xl text-paper">{p.name}</p>
            <p className="mt-1 text-sm text-bone">{p.blurb}</p>
          </div>
          <p className="font-serif text-2xl text-paper">{formatCents(p.priceCents)}</p>
        </div>
        <div className="mt-6">
          {comingSoon ? (
            <button disabled className="btn-ghost w-full justify-center opacity-60">
              Notify me
            </button>
          ) : (
            <button onClick={buy} disabled={loading} className="btn-primary w-full justify-center">
              {loading ? <Loader2 size={16} className="animate-spin" /> : (
                <>
                  Buy <ArrowRight size={16} />
                </>
              )}
            </button>
          )}
          {err && <p className="mt-2 text-xs text-flame">{err}</p>}
        </div>
      </div>
    </div>
  );
}
