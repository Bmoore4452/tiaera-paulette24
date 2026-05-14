import { Link } from 'react-router-dom';
import PageTransition from '../components/layout/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <section className="container-x grid min-h-[80svh] place-items-center py-32 text-center">
        <div className="max-w-xl">
          <p className="font-serif text-8xl text-flame">404</p>
          <h1 className="mt-6 text-balance text-4xl md:text-6xl">This page took a moment off.</h1>
          <p className="mt-6 text-bone">Your 24 keeps moving — let&apos;s get you back on the path.</p>
          <div className="mt-10">
            <Link to="/" className="btn-primary">Back home</Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}
