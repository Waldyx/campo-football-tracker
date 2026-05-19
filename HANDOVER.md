# 🤖 HANDOVER — Football Shoe Tracker (CAMPO.)
**Para la próxima IA o desarrollador que tome este proyecto.**

---

## 🎯 ¿Qué es esto?

**CAMPO.** es un motor de recomendación experto de botas de fútbol. El usuario hace un quiz de ~6 preguntas sobre cómo juega (posición, superficie, estilo, presupuesto, peso, anchura de pie) y el motor devuelve las 5 botas que mejor encajan con su perfil. Sin publicidad, sin sesgo, 100% técnico.

**Referencia visual y de código:** está basado 1:1 en el Basketball Shoe Tracker que está en:
`C:\Users\oswal\Desktop\AI\Proyectos\Basketball Shoe Tracker\web`
Ese proyecto ya está desplegado y funciona. Si algo no está claro aquí, mírate ese proyecto — la arquitectura es idéntica.

---

## 📁 Estructura del proyecto

```
Football Shoe Tracker/
├── astro.config.mjs          # Config Astro + Tailwind v4 + sitemap
├── package.json              # Dependencias (astro, tailwindcss, sitemap)
├── tsconfig.json             # TypeScript config
├── src/
│   ├── data/
│   │   └── botas.ts          # ⭐ BASE DE DATOS de 8 botas (aquí añades más)
│   ├── lib/
│   │   ├── types.ts          # Todos los tipos TypeScript del dominio
│   │   └── scoring.ts        # ⭐ MOTOR DE RECOMENDACIÓN (algoritmo de match)
│   ├── layouts/
│   │   └── Base.astro        # Layout HTML base con nav y footer
│   ├── styles/
│   │   └── global.css        # CSS global + variables de color
│   └── pages/
│       ├── index.astro       # Homepage hero + CTA quiz
│       ├── quiz.astro        # ⭐ Quiz interactivo (JS vanilla)
│       ├── resultados.astro  # Página de resultados del quiz
│       ├── botas.astro       # Catálogo completo con filtros
│       ├── rankings.astro    # Rankings por categoría
│       ├── comparar.astro    # Comparador de 2 botas
│       ├── faq.astro         # Preguntas frecuentes
│       ├── metodologia.astro # Cómo funciona el scoring
│       ├── 404.astro         # Página de error
│       └── bota/
│           └── [slug].astro  # Ficha detalle de cada bota
└── public/
    └── favicon.svg           # Logo CAMPO.
```

---

## 🚀 Cómo arrancar en local

```bash
cd "C:\Users\oswal\Desktop\AI\Proyectos\Football Shoe Tracker"
npm install       # solo la primera vez
npm run dev       # arranca en http://localhost:4321
npm run build     # genera dist/ listo para deploy
```

**Nota:** Si el puerto 4321 está ocupado (por el basket tracker), usará el 4322 automáticamente.

---

## 🧠 Cómo funciona el motor de scoring

Archivo: `src/lib/scoring.ts`

El algoritmo toma las respuestas del quiz (`RespuestasQuiz`) y las compara contra cada bota del catálogo. Para cada bota calcula un `match_pct` (0-100) aplicando pesos sobre los atributos:

| Criterio             | Peso |
|----------------------|------|
| Superficie           | 30%  |
| Posición del jugador | 20%  |
| Estilo de juego      | 15%  |
| Prioridad declarada  | 15%  |
| Presupuesto          | 10%  |
| Peso del jugador     | 5%   |
| Anchura del pie      | 5%   |

El resultado es un array de `Recomendacion[]` ordenado por `match_pct` descendente. Se muestran las top 5.

---

## 👟 Base de datos de botas (estado actual)

Archivo: `src/data/botas.ts` — **8 botas** incluidas:

| # | Marca | Modelo | Categoría | Superficies |
|---|-------|--------|-----------|-------------|
| 1 | Nike | Mercurial Superfly 10 Elite | Velocidad | FG, AG |
| 2 | Adidas | Predator 24 Elite | Control | FG, AG |
| 3 | Adidas | Copa Pure 2 Elite | Técnica/Cuero | FG |
| 4 | Nike | Phantom GX 2 Elite | Control | FG, AG |
| 5 | Puma | Future 7 Ultimate | Equilibrada | FG, AG, SG |
| 6 | New Balance | Furon v7 Pro | Velocidad | FG, AG |
| 7 | Mizuno | Morelia Neo IV Beta | Técnica | FG, SG |
| 8 | Under Armour | Magnetico Elite 3 | Equilibrada | FG, AG |

