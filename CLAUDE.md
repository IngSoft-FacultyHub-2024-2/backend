# CLAUDE.md

@AGENTS.md

## Claude Code notes

- `AGENTS.md` above is the single source of truth for project context; update it (not this file) when conventions, commands, or architecture change.
- Before claiming a change is done, run `npm test` (and `npx tsc --noEmit` for type changes). Tests don't need a database.
- Follow the existing layering exactly: router → controller (yup validation + `returnError`) → module `index.ts` → service → repository → model. Mirror a nearby module (e.g. `degree`) when adding a new entity.
- Schema changes: update the model **and** add a migration in `migrations/`. Don't rely on `sequelize.sync`.
- Keep user-facing error messages in Spanish, consistent with the rest of the API.
- Branch from `develop` using `feature/*` or `bugfix/*`; open PRs against `develop`, not `main`.
- Don't run seeders or migrations against a non-local database, and don't touch AWS resources, without explicit confirmation.
