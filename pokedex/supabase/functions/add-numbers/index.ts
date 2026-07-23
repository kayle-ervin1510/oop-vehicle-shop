const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  const url = new URL(req.url);
  const rawA = url.searchParams.get("a");
  const rawB = url.searchParams.get("b");

  if (rawA === null && rawB === null) {
    return json({ error: "Missing required query parameters: a, b" }, 400);
  }
  if (rawA === null) {
    return json({ error: "Missing required query parameter: a" }, 400);
  }
  if (rawB === null) {
    return json({ error: "Missing required query parameter: b" }, 400);
  }

  const a = Number(rawA);
  const b = Number(rawB);

  if (isNaN(a) && isNaN(b)) {
    return json({ error: `Invalid values for a and b: "${rawA}", "${rawB}" are not numbers` }, 400);
  }
  if (isNaN(a)) {
    return json({ error: `Invalid value for a: "${rawA}" is not a number` }, 400);
  }
  if (isNaN(b)) {
    return json({ error: `Invalid value for b: "${rawB}" is not a number` }, 400);
  }

  return json({ result: a + b });
});
