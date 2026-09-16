# AGENTS.md — Faculty Hub Backend

Guide for AI coding agents (and humans) working in this repository.

## Project overview

Faculty Hub is a university faculty-management platform (teachers, subjects, study plans, semesters, lectures, and automatic teacher→lecture assignment). This repo is the **main backend**: a REST API in **Node.js + TypeScript + Express**, with **PostgreSQL** accessed through **Sequelize 6**.

Related systems (not in this repo):
- **Frontend** SPA (Vite, default `http://localhost:5173`), deployed to AWS S3.
- **LectureTeacherAssignator**: a separate Python + Google OR-Tools service that solves the assignment problem. This backend calls it over HTTP at `${ALGORITHM_URL}/assignTeachers/` (trailing slash matches the FastAPI route and avoids a 307 redirect). Do not add OR-Tools/optimization logic here.

Deployment: AWS Elastic Beanstalk (backend), AWS RDS PostgreSQL (DB). Env vars in production are set in Elastic Beanstalk, not `.env`. Deploys are manual.

Human-facing docs (README, CONTRIBUTING, ADRs, API error messages) are written in **Spanish**; code identifiers and comments are mostly English.

## Commands

```bash
npm install                 # install deps
npm run dev                 # nodemon + ts-node on src/app.ts (same as `npm start`)
npm run build               # tsc -> dist/
npm run prod                # node dist/app.js
npm test                    # jest (all tests, with coverage)
npx jest tests/modules/degree.test.ts        # single test file
npx jest -t "creates a degree successfully"  # single test by name
docker-compose up --build   # app (host 3000 -> container 3000) + postgres (5432)

# Database (sequelize-cli, reads config/config.js via .env)
npx sequelize-cli db:migrate
npx sequelize-cli db:migrate:undo
npx sequelize-cli db:seed:all
npx sequelize-cli migration:generate --name <kebab-name>

# Lint / format (no npm scripts exist for these)
npx eslint "src/**/*.ts"
npx prettier --write "src/**/*.ts" "tests/**/*.ts"
```

Notes:
- ESLint 9 is installed but config is legacy `.eslintrc.json`; you may need `ESLINT_USE_FLAT_CONFIG=false npx eslint ...`.
- Only a local Postgres is needed to run the server (see `docs/guides/local_guide.md` for a one-line `docker run`). The assignment endpoint also needs the Python algorithm service running at `ALGORITHM_URL`.
- CI (`.github/workflows/ci.yml`) runs only `npm install && npm test` on Node 18.x and 20.x, on every push and PR. Tests must pass on both.

## Environment variables

Copy `.env.example` to `.env`:

| Var | Purpose |
| --- | --- |
| `NAME_DB`, `USER_DB`, `PASSWORD_DB`, `HOST_DB`, `PORT_DB` | Postgres connection (`HOST_DB=localhost` locally, `postgres` inside docker-compose) |
| `DB_SSL` | `true` on AWS RDS, `false` locally |
| `JWT_SECRET` | JWT signing secret |
| `FRONTEND_URL` | CORS origin (default `http://localhost:5173`) |
| `ALGORITHM_URL` | Base URL of the Python OR-Tools assignment service (local default `http://localhost:8080`) |
| `PORT` | HTTP port (default `3000`) |

Never commit a real `.env` or production secrets.

## Architecture

**Modular monolith** (see `docs/decisions/ADR1-monolito-modular.md`). Request flow:

```
src/routers/*Router.ts        -> route + middleware chain (auth, role)
src/controllers/*Controller.ts -> yup validation, call module API, map to HTTP
src/modules/<module>/index.ts  -> PUBLIC API of the module (the only entry point)
  services/*Service.ts         -> business logic (exported functions)
  repositories/*Repository.ts  -> Sequelize queries (class, exported as singleton instance)
  repositories/models/*.ts     -> Sequelize models (Model.init + associations)
  dtos/request|response/*.ts   -> DTO types
src/shared/utils/              -> enums, custom exceptions, error handler, helpers
src/middlewares/               -> authMiddleware, isCoordinatorMiddleware, isTeacherOwnDataMiddleware
src/config/database.ts         -> Sequelize instance used by the app
```

Modules (`src/modules/`):
- `auth` — login (bcrypt + JWT).
- `userManagement` — Users, Roles, Permissions.
- `teacher` — Teachers, contacts, prizes, CAES courses, benefits, categories, available time modules, subject history/interests, teacher groups.
- `subject` — Subjects, study plans, events (exams, deliveries), needs (equipment), hour configs.
- `semester` — Semesters, lectures, lecture groups/roles/hour configs, lecture-teacher assignments and reviews.
- `degree` — Degrees (carreras).
- `file-processor` — Parses uploaded Excel (`xlsx`) files, e.g. semester lectures.
- `teacherAssignations` — Builds payload for the Python solver, persists results, detects assignment conflicts. No DB models of its own.

API base paths are mounted in `src/app.ts` under `/api/...` (`subjects`, `events`, `teachers`, `study-plans`, `needs`, `modules`, `file-processor`, `semesters`, `degrees`, `teachers-assignations`, `users`, `auth`). A Postman collection and `.http` file live in `docs/postman_collection/`. DB model diagrams: `docs/database_models/models.md`.

### Module boundary rules

