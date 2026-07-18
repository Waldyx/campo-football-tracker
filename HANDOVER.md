# 🤖 HANDOVER — CANCHA.BOTAS (Football Shoe Tracker)
**Para la próxima IA o desarrollador que tome este proyecto.**

> Última actualización: 2026-05-20 — sesión de portado de sistemas desde CANCHA.ZAPA.

---

## 🎯 ¿Qué es esto?

**CANCHA.BOTAS** es un motor de recomendación experto de botas de fútbol para el
mercado español. El usuario hace un quiz (posición, superficie, estilo, peso,
presupuesto, anchura de pie) y el motor devuelve las 5 botas que mejor encajan.
Sin publicidad, sin sesgo de marca, 100% técnico.

**Proyecto hermano:** `C:\Users\oswal\Desktop\AI\Proyectos\Basketball Shoe Tracker`
(CANCHA.ZAPA, baloncesto, ya maduro y en producción en canchazapa.com).
Este proyecto replica su arquitectura. **Si algo no está claro aquí, míralo allí.**

---

## 📁 Estructura

```
Football Shoe Tracker/
├── api/
│   ├── chat.ts               # ⭐ Función serverless del asistente IA (Vercel)
│   └── _catalog.json         # Catálogo precompilado (lo genera prebuild)
├── scripts/
│   └── gen-chat-catalog.ts   # Genera _catalog.json (corre en prebuild)
├── src/
│   ├── data/
│   │   ├── botas.ts          # ⭐ BASE DE DATOS (36 botas)
│   │   ├── score-fuentes.json# ⭐ Scores anclados a fuentes externas
│   │   └── promos.ts         # Promos de afiliados (date-gated)
│   ├── lib/
│   │   ├── types.ts          # Tipos del dominio
│   │   ├── scoring.ts        # ⭐ MOTOR DE RECOMENDACIÓN + score mostrado
│   │   ├── scoreFuentes.ts   # Consenso de fuentes → score con confianza
│   │   └── articles.ts       # ⭐ Artículos del blog (contenido editorial)
│   ├── components/
│   │   ├── ChatWidget.astro  # Burbuja del asistente IA
│   │   ├── PromoBanner.astro # Franja rotativa de promos
│   │   ├── CookieBanner.astro
│   │   └── Analytics.astro   # Cloudflare Web Analytics (token PENDIENTE)
│   ├── layouts/Base.astro    # Layout + monta Promo/Chat/Cookie/Analytics
│   └── pages/
│       ├── index, quiz, resultados, botas, rankings, comparar, faq, metodologia
│       ├── calculadora.astro # Coste por partido
│       ├── financiacion.astro / privacidad.astro
│       ├── blog/index.astro + blog/[slug].astro
│       └── bota/[slug].astro # Ficha detalle
└── vercel.json
```

---

## 🚀 Arrancar

```bash
cd "C:\Users\oswal\Desktop\AI\Proyectos\Football Shoe Tracker"
npm install
npm run dev      # http://localhost:4325
npm run build    # corre prebuild (gen-chat-catalog) + astro build
```

Dev server registrado en `C:\.claude\launch.json` como **`cancha-botas`** (puerto 4325).

---

## 🌐 Despliegue

- **Repo:** github.com/Waldyx/campo-football-tracker (rama `main`)
- **Vercel:** auto-deploy en cada push a `main`
- Git identity ya configurada. El remote lleva el token embebido.

---

## 🧠 Sistemas portados desde CANCHA.ZAPA (sesión 2026-05-20)

### 1. Score anclado a fuentes (`scoreFuentes.ts` + `score-fuentes.json`)
El score que se muestra NO es el promedio crudo de los 8 ejes. Sigue esta cascada:
1. `fbd` (FootballBootsDB) → ancla experta. Confianza **alta** si además hay `sb` o n≥4.
2. `sb` (SoccerBible) → confianza **media**.
3. `editorial` → estimación calibrada, confianza **editorial**.
4. Si no hay nada → promedio de los 8 ejes.

Luego se aplica `agePenalty()`: −0.1 cada 2 años a partir de los 3 años, tope −0.3.

Funciones públicas en `scoring.ts`: `scoreDisplay()`, `scoreBadge()`, `scoreMeta()`
(devuelve fuentes + confianza + desglose, se usa en la ficha), `compareByScore()`.

**Para añadir un ancla:** edita `score-fuentes.json` con el id de la bota.

### 2. Estrategia "Ver precio"
`mostramosPrecio(link)` — solo enseñamos precio NUMÉRICO de tiendas con afiliado
activo o en `TIENDAS_PENDIENTES`. Del resto se muestra "Ver precio en [tienda]".
`findMejorPrecioMostrado()` calcula el "desde X€".
**OJO:** esto solo afecta a lo mostrado; el orden del catálogo sigue usando
`findMejorPrecio()` (precio real más barato).

