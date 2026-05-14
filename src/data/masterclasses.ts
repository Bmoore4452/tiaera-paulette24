export type Masterclass = {
  id: string;
  title: string;
  blurb: string;
  date: string;
  duration: string;
  format: 'Virtual' | 'In-person' | 'Hybrid';
  priceCents: number | null;
  stripePriceId?: string;
  seats?: string;
};

export const masterclasses: Masterclass[] = [
  {
    id: 'free-encouraged',
    title: 'Stay Encouraged: A 60-Minute Reset',
    blurb:
      'A free monthly session for anyone navigating burnout, grief, or a heavy week. Practical tools you can use the same day.',
    date: 'First Tuesday, monthly · 7:00 PM ET',
    duration: '60 minutes',
    format: 'Virtual',
    priceCents: null,
    seats: 'Open seating',
  },
  {
    id: 'paid-trauma-informed',
    title: 'Trauma-Informed Family Dynamics',
    blurb:
      'A clinician-led deep dive into recognizing and unwinding intergenerational patterns. Includes workbook and 30-day follow-up.',
    date: 'Saturday, Jun 14, 2026 · 10:00 AM ET',
    duration: '3 hours',
    format: 'Virtual',
    priceCents: 14900,
    stripePriceId: 'price_REPLACE_ME_TRAUMA',
    seats: 'Limited to 40',
  },
  {
    id: 'paid-women-wellness',
    title: 'Black Women & The Weight of Wellness',
    blurb:
      'For Black women carrying everything. A two-day intensive on mental health equity, boundaries, and recovery.',
    date: 'Jul 18–19, 2026 · Atlanta, GA',
    duration: '2 days',
    format: 'In-person',
    priceCents: 49900,
    stripePriceId: 'price_REPLACE_ME_WOMEN',
    seats: 'Limited to 25',
  },
];
