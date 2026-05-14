import Stripe from 'stripe';

type Body = {
  priceId?: string;
  name: string;
  amountCents: number;
  quantity?: number;
};

export const config = { runtime: 'nodejs' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return new Response('Stripe is not configured (missing STRIPE_SECRET_KEY).', {
      status: 500,
    });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (!body.name || typeof body.amountCents !== 'number' || body.amountCents <= 0) {
    return new Response('Invalid item', { status: 400 });
  }

  const origin = req.headers.get('origin') ?? new URL(req.url).origin;
  const stripe = new Stripe(secretKey);

  const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = body.priceId
    ? { price: body.priceId, quantity: body.quantity ?? 1 }
    : {
        quantity: body.quantity ?? 1,
        price_data: {
          currency: 'usd',
          unit_amount: body.amountCents,
          product_data: { name: body.name },
        },
      };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [lineItem],
      allow_promotion_codes: true,
      automatic_tax: { enabled: false },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: { item: body.name },
    });

    return Response.json({ sessionId: session.id, url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Stripe error';
    return new Response(message, { status: 500 });
  }
}
