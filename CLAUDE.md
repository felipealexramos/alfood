# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Alfood is an MVP React SPA that lists restaurants and their menu dishes, plus an admin area for CRUD. The codebase is written in **English** — file names, components, variables, comments, tests, UI strings, and routes. The one deliberate exception: **the backend API contract is Brazilian Portuguese**. Endpoint paths (`restaurantes/`, `pratos/`, `tags/`) and payload/response field names (`nome`, `descricao`, `imagem`, `tag`, `restaurante`) must NOT be translated — they are dictated by the alfood-api backend (sibling repo `../alfood-api`). Interfaces like `IDish`/`IRestaurant` have English names but pt-BR field names for this reason.

## Commands

```bash
npm run dev            # Vite dev server on http://localhost:3000 (auto-opens browser)
npm start              # alias for dev
npm run build          # tsc type-check then vite build
npm run typecheck      # tsc --noEmit (type-check only, no build)
npm run preview        # serve the production build locally
npm test               # vitest run (single pass)
npm run test:watch     # vitest in watch mode
npm run test:coverage  # vitest with v8 coverage
```

Tests use **Vitest + Testing Library** (jsdom environment, `globals: true` — required for Testing Library auto-cleanup — setup in [src/setupTests.ts](src/setupTests.ts), config in [vite.config.ts](vite.config.ts)). Tests are co-located with source as `*.test.ts(x)`. There is **no ESLint configured**. `strict`, `noUnusedLocals`, and `noUnusedParameters` are on, so unused imports/vars fail the build.

## Backend API

The backend is the NestJS app in the sibling repo `../alfood-api`, served at `http://localhost:8000` — configurable via `VITE_API_URL` (see [.env.example](.env.example); the code falls back to localhost:8000). Two axios clients live in [src/http/index.ts](src/http/index.ts):

- `http` (default export) → `/api/v2/` — admin CRUD (restaurantes, pratos, tags). **The backend protects all of `/api/v2` with JWT** (`POST /api/v2/auth/login` with `{ usuario, senha }` → `{ access_token }`). The client has interceptors: a request interceptor injects `Authorization: Bearer <token>`, and a response interceptor clears the token and hard-redirects to `/admin/login` on any `401`. The JWT lives in `localStorage` (`alfood.accessToken`), managed by [src/auth/session.ts](src/auth/session.ts); [src/auth/authService.ts](src/auth/authService.ts) performs the login call.
- `httpV1` (named export) → `/api/v1/` — public showcase listing (no auth).

Endpoint shape notes:
- `v1/restaurantes/` returns a paginated envelope `IPagination<T>` (`{ count, next, previous, results }`) with `pratos[]` nested in each result; "Load more" follows the absolute `next` URLs directly.
- `v2/restaurantes/` and `v2/pratos/` return plain arrays.
- `v2/tags/` returns `{ tags: ITag[] }` (note the wrapper key).
- Dish create/update posts `multipart/form-data` (image upload) and switches POST/PUT based on presence of a route `:id`.

## Architecture

- **Routing** is centralized in [src/App.tsx](src/App.tsx) with React Router v7: `/`, `/restaurants`, a public `/admin/login`, and the `/admin/*` CRUD routes nested under [AdminBasePage](src/pages/Admin/AdminBasePage.tsx) (shared MUI AppBar nav + `<Outlet />` + a "Log out" button). The `/admin` branch is wrapped in [ProtectedRoute](src/components/ProtectedRoute/index.tsx), which redirects to `/admin/login` when no token is stored (login itself stays outside the guard). Form routes are reused for both create (`/new`) and edit (`/:id`) — components branch on `useParams().id`.
- **Two UI worlds, two styling systems:**
  - Public site (`pages/Home`, `pages/RestaurantShowcase`, `components/*`) uses **SCSS modules** (`*.module.scss`, imported as `styles` objects).
  - Admin area (`pages/Admin/*`) uses **MUI v7** components with the `sx` prop and Emotion.
- **Folder layout:** `pages/` = route-level pages, `components/` = reusable UI (each is a folder with `index.tsx` + co-located `.module.scss`), `interfaces/` = shared TS types, `http/` = axios clients.
- **Entry point** [src/index.tsx](src/index.tsx) wraps `<App/>` in `QueryClientProvider` (React Query, `refetchOnWindowFocus: false`, `retry: 1`), `BrowserRouter`, and StrictMode, with React Query Devtools mounted.

## State of migration (important)

Dependencies for `@tanstack/react-query`, `react-hook-form`, `zod`, and `@hookform/resolvers` are **installed but not yet adopted** — data fetching currently uses raw `axios` + `useEffect`/`useState`, and forms use controlled `useState` (see [DishForm.tsx](src/pages/Admin/AdminDishes/DishForm.tsx) and [RestaurantList/index.tsx](src/components/RestaurantList/index.tsx)). When touching data/forms, prefer migrating toward React Query + react-hook-form + Zod rather than extending the legacy pattern.

Integration milestones for the alfood-api backend: M1 (env-based HTTP clients, no hardcoded URLs, nested `pratos[]` rendering in the showcase) and M2 (admin JWT auth: login page, Authorization/401 interceptors, guarded `/admin` routes, logout) are **done**. Remaining: M3 = React Query adoption; M4 = react-hook-form + Zod forms; M5 = verification/docs.
