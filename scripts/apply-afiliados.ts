/**
 * apply-afiliados.ts — envuelve los enlaces de compra de botas.ts con los
 * wrappers de afiliado APROBADOS y marca `tiene_afiliado` en consecuencia.
 *
 * Idempotente: se puede volver a ejecutar sin doble-envolver.
 * Uso:  npx tsx scripts/apply-afiliados.ts [--dry]
 *
 * Importa las funciones reales de src/lib/afiliados.ts para que no haya dos
 * fuentes de verdad del formato de wrapper.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { wrap, AFILIADO_ACTIVO } from "../src/lib/afiliados";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname, "../src/data/botas.ts");
const dry = process.argv.includes("--dry");

let src = readFileSync(FILE, "utf8");

// Cada entrada de links_compra en una sola línea:
// { tienda: "amazon_es", url: "...", precio_actual: 1, disponible: true, tiene_afiliado: false, ultima_verificacion: "..." },
const RE = /\{ tienda: "([a-z_0-9]+)", url: "([^"]+)"(, precio_actual: [\d.]+, disponible: (?:true|false), tiene_afiliado: )(true|false)/g;

const stats: Record<string, { envueltos: number; saltados: number }> = {};
let cambiados = 0;

src = src.replace(RE, (full, tienda: string, url: string, mid: string, afi: string) => {
  stats[tienda] ??= { envueltos: 0, saltados: 0 };

  // Sin programa aprobado → enlace directo, tiene_afiliado false.
  if (!AFILIADO_ACTIVO.has(tienda)) {
    stats[tienda].saltados++;
    return `{ tienda: "${tienda}", url: "${url}"${mid}false`;
  }

  // Ya envuelto → no tocar (idempotencia).
  const yaEnvuelto =
    url.includes("awin1.com/cread.php") ||
    url.includes("tradetracker.net") ||
    url.includes("deals.fuikaomar.es") ||
    url.includes("tag=");
  if (yaEnvuelto) {
    stats[tienda].saltados++;
    return `{ tienda: "${tienda}", url: "${url}"${mid}true`;
  }

  const nueva = wrap(tienda, url);
  stats[tienda].envueltos++;
  cambiados++;
  return `{ tienda: "${tienda}", url: "${nueva}"${mid}true`;
});

console.log("\n  tienda              envueltos  sin-programa");
console.log("  " + "─".repeat(46));
for (const [t, v] of Object.entries(stats).sort((a, b) => b[1].envueltos - a[1].envueltos)) {
  console.log(`  ${t.padEnd(20)}${String(v.envueltos).padStart(6)}${String(v.saltados).padStart(14)}`);
}
console.log(`\n  ${cambiados} enlaces envueltos${dry ? " (DRY RUN, no escrito)" : ""}\n`);

if (!dry) writeFileSync(FILE, src);
