import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';

/**
 * Placeholder for the upcoming /Gems section — small, brand-aligned, easy to
 * swap once the real content (quotes, micro-essays, podcast clips, etc.) lands.
 */
export default function Gems() {
  return (
    <PageTransition>
      <section className="container-x grid min-h-[80svh] place-items-center py-32 text-center">
        <div className="max-w-2xl">
          <p className="eyebrow justify-center">
            <Sparkles size={13} className="text-flame" />
            Coming soon
          </p>
          <h1 className="mt-8 text-balance text-6xl md:text-8xl">
            Gems<span className="text-flame">.</span>
          </h1>
          <p className="mt-8 text-balance text-lg text-bone md:text-xl">
            Small, sharp pieces of wisdom from Tiaera — drops from sessions, podcasts, and the
            quiet work in between. Something you can pick up in a minute and carry for a week.
          </p>
          <p className="mt-6 text-balance text-bone/70">
            We&apos;re polishing the first ones now. Come back soon.
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link to="/" className="btn-primary">
              Back home <ArrowRight size={15} />
            </Link>
            <Link to="/speaking" className="btn-ghost">
              Book Tiaera in the meantime
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
