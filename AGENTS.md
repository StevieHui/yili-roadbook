# Repository Guidelines

## Project Structure & Module Organization

This repository is a Vite + React + TypeScript roadbook app for an Yili loop trip. Application code lives in `src/`: UI components are in `src/components/`, itinerary content in `src/data/`, helpers in `src/lib/`, AMap integration in `src/map/`, shared types in `src/types.ts`, and test setup in `src/test/`. Tests live in `src/__tests__/` and use `*.test.ts` or `*.test.tsx`. Static assets are served from `public/`, especially `public/images/`. Planning notes are under `docs/superpowers/`. Do not edit `dist/` or `node_modules/` manually.

## Build, Test, and Development Commands

- `npm install`: install project dependencies from `package-lock.json`.
- `npm run dev`: start the Vite development server.
- `npm run test`: run the Vitest test suite once.
- `npm run typecheck`: run TypeScript checks without emitting files.
- `npm run build`: type-check and create a production build in `dist/`.
- `npm run preview`: serve the production build locally for verification.

## Coding Style & Naming Conventions

Use TypeScript strict mode and React function components. Follow the existing style: two-space indentation, single quotes, semicolons, named exports for components, and PascalCase component filenames such as `CalendarStrip.tsx`. Keep helper modules lower camel case, for example `src/lib/itinerary.ts`. Prefer typed props and shared domain types from `src/types.ts`.

## Testing Guidelines

Vitest runs in `jsdom` with setup from `src/test/setup.ts`; React tests use Testing Library. Add focused tests in `src/__tests__/` whenever changing itinerary rules, checklist behavior, navigation, or map fallback behavior. Use descriptive `describe` and `it` labels that state the user-facing behavior. Run `npm run test` and `npm run typecheck` before submitting changes; use `npm run build` for UI or data changes that affect production output.

## Commit & Pull Request Guidelines

The current Git history uses Conventional Commit-style messages such as `feat: add resilient AMap route map` and `style: finish cinematic Yili visual system`. Keep commits short, imperative, and scoped to one logical change. Pull requests should include a concise summary, test results, linked issue or planning note when relevant, and screenshots or screen recordings for visible UI changes.

## Security & Configuration Tips

Keep local secrets in `.env.local`; use `.env.example` to document required variables. Do not commit API keys or generated build artifacts. Changes to `src/map/` should preserve graceful behavior when AMap fails to load or required configuration is absent.
