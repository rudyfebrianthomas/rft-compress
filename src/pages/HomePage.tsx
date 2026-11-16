import { motion } from 'motion/react'
import { Link } from 'wouter'
import { PAGE_ROUTES } from '../constants/navigation.ts'
import { HOME_TEXT } from '../constants/pages.ts'

export function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-10"
    >
      <section className="space-y-3">
        <h1 className="max-w-2xl font-display text-3xl font-medium tracking-[-0.03em] text-ink sm:text-5xl">
          {HOME_TEXT.title}
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          {HOME_TEXT.subtitle}
        </p>
      </section>

      <section
        aria-label={HOME_TEXT.toolsAriaLabel}
        className="grid gap-4 sm:grid-cols-2"
      >
        {HOME_TEXT.tools.map((tool) => (
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
              <Link
                href={PAGE_ROUTES[tool.id]}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 active:scale-[0.98]"
              >
                {tool.action}
              </Link>
            </div>
          </article>
        ))}
      </section>

      <div>
        <Link
          href={PAGE_ROUTES.about}
          className="inline-flex min-h-11 items-center text-sm font-medium text-muted transition-colors hover:text-ink"
        >
          {HOME_TEXT.aboutLinkLabel}
        </Link>
      </div>
    </motion.div>
  )
}