**Para añadir más botas:** copia la estructura de cualquier bota existente en `botas.ts` y añádela al array `_rawBotas`. El motor la incluirá automáticamente.

---

## 🎨 Diseño y marca

- **Nombre:** CAMPO. (con punto)
- **Esquema de color:** fondo negro (#0a0a0a), acento naranja (#f97316), texto blanco
- **Tipografía:** Inter (Google Fonts), ultra-bold para headings
- **Fondo hero:** campo de fútbol con líneas sutiles (SVG inline)
- **Estilo:** oscuro, deportivo, directo — igual que el basket tracker

---

## 📊 Páginas disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Hero + CTA al quiz |
| `/quiz` | Quiz interactivo 6 pasos |
| `/resultados` | Top 5 botas recomendadas |
| `/botas` | Catálogo completo con filtros por superficie/categoría |
| `/rankings` | Rankings: más ligeras, mejor tracción FG, mejor cuero... |
| `/comparar` | Comparar 2 botas head-to-head |
| `/bota/[slug]` | Ficha detalle de cada bota |
| `/metodologia` | Cómo funciona el sistema de scoring |
| `/faq` | Preguntas frecuentes |

---

## 🔮 Próximos pasos sugeridos (prioridad)

### 1. 🌐 DESPLIEGUE (más urgente)
Desplegar en Vercel para tener URL pública:
```bash
npm install -g vercel
vercel login
vercel --prod
```
O conectar el repo de GitHub a Vercel desde vercel.com.

### 2. 📸 Imágenes reales de botas
Las imágenes actuales son placeholders. Sustituir `imagen_principal` en `botas.ts` con URLs reales de las webs oficiales de Nike, Adidas, Puma, etc.

### 3. 💰 Precios actualizados
Los precios en `links_compra` son de referencia. Actualizar con precios reales de Amazon ES, Decathlon, etc.

### 4. 👟 Ampliar catálogo
Añadir al menos 10-15 botas más, especialmente:
- Rango budget (< 60€): Adidas X Speedportal.3, Nike Mercurial Vapor 15 Club
- Fútbol sala / IN: Adidas Copa, Nike Tiempo
- Superficies blandas (SG): botas con tacos intercambiables

### 5. 🔗 Links de afiliado reales
Reemplazar URLs placeholder en `links_compra` con links reales de Amazon Associates u otro programa de afiliados.

### 6. 📱 Optimización móvil
Revisar que el quiz y las fichas de botas funcionen perfectamente en móvil (especialmente el comparador).

### 7. 🔍 SEO
- Añadir meta descriptions únicas por página
- Añadir structured data (JSON-LD) en las fichas de botas
- El sitemap ya se genera automáticamente (`/sitemap-index.xml`)

---

## ⚙️ Stack técnico

| Herramienta | Versión | Para qué |
|-------------|---------|----------|
| Astro | 6.3.x | Framework web (SSG) |
| Tailwind CSS | 4.3.x | Estilos (vía plugin Vite) |
| TypeScript | 6.x | Tipado del dominio |
| @astrojs/sitemap | 3.7.x | Generación automática de sitemap |
| Node.js | ≥22.12 | Runtime |

**Nota importante:** Tailwind v4 se integra vía `@tailwindcss/vite` (no `@astrojs/tailwind`). No hay `tailwind.config.js` — la configuración es en CSS.

---

## 🐛 Bugs conocidos

- Las URLs de imágenes son placeholders — las páginas muestran imágenes rotas
- Los precios no se actualizan automáticamente (no hay scraper todavía)
- El comparador necesita pulido en móvil

---

## 📝 Contexto del dueño del proyecto

- **Propietario:** Oswal (oswaldhs7@gmail.com)
- **Nivel técnico:** Usuario, no desarrollador — necesita que la IA haga los cambios de código
- **Referencia directa:** El Basketball Shoe Tracker en `C:\Users\oswal\Desktop\AI\Proyectos\Basketball Shoe Tracker` es el proyecto hermano ya terminado
- **Idioma:** Español (Oswal habla español)

---

*Última actualización: 2026-05-19*
