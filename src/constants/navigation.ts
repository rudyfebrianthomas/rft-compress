import type { PageId } from '../types.ts'

export const SITE_TEXT = {
  brand: 'RFT Compress',
  skipToContent: 'Skip to content',
  footerTagline: 'Local Image & Sound',
} as const

export const NAV_ITEMS: ReadonlyArray<{ id: PageId; label: string }> = [
  { id: 'home', label: 'Home' },
  { id: 'image', label: 'Image' },
  { id: 'sound', label: 'Sound' },
  { id: 'about', label: 'About' },
]
