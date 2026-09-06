# Spirkz website concept

An independent landing-page concept by Nilesh. React + TypeScript + Vite, prepared for a static Vercel deployment. No Vercel CLI is required.

## Run locally

Use Node.js 24 (or Node.js 22.13+) and npm.

```sh
npm ci
npm run dev
```

## Validate

```sh
npm run lint
npm test
npm run build
```

## Deploy through Vercel's website

1. Push this folder as the repository root to a repository owned by **knileshh**. Use the personal GitHub identity; do not push through **nileshh-kumarr**.
2. In Vercel, import that GitHub repository using the personal account.
3. Framework: **Vite**. Build command: **npm run build**. Output directory: **dist**. Root directory: **./**. The included `vercel.json` provides the framework and build settings.
4. Deploy. No environment variables, database, backend, or custom rewrites are needed.

If this folder is imported from a larger repository, set its root directory to `spirkz-concept` instead.

## What's included

- Responsive landing page with self-hosted real science photographs and Manrope fonts.
- A correctly proportioned, clickable phone concept.
- Three original 32-second animated, caption-led sample lessons. Play/pause, seek, chapter selection, replay, next lesson, and an end-of-lesson quiz work locally.
- Keyboard accessible dialog and single-open FAQ accordion using the starter's Base UI / Shadcn components.
- Reduced-motion support, visible focus indicators, and mobile navigation.
- Android links go to the real Play Store listing. The iOS action opens the official website; no emails are collected by this concept.
- Photo credits and educational references at `/credits.html`.
- `noindex` metadata and HTTP header for the independent concept.

## Editing

- `src/main.tsx`: landing-page content and lesson player.
- `src/lessons.ts`: lesson captions, references, and app links.
- `app/globals.css`: visual theme and responsive styling.
- `public/images`: locally served image assets.
- `public/fonts`: locally served Manrope font files and license.
- `public/credits.html`: attribution and concept disclosure.

The scaffold was adapted to use Vite's static build so it can be deployed on Vercel without a Cloudflare or Sites runtime. The starter's component catalog and dependency versions are retained; unused modules are not included in the generated client bundle.

## Scope

This is an outreach concept, not an official Spirkz site or app. It does not include live Spirkz footage, a recommendation system, a course backend, or an email service. Its sample course path is illustrative, and the photo and content credits should stay with the demo.

TypeScript, lint, and automated content/boundary checks are provided. Browser interaction and responsive visual QA have not been performed in this task.
