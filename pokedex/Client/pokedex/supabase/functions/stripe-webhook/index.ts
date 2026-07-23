import Stripe from 'npm:stripe';
import { createClient } from 'npm:@supabase/supabase-js';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// V2 thin events have "object": "v2.core.event"; all others are v1 snapshot events.
function isV2Event(body: Record<string, unknown>): boolean {
  return body.object === 'v2.core.event';
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const stripeKey       = Deno.env.get('STRIPE_SECRET_KEY');
  const thinSecret      = Deno.env.get('STRIPE_WEBHOOK_SECRET_THIN');
  const snapshotSecret  = Deno.env.get('STRIPE_WEBHOOK_SECRET_SNAPSHOT');
  const supabaseUrl     = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!stripeKey || !thinSecret || !snapshotSecret || !supabaseUrl || !serviceRoleKey) {
    return new Response(
      JSON.stringify({ error: "Server configuration error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new Response(
      JSON.stringify({ error: "Missing stripe-signature header" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const rawBody = await req.arrayBuffer();

  // Parse body to detect event version — used only to select the correct signing
  // secret; we still verify the signature before trusting any payload content.
  let parsedBody: Record<string, unknown>;
  try {
    parsedBody = JSON.parse(new TextDecoder().decode(rawBody));
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON body" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const webhookSecret = isV2Event(parsedBody) ? thinSecret : snapshotSecret;
  const stripe = new Stripe(stripeKey, { apiVersion: '2025-05-28.basil' });

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      new Uint8Array(rawBody),
      sig,
      webhookSecret,
    ) as Stripe.Event;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook signature verification failed";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  // ── Payment intent (one-time donations) ────────────────────────────────────
  if (event.type === 'payment_intent.succeeded' || event.type === 'payment_intent.payment_failed') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const status = event.type === 'payment_intent.succeeded' ? 'succeeded' : 'failed';

    const { data: existing } = await supabase
      .from('donations')
      .select('id')
      .eq('stripe_payment_intent_id', paymentIntent.id)
      .maybeSingle();

    if (!existing) {
      await supabase.from('donations').insert({
        user_id: paymentIntent.metadata?.user_id,
        amount: paymentIntent.amount,
        stripe_payment_intent_id: paymentIntent.id,
        status,
      });
    }
  }

  // ── Setup intent created (subscription enrollment) ─────────────────────────
  if (event.type === 'setup_intent.created') {
    const setupIntent = event.data.object as Stripe.SetupIntent;

    const { data: existing } = await supabase
      .from('donations')
      .select('id')
      .eq('stripe_setup_intent_id', setupIntent.id)
      .maybeSingle();

    if (!existing) {
      await supabase.from('donations').insert({
        user_id: setupIntent.metadata?.user_id,
        amount: 0,
        stripe_setup_intent_id: setupIntent.id,
        status: 'pending',
      });
    }
  }

  // ── Billing meter error (v2 thin event) ────────────────────────────────────
  if (event.type === 'v1.billing.meter.error_report_triggered') {
    // v2 events are not unwrapped by constructEventAsync into a typed object,
    // so we read directly from the verified parsedBody.
    const v2 = parsedBody as {
      id: string;
      created: string;
      related_object: { id: string; url: string };
    };

    const { data: existing } = await supabase
      .from('meter_error_logs')
      .select('id')
      .eq('stripe_event_id', v2.id)
      .maybeSingle();

    if (!existing) {
      await Promise.all([
        supabase.from('meter_error_logs').insert({
          stripe_event_id: v2.id,
          meter_id:        v2.related_object.id,
          meter_url:       v2.related_object.url,
          occurred_at:     v2.created,
        }),
        supabase.from('notifications').insert({
          type:    'meter_error',
          message: `Billing meter error reported for meter ${v2.related_object.id}`,
          payload: {
            meter_id:    v2.related_object.id,
            meter_url:   v2.related_object.url,
            occurred_at: v2.created,
          },
        }),
      ]);
    }
  }

  return new Response(
    JSON.stringify({ received: true }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
