type Body = {
  email: string;
  masterclassId: string;
  masterclassTitle: string;
};

export const config = { runtime: 'nodejs' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  const { email, masterclassId, masterclassTitle } = body;
  if (!email || !email.includes('@') || !masterclassId) {
    return new Response('Invalid input', { status: 400 });
  }

  // TODO: replace this stub with a real handler:
  //   - send a confirmation email (Resend/Postmark/SES)
  //   - push the lead into a list (Mailchimp/ConvertKit/Brevo)
  //   - or write to a database (Supabase/Postgres)
  console.log(`[free-register] ${email} -> ${masterclassId} (${masterclassTitle})`);

  return Response.json({ ok: true });
}
