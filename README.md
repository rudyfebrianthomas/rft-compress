# RFT Compress

Client-side image and audio compression web application built with React, TypeScript, and WebAssembly. All decoding, encoding, and `.zip` archive creation run locally in browser memory with zero server uploads.

## Features

- **Home (`/`)**: Tool selector linking to the image compressor (`/image`), sound compressor (`/sound`), and format guide (`/about`).
- **Compress Image (`/image`)**:
  - Drag-and-drop or multi-file picker accepting `PNG`, `JPG`, `JPEG`, `WebP`, `BMP`, `AVIF`, and `GIF`.
  - Encodes raster images to `.webp` via `@jsquash/webp` (preserving alpha transparency) and optimizes animated `.gif` files via `gifsicle-wasm-browser` (`-O2` up to 5 MB, `-O1` above 5 MB, mapped lossy `10` to `180`).
  - Quality slider (`30%` to `95%` in `5%` increments, default `80%`) with `Re-apply` batch re-compression, thumbnail previews, dimensions, byte savings, individual downloads, and `compressed-images.zip` batch export.
- **Compress Sound (`/sound`)**:
  - Drag-and-drop or multi-file picker accepting `WAV`, `MP3`, `OGG`, `FLAC`, `M4A`, `AAC`, `WebM`, `OPUS`, `AIFF`, and `WMA`.
  - Decodes audio with the Web Audio API, resamples unsupported rates to `44.1 kHz` via `OfflineAudioContext`, and encodes `.mp3` via `@breezystack/lamejs`.
  - Bitrate selector (`64k`, `96k`, `128k`, `192k`, default `128k`) with `Re-apply`, inline play/pause audio preview, duration/sample-rate/channel metadata, and `compressed-sound.zip` batch export.
- **About (`/about`)**: Usage steps and input-to-output codec reference table.
- **Queue & UX controls**: Rejects unsupported files with an auto-dismissing (`5000 ms`) error alert, skips duplicate files in the queue, tracks `Download` vs `Downloaded` state per item, shows a blocking progress overlay during active encoding, and persists light/dark theme via `localStorage` and `prefers-color-scheme`.

## Tech Stack

| Category | Technology | Role |
| --- | --- | --- |
| UI Framework | React (`^19.3.1`), `react-dom` (`^19.3.1`) | Component rendering and queue state |
| Routing | `wouter` (`^3.13.0`) | Client-side routing (`/`, `/image`, `/sound`, `/about`) |
| Language | TypeScript (`^7.0.2`) | Strict static typing via `tsc -b` |
| Styling | Tailwind CSS v4 (`^4.3.5`), `@tailwindcss/vite` | Utility classes and light/dark CSS theme variables |
| Motion | `motion` (`^14.14.0`) | Route transitions, list item motion, and `reducedMotion="user"` support |
| Fonts | `@fontsource-variable/commissioner`, DM Mono | Self-hosted variable sans font and tabular monospace metrics |
| Image Codecs | `@jsquash/webp` (`^1.5.0`), `gifsicle-wasm-browser` (`^1.5.19`) | Browser WASM WebP encoding and lossy GIF optimization |
| Audio Codec | Web Audio API, `@breezystack/lamejs` (`^1.2.7`) | Audio decoding, resampling, and LAME MP3 encoding |
| Archive | `fflate` (`^0.8.3`) | In-memory `.zip` bundle creation |
| Build & QA | Vite (`^8.3.6`), Vitest (`^5.1.0`), Testing Library, `jsdom`, `oxlint` | Bundling, unit/UI tests, and linting |

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Scripts

```bash
npm run dev         # Start Vite dev server
npm run build       # Build production bundle into dist/
npm run typecheck   # Run TypeScript checks (tsc -b)
npm run lint        # Run oxlint across source files
npm run test        # Run Vitest test suite once
npm run test:watch  # Run Vitest in watch mode
npm run preview     # Preview the production build locally
```

## Project Structure

```text
├── LICENSE
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── public/
│   └── favicon.ico
└── src/
    ├── App.tsx
    ├── App.test.tsx
    ├── index.css
    ├── main.tsx
    ├── types.ts
    ├── vite-env.d.ts
    ├── test/
    │   └── setup.ts
    ├── constants/
    │   ├── compression.ts
    │   ├── navigation.ts
    │   └── pages.ts
    ├── hooks/
    │   ├── useAudioPreview.ts
    │   ├── useBatchRunner.ts
    │   ├── useFileDrop.ts
    │   ├── useMediaQueue.ts
    │   ├── useMediaQueue.test.ts
    │   └── useTheme.ts
    ├── components/
    │   ├── CompressionResultsSection.tsx
    │   ├── DropZone.tsx
    │   ├── Footer.tsx
    │   ├── Header.tsx
    │   ├── ImageResultCard.tsx
    │   ├── LoadingOverlay.tsx
    │   ├── MediaCompressPage.tsx
    │   ├── ResultRow.tsx
    │   ├── ResultRow.test.tsx
    │   └── SoundResultCard.tsx
    ├── pages/
    │   ├── AboutPage.tsx
    │   ├── CompressImagePage.tsx
    │   ├── CompressSoundPage.tsx
    │   └── HomePage.tsx
    └── utils/
        ├── compressImage.ts
        ├── compressSound.ts
        ├── download.ts
        ├── format.ts
        ├── format.test.ts
        └── mediaItems.ts
```

## License

Licensed under the [MIT License](LICENSE).
