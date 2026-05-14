export type Product = {
  id: string;
  name: string;
  category: 'Book' | 'Apparel';
  priceCents: number;
  blurb: string;
  status: 'available' | 'coming-soon';
  stripePriceId?: string;
  imageUrl?: string;
};

export const products: Product[] = [
  {
    id: 'book-stay-encouraged',
    name: 'Stay Encouraged (Book)',
    category: 'Book',
    priceCents: 2400,
    blurb:
      'Tiaera\'s debut book — short, clinical-but-warm reflections on protecting your 24 hours.',
    status: 'coming-soon',
  },
  {
    id: 'tee-twentyfour',
    name: '"Your 24" Tee',
    category: 'Apparel',
    priceCents: 3500,
    blurb: 'Premium heavyweight tee in ink black with flame-red wordmark.',
    status: 'coming-soon',
  },
  {
    id: 'tee-billboard',
    name: 'Billboard Crewneck',
    category: 'Apparel',
    priceCents: 5800,
    blurb: 'Oversized crewneck. Don\'t let one moment own all 24.',
    status: 'coming-soon',
  },
];
