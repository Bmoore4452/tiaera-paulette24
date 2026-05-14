import { useEffect } from 'react';
import { Calendar, Mail, MapPin } from 'lucide-react';
import Cal, { getCalApi } from '@calcom/embed-react';
import PageTransition from '../components/layout/PageTransition';
import Reveal from '../components/Reveal';

const CAL_NAMESPACE = 'speaking-inquiry';

export default function Speaking() {
  const calLink = import.meta.env.VITE_CAL_LINK;

  useEffect(() => {
    if (!calLink) return;
    (async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      cal('ui', {
        theme: 'dark',
        hideEventTypeDetails: false,
        layout: 'month_view',
        cssVarsPerTheme: {
          dark: {
            'cal-brand': '#F2052C',
            'cal-bg': '#1A181B',
            'cal-bg-emphasis': '#2A2729',
            'cal-bg-muted': '#1A181B',
            'cal-bg-subtle': '#2A2729',
            'cal-bg-info': '#2A2729',
            'cal-text': '#FFFFFF',
            'cal-text-emphasis': '#FFFFFF',
            'cal-text-muted': '#D6D6D6',
            'cal-text-subtle': '#D6D6D6',
            'cal-text-info': '#FFFFFF',
            'cal-border': 'rgba(214,214,214,0.12)',
            'cal-border-emphasis': 'rgba(242,5,44,0.4)',
            'cal-border-default': 'rgba(214,214,214,0.12)',
            'cal-border-subtle': 'rgba(214,214,214,0.08)',
            'cal-border-booker': 'rgba(214,214,214,0.12)',
          },
          light: {
            'cal-brand': '#F2052C',
          },
        },
      });
    })();
  }, [calLink]);

  return (
    <PageTransition>
      <section className="container-x pt-36 pb-12 md:pt-48">
        <p className="eyebrow">Book Tiaera to speak</p>
        <h1 className="mt-6 max-w-4xl text-balance text-6xl md:text-8xl">
          Pick a time. <span className="italic text-flame">Lock it in.</span>
        </h1>
        <p className="mt-8 max-w-2xl text-balance text-lg text-bone md:text-xl">
          Tiaera takes a limited number of speaking engagements each quarter. Reserve a
          consultation directly on her calendar — confirmations land in both inboxes.
        </p>
      </section>

      <section className="container-x py-12">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Reveal>
              <div className="overflow-hidden rounded-3xl border border-bone/10 bg-ink-soft">
                {calLink ? (
                  <div className="h-[760px] w-full">
                    <Cal
                      namespace={CAL_NAMESPACE}
                      calLink={calLink}
                      style={{ width: '100%', height: '100%', overflow: 'scroll' }}
                      config={{ layout: 'month_view', theme: 'dark' }}
                    />
                  </div>
                ) : (
                  <div className="grid h-[760px] place-items-center bg-paper p-12 text-ink">
                    <div className="max-w-md text-center">
                      <Calendar className="mx-auto text-flame" />
                      <h3 className="mt-4 font-serif text-3xl">Cal.com link not configured</h3>
                      <p className="mt-3 text-ink/70">
                        Set <code className="rounded bg-ink/5 px-2 py-1">VITE_CAL_LINK</code>{' '}
                        to her Cal.com booking slug. Example:{' '}
                        <code className="rounded bg-ink/5 px-2 py-1 text-xs">
                          tiaera-paulette/speaking-inquiry
                        </code>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          <aside className="lg:col-span-4">
            <Reveal delay={0.1}>
              <div className="card p-6">
                <p className="eyebrow">What she speaks on</p>
                <ul className="mt-6 space-y-3 text-paper">
                  <li>— Trauma-informed care & resilience</li>
                  <li>— Family dynamics across generations</li>
                  <li>— Mental health equity for Black women</li>
                  <li>— Substance use & recovery</li>
                  <li>— Faith, identity, and the clinical room</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.2} className="mt-6">
              <div className="card p-6">
                <p className="eyebrow">Audiences</p>
                <ul className="mt-6 space-y-3 text-paper">
                  <li>— Universities & graduate programs</li>
                  <li>— Conferences & summits</li>
                  <li>— Faith communities</li>
                  <li>— Corporate wellness & DEI</li>
                  <li>— Nonprofits & community orgs</li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.3} className="mt-6">
              <div className="card p-6">
                <p className="eyebrow">Direct</p>
                <ul className="mt-6 space-y-3 text-sm text-bone">
                  <li className="inline-flex items-center gap-2">
                    <Mail size={14} className="text-flame" />
                    <a href="mailto:tiaerapaulette24@gmail.com" className="hover:text-paper">
                      tiaerapaulette24@gmail.com
                    </a>
                  </li>
                  <li className="inline-flex items-center gap-2">
                    <MapPin size={14} className="text-flame" /> Atlanta, GA · Worldwide
                  </li>
                </ul>
              </div>
            </Reveal>
          </aside>
        </div>
      </section>
    </PageTransition>
  );
}
