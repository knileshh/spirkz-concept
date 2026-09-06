# Spirkz local video workshop

Three original 32-second educational shorts: the Moon, ocean color, and photosynthesis. Remotion 4.0.521 renders the animations at 1080×1920, 30 fps. Current English narration uses ElevenLabs George (Multilingual v2), generated on 6 September 2026. Windows SAPI / Microsoft Zira remains an offline fallback.

The videos and 21 subtitle tracks live in `../public/videos` and are already included. Playback needs no API key. The website does not need this renderer or its dependencies to run or deploy. Voice and visual labels remain English; the website selects subtitles in the chosen language. English captions use ElevenLabs character alignment, adjusted for playback speed; translated phrase timings are estimated within each measured clip.

The current audio was generated under the ElevenLabs free plan, which does not grant commercial usage rights. Before publishing a promotional site, regenerate narration under an appropriate license. Attribution: [elevenlabs.io](https://elevenlabs.io/). See [ElevenLabs publication rules](https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform). The source MP3s and alignment are saved locally; the API key is never saved in this project.

## Generate ElevenLabs narration

Set `ELEVENLABS_API_KEY` securely in the process environment, then run:

```powershell
npm run narrate:elevenlabs
npm run captions
npm run replace-audio
npm run verify
```

The script checks the account's included credits, uses the George stock voice and caches successful requests in ignored `out/elevenlabs`. `ELEVENLABS_VOICE_ID` optionally selects another voice. Delete the generation cache before regenerating under a new commercial license so older free-plan audio is not reused. The audio replacement script preserves every encoded video frame, fits clips into four eight-second scenes without changing pitch, and includes attribution in MP4 title metadata. Future full renders also use the selected narration and playback rates from `src/voice.json`.

## Rebuild with the offline fallback

Use Node.js 24 (or 22.13+) and Windows with the installed Microsoft Zira desktop voice. From this directory:

```powershell
npm ci
node scripts/prepare.mjs
./scripts/narrate.ps1
node scripts/captions.mjs
npm run render
npm run verify
```

The first render downloads Chrome Headless Shell if absent. Subsequent rendering, narration and caption preparation run locally. The narration script writes audio to files, never to the speakers. It chooses the slowest available speech rate that keeps each narration inside its eight-second scene. Rerun prepare/narrate/captions after editing lesson text.

For just one video: `npm run render -- moon` (or `ocean`, `fern`).

For an editable preview: `npm run dev -- --no-open`. For an English version with captions baked into the frames, render with the input props `id: moon` and `burnCaptions: true`. The website uses clean video with separate caption tracks so viewers can switch languages.

## Edit the content

- `../src/lessons.ts`: narration, references and quiz answers.
- `../src/locales/*.json`: translated text used for subtitles.
- `src/Short.tsx`: overall layout, on-screen headlines, timing and audio.
- `src/scenes/*.tsx`: moving diagrams and photographs.
- `src/Captions.tsx`: optional captions baked into the export.
- `scripts/export.mjs`: H.264/AAC output and poster generation.
- `scripts/verify.mjs`: codecs, dimensions, duration, full decode, and four extracted frames per video in `out/` for inspection.

Scene lengths are four × eight seconds. Each voice clip begins five frames into its scene. Diagrams are simplified: Earth–Moon distances and sizes are not to scale; the leaf and water diagrams explain processes rather than simulate them numerically. Photographs and branding reuse the site's credited local assets.

## Skills and research

The official [Remotion agent skills](https://www.remotion.dev/docs/ai/skills) were used for composition structure, frame-driven animation, captions and rendering. Reference copies were downloaded to `D:/Development/Private/video-skills` for this task; they are separate from the website and are not required to render. Source: [remotion-dev/skills](https://github.com/remotion-dev/skills).

The official curated Codex skill catalog had no dedicated local Blender/Manim renderer. Community [Manim skills](https://github.com/awesome-skills/manim-skill) also exist; they were researched but not used. Remotion was chosen for its direct fit with the existing React project. Blender remains useful for detailed 3D scenes; Manim for mathematical explanations.

Remotion is free for individuals and other qualifying users under its [license](https://www.remotion.dev/license), including for-profit teams with up to three employees in this version. It is not an unrestricted MIT-licensed renderer. Reassess licensing if the founder adopts the rendering pipeline commercially with a larger team.

Facts were checked against [NASA](https://science.nasa.gov/moon/facts/), [NOAA](https://oceanservice.noaa.gov/facts/oceanblue.html), and [National Geographic](https://education.nationalgeographic.org/resource/photosynthesis/). Scripts and diagrams are original explanations, not extracted footage. Research date: 6 September 2026.
