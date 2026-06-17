# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Alfood is an MVP React SPA that lists restaurants and their menu dishes ("pratos"), plus an admin area for CRUD. The codebase is written in **Brazilian Portuguese** — file names, component names, variables, and UI strings are all pt-BR (e.g. `paginas`, `componentes`, `pratos`, `aoSubmeterForm`). Match this convention when adding code.

## Commands

```bash
npm run dev        # Vite dev server on http://localhost:3000 (auto-opens browser)
npm start          # alias for dev
npm run build      # tsc type-check then vite build
npm run typecheck  # tsc --noEmit (type-check only, no build)
npm run preview    # serve the production build locally
```

There is **no test runner and no ESLint configured**. `tsc` (via `npm run typecheck` or `build`) is the only static-analysis gate. `strict`, `noUnusedLocals`, and `noUnusedParameters` are on, so unused imports/vars fail the build.

## Backend API

The app expects a Django-style backend at `http://localhost:8000` (not in this repo). Two axios clients live in [src/http/index.ts](src/http/index.ts):

- `http` (default export) → `/api/v2/` — admin CRUD (restaurantes, pratos, tags).
- `httpV1` (named export) → `/api/v1/` — public vitrine listing.

Endpoint shape notes:
- `v1/restaurantes/` returns a paginated envelope `IPaginacao<T>` (`{ count, next, previous, results }`); "Ver mais" pagination follows `next` URLs directly.
- `v2/restaurantes/` and `v2/pratos/` return plain arrays.
- `v2/tags/` returns `{ tags: ITag[] }` (note the wrapper key).
- Dish create/update posts `multipart/form-data` (image upload) and switches POST/PUT based on presence of a route `:id`.

## Architecture

- **Routing** is centralized in [src/App.tsx](src/App.tsx) with React Router v7. The `/admin` routes are nested under [PaginaBaseAdmin](src/paginas/Admin/PaginaBaseAdmin.tsx), which renders the shared MUI AppBar nav + `<Outlet />`. Form routes are reused for both create (`/novo`) and edit (`/:id`) — components branch on `useParams().id`.
- **Two UI worlds, two styling systems:**
  - Public site (`paginas/Home`, `paginas/VitrineRestaurantes`, `componentes/*`) uses **SCSS modules** (`*.module.scss`, imported as `style` objects).
  - Admin area (`paginas/Admin/*`) uses **MUI v7** components with the `sx` prop and Emotion.
- **Folder layout:** `paginas/` = route-level pages, `componentes/` = reusable UI (each is a folder with `index.tsx` + co-located `.module.scss`), `interfaces/` = shared TS types, `http/` = axios clients.
- **Entry point** [src/index.tsx](src/index.tsx) wraps `<App/>` in `QueryClientProvider` (React Query, `refetchOnWindowFocus: false`, `retry: 1`), `BrowserRouter`, and StrictMode, with React Query Devtools mounted.

## State of migration (important)

The project recently migrated CRA → **Vite** and added dependencies for `@tanstack/react-query`, `react-hook-form`, `zod`, and `@hookform/resolvers`. **These are installed but not yet adopted** in the components — data fetching currently uses raw `axios` + `useEffect`/`useState`, and forms use controlled `useState` (see [FormularioPratos.tsx](src/paginas/Admin/AdminPratos/FormularioPratos.tsx) and [ListaRestaurantes/index.tsx](src/componentes/ListaRestaurantes/index.tsx)). When touching data/forms, prefer migrating toward React Query + react-hook-form + Zod rather than extending the legacy pattern. Note `ListaRestaurantes` hardcodes its full URL instead of using the `httpV1` client.