### 3. Promos date-gated (`promos.ts` + `PromoBanner.astro`)
Gating **en cliente** (la web es estática). Añadir una promo = copiar un objeto
en `PROMOS`. Previsualizar antes de su fecha: `?promo=preview`.
Ahora mismo solo hay una plantilla de ejemplo con fechas pasadas (no se muestra).

### 4. Calculadora de coste por partido (`/calculadora`)
Modelo: `vidaBaseFG = durabilidad × 40` partidos. AG/TF desgastan **~2×** más que FG.
Deep-link soportado: `/calculadora?slug=<slug>`.

### 5. Blog / SEO (`articles.ts` + `/blog`)
5 artículos editoriales propios (suelas, posición, calidad-precio, pie ancho,
duración). Cada uno enlaza botas del catálogo (`relatedBotas`) y lleva JSON-LD
Article + BreadcrumbList. Estilos del cuerpo en `.art-body` (en `blog/[slug].astro`).

### 6. Asistente IA (`api/chat.ts` + `ChatWidget.astro`)
RAG por inyección: el system prompt lleva el catálogo entero precompilado.
Cadena de modelos gratuitos de OpenRouter con fallback + rate limit en memoria.
Marcadores `[[bota:slug]]` → el widget los convierte en mini-cards.

**⚠️ Requiere `OPENROUTER_API_KEY` en Vercel** (Settings → Environment Variables).
Sin ella devuelve un mensaje de "no configurado" y el resto de la web sigue igual.

---

## ⚠️ PENDIENTES / cosas a saber

### Alta prioridad
1. **`OPENROUTER_API_KEY` en Vercel** — sin esto el chat no responde en producción.
2. **Token de Cloudflare Web Analytics** — `src/components/Analytics.astro` tiene
   `CF_TOKEN = ""`. Mientras esté vacío NO inyecta nada (no-op seguro).
   NO reutilizar el token de canchazapa.com: mezclaría el tráfico de ambos sitios.
3. **Enlaces de afiliado reales** — casi todos los `links_compra` son búsquedas de
   Amazon (`amazon.es/s?k=...`) con `tiene_afiliado: false`. Hay que sustituirlos por
   URLs de producto reales envueltas en el wrapper de afiliado. Referencia de
   wrappers en el CLAUDE.md del proyecto de baloncesto (Awin `awinaffid=2908587`).

### Media
4. **Imágenes duplicadas** — al añadir las 8 botas nuevas se reutilizaron URLs de
   Amazon de otros modelos. Comparten foto (revisar y sustituir):
   - `asics-ds-light` usa la de New Balance Furon
   - `pantofola-doro-lazzarini` usa la de Mizuno Morelia Neo IV
   - `adidas-x-speedportal-in` usa la de X Crazyfast
   - `nike-mercurial-vapor-15-tf` usa la de Vapor 15 Club
   - `nike-phantom-gx-tf` usa la de Phantom GX 2 Elite
   - `puma-future-7-pro` usa la de Future 7 Ultimate
5. **Precios sin verificar** — los `precio_actual` son orientativos, no scrapeados.
6. **Scores editoriales** — las botas sin `fbd`/`sb` en `score-fuentes.json` llevan
   estimación editorial. Anclarlas si aparece review numérica.

### Baja
7. No hay scraper de precios (el de baloncesto sí tiene, en `web/scripts/scraper`).
8. No hay OG images dinámicas (el de baloncesto tiene `/og/[slug].png.ts`).
9. No hay página de accesorios ni "mis botas" (equivalentes a `/balones` y `/mis-zapas`).

---

## 📝 Reglas de edición (heredadas de CANCHA.ZAPA)

1. **Cambios quirúrgicos.** Edita solo lo que pide la tarea. En `botas.ts` haz match
   por `id:`, NUNCA por las líneas de comentario (tienen box-drawing chars que rompen
   el match).
2. **Simplicidad.** El mínimo código que resuelve lo pedido.
3. **Piensa antes.** Si algo es ambiguo, dilo y pregunta.
4. **Objetivos verificables.** Convierte tareas vagas en criterios comprobables y
   verifica en el navegador antes de dar algo por hecho.

---

## 🎨 Marca

- **Nombre:** CANCHA.BOTAS → `CANCHA<span class="text-lime-500">.</span>BOTAS`
- **Fondo:** `#0a1f0f` (verde muy oscuro) · **Footer:** `#071408`
- **Acento:** lime-500 `#84cc16`
- **Tipografía:** Inter (cuerpo) + Barlow Condensed (titulares, `font-black`, uppercase)
- **Tono:** directo, honesto, "sin humo". Tuteo.

---

## 👤 Contexto del dueño

- **Propietario:** Oswal (oswaldhs7@gmail.com) — habla español.
- **Nivel:** usuario, no desarrollador. Necesita que la IA haga los cambios.
- **Forma de trabajar:** delega con autonomía; pasa URLs y precios y espera que la
  IA actualice, compile y haga push.
