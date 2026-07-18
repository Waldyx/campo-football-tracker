/**
 * add-futbolemotion.ts — añade un enlace de Fútbol Emotion (TradeTracker, 3.5%)
 * a cada bota cuya marca tenga página de categoría válida en su web.
 *
 * Enlaza a la categoría de botas de la MARCA (deeplink real y estable), no a un
 * producto concreto: por eso va con `precio_verificado: false`, de modo que la
 * ficha muestre "Ver precio en Fútbol Emotion" en lugar de un número inventado.
 *
 * Idempotente. Uso: npx tsx scripts/add-futbolemotion.ts [--dry]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { tradetracker } from "../src/lib/afiliados";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname, "../src/data/botas.ts");
const dry = process.argv.includes("--dry");

// Slugs de marca VERIFICADOS con HTTP 200 en futbolemotion.com (2026-05-20).
// Kelme, Asics y Pantofola d'Oro NO tienen categoría → no se les añade enlace.
const MARCA_SLUG: Record<string, string> = {
  Nike: "nike",
  Adidas: "adidas",
  Puma: "puma",
  "New Balance": "new-balance",
  Mizuno: "mizuno",
  "Under Armour": "under-armour",
  Joma: "joma",
  Munich: "munich",
  Lotto: "lotto",
  Umbro: "umbro",
  Diadora: "diadora",
};

const HOY = "2026-05-20";
let src = readFileSync(FILE, "utf8");

// Recorremos cada bota por su bloque `id:` y localizamos su array links_compra.
const idRe = /^    id: "([^"]+)",$/gm;
const bloques: { id: string; start: number }[] = [];
for (const m of src.matchAll(idRe)) bloques.push({ id: m[1], start: m.index! });

let añadidos = 0;
const saltados: string[] = [];

// De atrás hacia delante para que los índices previos sigan siendo válidos.
for (let i = bloques.length - 1; i >= 0; i--) {
  const { id, start } = bloques[i];
  const end = i + 1 < bloques.length ? bloques[i + 1].start : src.length;
  const bloque = src.slice(start, end);

  const marca = bloque.match(/^    marca: "([^"]+)",$/m)?.[1] ?? "";
  const slug = MARCA_SLUG[marca];
  if (!slug) { saltados.push(`${id} (${marca}: sin categoría)`); continue; }
  if (bloque.includes("futbolemotion_es")) { saltados.push(`${id} (ya tiene)`); continue; }

  const msrp = Number(bloque.match(/^    precio_msrp_eur: ([\d.]+),$/m)?.[1] ?? 0);
  if (!msrp) { saltados.push(`${id} (sin msrp)`); continue; }

  // Cierre del array links_compra dentro de este bloque.
  const lcIdx = bloque.indexOf("links_compra: [");
  if (lcIdx < 0) { saltados.push(`${id} (sin links_compra)`); continue; }
  const cierre = bloque.indexOf("\n    ],", lcIdx);
  if (cierre < 0) { saltados.push(`${id} (cierre no hallado)`); continue; }

  const destino = `https://www.futbolemotion.com/es/categoria/botas-de-futbol/${slug}`;
  const url = tradetracker("futbolemotion_es", destino);
  // precio_actual = MSRP solo como valor de respaldo; NO se muestra porque
  // precio_verificado es false.
  const linea =
    `\n      { tienda: "futbolemotion_es", url: "${url}", precio_actual: ${msrp.toFixed(2)}, ` +
    `disponible: true, tiene_afiliado: true, precio_verificado: false, ultima_verificacion: "${HOY}" },`;

  const abs = start + cierre;
  src = src.slice(0, abs) + linea + src.slice(abs);
  añadidos++;
}

console.log(`\n  Fútbol Emotion: ${añadidos} enlaces añadidos${dry ? " (DRY RUN)" : ""}`);
if (saltados.length) {
  console.log(`  Saltadas (${saltados.length}):`);
  saltados.reverse().forEach((s) => console.log("   -", s));
}
console.log();

if (!dry) writeFileSync(FILE, src);
