import type { PageId } from '../types.ts'

export const PAGE_ROUTES: Record<PageId, string> = {
  home: '/',
  image: '/image',
  sound: '/sound',
  about: '/about',
}

export const SITE_TEXT = {
  brand: 'RFT Compress',
  skipToContent: 'Skip to content',
  navAriaLabel: 'Primary',
  themeSwitchToLight: 'Switch to light theme',
  themeSwitchToDark: 'Switch to dark theme',
  footerTagline: 'Local Image & Audio',
} as const

export const NAV_ITEMS: ReadonlyArray<{
  id: PageId
  label: string
  path: string
}> = [
  { id: 'home', label: 'Home', path: PAGE_ROUTES.home },
  { id: 'image', label: 'Image', path: PAGE_ROUTES.image },
  { id: 'sound', label: 'Audio', path: PAGE_ROUTES.sound },
  { id: 'about', label: 'About', path: PAGE_ROUTES.about },
]
