export const config = { runtime: 'edge' };

// Appelée deux fois par semaine par la tâche planifiée de vercel.json.
// Elle lit une ligne de la table des lots pour que Supabase compte une activité
// et ne mette pas le projet en pause.

const SUPABASE_URL = 'https://jlawnhtkwkqpbhxtwedl.supabase.co';
const SUPABASE_KEY = 'sb_publishable_lOtRr5mZZgJVa3nmA1CrBA_9TtH0zYg';

export default async function handler() {
  const debut = Date.now();
  let status = 0;
  let ok = false;
  try {
    const r = await fetch(SUPABASE_URL + '/rest/v1/lots?select=numero&limit=1', {
      headers: { apikey: SUPABASE_KEY, Authorization: 'Bearer ' + SUPABASE_KEY }
    });
    status = r.status;
    ok = r.ok;
  } catch (e) {}

  return new Response(JSON.stringify({ ok, supabase: status, ms: Date.now() - debut, le: new Date().toISOString() }), {
    status: ok ? 200 : 502,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }
  });
}
