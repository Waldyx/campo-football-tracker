// ─────────────────────────────────────────────────────────
// Tipos del dominio: perfiles de jugador (fútbol)
// ─────────────────────────────────────────────────────────

export type Posicion =
  | "portero"
  | "defensa"
  | "lateral"
  | "mediocentro"
  | "mediapunta"
  | "extremo"
  | "delantero";

export type Estilo = "potencia" | "velocidad" | "tecnico" | "equilibrado";

export type Lesion = "rodillas" | "tobillos" | "fascia";

export type PesoJugador = "menos-60" | "60-75" | "75-90" | "mas-90";

export type Superficie = "fg" | "ag" | "sg" | "in" | "tf";

export type Prioridad =
  | "agarre"
  | "velocidad"
  | "control"
  | "durabilidad"
  | "precio";

export type AnchoPie = "normal" | "ancho" | "no-se";

// ─────────────────────────────────────────────────────────
// Tipos del dominio: botas
// ─────────────────────────────────────────────────────────

export type Genero = "unisex" | "women" | "junior";

export type Horma = "estrecha" | "normal" | "ancha";

export type CategoriaPrincipal =
  | "velocidad"
  | "control"
  | "potencia"
  | "equilibrada";

export type MaterialSuperior =
  | "mesh"
  | "knit"
  | "cuero"
  | "sintetico"
  | "knit+tpu"
  | "mesh+tpu";

export type Tienda =
  // ── Con afiliado ACTIVO (ver lib/afiliados.ts) ──
  | "amazon_es"
  | "decathlon"
  | "adidas_es"
  | "aliexpress"
  | "atmosfera_es"
  | "elcorteingles_es"
  | "forumsport_es"
  | "snipes_es"
  | "fuikaomar_es"
  | "futbolemotion_es"
  // ── Pendientes de aprobación ──
  | "prodirect_es"
  // ── Sin programa (rechazado o inexistente): enlace directo ──
  | "nike_es"
  | "puma_es"
  | "ua_es"
  | "nb_es"
  | "mizuno_es"
  | "footlocker_es"
  | "jd_sports_es"
  | "zalando_es"
  | "sprinter_es"
  | "idealo_es";

export type FuenteReview =
  | "football-boots-guru"
  | "cleatsreview"
  | "soccerpro-review"
  | "evaluacion-propia";

// ─────────────────────────────────────────────────────────
// Subestructuras
// ─────────────────────────────────────────────────────────

export interface Puntuaciones {
  /** Agarre en la superficie (1-10). Mayor = más grip. */
  traccion: number;
  /** Amortiguación / protección de impactos (1-10). */
  amortiguacion: number;
  /** Tacto de balón / control (1-10). Mayor = más precisión. */
  control_balon: number;
  /** Soporte lateral del pie (1-10). */
  soporte_lateral: number;
  /** Estabilidad en tracción y frenadas (1-10). */
  estabilidad: number;
  /** Inverso del peso (1-10). Mayor = más ligera. */
  peso_score: number;
  /** Durabilidad en superficies duras / sintéticas (1-10). */
  durabilidad: number;
  /** Confort general y ajuste (1-10). */
  confort: number;
}

export interface IdealPara {
  posiciones: Posicion[];
  /** Tupla [min, max] en kg. */
  peso_jugador_kg: [number, number];
  estilos: Estilo[];
  superficies: Superficie[];
  lesiones_compatibles?: Lesion[];
}

export interface NoRecomendadaPara {
  posiciones?: Posicion[];
  estilos?: Estilo[];
  lesiones?: Lesion[];
}

export interface Fuente {
  tipo: FuenteReview;
  url?: string;
  score_original?: number | string;
  datos?: string;
  fecha?: string;
}

export interface LinkCompra {
  tienda: Tienda;
  url: string;
  /** Precio actual en EUR. */
  precio_actual: number;
  disponible: boolean;
  tiene_afiliado: boolean;
  /**
   * ¿Hemos verificado este precio a mano?
   * `false` → el enlace funciona y monetiza, pero NO enseñamos un número:
   * la ficha muestra "Ver precio en [tienda]". Se usa para deeplinks de
   * categoría, donde el precio depende del modelo concreto.
   * Si se omite, se asume `true` (comportamiento histórico).
   */
  precio_verificado?: boolean;
  ultima_verificacion: string;
}

// ─────────────────────────────────────────────────────────
// Entidad principal: Bota
// ─────────────────────────────────────────────────────────

export interface Bota {
  // Identidad
  id: string;
  slug: string;
  marca: string;
  modelo: string;
  año_lanzamiento: number;
  genero: Genero;
  tecnologia_clave: string[];

  // Datos físicos
  /** Peso real en gramos, medido en talla EU 42. */
  peso_real_g: number;
  horma: Horma;
  /** Superficies para las que está diseñada. */
  superficies_compatibles: Superficie[];
  material_superior?: MaterialSuperior;

  // Scoring y categorización
  puntuaciones: Puntuaciones;
  categoria_principal: CategoriaPrincipal;
  tags: string[];

  // Recomendación
  ideal_para: IdealPara;
  no_recomendada_para: NoRecomendadaPara;

  // Editorial
  resumen: string;
  pros: string[];
  contras: string[];
  veredicto: string;

  // Multimedia
  imagen_principal: string;
  imagenes: string[];

  // Trazabilidad
  fuentes: Fuente[];
  ultima_actualizacion: string;

  // Precios
  precio_msrp_eur: number;
  links_compra: LinkCompra[];
}

// ─────────────────────────────────────────────────────────
// Respuestas del quiz
// ─────────────────────────────────────────────────────────

export interface RespuestasQuiz {
  posicion: Posicion;
  peso: PesoJugador;
  estilo: Estilo;
  superficie: Superficie;
  lesiones: Lesion[];
  prioridad: Prioridad;
  presupuesto_max_eur: number | null;
  ancho_pie?: AnchoPie;
}

// ─────────────────────────────────────────────────────────
// Resultado del motor de recomendación
// ─────────────────────────────────────────────────────────

export interface Recomendacion {
  bota: Bota;
  /** 0-100, porcentaje de match calculado por el motor. */
  match_pct: number;
  razones: string[];
  mejor_precio?: LinkCompra;
}
