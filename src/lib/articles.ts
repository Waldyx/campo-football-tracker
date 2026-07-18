// ─────────────────────────────────────────────────────────────────────
// Blog articles — CANCHA.BOTAS
// Cada artículo es un objeto con contenido en HTML (editorial propio).
// Rutas: /blog (index) y /blog/[slug] (detalle).
//
// Para añadir un artículo: copia un objeto, rellena y listo — aparece solo
// en el index (ordenado por fecha desc) y genera su página.
// ─────────────────────────────────────────────────────────────────────

export interface Article {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  fecha: string; // ISO YYYY-MM-DD
  fechaLabel: string; // "20 mayo 2026"
  categoria: string; // "Guías" | "Comparativas" | "Análisis"
  readMinutes: number;
  eyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  body: string; // HTML (contenido editorial nuestro)
  imagen?: string;
  author: string;
  /** slugs de botas del catálogo que se enlazan desde el artículo */
  relatedBotas: string[];
}

export const ARTICLES: Article[] = [
  // ── 1. Superficies: FG/AG/SG/TF/IN ──────────────────────────────────
  {
    slug: "fg-ag-sg-tf-in-que-botas-necesitas",
    title: "FG, AG, SG, TF, IN: qué significa cada suela y cuál necesitas",
    metaTitle: "FG, AG, SG, TF o IN: qué botas de fútbol necesitas | CANCHA.BOTAS",
    description:
      "La guía definitiva de las suelas de botas de fútbol. Qué significan FG, AG, SG, TF e IN, en qué campo va cada una y qué pasa si te equivocas (spoiler: lesiones y botas rotas).",
    fecha: "2026-05-20",
    fechaLabel: "20 mayo 2026",
    categoria: "Guías",
    readMinutes: 7,
    eyebrow: "★ Guía · Fundamentos",
    heroTitle: "FG, AG, SG, TF, IN",
    heroSubtitle: "Qué significa cada suela y cuál necesitas de verdad",
    author: "Editorial CANCHA.BOTAS",
    relatedBotas: [
      "nike-mercurial-superfly-10-elite",
      "nike-phantom-gx-tf",
      "adidas-x-speedportal-in",
      "puma-future-7-ultimate",
    ],
    body: `
<p class="art-intro">Es el error más caro del fútbol amateur: comprar unas botas preciosas de 200€ y reventarlas en dos meses porque son de suela equivocada. Las siglas de la caja no son marketing — describen el terreno para el que está diseñada la suela. Elegir mal no solo destroza la bota: <strong>multiplica el riesgo de lesión de rodilla y tobillo</strong>.</p>

<h2>Las cinco siglas, explicadas</h2>

<h3>FG — Firm Ground (hierba natural)</h3>
<p>La suela clásica: tacos largos, relativamente pocos (11-13), a menudo mixtos entre cónicos y de lámina. Están pensados para <strong>penetrar en la tierra</strong> de un campo de hierba natural en condiciones normales o secas.</p>
<p>Es la suela más común y la que llevan casi todas las botas de gama alta. Si tu liga juega en hierba natural, esta es tu suela. <strong>Aviso importante:</strong> usar FG en hierba artificial es el error más frecuente — los tacos no penetran, se quedan clavados en la superficie y transmiten toda la torsión a tu rodilla.</p>

<h3>AG — Artificial Ground (hierba artificial)</h3>
<p>Más tacos (normalmente 20+), más cortos y huecos. La distribución reparte la presión sobre una superficie que no cede, lo que hace dos cosas: <strong>reduce el impacto en articulaciones</strong> y evita que el pie se quede enganchado.</p>
<p>Si juegas en césped artificial —que en España es la mayoría del fútbol amateur y base—, esta es la suela correcta. También aguanta mucho más: la fibra sintética desgasta los tacos aproximadamente el doble de rápido que la hierba natural.</p>

<h3>SG — Soft Ground (campo blando, barro, lluvia)</h3>
<p>Pocos tacos y largos, muchas veces <strong>metálicos e intercambiables</strong>. Diseñados para clavarse en terreno embarrado o muy blando, donde una FG patinaría.</p>
<p>Es una suela de nicho: solo tiene sentido si juegas en hierba natural en zonas de mucha lluvia. En campo seco, los tacos metálicos son incómodos y peligrosos. Muchos jugadores tienen unas SG como segundo par para los meses de invierno.</p>

<h3>TF — Turf (moqueta / césped artificial de pelo corto)</h3>
<p>Suela de goma con decenas de tacos diminutos, sin taco largo. Es para <strong>moqueta</strong> o césped artificial viejo y de pelo muy corto, esas pistas donde una AG ya es demasiado agresiva.</p>
<p>Es la suela más duradera de todas y la típica de entrenamiento. Muy recomendable como segundo par si entrenas a diario: alarga muchísimo la vida de tus botas buenas.</p>

<h3>IN — Indoor (fútbol sala, pabellón)</h3>
<p>Suela de goma lisa, sin tacos, con dibujo pensado para agarrar en parqué o pavimento sintético sin dejar marca. Para <strong>fútbol sala</strong> exclusivamente.</p>
<p>Nunca las uses en exterior: la goma lisa se destroza en unas pocas sesiones sobre cemento o césped artificial.</p>

<h2>Tabla rápida: dónde juegas → qué compras</h2>
<table class="art-table">
  <thead><tr><th>Dónde juegas</th><th>Suela correcta</th></tr></thead>
  <tbody>
    <tr><td>Hierba natural, tiempo seco</td><td><strong>FG</strong></td></tr>
    <tr><td>Hierba natural, barro y lluvia</td><td><strong>SG</strong></td></tr>
    <tr><td>Césped artificial (el habitual)</td><td><strong>AG</strong></td></tr>
    <tr><td>Moqueta / artificial de pelo corto</td><td><strong>TF</strong></td></tr>
    <tr><td>Pabellón, fútbol sala</td><td><strong>IN</strong></td></tr>
  </tbody>
</table>

<h2>¿Y las botas "FG/AG" que valen para todo?</h2>
<p>Muchos modelos se venden como compatibles con ambas superficies, y en la práctica funcionan razonablemente bien. Pero hay un matiz honesto: <strong>una suela mixta es un compromiso</strong>. Rinde bien en las dos, pero no es óptima en ninguna, y en artificial se desgasta antes que una AG pura.</p>
<p>Si juegas el 80% de tus partidos en la misma superficie, compra la suela específica. Si de verdad alternas, la mixta te ahorra un par de botas.</p>

<h2>El error que más caro sale</h2>
<p>Repetimos porque es el importante: <strong>FG en césped artificial</strong>. Los tacos largos no penetran en la fibra, así que en lugar de clavarse y liberarse, se quedan agarrados. Cuando giras, tu pie se queda fijo y la rotación se la come tu rodilla. Es un mecanismo conocido de lesión de ligamento cruzado.</p>
<p>Si solo te llevas una cosa de este artículo: <strong>mira la superficie de tu campo antes de mirar el color de la bota</strong>.</p>

<h2>¿Qué bota concreta te toca?</h2>
<p>Ya sabes qué suela necesitas. Para saber qué modelo encaja con tu posición, tu estilo y tu presupuesto, haz <a href="/quiz">el quiz de CANCHA.BOTAS</a>: seis preguntas y te devuelve las cinco botas que mejor encajan contigo, con el porqué de cada una.</p>
`,
  },

  // ── 2. Botas por posición ────────────────────────────────────────────
  {
    slug: "mejores-botas-futbol-segun-posicion",
    title: "Qué botas de fútbol elegir según tu posición",
    metaTitle: "Mejores botas de fútbol según tu posición (2026) | CANCHA.BOTAS",
    description:
      "Extremo, mediocentro, defensa o portero: cada posición pide cosas distintas de una bota. Guía por posición con qué priorizar y qué modelos encajan en cada perfil.",
    fecha: "2026-05-19",
    fechaLabel: "19 mayo 2026",
    categoria: "Guías",
    readMinutes: 8,
    eyebrow: "★ Guía · Por posición",
    heroTitle: "Botas según tu posición",
    heroSubtitle: "Qué prioriza cada puesto y qué modelos lo cumplen",
    author: "Editorial CANCHA.BOTAS",
    relatedBotas: [
      "nike-mercurial-superfly-10-elite",
      "adidas-predator-24-elite",
      "nike-tiempo-legend-10-elite",
      "puma-future-7-ultimate",
      "adidas-copa-pure-2-elite",
    ],
    body: `
<p class="art-intro">No existe "la mejor bota de fútbol". Existe la mejor bota <strong>para lo que tú haces en el campo</strong>. Un extremo que vive del sprint y un mediocentro que toca 90 balones por partido necesitan cosas opuestas. Esta es la guía por posición, sin marketing.</p>

<h2>Extremo y delantero de banda: velocidad</h2>
<p>Tu bota tiene que pesar poco y darte agarre en el arranque. Aquí manda la categoría <strong>speed</strong>: uppers finísimos, placas de carbono y peso por debajo de 200 g.</p>
<p><strong>Qué priorizar:</strong> ligereza (peso_score), tracción y propulsión. <strong>Qué sacrificar:</strong> amortiguación y anchura — estas botas suelen tener horma estrecha y protección mínima.</p>
<p>Modelos de referencia: <a href="/bota/nike-mercurial-superfly-10-elite">Nike Mercurial Superfly 10 Elite</a> y <a href="/bota/adidas-f50-2024">Adidas F50</a>. Si tu pie es ancho, cuidado: las dos son estrechas.</p>

<h2>Mediapunta y organizador: control</h2>
<p>Tú vives del toque. Necesitas <strong>tacto de balón</strong>: uppers texturizados o de cuero que te den precisión en el pase largo y el disparo colocado.</p>
<p><strong>Qué priorizar:</strong> control de balón y confort. <strong>Qué sacrificar:</strong> peso — una bota de control pesa 10-30 g más y da igual, tú no vives del sprint puro.</p>
<p>Modelos de referencia: <a href="/bota/adidas-predator-24-elite">Adidas Predator 24 Elite</a> (la referencia absoluta en control) y <a href="/bota/nike-phantom-gx2-elite">Nike Phantom GX 2 Elite</a>.</p>

<h2>Mediocentro: equilibrio y confort</h2>
<p>Eres el que más kilómetros hace. Ni la bota más ligera ni la más protegida: la que aguante 90 minutos sin castigarte el pie.</p>
<p><strong>Qué priorizar:</strong> confort, amortiguación y una horma que no te apriete. <strong>Qué sacrificar:</strong> nada extremo — busca la bota equilibrada.</p>
<p>Modelos de referencia: <a href="/bota/puma-future-7-ultimate">Puma Future 7 Ultimate</a> (su upper se adapta al pie como pocos) y <a href="/bota/adidas-copa-pure-2-elite">Adidas Copa Pure 2 Elite</a> si prefieres cuero.</p>

<h2>Defensa central: estabilidad y protección</h2>
<p>Duelos, saltos, entradas. Tu bota tiene que sujetar el pie y aguantar impactos, no hacerte más rápido.</p>
<p><strong>Qué priorizar:</strong> estabilidad, soporte lateral y durabilidad. <strong>Qué sacrificar:</strong> ligereza extrema — los uppers ultrafinos de las botas de velocidad no protegen nada en un choque.</p>
<p>Modelos de referencia: <a href="/bota/nike-tiempo-legend-10-elite">Nike Tiempo Legend 10 Elite</a> y <a href="/bota/adidas-copa-pure-2-elite">Adidas Copa Pure 2 Elite</a>. Cuero, protección y agarre.</p>

<h2>Lateral: el híbrido</h2>
<p>Subes y bajas la banda todo el partido: necesitas algo de la velocidad del extremo y algo de la solidez del defensa.</p>
<p><strong>Qué priorizar:</strong> ligereza moderada + durabilidad. Eres quien más metros recorre en carrera, y muchas veces por la zona más castigada del campo.</p>
<p>Modelos de referencia: <a href="/bota/puma-future-7-pro">Puma Future 7 Pro</a> o <a href="/bota/nike-mercurial-vapor-15-pro-fg">Nike Mercurial Vapor 15 Pro</a>.</p>

<h2>Portero: agarre y estabilidad</h2>
<p>La posición más ignorada por las marcas. Tú no corres 10 km: haces apoyos explosivos, cambios de dirección cortos y saltos con caída.</p>
<p><strong>Qué priorizar:</strong> estabilidad, agarre y amortiguación en la caída. <strong>Qué sacrificar:</strong> peso y tacto de balón fino — no te aportan casi nada.</p>
<p>Busca una bota de la categoría equilibrada con buena puntuación en estabilidad, y evita las speed de upper ultrafino: no te sujetan en los apoyos laterales.</p>

<h2>La regla que vale para todos</h2>
<p>Antes que la posición está <strong>la superficie</strong> (si no sabes qué suela te toca, lee <a href="/blog/fg-ag-sg-tf-in-que-botas-necesitas">nuestra guía de suelas</a>) y <strong>la horma</strong>. Una bota perfecta para tu puesto que te aprieta el pie es una bota mala. Si tienes el pie ancho, descarta de entrada las speed estrechas por muy bien que se vean.</p>
<p>¿Quieres el atajo? <a href="/quiz">Haz el quiz</a>: cruza tu posición con tu superficie, tu peso, tu anchura de pie y tu presupuesto, y te da las cinco que encajan.</p>
`,
  },

  // ── 3. Calidad-precio ────────────────────────────────────────────────
  {
    slug: "mejores-botas-futbol-calidad-precio",
    title: "Las mejores botas de fútbol calidad-precio (y por qué la gama alta casi nunca compensa)",
    metaTitle: "Mejores botas de fútbol calidad-precio 2026 | CANCHA.BOTAS",
    description:
      "Qué cambia de verdad entre una bota de 80€ y una de 250€, cuándo merece la pena pagar más y qué modelos dan el mejor rendimiento por euro.",
    fecha: "2026-05-18",
    fechaLabel: "18 mayo 2026",
    categoria: "Análisis",
    readMinutes: 6,
    eyebrow: "★ Análisis · Dinero",
    heroTitle: "Calidad-precio real",
    heroSubtitle: "Qué pagas de más en la gama alta y cuándo compensa",
    author: "Editorial CANCHA.BOTAS",
    relatedBotas: [
      "nike-mercurial-vapor-15-pro-fg",
      "adidas-copa-pure-2-3-fg",
      "puma-future-7-pro",
      "joma-propulsion-cup-fg",
      "asics-ds-light",
    ],
    body: `
<p class="art-intro">La gama alta de una marca cuesta entre 250 y 300€. La gama media de la <em>misma</em> silueta cuesta 120-160€. Y en la mayoría de los casos comparten upper, horma y suela. Lo que cambia es la placa. Vamos a mirar los números con honestidad.</p>

<h2>Qué cambia de verdad al subir de gama</h2>
<h3>Elite (220-300€)</h3>
<p>Placa de <strong>fibra de carbono</strong>, upper de la mejor calidad disponible en el catálogo de la marca, y el peso más bajo posible. La placa de carbono devuelve más energía en el arranque — es real, pero es una diferencia de milisegundos que un jugador amateur difícilmente convierte en ventaja.</p>

<h3>Pro / gama media (120-180€)</h3>
<p>Mismo upper o muy parecido, misma horma, misma suela. La placa pasa a ser de <strong>nylon o compuesto</strong>, y la bota suele pesar 15-30 g más. Es, con diferencia, el punto dulce del mercado.</p>

<h3>Club / entrada (50-90€)</h3>
<p>Aquí sí cambia todo: upper sintético básico, sin tecnología de tacto, suela más rígida y menos duradera. Sirven para empezar o para un segundo par, pero se nota.</p>

<h2>La cuenta que nadie hace: coste por partido</h2>
<p>El precio de la etiqueta engaña. Lo que importa es cuánto te cuesta <strong>cada vez que juegas</strong>. Una bota de 250€ que aguanta tres temporadas sale más barata que una de 80€ que revientas en cuatro meses.</p>
<p>Y aquí hay un factor que domina todo lo demás: <strong>la superficie</strong>. El césped artificial desgasta la suela aproximadamente el doble de rápido que la hierba natural. Si juegas en artificial y compras una bota elite de upper finísimo, la estás condenando.</p>
<p>Puedes calcular tu caso concreto en <a href="/calculadora">la calculadora de coste por partido</a>: metes tu bota, tus partidos por semana y tu porcentaje de artificial, y te dice lo que te cuesta de verdad.</p>

<h2>Cuándo SÍ compensa la gama alta</h2>
<ul>
  <li>Juegas en <strong>hierba natural</strong> (la bota dura mucho más).</li>
  <li>Compites a un nivel donde los milisegundos importan.</li>
  <li>Tu pie encaja perfectamente en esa horma y llevas años con esa silueta.</li>
</ul>

<h2>Cuándo NO compensa (la mayoría de casos)</h2>
<ul>
  <li>Juegas en <strong>césped artificial</strong> con frecuencia.</li>
  <li>Juegas fútbol amateur o de veteranos.</li>
  <li>Entrenas más de lo que compites (busca un par TF para entrenar).</li>
  <li>Tienes el pie ancho: las elite suelen ser las más estrechas del catálogo.</li>
</ul>

<h2>Las que mejor rinden por euro</h2>
<p>Estas son las que, en nuestro catálogo, dan más rendimiento por lo que cuestan:</p>
<ul>
  <li><a href="/bota/puma-future-7-pro">Puma Future 7 Pro</a> — placa de carbono a precio de gama media. La compra más inteligente de la gama Future.</li>
  <li><a href="/bota/nike-mercurial-vapor-15-pro-fg">Nike Mercurial Vapor 15 Pro</a> — la Mercurial sin el sobrecoste de la elite.</li>
  <li><a href="/bota/adidas-copa-pure-2-3-fg">Adidas Copa Pure 2.3</a> — tacto de cuero por menos de 100€.</li>
  <li><a href="/bota/asics-ds-light">Asics DS Light</a> — el secreto de los técnicos: 175 g, durabilidad excepcional, sin pagar marca de moda.</li>
  <li><a href="/bota/joma-propulsion-cup-fg">Joma Propulsion Cup</a> — marca española, muy sólida por el precio.</li>
</ul>

<h2>El consejo que más dinero ahorra</h2>
<p>Si entrenas tres o más días por semana, <strong>compra dos pares</strong>: unas buenas para competir y unas TF baratas para entrenar. Te va a costar menos a lo largo del año que reventar un par bueno cada temporada, y jugarás mejor los partidos.</p>
`,
  },

  // ── 4. Pie ancho ─────────────────────────────────────────────────────
  {
    slug: "botas-futbol-pie-ancho",
    title: "Botas de fútbol para pie ancho: qué evitar y qué funciona",
    metaTitle: "Mejores botas de fútbol para pie ancho (2026) | CANCHA.BOTAS",
    description:
      "Si tienes el pie ancho, la mitad del catálogo no es para ti. Qué hormas evitar, qué marcas calzan ancho y qué modelos concretos funcionan sin destrozarte el pie.",
    fecha: "2026-05-17",
    fechaLabel: "17 mayo 2026",
    categoria: "Guías",
    readMinutes: 5,
    eyebrow: "★ Guía · Horma",
    heroTitle: "Pie ancho",
    heroSubtitle: "Qué evitar y qué modelos sí te van a valer",
    author: "Editorial CANCHA.BOTAS",
    relatedBotas: [
      "nike-tiempo-legend-10-elite",
      "adidas-copa-pure-2-elite",
      "mizuno-morelia-neo-iv-beta",
      "puma-king-platinum-21",
      "pantofola-doro-lazzarini",
    ],
    body: `
<p class="art-intro">Comprar botas con el pie ancho es un ejercicio de descarte. Las botas más vendidas y más bonitas —las de velocidad— son sistemáticamente las más estrechas del mercado. Si te aprietan, no es que no te hayas acostumbrado: es que <strong>no son para tu pie</strong>, y forzarlo te va a dar juanetes, uñas negras y fascitis.</p>

<h2>Cómo saber si tienes el pie ancho</h2>
<p>La prueba casera: pisa descalzo sobre un folio y dibuja el contorno. Mide el ancho en la zona del metatarso (la parte más ancha, justo detrás de los dedos) y la longitud del talón al dedo más largo. Si el ancho supera aproximadamente el <strong>40% de la longitud</strong>, tienes pie ancho.</p>
<p>La otra señal, más simple: si al probarte una bota de tu talla los laterales del pie tocan la pared de la bota antes de que los dedos lleguen a la punta, tu problema es de anchura, no de talla. <strong>Subir de talla no lo arregla</strong> — solo consigues que el pie baile hacia delante y se te salga el talón.</p>

<h2>Lo que debes evitar</h2>
<p>Casi toda la categoría <strong>velocidad</strong>. Estas botas están construidas sobre hormas deliberadamente estrechas para eliminar cualquier movimiento del pie:</p>
<ul>
  <li>Nike Mercurial (Superfly y Vapor) — de las más estrechas del mercado.</li>
  <li>Adidas X / F50 — horma estrecha por diseño.</li>
  <li>Cualquier bota con upper sintético ultrafino: no cede con el uso.</li>
</ul>

<h2>Lo que sí funciona</h2>
<h3>1. Cuero, siempre que puedas</h3>
<p>El cuero —sobre todo la piel de canguro— <strong>se amolda al pie con el uso</strong>. Es la mejor característica que puede tener una bota para un pie ancho: las primeras sesiones son ajustadas y luego la bota se convierte en tu pie.</p>
<ul>
  <li><a href="/bota/nike-tiempo-legend-10-elite">Nike Tiempo Legend 10 Elite</a> — la opción de cuero de Nike, horma normal y buen volumen.</li>
  <li><a href="/bota/mizuno-morelia-neo-iv-beta">Mizuno Morelia Neo IV</a> — Mizuno calza tradicionalmente más ancho que las marcas occidentales.</li>
  <li><a href="/bota/pantofola-doro-lazzarini">Pantofola d'Oro Lazzarini</a> — piel de canguro artesanal, se amolda como pocas.</li>
</ul>

<h3>2. Las líneas "de control", no las de velocidad</h3>
<p>Las botas de la categoría control y técnica se construyen sobre hormas más generosas:</p>
<ul>
  <li><a href="/bota/adidas-copa-pure-2-elite">Adidas Copa Pure 2 Elite</a> — la Copa es históricamente la horma más cómoda de Adidas.</li>
  <li><a href="/bota/puma-king-platinum-21">Puma King Platinum 21</a> — clásico de cuero con buen volumen.</li>
</ul>

<h3>3. Marcas japonesas y clásicas</h3>
<p>Mizuno y Asics diseñan para pies asiáticos, que estadísticamente son más anchos y de empeine más alto. La <a href="/bota/asics-ds-light">Asics DS Light</a> es una opción excelente y poco conocida en España.</p>

<h2>Trucos que sí ayudan (y uno que no)</h2>
<p><strong>Sí:</strong> comprar por la tarde (el pie se hincha durante el día), probar con los calcetines de jugar, y usar plantillas finas si la bota trae una gruesa que roba volumen.</p>
<p><strong>No:</strong> subir media talla. Es el error clásico. Ganas dos milímetros de ancho y pierdes toda la sujeción del talón, que es peor. Si necesitas más ancho, cambia de modelo, no de talla.</p>

<h2>Filtra por horma directamente</h2>
<p>En <a href="/quiz">el quiz</a> hay una pregunta de anchura de pie: si marcas "ancho", el motor <strong>descarta automáticamente</strong> todas las botas de horma estrecha antes de recomendarte nada. Es la forma más rápida de no perder el tiempo con modelos que no te van a valer.</p>
`,
  },

  // ── 5. Cuánto duran ──────────────────────────────────────────────────
  {
    slug: "cuanto-duran-las-botas-de-futbol",
    title: "¿Cuánto duran unas botas de fútbol? (y cómo hacer que duren el doble)",
    metaTitle: "¿Cuánto duran unas botas de fútbol? Vida útil real | CANCHA.BOTAS",
    description:
      "Vida útil real de unas botas según superficie y uso, señales de que toca cambiarlas, y los cuidados que de verdad alargan su vida. Con datos, no con mitos.",
    fecha: "2026-05-16",
    fechaLabel: "16 mayo 2026",
    categoria: "Guías",
    readMinutes: 6,
    eyebrow: "★ Guía · Mantenimiento",
    heroTitle: "Cuánto duran de verdad",
    heroSubtitle: "Vida útil real y cómo alargarla sin gastar más",
    author: "Editorial CANCHA.BOTAS",
    relatedBotas: [
      "nike-phantom-gx-tf",
      "nike-mercurial-vapor-15-tf",
      "adidas-copa-pure-2-elite",
      "asics-ds-light",
    ],
    body: `
<p class="art-intro">La respuesta corta: entre <strong>6 meses y 3 años</strong>. El rango es tan enorme porque la superficie donde juegas pesa más que la marca, el precio y el modelo juntos.</p>

<h2>Vida útil según superficie</h2>
<table class="art-table">
  <thead><tr><th>Superficie</th><th>Vida orientativa</th></tr></thead>
  <tbody>
    <tr><td>Hierba natural (FG)</td><td>~2-3 temporadas</td></tr>
    <tr><td>Césped artificial (AG)</td><td>~1 temporada</td></tr>
    <tr><td>Moqueta / turf (TF)</td><td>~2 temporadas</td></tr>
    <tr><td>FG usada en artificial</td><td><strong>~4-6 meses</strong></td></tr>
  </tbody>
</table>
<p>Fíjate en la última fila. Usar una suela FG en césped artificial no solo es peligroso para tu rodilla: <strong>reduce la vida de la bota a la cuarta parte</strong>. Es el error más caro que puedes cometer.</p>

<h2>Las cinco señales de que toca cambiarlas</h2>
<ol>
  <li><strong>Tacos redondeados.</strong> Si el borde del taco ya no tiene arista, has perdido agarre. Es la señal más objetiva.</li>
  <li><strong>Patinas en apoyos donde antes no.</strong> Tu cuerpo lo nota antes que tus ojos.</li>
  <li><strong>La suela se despega del upper.</strong> Punto de no retorno; se puede pegar, pero nunca vuelve a ser lo mismo.</li>
  <li><strong>El upper está dado de sí.</strong> Si el pie se mueve dentro de la bota, has perdido la sujeción y con ella la precisión.</li>
  <li><strong>Dolor nuevo en pie o rodilla.</strong> Cuando la amortiguación y la placa se degradan, tus articulaciones absorben lo que la bota ya no absorbe.</li>
</ol>

<h2>Los cuidados que de verdad funcionan</h2>
<h3>Sí funcionan</h3>
<ul>
  <li><strong>Quitarles el barro después de cada uso</strong>, en seco o con agua fría y un cepillo suave. El barro seco tira del material al cuartearse.</li>
  <li><strong>Secarlas a la sombra</strong>, rellenas de papel de periódico. Absorbe la humedad de dentro, que es la que pudre el forro.</li>
  <li><strong>Rotar dos pares.</strong> Una bota necesita 24 h para secarse por completo. Alternar dos pares más que duplica la vida de ambos.</li>
  <li><strong>Grasa o crema para las de cuero</strong>, una vez al mes. El cuero sin hidratar se agrieta.</li>
  <li><strong>Llevarlas fuera de la mochila</strong> con los tacos limpios, no aplastadas bajo el resto del equipo.</li>
</ul>

<h3>No funcionan (o son contraproducentes)</h3>
<ul>
  <li><strong>Radiador, secador o sol directo.</strong> El calor seca el pegamento y encoge el cuero. Es la forma más rápida de matar unas botas.</li>
  <li><strong>Lavadora.</strong> Destroza el adhesivo entre suela y upper.</li>
  <li><strong>Guardarlas mojadas en la bolsa.</strong> Hongos, mal olor y forro podrido en una semana.</li>
</ul>

<h2>La estrategia que más alarga la vida: dos pares</h2>
<p>Si entrenas tres o más días por semana, el mejor dinero que puedes gastar no es en unas botas más caras: es en <strong>unas TF baratas para entrenar</strong>. Reservas las buenas para competir, y las dos duran mucho más porque nunca se usan mojadas.</p>
<p>Opciones sólidas de segundo par: <a href="/bota/nike-phantom-gx-tf">Nike Phantom GX TF</a> o <a href="/bota/nike-mercurial-vapor-15-tf">Nike Mercurial Vapor 15 TF</a>.</p>

<h2>Calcula tu caso concreto</h2>
<p>Todo esto son medias. Para tu situación real —tu modelo, tus partidos por semana y tu porcentaje de artificial— usa <a href="/calculadora">la calculadora de coste por partido</a>: te dice cuántos partidos de vida le quedan a tu bota y cuánto te está costando cada uno.</p>
`,
  },
];

/** Artículos ordenados por fecha descendente (más nuevo primero). */
export const ARTICLES_SORTED: Article[] = [...ARTICLES].sort((a, b) =>
  b.fecha.localeCompare(a.fecha)
);

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}
