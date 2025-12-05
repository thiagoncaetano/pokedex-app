<h1 align="center">Pokédex App</h1>

Fullstack Pokédex application built as a **monorepo** with **Yarn Workspaces**,
using **Next.js** on the frontend and **NestJS** on the backend, consuming the
**PokeAPI** and providing a rich experience for search, infinite list and
Pokémon details.

---

## Overview

- **Monorepo** managed by Yarn Workspaces.
- **Frontend** (`frontend/` folder):
  - Next.js 16 (Pages Router).
  - React Query (@tanstack) for server state.
  - Tailwind 4 for styling.
- **Backend** (`backend/` folder):
  - NestJS 11.
  - Integration with PokeAPI via `PokeApiAdapter`.
  - Domain model tailored to the application (details, stats, images, etc.).
- Authentication with **JWT** (NestJS + Passport) and protected routes on the
  frontend.

---

## What this project demonstrates

- **Fullstack monorepo** setup with Yarn Workspaces (frontend + backend).
- **Clean backend design** with use cases, presenters and adapters to an
  external API (PokeAPI).
- **Authentication** with JWT and protected routes / pages.
- **Modern React stack**: SSR + React Query + infinite scroll + URL-based
  filters.
- **TypeScript-first codebase** across frontend and backend.

---

## Requirements

- **Node.js** (LTS version recommended).
- **Yarn** (the project uses `yarn workspaces`).

---

## Quickstart for recruiters

1. Clone the repository.
2. From the project root, install dependencies:

   ```bash
   yarn install
   ```

3. Create `.env` files using the **Environment variables** section as a
   reference (backend and frontend examples).
4. Still from the project root, start both apps:

   ```bash
   yarn start
   ```

5. Open the frontend at <http://localhost:3000>.

> **Note for reviewers**: Although a default admin user was part of the
> original requirements, I encourage you to create your own user and go
> through the full signup/login flow. This gives a better picture of the
> end-to-end user experience and validation logic implemented in the app.

---

## How to run the application

All commands below should be executed from the **project root**
(`pokedex-app/`).

### 1. Install dependencies

```bash
yarn install
```

This will install dependencies for the root and the `frontend` and `backend`
workspaces.

### 2. Start frontend + backend together (recommended)

```bash
yarn start
```

This command uses `concurrently` to run:

- **Backend** (NestJS) in development mode.
- **Frontend** (Next.js) in development mode.

By default, the services run on:

- Frontend: <http://localhost:3000>
- Backend: <http://localhost:3001>

### 3. Run only one service (if needed)

**Frontend (Next.js) only:**

```bash
yarn workspace frontend dev
```

**Backend (NestJS) only:**

```bash
yarn workspace backend start:dev
```

---

## Available scripts

At the **monorepo root** (`package.json`):

- **`yarn start`** – runs `backend` and `frontend` together (dev).
- **`yarn start:front`** – runs only the frontend in dev mode.
- **`yarn start:back`** – runs only the backend in dev mode.

In the **frontend** (`frontend/package.json`):

- **`yarn workspace frontend dev`** – Next.js in development mode.
- **`yarn workspace frontend build`** – production build.
- **`yarn workspace frontend start`** – Next.js production server.
- **`yarn workspace frontend lint`** – frontend lint.

In the **backend** (`backend/package.json`):

- **`yarn workspace backend start:dev`** – NestJS in development mode.
- **`yarn workspace backend build`** – backend build.
- **`yarn workspace backend start:prod`** – runs the backend from the `dist` folder.
- **`yarn workspace backend test`** – unit tests.
- **`yarn workspace backend test:e2e`** – end-to-end tests.

---

## Environment variables

### Backend (NestJS)

`.env` file inside the `backend/` folder (**development example**):

```env
NODE_ENV=development
PORT=3001
JWT_ACCESS_SECRET=jwt-test

# development (SQLite)
DB_TYPE=sqlite
SQLITE_DATABASE_PATH=./data/pokemon.db
```

The backend listens on port `3001` by default (`process.env.PORT ?? 3001`).

### Frontend (Next.js)

Frontend `.env` (**development example**):

```env
API_URL=http://localhost:3001
NEXT_PUBLIC_AUTH_TOKEN_KEY=auth_token_prod
```

