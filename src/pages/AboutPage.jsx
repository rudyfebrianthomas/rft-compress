import { motion } from 'motion/react'

const STEPS = [
  {
    step: '01',
    title: 'Drop or select your images',
    detail:
      'Open Home and drag PNG, JPG, WebP, BMP, AVIF, or GIF files into the upload box, or click to select multiple files from your device.',
  },
  {
    step: '02',
    title: 'Compress locally in your browser',
    detail:
      'Standard raster images convert to WebP at your chosen quality. GIF files decode frame by frame and re-encode with a shared reduced palette to shrink file size while keeping animation.',
  },
  {
    step: '03',
    title: 'Check savings and download',
    detail:
      'Every uploaded image appears on the Home page with its preview, original size, compressed size, and compression percentage so you can download one file or the entire batch.',
  },
]

const FORMAT_ROWS = [
  {
    input: 'PNG, JPG, JPEG, WebP, BMP, AVIF',
    output: 'WebP (.webp)',
    method: 'Browser Canvas WebP encoding with transparency support',
  },
  {
    input: 'GIF (.gif)',
    output: 'GIF (.gif)',
    method: 'Shared palette quantization and frame delta optimization',
  },
]

export function AboutPage({ onGoHome }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-12"
    >
      <section className="space-y-4">
        <h1 className="max-w-3xl text-4xl font-medium tracking-[-0.04em] text-ink sm:text-5xl">
          About Rudy Febrianthomas Compress Images
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Rudy Febrianthomas Compress Images is a client-side image compressor built for two everyday web
          formats: converting photos and graphics into compact WebP files, and
          reducing animated or static GIF file sizes without leaving your
          browser.
        </p>
        <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Because all processing runs locally in memory, your images never leave
          your device and there are no upload queues or file-count limits.
        </p>
      </section>

      <section aria-labelledby="how-to-use-heading" className="space-y-5">
        <h2
          id="how-to-use-heading"
          className="text-2xl font-medium tracking-tight text-ink sm:text-3xl"
        >
          How to use
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {STEPS.map((item) => (
            <article
              key={item.step}
              className="flex flex-col justify-between rounded-xl border border-border bg-surface p-6"
            >
              <div className="space-y-3">
                <span className="inline-block font-mono text-sm font-medium text-accent">
                  Step {item.step}
                </span>
                <h3 className="text-lg font-medium text-ink">{item.title}</h3>
                <p className="text-base leading-relaxed text-muted">
                  {item.detail}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="formats-heading" className="space-y-5">
        <h2
          id="formats-heading"
          className="text-2xl font-medium tracking-tight text-ink sm:text-3xl"
        >
          Supported formats
        </h2>
        <div className="overflow-hidden rounded-xl border border-border bg-surface">
          <div className="divide-y divide-border">
            {FORMAT_ROWS.map((row) => (
              <div
                key={row.output}
                className="grid gap-3 p-5 sm:grid-cols-3 sm:items-center sm:gap-6"
              >
                <div>
                  <span className="block font-mono text-xs text-muted">
                    Input
                  </span>
                  <span className="text-base font-medium text-ink">
                    {row.input}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-xs text-muted">
                    Output
                  </span>
                  <span className="font-mono text-base font-medium text-accent">
                    {row.output}
                  </span>
                </div>
                <div>
                  <span className="block font-mono text-xs text-muted">
                    Method
                  </span>
                  <span className="text-sm text-muted">{row.method}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div>
        <button
          type="button"
          onClick={onGoHome}
          className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg bg-accent px-5 text-base font-medium text-accent-ink transition-transform hover:brightness-95 active:scale-[0.98]"
        >
          Go to compressor
        </button>
      </div>
    </motion.div>
  )
}
