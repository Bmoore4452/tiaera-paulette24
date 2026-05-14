import { Mail, MapPin } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';

export default function Contact() {
  return (
    <PageTransition>
      <section className="container-x pt-36 pb-24 md:pt-48">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-6 max-w-4xl text-balance text-6xl md:text-8xl">
          Say <span className="italic text-flame">hello.</span>
        </h1>
        <p className="mt-8 max-w-xl text-balance text-lg text-bone md:text-xl">
          Press, partnerships, custom workshops, or general questions — Tiaera reads every
          message.
        </p>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 max-w-2xl">
          <a
            href="mailto:tiaerapaulette24@gmail.com"
            className="card flex items-center gap-4 p-6 hover:border-flame/40"
          >
            <Mail className="text-flame" />
            <div>
              <p className="text-xs uppercase tracking-widest text-bone">Email</p>
              <p className="font-serif text-lg text-paper">tiaerapaulette24@gmail.com</p>
            </div>
          </a>
          <div className="card flex items-center gap-4 p-6">
            <MapPin className="text-flame" />
            <div>
              <p className="text-xs uppercase tracking-widest text-bone">Based in</p>
              <p className="font-serif text-lg text-paper">Atlanta, GA</p>
            </div>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
