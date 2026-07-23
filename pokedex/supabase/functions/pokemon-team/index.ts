import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(req.url);
  const type = url.searchParams.get("type");

  if (!type) {
    return new Response(
      JSON.stringify({ error: "Missing required query parameter: type" }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  const typeRes = await fetch(`https://pokeapi.co/api/v2/type/${type}/`);
  if (!typeRes.ok) {
    return new Response(
      JSON.stringify({ error: `PokeAPI type lookup failed: ${typeRes.statusText}` }),
      { status: typeRes.status, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  }

  const typeData = await typeRes.json();
  const allPokemon: { name: string; url: string }[] = typeData.pokemon.map(
    (entry: { pokemon: { name: string; url: string } }) => entry.pokemon
  );

  // Fisher-Yates shuffle, take first 6
  const shuffled = [...allPokemon];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const team = shuffled.slice(0, 6);

  const teamWithSprites = await Promise.all(
    team.map(async ({ name, url }) => {
      const pokeRes = await fetch(url);
      if (!pokeRes.ok) return { [name]: null };
      const pokeData = await pokeRes.json();
      return { [name]: pokeData.sprites.front_default };
    })
  );

  return new Response(
    JSON.stringify(teamWithSprites),
    { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
  );
});
