import { motion } from 'motion/react'
import { Link } from 'wouter'
import { PAGE_ROUTES } from '../constants/navigation.ts'
import { ABOUT_TEXT } from '../constants/pages.ts'

export function AboutPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-14"
    >
      <section className="space-y-4">
        <h1 className="max-w-2xl font-display text-3xl font-medium tracking-[-0.03em] text-ink sm:text-5xl">
          {ABOUT_TEXT.title}
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          {ABOUT_TEXT.description}
        </p>
      </section>

      <section aria-labelledby="how-to-use-heading" className="space-y-6">
        <h2
          id="how-to-use-heading"
          className="text-xl font-medium tracking-tight text-ink sm:text-2xl"
        >
          {ABOUT_TEXT.howToUseHeading}
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {ABOUT_TEXT.steps.map((item) => (
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
          {ABOUT_TEXT.formatsHeading}
        </h2>
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface/50">
          {ABOUT_TEXT.formats.map((row) => (
            <div
              key={row.output}
              className="grid gap-3 p-5 sm:grid-cols-3 sm:items-center sm:gap-6"
            >
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-muted">
                  {ABOUT_TEXT.formatColumns.input}
                </span>
                <span className="text-sm font-medium text-ink sm:text-base">
                  {row.input}
                </span>
              </div>
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-muted">
                  {ABOUT_TEXT.formatColumns.output}
                </span>
                <span className="font-mono text-sm font-medium text-ink sm:text-base">
                  {row.output}
                </span>
              </div>
              <div>
                <span className="block font-mono text-[11px] uppercase tracking-wider text-muted">
                  {ABOUT_TEXT.formatColumns.method}
                </span>
                <span className="text-sm text-muted">{row.method}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={PAGE_ROUTES.image}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 active:scale-[0.98]"
        >
          {ABOUT_TEXT.actions.image}
        </Link>
        <Link
          href={PAGE_ROUTES.sound}
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-border-strong px-6 text-sm font-medium text-ink transition-colors hover:bg-surface active:scale-[0.98]"
        >
          {ABOUT_TEXT.actions.sound}
        </Link>
      </div>
    </motion.div>
  )
}
