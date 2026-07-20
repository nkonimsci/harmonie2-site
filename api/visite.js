export const config = { runtime: 'edge' };

// Enregistre une visite dans Supabase en ajoutant, côté serveur, le pays /
// la ville / la position approximative fournis par le réseau Vercel.
// AUCUNE adresse IP n'est stockée ; aucune donnée personnelle ; aucun tiers.

const SUPABASE_URL = 'https://jlawnhtkwkqpbhxtwedl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_lOtRr5mZZgJVa3nmA1CrBA_9TtH0zYg';

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let body = {};
  try { body = await req.json(); } catch (e) {}

  const h = req.headers;
  const ville = h.get('x-vercel-ip-city');
  const lat = h.get('x-vercel-ip-latitude');
  const lon = h.get('x-vercel-ip-longitude');

  const row = {
    page: (typeof body.page === 'string') ? body.page.slice(0, 300) : '/',
    referrer: (typeof body.referrer === 'string') ? body.referrer.slice(0, 200) : null,
    ecran: (body.ecran === 'mobile') ? 'mobile' : 'ordinateur',
    nouvelle_visite: !!body.nouvelle_visite,
    pays: h.get('x-vercel-ip-country') || null,
    ville: ville ? decodeURIComponent(ville) : null,
    lat: lat ? Number(lat) : null,
    lon: lon ? Number(lon) : null
  };

  try {
    await fetch(SUPABASE_URL + '/rest/v1/visites', {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: 'Bearer ' + SUPABASE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(row)
    });
  } catch (e) {}

  return new Response(null, { status: 204 });
}
