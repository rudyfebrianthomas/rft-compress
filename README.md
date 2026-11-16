# RFT Compress

RFT Compress is a client-side image and audio compressor built with React, TypeScript, and WebAssembly. All decoding, encoding, and `.zip` archiving happen locally in browser memory with zero server uploads.

## Features

- **Home (`/`)**: Clean landing view with direct navigation cards for the Image tool, Sound tool, and About reference page.
- **Compress Image (`/image`)**:
  - Drag-and-drop or multi-file picker supporting `PNG`, `JPG`, `JPEG`, `WebP`, `BMP`, `AVIF`, and `GIF`.
  - Encodes raster images to `.webp` via `@jsquash/webp` (WebAssembly `libwebp`, preserving transparency) and optimizes animated `.gif` files via `gifsicle-wasm-browser`.
  - Adjustable quality slider (`30%–95%` in `5%` steps) with one-click `Re-apply` when the quality changes after compression.
  - Shows visual previews, pixel dimensions, original vs. compressed sizes, savings percentage, individual `Download` buttons, and batch `.zip` export (`compressed-images.zip`).
- **Compress Sound (`/sound`)**:
  - Drag-and-drop or multi-file picker supporting `WAV`, `MP3`, `OGG`, `FLAC`, `M4A`, `AAC`, `WebM`, `OPUS`, `AIFF`, and `WMA`.
  - Decodes audio through the Web Audio API, normalizes unsupported sample rates to `44.1 kHz`, and encodes `.mp3` via `@breezystack/lamejs`.
  - Selectable MP3 bitrates (`64k`, `96k`, `128k`, `192k`) with `Re-apply`, inline play/pause audio preview, duration/sample-rate/channel metadata, and `.zip` batch export (`compressed-sound.zip`).
- **About (`/about`)**: Overview, 3-step usage guide, and input/output codec breakdown.
- **Queue Feedback & UX**:
  - **Unsupported Format Errors**: Rejects unsupported extensions/MIME types (such as `.svg` or documents), displays the rejected filenames alongside allowed formats, and auto-dismisses the alert after `5s`.
  - **Duplicate Guard**: Skips identical files already present in the current queue and reports how many were skipped.
  - **Download Status Tracking**: Switches each row's action button from `Download` to `Downloaded` after single-file download or `Download all` batch export, resetting to `Download` on `Re-apply`.
  - **Progress Overlay & Theme**: Blocking modal progress overlay (`completed / total`) during active encoding, plus persistent light/dark theme switching via `localStorage` and `prefers-color-scheme`.

## Tech Stack

| Category | Technology | Role |
| --- | --- | --- |
| UI Framework | React 19 (`react`, `react-dom`) | Component architecture and interactive state |
| Routing | `wouter` | Client-side path routing (`/`, `/image`, `/sound`, `/about`) |
| Language | TypeScript (`typescript`, `tsc -b`) | Strict static typing across UI, hooks, and media utilities |
| Build Tool | Vite 8 (`vite`, `@vitejs/plugin-react`) | Dev server, HMR, and production bundling |
| Styling | Tailwind CSS v4 (`tailwindcss`, `@tailwindcss/vite`) | Utility styling and CSS custom-property light/dark themes |
| Animation | Motion (`motion/react`) | Route, list item, header pill, and modal transitions |
| Typography | Commissioner Variable & DM Mono | Self-hosted display/body sans font and tabular monospace readouts |
| Image Compression | `@jsquash/webp` & `gifsicle-wasm-browser` | Client-side WASM `libwebp` encoding and GIF optimization |
| Audio Compression | Web Audio API & `@breezystack/lamejs` | Browser PCM decoding and LAME MP3 encoding |
| Archive Export | `fflate` | Zero-compression streaming `.zip` bundle creation |
| Testing | Vitest, Testing Library, `jsdom` | Unit, hook, and UI component tests |
| Linting | `oxlint` | Fast static lint checks across `src/` |

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## Scripts

```bash
npm run dev        # Start Vite dev server
npm run build      # Build production bundle into dist/
npm run typecheck  # Run TypeScript project checks (tsc -b)
npm run lint       # Run oxlint across source files
npm test           # Run Vitest suite once
npm run test:watch # Run Vitest in watch mode
npm run preview    # Preview the production build locally
```

## Project Structure

```text
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
    ├── main.tsx
    ├── index.css
    ├── types.ts
    ├── vite-env.d.ts
    ├── App.tsx
    ├── App.test.tsx
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
