import type {
  Bota,
  RespuestasQuiz,
  Recomendacion,
  Puntuaciones,
  LinkCompra,
} from "./types";

type Atributo = keyof Puntuaciones;

const ATRIBUTOS: Atributo[] = [
  "traccion",
  "amortiguacion",
  "control_balon",
  "soporte_lateral",
  "estabilidad",
  "peso_score",
  "durabilidad",
  "confort",
];

const NOMBRES_ATRIBUTO: Record<Atributo, string> = {
  traccion: "tracción",
  amortiguacion: "amortiguación",
  control_balon: "control de balón",
  soporte_lateral: "soporte lateral",
  estabilidad: "estabilidad",
  peso_score: "ligereza",
  durabilidad: "durabilidad",
  confort: "confort",
};

const RANGO_PESO_KG: Record<RespuestasQuiz["peso"], [number, number]> = {
  "menos-60": [45, 60],
  "60-75": [60, 75],
  "75-90": [75, 90],
  "mas-90": [90, 120],
};

// ─────────────────────────────────────────────────────────
// 1. Pesos del quiz → multiplicadores por atributo
// ─────────────────────────────────────────────────────────

export function calcularPesos(
  respuestas: RespuestasQuiz
): Record<Atributo, number> {
  const pesos: Record<Atributo, number> = {
    traccion: 1.0,
    amortiguacion: 1.0,
    control_balon: 1.0,
    soporte_lateral: 1.0,
    estabilidad: 1.0,
    peso_score: 1.0,
    durabilidad: 1.0,
    confort: 1.0,
  };

  // Q1: Posición
  switch (respuestas.posicion) {
    case "portero":
      pesos.estabilidad += 0.6;
      pesos.soporte_lateral += 0.4;
      pesos.amortiguacion += 0.4;
      break;
    case "defensa":
      pesos.estabilidad += 0.5;
      pesos.soporte_lateral += 0.4;
      break;
    case "lateral":
      pesos.peso_score += 0.4;
      pesos.traccion += 0.3;
      break;
    case "mediocentro":
      pesos.confort += 0.5;
      pesos.control_balon += 0.3;
      break;
    case "mediapunta":
      pesos.control_balon += 0.7;
      pesos.traccion += 0.3;
      break;
    case "extremo":
      pesos.peso_score += 0.6;
      pesos.traccion += 0.4;
      break;
    case "delantero":
      pesos.peso_score += 0.4;
      pesos.control_balon += 0.4;
      pesos.traccion += 0.3;
      break;
  }

  // Q2: Peso del jugador
  switch (respuestas.peso) {
    case "menos-60":
      pesos.peso_score += 0.5;
      break;
    case "60-75":
      break;
    case "75-90":
      pesos.amortiguacion += 0.4;
      pesos.estabilidad += 0.3;
      break;
    case "mas-90":
      pesos.amortiguacion += 0.7;
      pesos.estabilidad += 0.7;
      pesos.soporte_lateral += 0.3;
      break;
  }

  // Q3: Estilo
  switch (respuestas.estilo) {
    case "velocidad":
      pesos.peso_score += 0.7;
      pesos.traccion += 0.4;
      break;
    case "potencia":
      pesos.amortiguacion += 0.5;
      pesos.estabilidad += 0.5;
      break;
    case "tecnico":
      pesos.control_balon += 0.8;
      pesos.traccion += 0.3;
      break;
    case "equilibrado":
      break;
  }

  // Q4: Superficie
  switch (respuestas.superficie) {
    case "fg":
      pesos.traccion += 0.4;
      break;
    case "ag":
      pesos.durabilidad += 0.6;
      pesos.amortiguacion += 0.3;
      break;
    case "sg":
      pesos.traccion += 0.6;
      pesos.soporte_lateral += 0.3;
      break;
    case "in":
      pesos.control_balon += 0.4;
      pesos.traccion += 0.5;
      break;
    case "tf":
      pesos.durabilidad += 0.5;
      pesos.traccion += 0.3;
      break;
  }

  // Q5: Lesiones
  for (const lesion of respuestas.lesiones) {
    switch (lesion) {
      case "rodillas":
        pesos.amortiguacion += 1.0;
        break;
      case "tobillos":
        pesos.soporte_lateral += 0.8;
        pesos.estabilidad += 0.5;
        break;
      case "fascia":
        pesos.amortiguacion += 0.5;
        pesos.confort += 0.4;
        break;
    }
  }

  // Q6: Prioridad única — multiplica x1.5 el atributo correspondiente
  switch (respuestas.prioridad) {
    case "agarre":
      pesos.traccion *= 1.5;
      break;
    case "velocidad":
      pesos.peso_score *= 1.5;
      break;
    case "control":
      pesos.control_balon *= 1.5;
      break;
    case "durabilidad":
      pesos.durabilidad *= 1.5;
      break;
    case "precio":
      break;
  }

  return pesos;
}

