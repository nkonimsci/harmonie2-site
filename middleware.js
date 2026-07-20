export const config = { matcher: '/((?!_vercel/).*)' };

// Restriction géographique : les connexions provenant des pays listés
// ci-dessous sont refusées (lecture du pays via le réseau Vercel, aucune
// IP stockée). Pour ajouter/retirer un pays, modifier la liste PAYS_BLOQUES
// (codes ISO à 2 lettres, ex. 'JP' = Japon, 'CN' = Chine).

const PAYS_BLOQUES = ['JP'];

export default function middleware(request) {
  const pays = request.headers.get('x-vercel-ip-country') || '';
  if (PAYS_BLOQUES.includes(pays)) {
    return new Response(
      '<!doctype html><html lang="fr"><head><meta charset="utf-8">' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<title>Accès restreint</title></head>' +
      '<body style="font-family:system-ui,Segoe UI,Roboto,sans-serif;background:#17443A;' +
      'color:#fff;display:flex;min-height:100vh;align-items:center;justify-content:center;' +
      'text-align:center;margin:0;padding:24px">' +
      '<div><div style="font-size:2rem;color:#C9A227;font-weight:700;margin-bottom:8px">Accès non disponible</div>' +
      '<p style="opacity:.85">Ce site n\'est pas accessible depuis votre région.</p></div>' +
      '</body></html>',
      { status: 403, headers: { 'content-type': 'text/html; charset=utf-8' } }
    );
  }
}
