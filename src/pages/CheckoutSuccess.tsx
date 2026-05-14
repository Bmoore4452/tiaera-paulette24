import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';

export default function CheckoutSuccess() {
  return (
    <PageTransition>
      <section className="container-x grid min-h-[80svh] place-items-center py-32 text-center">
        <div className="max-w-xl">
          <CheckCircle2 size={48} className="mx-auto text-flame" />
          <h1 className="mt-8 text-balance text-5xl md:text-7xl">You&apos;re in.</h1>
          <p className="mt-6 text-balance text-bone md:text-lg">
            Tiaera&apos;s team will send confirmation and next steps to your email shortly.
            Save this moment — your 24 just got a little better.
          </p>
          <div className="mt-10 flex justify-center gap-3">
            <Link to="/" className="btn-primary">Back home</Link>
            <Link to="/masterclasses" className="btn-ghost">See other classes</Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
