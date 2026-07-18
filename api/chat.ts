/**
 * /api/chat — Asistente IA de CANCHA.BOTAS (función serverless de Vercel)
 *
 * Por qué función standalone (no ruta Astro): la web se compila 100% estática
 * (output `dist`). Una función en `/api` es puramente aditiva — Vercel la detecta
 * y la despliega como serverless junto al build estático, sin tocar el resto del
 * sitio. Así el chat NO arriesga el catálogo en producción.
 *
 * Contrato (lo que envía ChatWidget.astro):
 *   POST /api/chat  { messages: [{ role: "user"|"assistant", content: "..." }, ...] }
 *   → 200 { reply: "texto con [[bota:slug]] opcionales" }
 *
 * El LLM se ancla SIEMPRE al catálogo (RAG por inyección en el system prompt):
 * no inventa modelos ni specs — solo usa las botas reales.
 *
 * Variables de entorno (Vercel → Settings → Environment Variables):
 *   OPENROUTER_API_KEY   (obligatoria) — clave de https://openrouter.ai
 *   CHAT_MODEL           (opcional)    — fuerza un único modelo; si no, usa la
 *                                        cadena de fallback gratuita de abajo.
 */
import catalogData from "./_catalog.json" with { type: "json" };

export const config = { maxDuration: 30 };

const CATALOGO: string = (catalogData as any).catalogo;

const SYSTEM = `Eres el experto de CANCHA.BOTAS, web independiente de botas de fútbol para España. Hablas castellano, directo, sin marketing ("sin humo"). Tuteas.

REGLAS:
- Tu especialidad son las BOTAS de este catálogo: NUNCA inventes modelos, specs ni precios; usa solo los datos de abajo. Si una bota no está, dilo claro.
- LA SUPERFICIE MANDA. Antes que nada, averigua dónde juega el usuario y recomienda la suela correcta:
  · FG = hierba natural · AG = césped artificial · SG = barro/lluvia · TF = moqueta/turf · IN = fútbol sala.
  · AVISO IMPORTANTE: usar FG en césped artificial desgasta la bota el cuádruple y aumenta el riesgo de lesión de rodilla. Si el usuario dice que juega en artificial, NO le recomiendes una bota solo-FG sin advertírselo.
- HORMA: si el usuario dice que tiene el pie ancho, NUNCA le recomiendes hormas estrechas (las de velocidad: Mercurial, X/F50). Dirígelo a cuero y a la categoría control (Tiempo, Copa, Morelia, King).
- Si una bota es mala para el caso del usuario, lo dices sin rodeos.
- Los scores van de 1 a 10 y están anclados a fuentes externas (FootballBootsDB/SoccerBible) cuando existen. Los precios son los mejores verificados en tiendas españolas.
- Cuando recomiendes una bota concreta, escribe su marcador EXACTO [[bota:SLUG]] en su propia línea (el SLUG es el primer campo de cada línea del catálogo). El front lo convierte en tarjeta con foto, score y precio. Máximo 2-3 marcadores por respuesta.
- Respeta SIEMPRE el presupuesto que pida el usuario: no recomiendes una bota cuyo precio supere su tope.
- La web tiene además: quiz (/quiz), comparador (/comparar), calculadora de coste por partido (/calculadora) y guías (/blog). Redirige ahí cuando encaje.
- Respuestas breves (2-4 frases + marcadores). Cierra sugiriendo el quiz (/quiz) o una ficha concreta.

CATÁLOGO (slug | marca modelo | categoría | precio | score | puntuaciones | peso | horma | superficies):
${CATALOGO}`;

// ── Rate limit best-effort en memoria (por instancia caliente) ─────────────────
const RL_WINDOW_MS = 30 * 60 * 1000; // 30 min
const RL_MAX = 30; // 30 mensajes / 30 min / IP
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < RL_WINDOW_MS);
  arr.push(now);
  hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > RL_MAX;
}

type Msg = { role: string; content: string };

export default async function handler(req: any, res: any) {
  const origin = (req.headers["origin"] || "").toString();
  // Orígenes permitidos: cualquier despliegue *.vercel.app (producción y previews).
  // Al comprar dominio propio, añadirlo aquí.
  if (/^https:\/\/([a-z0-9-]+\.)*vercel\.app$/.test(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    res.status(500).json({ reply: "El asistente no está configurado todavía. Prueba el quiz mientras tanto." });
    return;
  }

  const ip =
    (req.headers["x-forwarded-for"] || "").toString().split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "anon";
  if (rateLimited(ip)) {
    res.status(429).json({ reply: "Has hecho muchas preguntas seguidas. Espera un poco y vuelve — o usa el quiz." });
    return;
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
  const raw: Msg[] = Array.isArray(body.messages) ? body.messages : [];

  const messages = raw
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) }));

  if (messages.length === 0 || messages[messages.length - 1].role !== "user") {
    res.status(400).json({ error: "messages inválido" });
    return;
  }

  // Modelos gratuitos en orden de preferencia. Los free se rate-limitean upstream,
  // así que probamos en cadena hasta que uno responda. CHAT_MODEL fuerza uno solo.
  const models = process.env.CHAT_MODEL
    ? [process.env.CHAT_MODEL]
    : [
        "google/gemma-4-31b-it:free",
        "meta-llama/llama-3.3-70b-instruct:free",
        "qwen/qwen3-next-80b-a3b-instruct:free",
        "openai/gpt-oss-120b:free",
        "google/gemma-4-26b-a4b-it:free",
      ];

  const payload = (model: string) =>
    JSON.stringify({
      model,
      messages: [{ role: "system", content: SYSTEM }, ...messages],
      max_tokens: 500,
      temperature: 0.4,
    });

  const deadline = Date.now() + 25000;

  for (const model of models) {
    const remaining = deadline - Date.now();
    if (remaining < 2500) break;
    try {
      const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "X-Title": "CANCHA.BOTAS",
        },
        body: payload(model),
        signal: AbortSignal.timeout(Math.min(12000, remaining)),
      });

      if (!r.ok) {
        const detail = await r.text().catch(() => "");
        console.error("[api/chat]", model, r.status, detail.slice(0, 200));
        continue;
      }

      const data = await r.json();
      const reply = data?.choices?.[0]?.message?.content ?? "";
      if (!reply) continue;
      res.status(200).json({ reply });
      return;
    } catch (err) {
      console.error("[api/chat]", model, err);
    }
  }

  res.status(502).json({ reply: "Uy, no he podido responder ahora mismo. Reintenta en un momento — o usa el quiz." });
}
