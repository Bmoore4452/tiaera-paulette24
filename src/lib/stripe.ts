import { loadStripe, type Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.warn('Missing VITE_STRIPE_PUBLISHABLE_KEY — Stripe checkout is disabled.');
      return Promise.resolve(null);
    }
    stripePromise = loadStripe(key);
  }
  return stripePromise;
}

export type CheckoutItem = {
  priceId?: string;
  name: string;
  amountCents: number;
  quantity?: number;
};

export async function startCheckout(item: CheckoutItem): Promise<void> {
  const res = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Checkout failed: ${text}`);
  }

  const data = (await res.json()) as { sessionId?: string; url?: string };

  if (data.url) {
    window.location.href = data.url;
    return;
  }

  const stripe = await getStripe();
  if (!stripe || !data.sessionId) {
    throw new Error('Stripe is not configured.');
  }
  const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
  if (error) throw error;
}