// ─────────────────────────────────────────────────────────
// 2. Filtros duros
// ─────────────────────────────────────────────────────────

export function aplicarFiltrosDuros(
  botas: Bota[],
  respuestas: RespuestasQuiz
): Bota[] {
  return botas.filter((b) => {
    // Presupuesto
    if (respuestas.presupuesto_max_eur != null) {
      const precioMin = b.links_compra
        .filter((l) => l.disponible)
        .reduce((min, l) => Math.min(min, l.precio_actual), Infinity);
      const precioReferencia = isFinite(precioMin) ? precioMin : b.precio_msrp_eur;
      if (precioReferencia > respuestas.presupuesto_max_eur) return false;
    }

    // Superficie AG o TF: durabilidad >= 5
    if (
      (respuestas.superficie === "ag" || respuestas.superficie === "tf") &&
      b.puntuaciones.durabilidad < 5
    ) {
      return false;
    }

    // Lesión rodillas: amortiguación >= 6
    if (
      respuestas.lesiones.includes("rodillas") &&
      b.puntuaciones.amortiguacion < 6
    ) {
      return false;
    }

    // Ancho de pie: pie ancho no encaja en horma estrecha
    if (respuestas.ancho_pie === "ancho" && b.horma === "estrecha") {
      return false;
    }

    return true;
  });
}

// ─────────────────────────────────────────────────────────
// 3. Score de una bota dado un set de pesos
// ─────────────────────────────────────────────────────────

export function calcularScore(
  bota: Bota,
  pesos: Record<Atributo, number>
): number {
  let sumaScores = 0;
  let sumaPesos = 0;

  for (const attr of ATRIBUTOS) {
    sumaScores += bota.puntuaciones[attr] * pesos[attr];
    sumaPesos += pesos[attr];
  }

  return sumaScores / sumaPesos;
}

// ─────────────────────────────────────────────────────────
// 3b. Factor de encaje según perfil
// ─────────────────────────────────────────────────────────

export function calcularFitFactor(
  bota: Bota,
  respuestas: RespuestasQuiz
): number {
  let factor = 1.0;

  if (bota.ideal_para.posiciones.includes(respuestas.posicion)) {
    factor += 0.15;
  }
  if (bota.ideal_para.estilos.includes(respuestas.estilo)) {
    factor += 0.1;
  }
  if (bota.ideal_para.superficies.includes(respuestas.superficie)) {
    factor += 0.1;
  }

  if (
    respuestas.ancho_pie === "ancho" &&
    (bota.horma === "ancha" || bota.horma === "normal")
  ) {
    factor += 0.08;
  } else if (respuestas.ancho_pie === "normal" && bota.horma === "normal") {
    factor += 0.04;
  }

  if (bota.no_recomendada_para.posiciones?.includes(respuestas.posicion)) {
    factor -= 0.3;
  }
  if (bota.no_recomendada_para.estilos?.includes(respuestas.estilo)) {
    factor -= 0.2;
  }

  return Math.max(0.3, factor);
}

// ─────────────────────────────────────────────────────────
// 4. Regla de diversidad: máx N botas por marca en el top
// ─────────────────────────────────────────────────────────

export function aplicarDiversidad(
  ranked: Recomendacion[],
  topN: number = 5,
  maxPorMarca: number = 2
): Recomendacion[] {
  const result: Recomendacion[] = [];
  const conteoMarca: Record<string, number> = {};

  for (const rec of ranked) {
    if (result.length >= topN) break;
    const marca = rec.bota.marca;
    if ((conteoMarca[marca] ?? 0) < maxPorMarca) {
      result.push(rec);
      conteoMarca[marca] = (conteoMarca[marca] ?? 0) + 1;
    }
  }

  if (result.length < topN) {
    for (const rec of ranked) {
      if (result.length >= topN) break;
      if (!result.includes(rec)) result.push(rec);
    }
  }

  return result;
}

// ─────────────────────────────────────────────────────────
// 5. Mejor precio disponible
// ─────────────────────────────────────────────────────────

export const COMISIONES_TIENDA: Record<string, number> = {
  puma_es: 6,
  ua_es: 5,
  nb_es: 5,
  nike_es: 5,
  adidas_es: 5,
  jd_sports_es: 5,
  zalando_es: 5,
  sprinter_es: 5,
  footlocker_es: 4,
  mizuno_es: 4,
  amazon_es: 4,
  idealo_es: 4,
  decathlon: 3,
};

const PRECIO_TIE_THRESHOLD = 0.5;

