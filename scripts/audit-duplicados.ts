/**
 * audit-duplicados.ts — detecta la misma tienda repetida dentro de una bota.
 * Uso: npx tsx scripts/audit-duplicados.ts
 */
import { botas } from "../src/data/botas";

let problemas = 0;
for (const b of botas) {
  const conteo: Record<string, number> = {};
  for (const l of b.links_compra) conteo[l.tienda] = (conteo[l.tienda] || 0) + 1;
  const dup = Object.entries(conteo).filter(([, n]) => n > 1);
  if (!dup.length) continue;
  problemas++;
  console.log("\n" + b.slug);
  for (const [t, n] of dup) {
    console.log(`  ${t} x${n}`);
    for (const l of b.links_compra.filter((x) => x.tienda === t)) {
      console.log(`    ${String(l.precio_actual).padStart(7)}€  ${decodeURIComponent(l.url).slice(-64)}`);
    }
  }
}
console.log(problemas ? `\n${problemas} botas con tienda duplicada\n` : "\nSin tiendas duplicadas\n");
