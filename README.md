# RFT Compress

Client-side React + Vite web app for compressing images (WebP and animated GIF) and audio files (MP3) directly in the browser with zero server uploads.

## Features

- **Home (`#home`)**: App overview and quick navigation to Image and Sound tools.
- **Compress Image (`#image`)**:
  - Drag-and-drop or multi-file picker for `PNG`, `JPG`, `WebP`, `BMP`, `AVIF`, and `GIF`.
  - Encodes raster images to `.webp` via `@jsquash/webp` (WebAssembly `libwebp`) and compresses `.gif` via `gifsicle-wasm-browser`.
  - Adjustable quality slider (`30%–95%`) with `Re-apply` for existing items.
  - Displays thumbnail preview, dimensions, original vs. compressed size, compression percentage, per-file download, and single `.zip` batch download via `fflate`.
- **Compress Sound (`#sound`)**:
  - Drag-and-drop or multi-file picker for `WAV`, `MP3`, `OGG`, `FLAC`, `M4A`, `AAC`, and `WebM`.
  - Decodes audio with the Web Audio API and encodes `.mp3` via `@breezystack/lamejs`.
  - Selectable MP3 bitrates (`64k`, `96k`, `128k`, `192k`) with `Re-apply`, inline audio play/pause preview, duration/sample-rate metadata, savings readout, and `.zip` batch export.
- **About (`#about`)**: App overview, 3-step usage guide, and supported input/output format table.
- **UI & UX**:
  - Light and dark theme (`white` / `dark grey`) persisted in `localStorage` with `prefers-color-scheme` default.
  - Duplicate file detection preventing identical files from being uploaded twice while still in the list.
  - Blocking full-screen loading overlay with progress counter while compression runs.

## Tech Stack

- **Framework & Build**: React 19, TypeScript, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`)
- **UI & Typography**: `motion` (`motion/react`), `@fontsource-variable/commissioner`, `DM Mono`
- **Compression & Archiving**: `@jsquash/webp`, `gifsicle-wasm-browser`, `@breezystack/lamejs`, `fflate`
- **Typechecking & Linting**: `tsc -b`, `oxlint`

## Scripts

```bash
npm install      # Install dependencies
npm run dev      # Start Vite dev server
npm run build    # Build production bundle to dist/
npm run typecheck # Run TypeScript compiler checks
npm run lint     # Run oxlint across source files
npm run preview  # Preview production build locally
```

## Project Structure

```text
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   └── favicon.ico
└── src/
    ├── main.tsx
    ├── index.css
    ├── types.ts
    ├── vite-env.d.ts
    ├── App.tsx
    ├── constants/
    │   ├── compression.ts
    │   ├── navigation.ts
    │   └── pages.ts
    ├── hooks/
    │   ├── useAudioPreview.ts
    │   ├── useBatchRunner.ts
    │   ├── useFileDrop.ts
    │   ├── useHashRoute.ts
    │   ├── useMediaQueue.ts
    │   └── useTheme.ts
    ├── components/
    │   ├── CompressionResultsSection.tsx
    │   ├── DropZone.tsx
    │   ├── Header.tsx
    │   ├── ImageResultCard.tsx
    │   ├── LoadingOverlay.tsx
    │   ├── ResultRow.tsx
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
        └── mediaItems.ts
```
