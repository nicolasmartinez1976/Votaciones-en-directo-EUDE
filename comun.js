// Configuración compartida · Votaciones EUDE
const SB_URL = "https://ggkotwacgcsbsdhvelie.supabase.co";
const SB_KEY = "sb_publishable_Oq9D2UsarSnzAzyrAe1rIA_JiCIaWva";
const ALIAS = { mkt: "spv-mkt", mba: "spv-mba" };

function slugActual() {
  const q = new URLSearchParams(location.search).get("p");
  if (q) return ALIAS[q] || q;
  const parts = location.pathname.split("/").filter(Boolean);
  const last = parts[parts.length - 1] || "";
  return ALIAS[last] || last;
}

function aliasDe(slug) {
  for (const [k, v] of Object.entries(ALIAS)) if (v === slug) return k;
  return slug;
}

async function sb(path, opts = {}) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    cache: "no-store",
  });
  const txt = await r.text();
  let data = null;
  try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = txt; }
  if (!r.ok) {
    const err = new Error((data && data.message) || r.statusText);
    err.status = r.status; err.code = data && data.code;
    throw err;
  }
  return data;
}

function cargarEncuesta(slug) {
  return sb(`vot_encuestas?slug=eq.${encodeURIComponent(slug)}&select=*`).then(d => (d && d[0]) || null);
}

// Al abrir: si la encuesta lleva más de 60 min sin actividad, se pone a cero sola.
function abrirEncuesta(slug) {
  return sb("rpc/vot_sesion_fresca", { method: "POST", body: JSON.stringify({ p_slug: slug }) })
    .then(d => (d && d.slug) ? d : null).catch(() => cargarEncuesta(slug));
}

function cargarVotos(slug, sesion) {
  return sb(`vot_votos?slug=eq.${encodeURIComponent(slug)}&sesion=eq.${sesion}&select=opcion,comentario,creado&order=creado.desc&limit=1000`);
}

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return store._m[k] ?? null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { store._m[k] = v; } },
  _m: {},
};

function dispositivo() {
  let id = store.get("eude_disp");
  if (!id) {
    id = (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36));
    store.set("eude_disp", id);
  }
  return id;
}
