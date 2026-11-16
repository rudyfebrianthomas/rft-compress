import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.tsx'

describe('App routing', () => {
  beforeEach(() => {
    window.history.pushState(null, '', '/')
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
    window.scrollTo = vi.fn()
  })

  it('navigates between /, /image, /sound, and /about paths', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: 'Compress images and sound' }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'Image' }))
    expect(window.location.pathname).toBe('/image')
    expect(
      screen.getByRole('heading', { name: 'Compress images to WebP and GIF' }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'Sound' }))
    expect(window.location.pathname).toBe('/sound')
    expect(
      screen.getByRole('heading', { name: 'Compress sound to MP3' }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'About' }))
    expect(window.location.pathname).toBe('/about')
    expect(
      screen.getByRole('heading', { name: 'About RFT Compress' }),
    ).toBeInTheDocument()
  })

  it('redirects unknown paths to /', () => {
    window.history.pushState(null, '', '/unknown-page')
    render(<App />)

    expect(window.location.pathname).toBe('/')
    expect(
      screen.getByRole('heading', { name: 'Compress images and sound' }),
    ).toBeInTheDocument()
  })
})
