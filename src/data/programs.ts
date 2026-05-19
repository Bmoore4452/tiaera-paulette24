export type Tier = {
  name: string;
  badge?: 'Basic' | 'Premium';
  priceCents: number;
  highlight?: boolean;
  perks: string[];
  stripePriceId?: string;
};

export type Program = {
  id: string;
  title: string;
  duration: string;
  format: 'Self-paced digital' | 'Live cohort';
  blurb: string;
  tiers: Tier[];
};

export const programs: Program[] = [
  {
    id: 'digital-course',
    title: 'Self-Guided Digital Course',
    duration: '6 weeks',
    format: 'Self-paced digital',
    blurb:
      "A six-week, on-demand version of Tiaera's flagship masterclass. Move at your own pace; come back as often as you need.",
    tiers: [
      {
        name: 'Tier 1',
        badge: 'Basic',
        priceCents: 12500,
        perks: [
          'Full course access',
          '6 weeks of structured curriculum',
          'Downloadable workbook & materials',
          'Lifetime access to recordings',
        ],
        stripePriceId: 'price_REPLACE_ME_DIGITAL_T1',
      },
      {
        name: 'Tier 2',
        priceCents: 17500,
        perks: [
          'Everything in Tier 1',
          'One personalized video message each week, based on your submitted coursework',
        ],
        stripePriceId: 'price_REPLACE_ME_DIGITAL_T2',
      },
      {
        name: 'Tier 3',
        badge: 'Premium',
        priceCents: 21000,
        highlight: true,
        perks: [
          'Everything in Tier 2',
          '15-minute personal phone call with Tiaera every week',
        ],
        stripePriceId: 'price_REPLACE_ME_DIGITAL_T3',
      },
    ],
  },
  {
    id: 'live-time-management',
    title: 'Live Time Management Masterclass',
    duration: '8 weeks',
    format: 'Live cohort',
    blurb:
      'Eight weeks of live, hour-long sessions on protecting your 24. Real cohort, real-time accountability, work that lands.',
    tiers: [
      {
        name: 'Tier 1',
        priceCents: 20000,
        perks: [
          'Eight 1-hour live sessions',
          'Group cohort access',
          'Session recordings for replay',
        ],
        stripePriceId: 'price_REPLACE_ME_LIVE_T1',
      },
      {
        name: 'Tier 2',
        priceCents: 25000,
        perks: [
          'Everything in Tier 1',
          'Weekly text-message check-ins from Tiaera',
        ],
        stripePriceId: 'price_REPLACE_ME_LIVE_T2',
      },
      {
        name: 'Tier 3',
        badge: 'Premium',
        priceCents: 29900,
        highlight: true,
        perks: [
          'Everything in Tier 2',
          'Monday / Wednesday / Friday text-message check-ins',
          'One personalized video message every week',
        ],
        stripePriceId: 'price_REPLACE_ME_LIVE_T3',
      },
    ],
  },
];
