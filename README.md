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

- **Framework & Build**: React 19, Vite 8, Tailwind CSS v4 (`@tailwindcss/vite`)
- **UI & Typography**: `motion` (`motion/react`), `@fontsource-variable/commissioner`, `DM Mono`
- **Compression & Archiving**: `@jsquash/webp`, `gifsicle-wasm-browser`, `@breezystack/lamejs`, `fflate`
- **Linting**: `oxlint`

## Scripts

```bash
npm install      # Install dependencies
npm run dev      # Start Vite dev server
npm run build    # Build production bundle to dist/
npm run preview  # Preview production build locally
npm run lint     # Run oxlint across source files
```

## Project Structure

```text
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── favicon.ico
└── src/
    ├── main.jsx
    ├── index.css
    ├── App.jsx
    ├── components/
    │   ├── CompressionResultsSection.jsx
    │   ├── DropZone.jsx
    │   ├── Header.jsx
    │   ├── ImageResultCard.jsx
    │   ├── LoadingOverlay.jsx
    │   ├── ResultRow.jsx
    │   └── SoundResultCard.jsx
    ├── pages/
    │   ├── AboutPage.jsx
    │   ├── CompressImagePage.jsx
    │   ├── CompressSoundPage.jsx
    │   └── HomePage.jsx
    └── utils/
        ├── compressImage.js
        ├── compressSound.js
        ├── download.js
        └── format.js
```