The frontend uses an `API_URL` constant defined in
`frontend/src/shared/constants/url.ts`:

```ts
export const API_URL = process.env.API_URL || 'http://localhost:3001';
```

To point the frontend to a different backend (for example, in production), set
`API_URL` in the frontend environment.

---

## Architecture

### Backend: Pokémon domain

- `PokemonDetail` exposes only what the frontend needs:
  - `moves: string[]` – move names.
  - `stats: { name: string; base_stat: number }[]` – base stats.
  - `images: string[]` – sprite/image URLs.
  - `main_image: string` – main image (prioritizes official artwork, then `front_default`).
- `PokeApiAdapter` transforms the raw PokeAPI response into this domain model.
- `PokemonPresenter` ensures the `/pokemons/:id` endpoint **always** returns a
  complete `PokemonDetail` (empty arrays/defaults in edge cases), avoiding
  excessive null checks on the frontend.

### Backend: main modules

- `AppModule` imports:
  - `AuthModule` – JWT authentication.
  - `UsersModule` – user management.
  - `PokemonsModule` – Pokémon use cases and endpoints.
- `PokemonsModule` provides use cases such as:
  - `GetPokemonsUseCase` / `ListPokemonsUseCase` – paginated listing.
  - `GetPokemonDetailUseCase` – Pokémon details.
  - `GetPokemonsBasicInfosUseCase` / `GetPokemonBasicInfoUseCase` – basic
    info for search.

### Backend: main endpoints

Controller: `PokemonsController` (`/pokemons`), protected with `AuthGuard('jwt')`.

- `POST /pokemons` – paginated Pokémon list from an optional array of `ids`.
- `GET /pokemons/:id` – full Pokémon detail.
- `GET /pokemons/basic_infos/:param` – basic info by name/id (used for search).

### Frontend: Home flow

Main page: `frontend/src/pages/index.tsx`.

- Uses **SSR** (`getServerSideProps`) to:
  - Retrieve the session (`SessionEntity`).
  - Redirect to login if there is no session.
  - Load the first page of Pokémon via `PokemonGateway.getPokemons`.
- Uses **React Query** (`useInfiniteQuery`) for infinite scrolling when the
  user reaches the end of the list.
- Builds a **deduplicated** list of results combining:
  - Initial SSR result.
  - Additional infinite scroll pages.
  - Extra results from remote search.
- The search flow has two steps:
  - **local-first**: filter in-memory by name.
  - **remote fallback**: if nothing is found locally, it calls the backend to
    fetch a Pokémon, adds it to the collection and updates the `ids` parameter
    in the URL.

### Frontend: Pokémon detail

Page: `frontend/src/pages/pokemon/[id].tsx`.

- Protected by session via `getServerSideProps`.
- Uses `PokemonGateway.getPokemonDetails` to prefetch data on the server
  (React Query dehydrated state).
- Renders the detail layout (`PokemonDetailLayout`) with main image, types,
  stats, moves, etc.

### Frontend: infinite scroll hook

The infinite scroll logic is extracted to a reusable hook
`useIntersectionObserver`, which:

- Encapsulates the `IntersectionObserver` lifecycle.
- Waits for the `ref` to be available using `requestAnimationFrame`.
- Performs proper cleanup (`cancelAnimationFrame` + `disconnect`).

The `CardList` component simply expresses the intent to load more data at the
end of the list, keeping its focus on rendering (cards, skeletons,
virtualization).

---

## Folder structure (simplified)

```text
.
├─ backend/
│  ├─ src/
│  │  ├─ auth/
│  │  ├─ pokemons/
│  │  │  ├─ application/
│  │  │  ├─ domain/
│  │  │  ├─ infrastructure/
│  │  │  └─ presentation/
│  │  ├─ common/
│  │  └─ config/
│  └─ test/
├─ frontend/
│  ├─ src/
│  │  ├─ features/
│  │  │  ├─ pokemon/
│  │  │  └─ auth/
│  │  ├─ pages/
│  │  ├─ hooks/
│  │  └─ shared/
│  └─ public/
└─ package.json (monorepo, global scripts)
```

---

## Code quality

- **Lint** configured for both frontend and backend.
- **Prettier** used on the backend for code formatting.
- **Jest** configured on the backend for unit and E2E tests.

To run backend tests:

```bash
yarn workspace backend test
```

---