- **Cross-module access goes through the other module's `index.ts`** (e.g. `import { getTeacherById } from '../../teacher'`). Do not query another module's tables/repositories directly; ask the "expert" module instead, even if it costs an extra query rather than a join.
- When adding a service function that other modules or controllers need, export it from the module's `index.ts`.
- Controllers import from `../modules/<module>` (the index), never from repositories.
- Known existing exceptions (Sequelize associations/includes, e.g. `User` ↔ `Teacher`) exist in model/repository files; don't add new ones without a reason.

## Code conventions

- Formatting (Prettier): single quotes, semicolons, 2-space indent, `printWidth` 80, `trailingComma: es5`.
- ESLint: `@typescript-eslint/recommended` + prettier; unused vars are errors unless prefixed with `_`. TypeScript `strict: true`.
- **Controllers**: a class with `async` methods `(req: Request, res: Response)`, exported as `export default new XController()`. Pattern:
  ```ts
  try {
    await inputXSchema.validate(req.body);
    const result = await someModuleFn(...);
    res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) returnError(res, error);
  }
  ```
- **Validation**: yup schemas in `src/controllers/validationSchemas/<entity>Schemas/inputXSchema.ts`, default-exported.
- **Errors**: throw `ResourceNotFound` (→ 404) or `DataBaseError` (→ 400) from `src/shared/utils/exceptions/customExceptions.ts`. `returnError` in `handleExceptions.ts` also maps yup `ValidationError` → 400 and Sequelize `UniqueConstraintError` → 409; anything else → 500. User-facing error messages are in Spanish.
- **Services**: plain exported async functions. **Repositories**: class with async methods, `export default new XRepository()`.
- **Routes**: always `authMiddleware` first; add `isCoordinatorMiddleware` for write/admin operations; `isTeacherOwnDataMiddleware` lets a `teacher` role access only its own `/:id`.
- **Enums** (`src/shared/utils/enums/`) hold Spanish domain values that are stored in the DB (e.g. `SubjectRoles.THEORY = 'Teórico'`, `TeacherStates.TEMPORARY_LEAVE = 'baja temporal'`, `WeekDays.MONDAY = 'Lunes'`). Use the enum, never string literals, and don't change the values without a data migration.
- Pagination/sorting/filtering from query strings uses `extractParameters` in `src/shared/utils/queryParamsHelper.ts` (`page`, `pageSize`, `sortField`, `sortOrder`, `search`, `withDeleted`, rest = filters).
- Some models are `paranoid` (soft delete, e.g. Teacher, Subject); respect `withDeleted` when querying.

## Database & migrations

- The app calls `sequelize.sync({ force: false })` on startup (creates missing tables only; it does not alter existing ones).
- **Every schema change needs both**: an update to the TS model in `src/modules/<module>/repositories/models/` **and** a new migration in `migrations/` (JS, `sequelize-cli` format, timestamp-prefixed). Use a transaction for multi-step migrations and implement `down`.
- Seeders in `seeders/` load reference data (modules, benefits, categories, study plans, events, needs, degrees, roles) and a bootstrap admin: Teacher "Super Admin" + User with `teacher_employee_number: 0`, password `admin123`, `role_id: 1` (= `coordinator`, since the roles seeder runs first). Log in with it to create the first real users via `POST /api/users`, then change its password. It is not created automatically on app startup; only `db:seed:all` creates it.
- `models/index.js` is unused sequelize-cli boilerplate (it points to a non-existent `config/config.json`); the app uses `src/config/database.ts`.

## Auth

- `POST /api/auth/login` with body `{ teacher_employee_number, password }` returns a JWT (24h) with payload `{ id, role (role_id), teacher_id }`.
- Clients send `Authorization: Bearer <token>`. Role names checked in middleware: `coordinator`, `teacher`.

## Testing

- Jest + ts-jest; tests live in `tests/` (`**/tests/**/*.test.ts`), not next to source.
  - `tests/modules/<module>.test.ts` — service tests, mocking the repository with `jest.mock('../../src/modules/<m>/repositories/<x>Repository')` and other modules via `jest.mock('../../src/modules/<other>')`.
  - `tests/controllers/<x>Controller.test.ts` — controller tests, mocking the module index, `handleExceptions`, and the yup schema; `res` is a mock with chained `status/json/send`.
- Tests are pure unit tests: **no database or network**. Mock Sequelize models/repositories and `axios`.
- When adding or changing a service or controller, add/update the matching test file.

## Git workflow

- GitFlow: `main` (production), `develop` (integration, PR target), `feature/*`, `bugfix/*`, `hotfix/*`.
- PRs target `develop`, need at least one approving review, must pass CI, should reference the issue, and follow `.github/pull_request_template.md`.
- Releases are tagged with SemVer (`X.Y.Z`).

## Gotchas

- Standard local ports across the stack: algorithm `8080`, backend `3000`, frontend `5173`. `docker-compose.yml` maps host `3000` → container `3000` and sets `ALGORITHM_URL=http://host.docker.internal:8080` (with `extra_hosts: host-gateway` for Linux), because `localhost` inside the container is the container itself. The Dockerfile `EXPOSE 8080` is informational only and stale.
- Uploaded files are written to `src/uploads/` (resolved relative to compiled `__dirname`) with their original filename; processing a LECTURES file **clears the target semester's lectures first**.
- Running a new automatic assignation deletes existing assignments for the semester before saving solver results; an `Infeasible` solver status aborts without deleting.
- File name typo: `src/controllers/userManagmentController.ts` (import it by that name).
- `tsconfig.json` includes `test/**` but the folder is `tests/`; ts-jest compiles tests independently, so this doesn't affect `npm test`.
