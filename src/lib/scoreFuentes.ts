// Puntuación de consenso: ancla el score mostrado a fuentes de referencia.
// FootballBootsDB (fbd) es el agregador de referencia en botas de fútbol; SoccerBible
// corrobora. Si no hay fuente externa → estimación editorial calibrada, y como último
// recurso el promedio de nuestros 8 ejes. Mismo patrón que el proyecto de baloncesto.
import fuentesJson from "../data/score-fuentes.json";

export type Confianza = "alta" | "media" | "editorial";

export interface FuenteScore {
  nombre: string;
  score: number; // normalizado /10
  escala: string; // texto original p.ej. "8.5/10" o "91/100"
  n?: number; // nº de reviews que agrega
  url?: string;
}

export interface ScoreInfo {
  score: number; // 0-10, el que se muestra
  confianza: Confianza;
  fuentes: FuenteScore[]; // para la UI de transparencia
  rango?: [number, number];
}

const DATA: Record<string, any> = (fuentesJson as any).botas ?? {};

/**
 * Devuelve el score a mostrar + confianza + fuentes.
 * @param id  id de la bota
 * @param axisAvg  promedio de nuestros 8 ejes (fallback editorial)
 */
export function scoreInfo(id: string, axisAvg: number): ScoreInfo {
  const d = DATA[id];
  const fuentes: FuenteScore[] = [];

  if (d?.fbd != null) {
    fuentes.push({ nombre: "FootballBootsDB", score: d.fbd, escala: `${d.fbd}/10`, n: d.n, url: d.url });
  }
  if (d?.sb != null) {
    fuentes.push({ nombre: "SoccerBible", score: d.sb, escala: `${d.sb}/10` });
  }

  // Score mostrado: FBD manda (ancla experta). Si solo hay SoccerBible, se usa esa.
  // Si no hay ninguna → estimación editorial calibrada, o promedio de ejes.
  let score: number;
  let confianza: Confianza;
  if (d?.fbd != null) {
    score = d.fbd;
    confianza = d.sb != null || (d.n ?? 0) >= 4 ? "alta" : "media";
  } else if (d?.sb != null) {
    score = d.sb;
    confianza = "media";
  } else if (d?.editorial != null) {
    score = d.editorial;
    confianza = "editorial";
  } else {
    score = axisAvg;
    confianza = "editorial";
  }

  return { score: Math.round(score * 10) / 10, confianza, fuentes, rango: d?.rango };
}

export const axisAverage = (puntuaciones: Record<string, number>): number => {
  const v = Object.values(puntuaciones);
  return Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10;
};
