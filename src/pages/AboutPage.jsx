import { motion } from 'motion/react'

const STEPS = [
  {
    step: '01',
    title: 'Drop or select images',
    detail:
      'Open Home and drag PNG, JPG, WebP, BMP, AVIF, or GIF files into the upload box, or click to select multiple files.',
  },
  {
    step: '02',
    title: 'Compress locally',
    detail:
      'Raster images convert to WebP at your chosen quality. GIFs decode frame by frame and re-encode with a shared palette while preserving animation.',
  },
  {
    step: '03',
    title: 'Compare and download',
    detail:
      'Review each image preview, original size, compressed size, and compression percentage on Home, then download one or all files.',
  },
]

const FORMAT_ROWS = [
  {
    input: 'PNG, JPG, JPEG, WebP, BMP, AVIF',
    output: 'WebP (.webp)',
    method: 'Canvas WebP encoding with transparency',
  },
  {
    input: 'GIF (.gif)',
    output: 'GIF (.gif)',
    method: 'Shared palette quantization and frame delta encoding',
  },
]

export function AboutPage({ onGoHome }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-14"
    >
      <section className="space-y-4">
        <h1 className="max-w-2xl text-3xl font-medium tracking-[-0.04em] text-ink sm:text-5xl">
          About Rudy Febrianthomas Compress Images
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          A lightweight browser utility built for two formats: converting photos
          and graphics into compact WebP files, and shrinking animated or static
          GIFs locally without uploading anything to a server.
        </p>
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
        <div className="overflow-hidden rounded-2xl border border-border bg-surface/50 divide-y divide-border">
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

      <div>
        <button
          type="button"
          onClick={onGoHome}
          className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          Start compressing
        </button>
      </div>
    </motion.div>
  )
}
