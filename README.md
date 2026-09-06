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
4. Before publishing this promotional concept, replace or regenerate the free-plan ElevenLabs audio with commercially licensed narration. Deploy. No environment variables, database, backend, or custom rewrites are needed.

If this folder is imported from a larger repository, set its root directory to `spirkz-concept` instead.

## What's included

- Complete original section coverage: About, Why Spirkz, all 12 topics, creators, app, iOS updates, FAQs, investors, contact details and official legal links, alongside the concept lessons and course journey.
- Responsive landing page with self-hosted real science photographs, Manrope fonts and Phosphor Icons.
- Official Spirkz owl branding from its Google Play listing and website.
- English, Spanish, German, French, Russian, Maltese and Georgian, matching the original website. The selector translates the page and sample lessons, remembers the choice locally, and supports shareable `?lang=ka` links.
- A correctly proportioned, clickable phone concept.
- Three original 32-second vertical MP4 shorts at 1080×1920 and 30fps, with animated explanations and ElevenLabs George English narration. Audio is embedded in the MP4 files, with no API calls during playback. The video player supports pause, seek, volume, fullscreen, next lesson, and subtitles in all seven languages. Transcript and quiz are optional below the player.
- Keyboard accessible dialog and single-open FAQ accordion using the starter's Base UI / Shadcn components.
- Reduced-motion support, visible focus indicators, and mobile navigation.
- Android links go to the real Play Store listing. The iOS action opens the official website; no emails are collected by this concept.
- Photo credits and educational references at `/credits.html`.
- `noindex` metadata and HTTP header for the independent concept.

## Editing

- `src/App.tsx`: landing-page content and lesson player.
- `src/VideoLessonPlayer.tsx`: portrait video dialog, subtitles, transcript and optional quiz.
- `src/Sections.tsx`: restored original-site sections.
- `src/content.ts`: shared section navigation, all topics and FAQ content.
- `src/icons.ts`: directly imported Phosphor icons.
- `src/lessons.ts`: lesson captions, references, and app links.
- `src/I18n.tsx` and `src/LanguageSelector.tsx`: language selection and persistence.
- `src/locales/*.json`: complete translation catalogs, keyed by the English source text. Add new strings to all seven files. Translations should receive native-speaker editorial review before an official launch.
- `app/globals.css`: visual theme and responsive styling.
- `public/images`: locally served image assets.
- `public/brand`: official owl and app-icon assets.
- `public/videos`: production MP4s, posters and WebVTT subtitle tracks.
- `video`: separate local Remotion renderer, ElevenLabs generation script and offline narration fallback; see its README. Its dependencies are not needed to run or deploy the website.
- `public/fonts`: locally served Manrope font files and license.
- `public/credits.html`: attribution and concept disclosure.

The scaffold was adapted to use Vite's static build so it can be deployed on Vercel without a Cloudflare or Sites runtime. The starter's component catalog and dependency versions are retained; unused modules are not included in the generated client bundle.

## Scope

This is an outreach concept, not an official Spirkz site or app. It does not include live Spirkz footage, a recommendation system, a course backend, or an email service. Its sample course path is illustrative, and the photo and content credits should stay with the demo.

TypeScript, lint, lesson checks, translation completeness and placeholder checks, server-rendered coverage for all seven languages, and navigation CSS regression checks at 320–1440px are provided. Video encoding, decoding, audio presence and representative exported frames are checked separately. The standalone credits page remains in English. Browser interaction and responsive visual QA have not been performed in this task.
