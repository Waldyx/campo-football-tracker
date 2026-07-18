/**
 * worklist-precios.ts — lista cada bota con el precio que MOSTRAMOS hoy y su
 * comisión, para saber dónde merece la pena buscar una fuente mejor pagada.
 * Uso: npx tsx scripts/worklist-precios.ts
 */
import { botas } from "../src/data/botas";
import { findMejorPrecioMostrado } from "../src/lib/scoring";
import { COMISIONES } from "../src/lib/afiliados";

const rows = botas
  .map((b) => {
    const m = findMejorPrecioMostrado(b.links_compra);
    const tienda = m?.tienda ?? "—";
    return {
      slug: b.slug,
      nombre: `${b.marca} ${b.modelo}`,
      precio: m?.precio_actual ?? b.precio_msrp_eur,
      tienda,
      com: COMISIONES[tienda] ?? 0,
    };
  })
  .sort((a, b) => a.com - b.com || b.precio - a.precio);

console.log("\n  precio  com   tienda           bota");
console.log("  " + "─".repeat(64));
for (const r of rows) {
  console.log(
    `  ${String(r.precio).padStart(6)}  ${String(r.com + "%").padStart(4)}  ${r.tienda.padEnd(16)} ${r.nombre}`
  );
}
const bajas = rows.filter((r) => r.com <= 3);
console.log(`\n  ${bajas.length}/${rows.length} botas monetizan al 3% o menos → candidatas a mejorar\n`);
