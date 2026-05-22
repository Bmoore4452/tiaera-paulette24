import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, Mic, BookOpen, Award, Trophy, Users, Sparkles } from 'lucide-react';
import PageTransition from '../components/layout/PageTransition';
import Reveal from '../components/Reveal';


export default function About() {
  return (
    <PageTransition>
      <section className="container-x pt-36 pb-16 md:pt-48">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="eyebrow">About Tiaera</p>
            <h1 className="mt-6 text-balance text-6xl md:text-7xl xl:text-8xl">
              A clinician, a teacher, a witness to the work.
            </h1>
            <p className="mt-8 max-w-2xl text-balance text-lg text-bone md:text-xl">
              Tiaera Paulette, LMSW, is a Georgia-licensed master social worker with over
              15 years of practice in trauma-focused clinical care. She trains the next
              generation of clinicians as an Adjunct Professor at the University of Tennessee
              College of Social Work and prepares to begin her PhD at Clark Atlanta&apos;s
              Whitney M. Young Jr. School of Social Work in Fall 2026.
            </p>
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-4 md:grid-cols-2">
          <Stat icon={<GraduationCap size={18} />} label="Master of Science in Social Work" value="University of Tennessee · 2009" />
          <Stat icon={<GraduationCap size={18} />} label="Incoming PhD" value="Clark Atlanta · Fall 2026" />
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">What she does</p>
            <h2 className="mt-6 text-4xl text-balance md:text-5xl">
              The work, in <span className="italic text-flame">four lanes.</span>
            </h2>
          </div>
          <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
            <Lane
              icon={<BookOpen size={18} />}
              title="Clinical care"
              body="Therapist and life coach at All Things Fit Wellness (Co-CEO) and Director at F.I.I.T. Families — trauma-informed therapy, evidence-based treatment, and integrated mental/physical health for underserved families."
            />
            <Lane
              icon={<GraduationCap size={18} />}
              title="Teaching"
              body="Adjunct Professor at University of Tennessee College of Social Work. Course design and instruction on the biological, psychological, and social dimensions of substance use, aligned to CSWE standards."
            />
            <Lane
              icon={<Mic size={18} />}
              title="Speaking & podcast"
              body="Host of the Uncensored Wellness Podcast. Keynotes and workshops for universities, conferences, faith communities, and corporate wellness."
            />
            <Lane
              icon={<BookOpen size={18} />}
              title="Writing"
              body="Author of educational and self-help literature on family resilience, identity, and protecting your peace."
            />
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Recognition</p>
            <h2 className="mt-6 text-4xl text-balance md:text-5xl">
              Awards & <span className="italic text-flame">achievements.</span>
            </h2>
          </div>
          <div className="lg:col-span-8 grid gap-4 sm:grid-cols-2">
            <AwardCard
              icon={<Trophy size={18} />}
              title="40 Under 40 Honoree"
              org="University of Tennessee"
              year="Class of 2024"
            />
            <AwardCard
              icon={<Award size={18} />}
              title="University Trailblazer Award Honoree"
              org="University of Tennessee Black Alumni Council"
              year="2024"
            />
            <AwardCard
              icon={<Users size={18} />}
              title="Campus Relations Co-Chair"
              org="University of Tennessee Black Alumni Council"
            />
            <AwardCard
              icon={<Sparkles size={18} />}
              title="Inaugural First-Generation Doctoral Student Program"
              org="University of Tennessee"
              year="2024"
            />
          </div>
        </div>
      </section>

      <section className="container-x py-16">
        <Reveal>
          <div className="rounded-3xl border border-bone/10 bg-ink-soft/50 p-8 md:p-12">
            <p className="eyebrow">Research interests</p>
            <ul className="mt-8 grid gap-3 text-lg text-paper md:grid-cols-2">
              <li className="flex gap-3"><span className="text-flame">—</span> Trauma-informed clinical practices and recovery outcomes</li>
              <li className="flex gap-3"><span className="text-flame">—</span> Mental health equity among Black women and underserved communities</li>
              <li className="flex gap-3"><span className="text-flame">—</span> Family resilience, youth behavioral health, community reintegration</li>
              <li className="flex gap-3"><span className="text-flame">—</span> Faith-based and culturally responsive approaches to psychotherapy</li>
            </ul>
          </div>
        </Reveal>
      </section>

      <section className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow">Credentials</p>
            <h2 className="mt-6 text-4xl text-balance md:text-5xl">Licensure & certifications.</h2>
          </div>
          <div className="lg:col-span-8 grid gap-3 text-paper md:grid-cols-2">
            <Cred title="LMSW" sub="Georgia" />
            <Cred title="Formerly LMSW" sub="South Carolina" />
            <Cred title="TF-CBT" sub="Trauma-Focused CBT" />
            <Cred title="CPR / CPI" sub="Certified" />
            <Cred title="CANS / ANSA" sub="Certified" />
            <Cred title="SASSI" sub="Certified" />
          </div>
        </div>
      </section>

      <section className="container-x py-24">
        <div className="rounded-[2rem] bg-flame p-10 md:p-16">
          <h2 className="max-w-3xl text-balance text-5xl text-paper md:text-7xl">
            Want her at your event?
          </h2>
          <p className="mt-6 max-w-xl text-paper/80">
            Tiaera takes a limited number of speaking engagements each season. Check her
            calendar and lock in a date.
          </p>
          <div className="mt-10">
            <Link to="/speaking" className="btn-dark">
              Book speaking <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PageTransition>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="card p-6">
      <span className="text-flame">{icon}</span>
      <p className="mt-4 text-sm uppercase tracking-widest text-bone">{label}</p>
      <p className="mt-2 font-serif text-2xl text-paper">{value}</p>
    </div>
  );
}

function Lane({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="card p-6">
      <span className="text-flame">{icon}</span>
      <p className="mt-4 font-serif text-2xl text-paper">{title}</p>
      <p className="mt-3 text-sm text-bone">{body}</p>
    </div>
  );
}

function AwardCard({
  icon,
  title,
  org,
  year,
}: {
  icon: React.ReactNode;
  title: string;
  org: string;
  year?: string;
}) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <span className="text-flame">{icon}</span>
        {year && <span className="text-xs uppercase tracking-widest text-bone">{year}</span>}
      </div>
      <p className="mt-4 font-serif text-2xl text-paper">{title}</p>
      <p className="mt-2 text-sm text-bone">{org}</p>
    </div>
  );
}

function Cred({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex items-baseline justify-between rounded-2xl border border-bone/10 px-5 py-4">
      <span className="font-serif text-xl">{title}</span>
      <span className="text-xs uppercase tracking-widest text-bone">{sub}</span>
    </div>
  );
}
