# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Quiero Ser Digital (QSD) — Impact Dashboard**  
A SaaS-style dashboard for tracking digital talent transformation, placement metrics, and participant lifecycles for the *Fondo Quiero Ser Digital* program in Cali, Colombia.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Dev server at http://localhost:3000
npm run build        # Production build
npm run lint         # TypeScript type-check (tsc --noEmit, no ESLint)
npm run preview      # Preview production build
npm run clean        # Remove dist/
```

Requires `GEMINI_API_KEY` in `.env.local` (Google AI Studio integration via `@google/genai`).

## Architecture

### View routing
`App.tsx` manages a single `currentView: ViewType` state. Switching views re-renders the matching component under `src/components/Views/`. There is no React Router — navigation is pure state. `AnimatePresence` + `motion.div` from `motion/react` (formerly Framer Motion) provides animated transitions.

### Views (9 total)
Each view in `src/components/Views/` maps to a `ViewType`:

| ViewType | View file | Purpose |
|---|---|---|
| `resumen` | ResumenView | KPIs, funnel overview, profile distribution |
| `caracterizacion` | CaracterizacionView | Participant demographics |
| `embudo` | EmbudoView | Pipeline funnel by phase |
| `formacion` | FormacionView | Training progress |
| `colocacion` | ColocacionView | Job placement |
| `retencion` | RetencionView | 6-month retention |
| `empresas` | EmpresasView | Allied companies |
| `trazabilidad` | TraceabilityView | Per-participant tracking |
| `calendario` | CalendarioView | Activities calendar |

### Data layer
- **`src/data.ts`** — All static mock data. Exports: `participantes` (134 `Participant[]`), `empresas`, `actividades`, `kpis`, `embudoSteps`, `retencionData`, `hitos`. Views import directly from here.
- **`src/services/dataService.ts`** — A stub `DataService` object meant for future replacement with a real API (Google Sheets or Supabase). Currently unused by views.
- **`src/FilterContext.tsx`** — React Context providing global filter state (`fechaDesde`, `fechaHasta`, `comuna`, `estrato`, `rangoEdad`, `genero`). Wrap consumers with `useFilters()`. `applyFilters()` is a stub that only `console.log`s the filter state — it does not filter data yet.

### Types (`src/types.ts`)
Key types to know:
- `PhaseCode`: `'PRE' | 'INS' | 'VER' | 'FOR' | 'INT' | 'COL' | 'RET'` — the 7 sequential program phases in that order.
- `ParticipantStatus`: `'Activo' | 'Caída' | 'Re-col.' | 'Completado'`
- `Participant` — core data model with demographic, phase, placement, and training fields.
- `KPI` — aggregate metrics with `meta*` (goal) companions for each metric.
- `Empresa`, `Actividad`, `EmbudoStep`, `RetencionMes`, `Hito` — supporting domain types.

### Shared UI components (`src/components/Common.tsx`)
- `KPICard` — metric card with value, optional meta/goal, and percentage change badge.
- `HorizontalBar` — labeled progress bar.
- `PhaseBadge` / `StatusBadge` — colored chips for phase and status.

### Layout components
- **`src/components/Header.tsx`** — exports `Header` (default) and `FilterBar` (named). Both are rendered in `App.tsx` directly above `<main>`. The search input in `Header` is currently unconnected to data.
- **`src/components/Sidebar.tsx`** — fixed 72-unit wide sidebar; `menuItems` array drives both the icon and the `ViewType` id.

### Styling
- Tailwind CSS v4 via `@tailwindcss/vite` plugin. Config is in `src/index.css` under `@theme {}`.
- Brand colors: `text-qsd-blue` (`#2d5bff`), `text-qsd-pink`, `text-qsd-purple`, `text-qsd-teal`, `text-qsd-orange`.
- Shared utility classes defined in `src/index.css`: `.glass-card`, `.kpi-card`, `.tab-active`, `.horizontal-bar-bg`, `.calendar-grid`.
- Phase-specific CSS classes follow the pattern `bg-phase-{code}` / `text-phase-{code}-text` (e.g. `bg-phase-ins`). **These are not defined in `index.css` yet** — they are referenced in `Common.tsx` but will need to be added to `@theme {}` or as `@layer utilities` before they render.

## Key conventions
- Views consume data by importing from `src/data.ts` directly; do not route data through `DataService` until the API integration is built.
- Adding a new view requires: (1) add the key to `ViewType` in `types.ts`, (2) create the component in `Views/`, (3) add a `case` in `App.tsx`'s `renderView()`, (4) add a nav entry in `Sidebar.tsx`.
- Dependencies `papaparse`, `xlsx`, and `express` are installed for planned Excel/CSV ingestion and a local API server — none are wired up yet.
