/**
 * gen-chat-catalog.ts — genera api/_catalog.json para la función serverless del chat.
 *
 * Por qué existe: en Vercel, con "type":"module", la función /api/chat.ts se ejecuta
 * en ESM puro SIN bundling. Importar la cadena de TS del catálogo
 * (../src/data/botas → scoring → types → JSON) revienta con ERR_MODULE_NOT_FOUND
 * (los imports sin extensión no resuelven en Node ESM).
 *
 * Solución: precompilamos aquí (con tsx, que sí resuelve la cadena) el string
 * compacto del catálogo que usa el system prompt y lo volcamos a un único JSON.
 * La función solo importa ese JSON (con extensión → seguro en ESM) y queda
 * autocontenida: el chat nunca arriesga el build del catálogo.
 *
 * Se ejecuta en `prebuild` (npm lo corre antes de `astro build`), así los precios
 * van siempre frescos. El JSON también se commitea como fallback.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { botas } from "../src/data/botas";
import { findMejorPrecio, scoreDisplay } from "../src/lib/scoring";

const catalogo = botas
  .map((b) => {
    const s = b.puntuaciones;
    const precio = findMejorPrecio(b.links_compra)?.precio_actual ?? b.precio_msrp_eur;
    return (
      `${b.slug} | ${b.marca} ${b.modelo} | ${b.categoria_principal} | ${Math.round(precio)}€ | ` +
      `score ${scoreDisplay(b)} | ` +
      `tracc ${s.traccion} cushion ${s.amortiguacion} control ${s.control_balon} ` +
      `soporte ${s.soporte_lateral} estab ${s.estabilidad} ligereza ${s.peso_score} ` +
      `durab ${s.durabilidad} confort ${s.confort} | ` +
      `${b.peso_real_g}g | horma ${b.horma} | sup ${b.superficies_compatibles.join("/")}`
    );
  })
  .join("\n");

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../api");
mkdirSync(outDir, { recursive: true });
const out = resolve(outDir, "_catalog.json");
// Sin timestamp: evita que el JSON quede "sucio" en git tras cada build.
writeFileSync(out, JSON.stringify({ catalogo, botas: botas.length }, null, 0));
console.log(`[gen-chat-catalog] ${botas.length} botas → ${out}`);
