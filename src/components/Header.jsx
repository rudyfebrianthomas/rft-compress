import { motion } from 'motion/react'

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
]

export function Header({ currentPage, onNavigate }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6 sm:px-8">
        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault()
            onNavigate('home')
          }}
          className="inline-flex min-h-[44px] items-center gap-2.5 text-lg font-semibold tracking-tight text-ink transition-opacity hover:opacity-85"
        >
          <span
            aria-hidden="true"
            className="grid h-7 w-7 place-items-center rounded-md border border-accent/40 bg-surface"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect
                x="2"
                y="2"
                width="12"
                height="12"
                rx="2"
                stroke="#c6f19d"
                strokeWidth="1.5"
              />
              <path
                d="M5 10.5L7.5 8L9.5 10L11 8.5"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>PressImg</span>
        </a>

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
                className={`relative inline-flex min-h-[44px] items-center rounded-md px-4 text-[15px] font-medium transition-colors ${
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
      </div>
    </header>
  )
}
