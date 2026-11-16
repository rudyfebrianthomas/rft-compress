import { motion } from 'motion/react'

const TOOLS = [
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
]

export function HomePage({ onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-10"
    >
      <section className="space-y-3">
        <h1 className="max-w-2xl font-display text-3xl font-medium tracking-[-0.03em] text-ink sm:text-5xl">
          Compress images and sound
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Local WebP, GIF, and MP3 compression in your browser. Zero server
          uploads.
        </p>
      </section>

      <section aria-label="Compression tools" className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <article
            key={tool.id}
            className="flex flex-col justify-between gap-6 rounded-2xl border border-border bg-surface/50 p-6 transition-colors hover:border-border-strong"
          >
            <div className="space-y-2">
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

      <div>
        <button
          type="button"
          onClick={() => onNavigate('about')}
          className="inline-flex min-h-[44px] cursor-pointer items-center text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          How it works &amp; supported formats →
        </button>
      </div>
    </motion.div>
  )
}
