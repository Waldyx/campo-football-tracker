/**
 * audit-afiliados.ts — informe del estado de monetización del catálogo.
 * Uso: npx tsx scripts/audit-afiliados.ts
 */
import { botas } from "../src/data/botas";
import { findMejorPrecioMostrado, findMejorPrecio } from "../src/lib/scoring";
import { COMISIONES, AFILIADO_ACTIVO } from "../src/lib/afiliados";

let conAfiliado = 0;
const sinMostrable: string[] = [];
const sinAfiliado: string[] = [];
const porTienda: Record<string, { n: number; afi: number }> = {};

for (const b of botas) {
  const tieneAfi = b.links_compra.some((l) => l.tiene_afiliado);
  if (tieneAfi) conAfiliado++;
  else sinAfiliado.push(b.slug);

  if (!findMejorPrecioMostrado(b.links_compra)) {
    sinMostrable.push(`${b.slug} [${b.links_compra.map((l) => l.tienda).join(", ")}]`);
  }

  for (const l of b.links_compra) {
    porTienda[l.tienda] ??= { n: 0, afi: 0 };
    porTienda[l.tienda].n++;
    if (l.tiene_afiliado) porTienda[l.tienda].afi++;
  }
}

const total = Object.values(porTienda).reduce((a, v) => a + v.n, 0);
const totalAfi = Object.values(porTienda).reduce((a, v) => a + v.afi, 0);

console.log(`\n  CATÁLOGO: ${botas.length} botas · ${total} enlaces`);
console.log(`  Enlaces con afiliado: ${totalAfi}/${total} (${Math.round((totalAfi / total) * 100)}%)`);
console.log(`  Botas que monetizan:  ${conAfiliado}/${botas.length}\n`);

console.log("  tienda               enlaces  afiliados  comisión");
console.log("  " + "─".repeat(52));
for (const [t, v] of Object.entries(porTienda).sort((a, b) => b[1].afi - a[1].afi || b[1].n - a[1].n)) {
  const c = COMISIONES[t] ?? 0;
  const mark = AFILIADO_ACTIVO.has(t) ? "" : "  (sin programa)";
  console.log(`  ${t.padEnd(20)}${String(v.n).padStart(6)}${String(v.afi).padStart(10)}${(c ? c + "%" : "—").padStart(10)}${mark}`);
}

if (sinAfiliado.length) {
  console.log(`\n  ⚠ Botas SIN ningún afiliado (${sinAfiliado.length}):`);
  sinAfiliado.forEach((s) => console.log("   -", s));
}
if (sinMostrable.length) {
  console.log(`\n  ⚠ Botas sin precio mostrable (${sinMostrable.length}):`);
  sinMostrable.forEach((s) => console.log("   -", s));
}
console.log();
