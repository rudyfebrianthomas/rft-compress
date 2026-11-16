import { motion } from 'motion/react'

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'image', label: 'Image' },
  { id: 'sound', label: 'Sound' },
  { id: 'about', label: 'About' },
]

export function Header({ currentPage, onNavigate, theme, onToggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg transition-colors">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-2 px-6 sm:gap-3 sm:px-8">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            onNavigate('home')
          }}
          className="inline-flex min-h-11 min-w-0 items-center gap-2 font-display text-sm font-semibold tracking-tight text-ink transition-opacity hover:opacity-75 sm:gap-2.5 sm:text-base"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            aria-hidden="true"
            className="shrink-0 text-ink"
          >
            <rect
              x="2"
              y="2"
              width="14"
              height="14"
              rx="3.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M5.5 11.5L8.25 8.75L10.25 10.75L12.5 8.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="truncate">RFT Compress</span>
        </a>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <nav aria-label="Primary" className="flex items-center gap-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    onNavigate(item.id)
                  }}
                  className={`relative inline-flex min-h-11 items-center rounded-full px-2.5 text-xs font-medium transition-colors sm:px-3.5 sm:text-sm ${
                    isActive
                      ? 'text-accent-ink'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                      className="absolute inset-x-0 inset-y-1.5 rounded-full bg-accent"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              )
            })}
          </nav>

          <span aria-hidden="true" className="h-4 w-px bg-border" />

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-surface hover:text-ink active:scale-[0.96]"
          >
            {isDark ? (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
                <path
                  d="M12 2.5V5M12 19V21.5M4.93 4.93L6.7 6.7M17.3 17.3L19.07 19.07M2.5 12H5M19 12H21.5M4.93 19.07L6.7 17.3M17.3 6.7L19.07 4.93"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M20.354 15.354A8.5 8.5 0 0 1 8.646 3.646 8.5 8.5 0 1 0 20.354 15.354Z"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
