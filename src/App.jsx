import { ReactLenis } from 'lenis/react'
import { MotionConfig, cancelFrame, frame } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Header } from './components/Header.jsx'
import { AboutPage } from './pages/AboutPage.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { compressImageFile, isGifFile } from './utils/compressImage.js'

function getPageFromHash() {
  return window.location.hash === '#about' ? 'about' : 'home'
}

function getInitialTheme() {
  const docTheme = document.documentElement.dataset.theme
  if (docTheme === 'dark' || docTheme === 'light') return docTheme
  const saved = localStorage.getItem('theme')
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function createItemId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function revokeItemUrls(item) {
  if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl)
  if (item.fallbackPreviewUrl) URL.revokeObjectURL(item.fallbackPreviewUrl)
}

function App() {
  const lenisRef = useRef(null)
  const itemsRef = useRef([])
  const [currentPage, setCurrentPage] = useState(getPageFromHash)
  const [theme, setTheme] = useState(getInitialTheme)
  const [quality, setQuality] = useState(0.8)
  const [items, setItems] = useState([])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    localStorage.setItem('theme', theme)
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta) {
      meta.setAttribute('content', theme === 'dark' ? '#18181b' : '#ffffff')
    }
  }, [theme])

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    function update(data) {
      lenisRef.current?.lenis?.raf(data.timestamp)
    }

    frame.update(update, true)
    return () => cancelFrame(update)
  }, [])

  useEffect(() => {
    function handleHashChange() {
      setCurrentPage(getPageFromHash())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    return () => {
      itemsRef.current.forEach(revokeItemUrls)
    }
  }, [])

  function handleNavigate(page) {
    setCurrentPage(page)
    const nextHash = page === 'about' ? '#about' : '#home'
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash)
    }
    lenisRef.current?.lenis?.scrollTo(0, { immediate: false })
  }

  async function processEntry(id, file, targetQuality) {
    try {
      const result = await compressImageFile(file, targetQuality)
      const compressedUrl = URL.createObjectURL(result.blob)

      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item
          if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl)
          return {
            ...item,
            status: 'done',
            compressedSize: result.blob.size,
            compressedUrl,
            previewUrl: compressedUrl,
            outputName: result.outputName,
            format: result.format,
            width: result.width,
            height: result.height,
            frameCount: result.frameCount,
            qualityUsed: targetQuality,
            error: null,
          }
        }),
      )
    } catch (err) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'error',
                error: err instanceof Error ? err.message : 'Compression failed.',
              }
            : item,
        ),
      )
    }
  }

  function handleFilesSelected(fileList) {
    const validFiles = fileList.filter(
      (file) => file.type.startsWith('image/') || isGifFile(file),
    )
    if (validFiles.length === 0) return

    const newEntries = validFiles.map((file) => {
      const fallbackPreviewUrl = URL.createObjectURL(file)
      return {
        id: createItemId(),
        file,
        outputName: file.name,
        format: isGifFile(file) ? 'GIF' : 'WEBP',
        originalSize: file.size,
        compressedSize: 0,
        compressedUrl: null,
        fallbackPreviewUrl,
        previewUrl: fallbackPreviewUrl,
        width: 0,
        height: 0,
        frameCount: 1,
        qualityUsed: quality,
        status: 'processing',
        error: null,
      }
    })

    setItems((prev) => [...newEntries, ...prev])

    newEntries.forEach((entry) => {
      processEntry(entry.id, entry.file, quality)
    })
  }

  function handleRecompressAll() {
    const snapshot = items
    setItems((prev) =>
      prev.map((item) => ({ ...item, status: 'processing', error: null })),
    )
    snapshot.forEach((item) => {
      processEntry(item.id, item.file, quality)
    })
  }

  function handleRemoveItem(id) {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target) revokeItemUrls(target)
      return prev.filter((item) => item.id !== id)
    })
  }

  function handleClearAll() {
    setItems((prev) => {
      prev.forEach(revokeItemUrls)
      return []
    })
  }

  return (
    <MotionConfig reducedMotion="user">
      <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
        <div className="flex min-h-screen flex-col bg-bg text-ink">
          <Header
            currentPage={currentPage}
            onNavigate={handleNavigate}
            theme={theme}
            onToggleTheme={() =>
              setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
            }
          />

          <main
            id="main-content"
            className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 sm:px-8 sm:py-16"
          >
            {currentPage === 'about' ? (
              <AboutPage onGoHome={() => handleNavigate('home')} />
            ) : (
              <HomePage
                items={items}
                quality={quality}
                onQualityChange={setQuality}
                onFilesSelected={handleFilesSelected}
                onRecompressAll={handleRecompressAll}
                onRemoveItem={handleRemoveItem}
                onClearAll={handleClearAll}
              />
            )}
          </main>

          <footer className="mx-auto w-full max-w-4xl px-6 pb-10 pt-4 sm:px-8">
            <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="font-medium tracking-tight text-ink">
                  RFT Compress Images
                </span>
                <span aria-hidden="true" className="text-muted">
                  /
                </span>
                <span className="font-mono text-xs text-muted">
                  Client-side WebP &amp; GIF
                </span>
              </div>

              <nav
                aria-label="Footer"
                className="flex items-center gap-5 text-sm text-muted"
              >
                <a
                  href="#home"
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavigate('home')
                  }}
                  className="inline-flex min-h-[44px] items-center transition-colors hover:text-ink"
                >
                  Home
                </a>
                <a
                  href="#about"
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavigate('about')
                  }}
                  className="inline-flex min-h-[44px] items-center transition-colors hover:text-ink"
                >
                  About
                </a>
              </nav>
            </div>
          </footer>
        </div>
      </ReactLenis>
    </MotionConfig>
  )
}

export default App
