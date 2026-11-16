import type { PageId } from '../types.ts'

export interface HomeToolCard {
  id: Extract<PageId, 'image' | 'sound'>
  title: string
  formats: string
  description: string
  action: string
}

export const HOME_TEXT = {
  title: 'Compress images and sound',
  subtitle:
    'Local WebP, GIF, and MP3 compression in your browser. Zero server uploads.',
  aboutLinkLabel: 'How it works & supported formats →',
  toolsAriaLabel: 'Compression tools',
  tools: [
    {
      id: 'image',
      title: 'Compress Image',
      formats: 'PNG · JPG · WEBP · BMP · GIF',
      description: 'Convert photos to WebP and shrink animated GIFs.',
      action: 'Compress images',
    },
    {
      id: 'sound',
      title: 'Compress Sound',
      formats: 'WAV · MP3 · OGG · FLAC · M4A',
      description: 'Encode audio files into smaller MP3s by bitrate.',
      action: 'Compress sound',
    },
  ] satisfies ReadonlyArray<HomeToolCard>,
} as const

export const ABOUT_TEXT = {
  title: 'About RFT Compress',
  description:
    'RFT Compress is a browser-based media compressor for images and sound. All encoding runs locally in memory on your device, so files never leave your browser.',
  howToUseHeading: 'How to use',
  formatsHeading: 'Supported formats',
  steps: [
    {
      step: '01',
      title: 'Pick Image or Sound',
      detail:
        'Open Image or Sound from the navigation bar and choose your target quality or MP3 bitrate.',
    },
    {
      step: '02',
      title: 'Drop files in the box',
      detail:
        'Drag and drop one or multiple files into the upload box, or click to select from your device.',
    },
    {
      step: '03',
      title: 'Compare and download',
      detail:
        'Check each file preview, original size, compressed size, and compression percentage, then download.',
    },
  ],
  formats: [
    {
      input: 'PNG, JPG, JPEG, WebP, BMP, AVIF',
      output: 'WebP (.webp)',
      method: 'WebAssembly libwebp encoding with transparency',
    },
    {
      input: 'GIF (.gif)',
      output: 'GIF (.gif)',
      method: 'WebAssembly Gifsicle lossy LZW optimization',
    },
    {
      input: 'WAV, MP3, OGG, FLAC, M4A, AAC, WebM',
      output: 'MP3 (.mp3)',
      method: 'Web Audio API decoding + LAME MP3 encoding',
    },
  ],
  actions: {
    image: 'Compress images',
    sound: 'Compress sound',
  },
} as const
