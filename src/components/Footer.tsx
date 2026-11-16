import { SITE_TEXT } from '../constants/navigation.ts'

const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-4xl px-6 pb-4 text-center sm:px-8">
      <div className="border-t border-border pt-3">
        <p className="font-mono text-[11px] leading-none text-muted">
          © {CURRENT_YEAR} {SITE_TEXT.brand} · {SITE_TEXT.footerTagline}
        </p>
      </div>
    </footer>
  )
}
