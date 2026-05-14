import { Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';

export default function CheckoutCancel() {
  return (
    <PageTransition>
      <section className="container-x grid min-h-[80svh] place-items-center py-32 text-center">
        <div className="max-w-xl">
          <h1 className="text-balance text-5xl md:text-7xl">No worries.</h1>
          <p className="mt-6 text-balance text-bone md:text-lg">
            Your checkout was cancelled — nothing was charged. Come back whenever you&apos;re
            ready.
          </p>
          <div className="mt-10 flex justify-center gap-3">
            <Link to="/" className="btn-ghost">Back home</Link>
            <Link to="/masterclasses" className="btn-primary">Try again</Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
