import { motion } from 'motion/react'

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
]

export function Header({ currentPage, onNavigate, theme, onToggleTheme }) {
  const isDark = theme === 'dark'

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg transition-colors">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-6 sm:px-8">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            onNavigate('home')
          }}
          className="inline-flex min-h-[44px] min-w-0 items-center gap-2.5 text-base font-semibold tracking-tight text-ink transition-opacity hover:opacity-85 sm:text-lg"
        >
          <span
            aria-hidden="true"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-border-strong bg-surface text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect
                x="2"
                y="2"
                width="12"
                height="12"
                rx="2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M5 10.5L7.5 8L9.5 10L11 8.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="truncate">RFT Compress Images</span>
        </a>

        <div className="flex shrink-0 items-center gap-1.5">
          <nav aria-label="Primary" className="flex items-center gap-1">
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
                  className={`relative inline-flex min-h-[44px] items-center rounded-md px-3.5 text-[15px] font-medium transition-colors sm:px-4 ${
                    isActive
                      ? 'text-accent-ink'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      className="absolute inset-0 rounded-md bg-accent"
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </a>
              )
            })}
          </nav>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-md border border-border bg-surface text-ink transition-colors hover:border-border-strong hover:bg-surface-elevated active:scale-[0.98]"
          >
            {isDark ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
                <path
                  d="M12 2.5V5M12 19V21.5M4.93 4.93L6.7 6.7M17.3 17.3L19.07 19.07M2.5 12H5M19 12H21.5M4.93 19.07L6.7 17.3M17.3 6.7L19.07 4.93"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
