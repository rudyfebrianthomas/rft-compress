import { motion } from 'motion/react'

const TOOLS = [
  {
    id: 'image',
    title: 'Compress Image',
    formats: 'PNG · JPG · WEBP · BMP · AVIF → WEBP / GIF → GIF',
    description:
      'Convert photos and graphics into compact WebP via WebAssembly libwebp, and shrink animated GIFs with Gifsicle.',
    action: 'Open Image Compressor',
  },
  {
    id: 'sound',
    title: 'Compress Sound',
    formats: 'WAV · MP3 · OGG · FLAC · M4A → MP3',
    description:
      'Decode audio in your browser and encode smaller MP3 files at your chosen bitrate using LAME.',
    action: 'Open Sound Compressor',
  },
]

const STEPS = [
  {
    step: '01',
    title: 'Choose Image or Sound',
    detail:
      'Pick Compress Image or Compress Sound from the navigation bar, then set your target quality or MP3 bitrate.',
  },
  {
    step: '02',
    title: 'Drop files in the box',
    detail:
      'Drag and drop one or multiple files into the upload box, or click to browse. Everything runs locally in browser memory.',
  },
  {
    step: '03',
    title: 'Review savings and download',
    detail:
      'See every file preview, original size, compressed size, and compression percentage, then download one or all files.',
  },
]

const FORMAT_ROWS = [
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
]

export function HomePage({ onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-14"
    >
      <section className="space-y-4">
        <h1 className="max-w-2xl font-display text-3xl font-medium tracking-[-0.03em] text-ink sm:text-5xl">
          Compress images and sound in your browser
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          RFT Compress is a local media compression app. Shrink photos to WebP,
          optimize animated GIFs, and compress audio files to MP3 directly on
          your device with zero server uploads.
        </p>
      </section>

      <section aria-label="Compression tools" className="grid gap-4 md:grid-cols-2">
        {TOOLS.map((tool) => (
          <article
            key={tool.id}
            className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-surface/50 p-6 transition-colors hover:border-border-strong"
          >
            <div className="space-y-2.5">
              <h2 className="text-xl font-medium tracking-tight text-ink">
                {tool.title}
              </h2>
              <p className="font-mono text-xs text-muted">{tool.formats}</p>
              <p className="text-sm leading-relaxed text-muted sm:text-base">
                {tool.description}
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={() => onNavigate(tool.id)}
                className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 active:scale-[0.98]"
              >
                {tool.action}
              </button>
            </div>
          </article>
        ))}
      </section>

      <section aria-labelledby="how-to-use-heading" className="space-y-6">
        <h2
          id="how-to-use-heading"
          className="text-xl font-medium tracking-tight text-ink sm:text-2xl"
        >
          How to use
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((item) => (
            <article
              key={item.step}
              className="space-y-2.5 border-t border-border pt-5"
            >
              <span className="block font-mono text-xs font-medium text-muted">
                {item.step}
              </span>
              <h3 className="text-base font-medium text-ink">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted sm:text-base">
                {item.detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="formats-heading" className="space-y-5">
        <h2
          id="formats-heading"
          className="text-xl font-medium tracking-tight text-ink sm:text-2xl"
        >
          Supported formats
        </h2>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface/50">
          {FORMAT_ROWS.map((row) => (
            <div
              key={row.output}
              className="grid gap-3 p-5 sm:grid-cols-3 sm:items-center sm:gap-6"
            >
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-muted">
                  Input
                </span>
                <span className="text-sm font-medium text-ink sm:text-base">
                  {row.input}
                </span>
              </div>
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-muted">
                  Output
                </span>
                <span className="font-mono text-sm font-medium text-ink sm:text-base">
                  {row.output}
                </span>
              </div>
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-muted">
                  Method
                </span>
                <span className="text-sm text-muted">{row.method}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  )
}
