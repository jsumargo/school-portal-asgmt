# School Portal

School Portal is a fullstack application for education administrators to keep track of teachers and their classes.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, React Query, Axios, Material UI
- **Backend:** Node.js (v21.2+), Express 5, TypeScript, Prisma ORM
- **Database:** PostgreSQL (via Docker)
- **Shared:** Zod schemas and TypeScript types via internal `@school-portal/shared` package

## Assumptions

- **Subjects are predefined** — teachers must be assigned one of the seeded subjects. Run `npm run db:seed` before creating teachers.
- **Class levels are predefined** — classes must use one of the seeded levels (`Primary 1` through `Primary 6`). These are also created by `npm run db:seed`.
- **Teacher emails are unique** — attempting to register a teacher with a duplicate email returns HTTP 409.
- **Class names are unique** — attempting to create a class with a duplicate name returns HTTP 409.
- **A teacher can only be the form teacher of one class** — assigning an already-assigned teacher returns HTTP 409.
- **Login and access control are not implemented** as per the assignment scope.

## Future Improvements

- **Filtering & search** — expand query param support on list endpoints (e.g. `GET /api/teachers?assigned=false`, `GET /api/classes?level=Primary`) for more flexible filtering beyond what's currently implemented
- **Pagination** — add pagination to list endpoints (e.g. `GET /api/teachers?page=1&limit=20`, `GET /api/classes?page=1&limit=20`) for large datasets
- **Form library integration** — migrate client-side form validation to a form library integrated with the shared Zod schemas, replacing the current manual validation approach

## Prerequisites

- Node.js v21.2+
- Docker

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/jsumargo/school-portal-asgmt
cd school-portal
```

### 2. Install dependencies

Run from the root — npm workspaces installs all packages at once:

```bash
npm install
```

### 3. Start PostgreSQL via Docker

```bash
docker compose up -d
```

### 4. Configure environment variables

```bash
cp apps/server/.env.example apps/server/.env
```

| Variable          | Description                                                                                   |
| ----------------- | --------------------------------------------------------------------------------------------- |
| `DATABASE_URL`    | PostgreSQL connection string                                                                  |
| `PORT`            | Server port (default: `3000`)                                                                 |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed origins (e.g. `http://localhost:5173,https://yourdomain.com`) |
| `LOG_LEVEL`       | Pino log level — `info`, `debug`, `warn`, `error` (default: `info`)                           |

### 5. Set up the database

Apply the schema and generate the Prisma client:

```bash
npm run db:push
```

Seed initial reference data (subjects and class levels):

```bash
npm run db:seed
```

> To reset the database from scratch:
>
> ```bash
> docker compose down -v && docker compose up -d
> npm run db:push && npm run db:seed
> ```

### 6. Build shared package

The shared package must be built before running the server:

```bash
npm run build:packages
```

### 7. Run the app

```bash
# Terminal 1 — backend
npm run dev:server

# Terminal 2 — frontend
npm run dev:client
```

| Service  | URL                   |
| -------- | --------------------- |
| Frontend | http://localhost:5173 |
| Backend  | http://localhost:3000 |

## Scripts

Run all scripts from the **project root**:

| Script                   | Description                                            |
| ------------------------ | ------------------------------------------------------ |
| `npm run dev:server`     | Build shared package and start backend with hot reload |
| `npm run dev:client`     | Start Vite dev server                                  |
| `npm run build`          | Build shared package and client for production         |
| `npm run build:packages` | Build the shared package only                          |
| `npm run typecheck`      | Type-check server and client                           |
| `npm run lint`           | Lint server and client                                 |
| `npm run lint:fix`       | Auto-fix lint issues across server and client          |
| `npm run db:push`        | Push Prisma schema to database and generate client     |
| `npm run db:seed`        | Seed reference data (subjects and class levels)        |

## API Endpoints

| Method | Endpoint        | Description          | Success Status |
| ------ | --------------- | -------------------- | -------------- |
| GET    | `/api/teachers` | Get all teachers     | 200            |
| POST   | `/api/teachers` | Register a teacher   | 201            |
| GET    | `/api/classes`  | Get all classes      | 200            |
| POST   | `/api/classes`  | Create a class       | 201            |
| GET    | `/api/subjects` | Get all subjects     | 200            |
| GET    | `/api/levels`   | Get all class levels | 200            |

## Useful Docker Commands

```bash
docker compose up -d            # Start PostgreSQL
docker compose down             # Stop, keep data
docker compose down -v          # Stop and wipe all data
docker compose logs -f postgres # View PostgreSQL logs
```
