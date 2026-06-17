# Alfood

Alfood is a website that lists restaurants and their menu dishes.
It's an MVP that's just getting started, with many new features still to be built.

<img src="screencapture.png" alt="Alfood screenshot" width="50%">


## 🔨 Features

- **Public storefront** — restaurant listing with pagination ("load more") consuming the public API (`/api/v1/`).
- **Admin area** (`/admin`) — CRUD for restaurants and dishes consuming the admin API (`/api/v2/`).
  - Create, edit, and delete restaurants.
  - Create, edit, and delete dishes, with tag/restaurant selection and image upload.

## 🗺️ Roadmap

Alfood is an evolving MVP. The planned next steps are:

1. **Data-layer and forms migration** _(in progress)_
   - **React Query** (`@tanstack/react-query`) for all data fetching, replacing `axios` + `useEffect`/`useState`.
   - **React Hook Form** for form management, replacing manual controlled state.
   - **Zod** (with `@hookform/resolvers`) for form schema validation.
2. **Automated testing**
   - Unit and integration tests using React ecosystem testing libraries.
   - End-to-end (E2E) tests with **Playwright** covering critical flows.

> The step-1 dependencies are already installed; adoption across the components is still pending.

## ✔️ Techniques and technologies

- `React` + `React Hooks`
- `TypeScript`
- `Vite`
- `React Router`
- `Material UI (MUI)` + `Emotion`
- `SCSS Modules`
- `axios`
- `React Query` · `React Hook Form` · `Zod` _(to be adopted — see Roadmap)_

## 🛠️ Getting started

> Prerequisite: the front-end expects an API running at `http://localhost:8000` (`/api/v1/` and `/api/v2/`).

To run the project, execute `npm i` to install dependencies and `npm run dev` to start it.

Then open <a href="http://localhost:3000/">http://localhost:3000/</a> in your browser.

### Available scripts

- `npm run dev` — starts the development server (Vite) on port 3000.
- `npm run build` — type-checks (`tsc`) and builds for production.
- `npm run typecheck` — type-check only, no build output.
- `npm run preview` — serves the production build locally.
