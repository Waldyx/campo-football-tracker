/**
 * add-decathlon.ts — añade/actualiza enlaces de Decathlon (Awin 105405, 6%)
 * para botas con coincidencia EXACTA de modelo verificada a mano.
 *
 * Por qué a mano: el emparejamiento automático por tokens sobre el buscador de
 * Decathlon devuelve basura peligrosa (calcetines para "Magnetico", un gymsack
 * para "Kelme", versiones Junior/infantil, generaciones distintas). Cada entrada
 * de abajo está verificada label a label contra el modelo de nuestro catálogo.
 *
 * Regla: solo se añade si el precio es MENOR que el que ya mostramos, para que
 * el "desde X€" mejore. Decathlon paga 6% (Amazon 3%), así que además duplica
 * la comisión.
 *
 * Idempotente. Uso: npx tsx scripts/add-decathlon.ts [--dry]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { awin } from "../src/lib/afiliados";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname, "../src/data/botas.ts");
const dry = process.argv.includes("--dry");
const HOY = "2026-05-20";

/** Verificados uno a uno en decathlon.es el 2026-05-20 (label exacto del producto). */
const HALLAZGOS: { slug: string; precio: number; url: string; label: string }[] = [
  {
    slug: "nike-mercurial-superfly-10-elite",
    precio: 161.38,
    label: "Botas de fútbol Nike Zoom Mercurial Superfly 10 Elite FG",
    url: "https://www.decathlon.es/es/p/mp/botas-de-futbol-nike-zoom-mercurial-superfly-10-elite-fg/643a8825-a68e-4208-94e1-eeaf87b924d8/c24",
  },
  {
    slug: "nike-tiempo-legend-10-elite",
    precio: 187.5,
    label: "Botas de fútbol Adulto Nike Tiempo Legend 10 Elite Fg Negro",
    url: "https://www.decathlon.es/es/p/mp/botas-de-futbol-adulto-nike-tiempo-legend-10-elite-fg-negro/bdaf322b-269e-4e1c-a8be-969f10485a71/c1",
  },
  {
    slug: "puma-ultra-5-pro-fg",
    precio: 68.8,
    label: "Botas de fútbol ULTRA 5 PRO FG/AG PUMA",
    url: "https://www.decathlon.es/es/p/mp/botas-de-futbol-para-suelo-firme-ultra-5-pro-para-adultos-unisex-manzana/d57365c2-40c0-4dea-aa54-4ae340dee29b/c9c11c4",
  },
  {
    slug: "puma-future-7-pro",
    precio: 62.99,
    label: "Botas de fútbol FUTURE 7 PRO FG/AG PUMA",
    url: "https://www.decathlon.es/es/p/mp/botas-de-futbol-future-7-pro-fg-ag-puma-black-silver-metallic-gray/c66b23b0-4875-4614-b7a2-0b6d82943733/c1c249c251",
  },
  {
    slug: "adidas-predator-club",
    precio: 29.4,
    label: "Bota Predator Club césped natural seco / multisuperficie",
    url: "https://www.decathlon.es/es/p/mp/bota-predator-club-cesped-natural-seco-multisuperficie/e323a77a-386e-4360-a503-0539a569ba73/c4c1c22",
  },
];

let src = readFileSync(FILE, "utf8");
const idRe = /^    id: "([^"]+)",$/gm;
const bloques: { id: string; start: number }[] = [];
for (const m of src.matchAll(idRe)) bloques.push({ id: m[1], start: m.index! });

let añadidos = 0;
const log: string[] = [];

for (let i = bloques.length - 1; i >= 0; i--) {
  const { id, start } = bloques[i];
  const h = HALLAZGOS.find((x) => x.slug === id);
  if (!h) continue;

  const end = i + 1 < bloques.length ? bloques[i + 1].start : src.length;
  const bloque = src.slice(start, end);

  // Ya tiene un enlace de Decathlon con este precio → nada que hacer.
  if (bloque.includes(`precio_actual: ${h.precio}`) && bloque.includes("decathlon")) {
    log.push(`= ${id} (ya aplicado)`);
    continue;
  }

  const lcIdx = bloque.indexOf("links_compra: [");
  const cierre = bloque.indexOf("\n    ],", lcIdx);
  if (lcIdx < 0 || cierre < 0) { log.push(`! ${id} (estructura inesperada)`); continue; }

  const url = awin("decathlon", h.url);
  const linea =
    `\n      { tienda: "decathlon", url: "${url}", precio_actual: ${h.precio.toFixed(2)}, ` +
    `disponible: true, tiene_afiliado: true, ultima_verificacion: "${HOY}" },`;

  src = src.slice(0, start + cierre) + linea + src.slice(start + cierre);
  añadidos++;
  log.push(`+ ${id} → ${h.precio}€  (${h.label.slice(0, 46)})`);
}

log.reverse().forEach((l) => console.log("  " + l));
console.log(`\n  ${añadidos} enlaces de Decathlon añadidos${dry ? " (DRY RUN)" : ""}\n`);
if (!dry) writeFileSync(FILE, src);
