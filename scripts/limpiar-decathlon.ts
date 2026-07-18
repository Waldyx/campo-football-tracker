/**
 * limpiar-decathlon.ts — saneo de los enlaces de Decathlon heredados.
 *
 * Problemas que arregla:
 *  1. adidas-predator-club tenía DOS enlaces de Decathlon: uno viejo a una URL
 *     de búsqueda (44,99 €, sin verificar) y el nuevo a la ficha de producto
 *     (29,40 €, verificado). Se elimina el viejo.
 *  2. Los enlaces de Decathlon que apuntan a /search?Ntt=... son deeplinks de
 *     búsqueda: monetizan, pero su `precio_actual` no está verificado (tres de
 *     ellos incluso valen 0). Se marcan `precio_verificado: false` para que la
 *     ficha muestre "Ver precio" en vez de un número inventado.
 *
 * Idempotente. Uso: npx tsx scripts/limpiar-decathlon.ts [--dry]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = resolve(__dirname, "../src/data/botas.ts");
const dry = process.argv.includes("--dry");

let src = readFileSync(FILE, "utf8");
const antes = src;

// ── 1. Borrar el enlace de búsqueda duplicado de predator-club ──────────────
// La URL va codificada dentro del wrapper de Awin (ued=...%3FNtt%3Dadidas%2Bpredator%2Bclub)
const dupRe =
  /\n {6}\{ tienda: "decathlon", url: "[^"]*Ntt%3Dadidas%2Bpredator%2Bclub[^"]*", precio_actual: 44\.99,[^}]*\},/;
const teniaDup = dupRe.test(src);
if (teniaDup) src = src.replace(dupRe, "");

// ── 2. Marcar los deeplinks de búsqueda como precio NO verificado ───────────
let marcados = 0;
src = src.replace(
  /\{ tienda: "decathlon", url: "([^"]*)", precio_actual: ([\d.]+), disponible: (true|false), tiene_afiliado: true, (?!precio_verificado)/g,
  (full, url: string, precio: string, disp: string) => {
    const esBusqueda = decodeURIComponent(decodeURIComponent(url)).includes("/search?");
    if (!esBusqueda) return full;
    marcados++;
    return `{ tienda: "decathlon", url: "${url}", precio_actual: ${precio}, disponible: ${disp}, tiene_afiliado: true, precio_verificado: false, `;
  }
);

console.log(`\n  Enlace duplicado de predator-club: ${teniaDup ? "ELIMINADO" : "no estaba"}`);
console.log(`  Deeplinks de búsqueda marcados sin precio verificado: ${marcados}`);
console.log(`  ${src === antes ? "sin cambios" : "fichero modificado"}${dry ? " (DRY RUN)" : ""}\n`);

if (!dry && src !== antes) writeFileSync(FILE, src);
