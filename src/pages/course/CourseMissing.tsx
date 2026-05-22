import { Link } from 'react-router-dom';
import PageTransition from '../../components/layout/PageTransition';

/** Shown when a week/topic/activity id in the URL doesn't resolve. */
export default function CourseMissing() {
  return (
    <PageTransition>
      <section className="container-x grid min-h-[60vh] place-items-center pt-32 text-center">
        <div>
          <p className="eyebrow justify-center">Not found</p>
          <h1 className="mt-6 text-4xl md:text-5xl">That part of the course doesn&apos;t exist.</h1>
          <p className="mt-4 text-bone">The link may be out of date.</p>
          <Link to="/course" className="btn-primary mt-8">
            Back to the course
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
