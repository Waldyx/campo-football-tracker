// ─────────────────────────────────────────────────────────────────────
// Promos de tiendas afiliadas — CANCHA.BOTAS
//
// Fuente única de promociones. La activación por fecha se hace EN CLIENTE
// (la web es estática: un check en build no se "encendería" solo el día de
// inicio sin re-desplegar). El componente serializa PROMOS a JSON y un script
// decide qué mostrar según la fecha del navegador.
//
// Para añadir una promo nueva (llega por email de Awin/Fútbol Emotion/etc.):
//   1. Copia un objeto de abajo y rellena tienda, fechas, código(s) y nota.
//   2. Nada más: aparece sola al llegar `desde` y desaparece tras `hasta`.
//   3. Previsualiza antes de su fecha con  ?promo=preview  en cualquier página.
// ─────────────────────────────────────────────────────────────────────

export interface PromoCodigo {
  code: string;
  descuento: number; // € de descuento
  minCompra: number; // compra mínima en €
}

export interface Promo {
  id: string;
  tienda: string; // debe coincidir con LinkCompra.tienda (p.ej. "decathlon")
  tiendaLabel: string;
  titulo: string;
  desde: string; // ISO con zona, p.ej. "2026-06-15T00:00:00+02:00"
  hasta: string; // ISO con zona (fin inclusive)
  url?: string; // enlace de afiliado a la tienda (home/campaña)
  /** Códigos escalonados por importe (estilo AliExpress). */
  codigos?: PromoCodigo[];
  /** Código único simple (estilo "25MIN"). */
  codigo?: string;
  /** Texto corto del descuento, p.ej. "20% en botas". */
  descuentoTexto?: string;
  /** Restricciones / letra pequeña, mostrada honestamente. */
  nota?: string;
  color?: string; // color de acento del banner
}

export const PROMOS: Promo[] = [
  // ── EJEMPLO / PLANTILLA (inactiva: fechas en el pasado) ──
  // Duplica este objeto con fechas reales cuando llegue una promo de afiliado.
  // Se puede previsualizar con ?promo=preview sin esperar a la fecha.
  {
    id: "ejemplo-futbol-emotion",
    tienda: "futbolemotion_es",
    tiendaLabel: "Fútbol Emotion",
    titulo: "Rebajas de temporada",
    desde: "2026-01-01T00:00:00+01:00",
    hasta: "2026-01-10T23:59:59+01:00",
    descuentoTexto: "hasta 30% en botas seleccionadas",
    nota: "Ejemplo de plantilla · sustituir por promo real con su código y fechas",
    color: "#84cc16",
  },
];