export function findMejorPrecio(links: LinkCompra[]): LinkCompra | undefined {
  const disponibles = links.filter((l) => l.disponible);
  if (disponibles.length === 0) return undefined;

  return disponibles.reduce((best, link) => {
    const diff = link.precio_actual - best.precio_actual;
    if (diff < -PRECIO_TIE_THRESHOLD) return link;
    if (diff > PRECIO_TIE_THRESHOLD) return best;
    const comisionLink = COMISIONES_TIENDA[link.tienda] ?? 0;
    const comisionBest = COMISIONES_TIENDA[best.tienda] ?? 0;
    return comisionLink > comisionBest ? link : best;
  });
}

// ─────────────────────────────────────────────────────────
// 6. Razones humanas (max 3 por card)
// ─────────────────────────────────────────────────────────

export function generarRazones(
  bota: Bota,
  respuestas: RespuestasQuiz
): string[] {
  const razones: string[] = [];
  const p = bota.puntuaciones;

  if (bota.ideal_para.posiciones.includes(respuestas.posicion)) {
    razones.push(`Diseñada para tu posición (${respuestas.posicion}).`);
  }

  const [minP, maxP] = RANGO_PESO_KG[respuestas.peso];
  const [idealMin, idealMax] = bota.ideal_para.peso_jugador_kg;
  if (minP >= idealMin - 5 && maxP <= idealMax + 5) {
    razones.push(`Encaja en tu rango de peso (${idealMin}-${idealMax} kg).`);
  }

  if (bota.ideal_para.superficies.includes(respuestas.superficie)) {
    const labelsSup: Record<string, string> = {
      fg: "hierba natural (FG)",
      ag: "hierba artificial (AG)",
      sg: "terreno blando (SG)",
      in: "fútbol sala (IN)",
      tf: "turf (TF)",
    };
    razones.push(`Optimizada para ${labelsSup[respuestas.superficie] ?? respuestas.superficie}.`);
  }

  if (respuestas.lesiones.includes("rodillas") && p.amortiguacion >= 8) {
    razones.push(`Amortiguación ${p.amortiguacion}/10 — protege tus rodillas.`);
  }
  if (respuestas.lesiones.includes("tobillos") && p.soporte_lateral >= 8) {
    razones.push(`Soporte lateral ${p.soporte_lateral}/10 para tus tobillos.`);
  }

  switch (respuestas.prioridad) {
    case "agarre":
      if (p.traccion >= 8) {
        razones.push(`Tracción ${p.traccion}/10 — agarre máximo como pediste.`);
      }
      break;
    case "velocidad":
      if (p.peso_score >= 8) {
        razones.push(`Ligereza ${p.peso_score}/10 — una de las más rápidas.`);
      }
      break;
    case "control":
      if (p.control_balon >= 8) {
        razones.push(`Control de balón ${p.control_balon}/10 — tacto premium.`);
      }
      break;
    case "durabilidad":
      if (p.durabilidad >= 8) {
        razones.push(`Durabilidad ${p.durabilidad}/10 — construida para durar.`);
      }
      break;
    case "precio": {
      const mejor = findMejorPrecio(bota.links_compra);
      if (mejor) {
        razones.push(`Mejor precio actual: ${mejor.precio_actual}€.`);
      }
      break;
    }
  }

  if (respuestas.ancho_pie === "ancho" && bota.horma === "ancha") {
    razones.push(`Horma ancha — perfecta para pies anchos.`);
  }

  // Fallback
  if (razones.length < 2) {
    const ordenadosPorScore = [...ATRIBUTOS].sort((a, b) => p[b] - p[a]);
    for (const attr of ordenadosPorScore) {
      if (razones.length >= 2) break;
      const nombre = NOMBRES_ATRIBUTO[attr];
      const yaMencionado = razones.some((r) => r.toLowerCase().includes(nombre));
      if (!yaMencionado && p[attr] >= 1) {
        razones.push(`Destaca en ${nombre} (${p[attr]}/10).`);
      }
    }
  }

  return razones.slice(0, 3);
}

// ─────────────────────────────────────────────────────────
// 7. Motor de recomendación completo
// ─────────────────────────────────────────────────────────

export function recomendar(
  respuestas: RespuestasQuiz,
  catalogo: Bota[],
  topN: number = 5
): Recomendacion[] {
  const filtradas = aplicarFiltrosDuros(catalogo, respuestas);
  const pesos = calcularPesos(respuestas);

  const recomendaciones: Recomendacion[] = filtradas.map((b) => {
    const scoreBase = calcularScore(b, pesos);
    const fit = calcularFitFactor(b, respuestas);
    const score = scoreBase * fit;
    return {
      bota: b,
      match_pct: Math.min(100, Math.round((score / 10) * 100)),
      razones: generarRazones(b, respuestas),
      mejor_precio: findMejorPrecio(b.links_compra),
    };
  });

  recomendaciones.sort((a, b) => b.match_pct - a.match_pct);
  return aplicarDiversidad(recomendaciones, topN);
}
