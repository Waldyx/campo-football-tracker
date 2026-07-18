// ─────────────────────────────────────────────────────────────────────
// Afiliados — CANCHA.BOTAS
//
// FUENTE ÚNICA de los wrappers de afiliado. Nunca escribas un wrapper a mano
// en botas.ts: usa estas funciones para que el formato sea siempre correcto y
// se pueda cambiar un ID en un solo sitio.
//
// Regla de oro: si un programa NO está aprobado, el enlace va DIRECTO y con
// `tiene_afiliado: false`. Nunca inventes un ID ni envuelvas una tienda que no
// tenemos aprobada — rompería el enlace y/o incumpliría las condiciones.
// ─────────────────────────────────────────────────────────────────────

/** Amazon Associates — el tag se añade como query param a cualquier URL de amazon.es */
export const AMAZON_TAG = "canchazapa-21";

/** Awin — nuestro publisher ID */
export const AWIN_AFFID = "2908587";

/** TradeTracker — nuestro affiliate ID */
export const TT_AFFID = "511170";

/** Awin: AID (merchant id) de cada programa APROBADO. */
export const AWIN_AID = {
  adidas_es: "77008",
  aliexpress: "11640",
  forumsport_es: "23805",
  decathlon: "105405",
  atmosfera_es: "26255",
  snipes_es: "122628",
  elcorteingles_es: "13075",
} as const;

/** TradeTracker: ID de campaña de cada programa ACEPTADO. */
export const TT_CAMPAIGN = {
  fuikaomar_es: "37834",
  futbolemotion_es: "35939",
} as const;

/**
 * Comisión estimada por tienda (% sobre venta). Solo se usa para DESEMPATAR
 * cuando dos tiendas tienen el mismo precio (±0,50 €) — nunca para ordenar
 * el catálogo ni para decidir qué recomienda el quiz.
 * 0 = sin programa de afiliado (rechazado o inexistente).
 */
export const COMISIONES: Record<string, number> = {
  // ── Awin (aprobados) ──
  aliexpress: 7,
  decathlon: 6,
  atmosfera_es: 6,
  elcorteingles_es: 6,
  adidas_es: 5,
  forumsport_es: 5,
  snipes_es: 5,
  // ── TradeTracker (aceptados) ──
  fuikaomar_es: 5,
  futbolemotion_es: 3.5,
  // ── Amazon ──
  amazon_es: 3,
  // ── Sin programa: rechazados o sin afiliación ──
  nike_es: 0,
  puma_es: 0,        // CJ Puma EU rechazado — reintentar con más tráfico
  jd_sports_es: 0,   // rechazado
  sprinter_es: 0,    // rechazado
  footlocker_es: 0,  // rechazado
  zalando_es: 0,     // rechazado (Privé by Zalando)
  mizuno_es: 0,
  nb_es: 0,
  ua_es: 0,
  idealo_es: 0,      // comparador, sin afiliación directa
  prodirect_es: 0,   // Awin PENDIENTE de aprobación
};

/** Tiendas con afiliado ACTIVO ahora mismo (las únicas que monetizan). */
export const AFILIADO_ACTIVO = new Set<string>([
  "amazon_es",
  "adidas_es",
  "decathlon",
  "aliexpress",
  "atmosfera_es",
  "elcorteingles_es",
  "forumsport_es",
  "snipes_es",
  "fuikaomar_es",
  "futbolemotion_es",
]);

// ─────────────────────────────────────────────────────────────────────
// Wrappers
// ─────────────────────────────────────────────────────────────────────

/** Añade el tag de Amazon Associates a una URL de amazon.es (idempotente). */
export function amazon(url: string): string {
  if (url.includes("tag=")) return url;
  return url + (url.includes("?") ? "&" : "?") + `tag=${AMAZON_TAG}`;
}

/** Envuelve una URL en el wrapper de Awin para un programa aprobado. */
export function awin(tienda: keyof typeof AWIN_AID, url: string): string {
  const aid = AWIN_AID[tienda];
  if (!aid) throw new Error(`Awin: no hay AID aprobado para "${tienda}"`);
  return `https://www.awin1.com/cread.php?awinmid=${aid}&awinaffid=${AWIN_AFFID}&ued=${encodeURIComponent(url)}`;
}

/**
 * Envuelve una URL en el wrapper de TradeTracker.
 * FuikaOmar usa su propio dominio de tracking; el resto usa tc.tradetracker.net.
 */
export function tradetracker(tienda: keyof typeof TT_CAMPAIGN, url: string): string {
  const c = TT_CAMPAIGN[tienda];
  if (!c) throw new Error(`TradeTracker: no hay campaña aceptada para "${tienda}"`);
  const base =
    tienda === "fuikaomar_es"
      ? `https://deals.fuikaomar.es/c?c=${c}`
      : `https://tc.tradetracker.net/?c=${c}`;
  return `${base}&m=12&a=${TT_AFFID}&r=&u=${encodeURIComponent(url)}`;
}

/**
 * Envuelve automáticamente según la tienda. Si no hay programa aprobado
 * devuelve la URL tal cual (enlace directo, sin comisión).
 */
export function wrap(tienda: string, url: string): string {
  if (tienda === "amazon_es") return amazon(url);
  if (tienda in AWIN_AID) return awin(tienda as keyof typeof AWIN_AID, url);
  if (tienda in TT_CAMPAIGN) return tradetracker(tienda as keyof typeof TT_CAMPAIGN, url);
  return url;
}
