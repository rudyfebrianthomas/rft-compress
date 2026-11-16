import { MotionConfig } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Header } from './components/Header.jsx'
import { LoadingOverlay } from './components/LoadingOverlay.jsx'
import { AboutPage } from './pages/AboutPage.jsx'
import { CompressImagePage } from './pages/CompressImagePage.jsx'
import { CompressSoundPage } from './pages/CompressSoundPage.jsx'
import { HomePage } from './pages/HomePage.jsx'
import { compressImageFile, isGifFile } from './utils/compressImage.js'
import { compressSoundFile, isAudioFile } from './utils/compressSound.js'

const CURRENT_YEAR = new Date().getFullYear()

function getPageFromHash() {
  const hash = window.location.hash.toLowerCase()
  if (hash === '#image' || hash === '#images') return 'image'
  if (hash === '#sound' || hash === '#audio') return 'sound'
  if (hash === '#about') return 'about'
  return 'home'
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
  const imageItemsRef = useRef([])
  const soundItemsRef = useRef([])

  const [currentPage, setCurrentPage] = useState(getPageFromHash)
  const [theme, setTheme] = useState(getInitialTheme)
  const [loadingState, setLoadingState] = useState(null)

  const [quality, setQuality] = useState(0.8)
  const [imageItems, setImageItems] = useState([])

  const [bitrate, setBitrate] = useState(128)
  const [soundItems, setSoundItems] = useState([])

  useEffect(() => {
    imageItemsRef.current = imageItems
  }, [imageItems])

  useEffect(() => {
    soundItemsRef.current = soundItems
  }, [soundItems])

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
    function handleHashChange() {
      setCurrentPage(getPageFromHash())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  useEffect(() => {
    return () => {
      imageItemsRef.current.forEach(revokeItemUrls)
      soundItemsRef.current.forEach(revokeItemUrls)
    }
  }, [])

  function handleNavigate(page) {
    setCurrentPage(page)
    const nextHash = `#${page}`
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function runBatch(entries, label, runner) {
    setLoadingState({
      label,
      total: entries.length,
      completed: 0,
      currentName: entries[0]?.outputName || '',
    })

    try {
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        setLoadingState((prev) =>
          prev ? { ...prev, currentName: entry.outputName } : prev,
        )
        // Yield a frame so the full-screen overlay paints progress before WASM/CPU work.
        await new Promise((resolve) => setTimeout(resolve, 16))
        await runner(entry)
        setLoadingState((prev) =>
          prev ? { ...prev, completed: i + 1 } : prev,
        )
      }
    } finally {
      setLoadingState(null)
    }
  }

  async function processImageEntry(id, file, targetQuality) {
    try {
      const result = await compressImageFile(file, targetQuality)
      const compressedUrl = URL.createObjectURL(result.blob)

      setImageItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item
          if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl)
          return {
            ...item,
            status: 'done',
            compressedSize: result.blob.size,
            compressedBlob: result.blob,
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
      setImageItems((prev) =>
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

  function handleImageFilesSelected(fileList) {
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
        compressedBlob: null,
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

    setImageItems((prev) => [...newEntries, ...prev])
    runBatch(newEntries, 'Compressing images', (entry) =>
      processImageEntry(entry.id, entry.file, quality),
    )
  }

  function handleRecompressImages() {
    const snapshot = imageItems
    setImageItems((prev) =>
      prev.map((item) => ({ ...item, status: 'processing', error: null })),
    )
    runBatch(snapshot, 'Compressing images', (item) =>
      processImageEntry(item.id, item.file, quality),
    )
  }

  function handleRemoveImage(id) {
    setImageItems((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target) revokeItemUrls(target)
      return prev.filter((item) => item.id !== id)
    })
  }

  function handleClearImages() {
    setImageItems((prev) => {
      prev.forEach(revokeItemUrls)
      return []
    })
  }

  async function processSoundEntry(id, file, targetBitrate) {
    try {
      const result = await compressSoundFile(file, targetBitrate)
      const compressedUrl = URL.createObjectURL(result.blob)

      setSoundItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item
          if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl)
          return {
            ...item,
            status: 'done',
            compressedSize: result.blob.size,
            compressedBlob: result.blob,
            compressedUrl,
            outputName: result.outputName,
            format: result.format,
            duration: result.duration,
            sampleRate: result.sampleRate,
            channels: result.channels,
            bitrateUsed: targetBitrate,
            error: null,
          }
        }),
      )
    } catch (err) {
      setSoundItems((prev) =>
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

  function handleSoundFilesSelected(fileList) {
    const validFiles = fileList.filter(isAudioFile)
    if (validFiles.length === 0) return

    const newEntries = validFiles.map((file) => ({
      id: createItemId(),
      file,
      outputName: file.name,
      format: 'MP3',
      originalSize: file.size,
      compressedSize: 0,
      compressedBlob: null,
      compressedUrl: null,
      duration: 0,
      sampleRate: 0,
      channels: 2,
      bitrateUsed: bitrate,
      status: 'processing',
      error: null,
    }))

    setSoundItems((prev) => [...newEntries, ...prev])
    runBatch(newEntries, 'Compressing sound', (entry) =>
      processSoundEntry(entry.id, entry.file, bitrate),
    )
  }

  function handleRecompressSounds() {
    const snapshot = soundItems
    setSoundItems((prev) =>
      prev.map((item) => ({ ...item, status: 'processing', error: null })),
    )
    runBatch(snapshot, 'Compressing sound', (item) =>
      processSoundEntry(item.id, item.file, bitrate),
    )
  }

  function handleRemoveSound(id) {
    setSoundItems((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target) revokeItemUrls(target)
      return prev.filter((item) => item.id !== id)
    })
  }

  function handleClearSounds() {
    setSoundItems((prev) => {
      prev.forEach(revokeItemUrls)
      return []
    })
  }

  const isCompressing = loadingState !== null

  return (
    <MotionConfig reducedMotion="user">
      <div
        inert={isCompressing || undefined}
        className="flex min-h-screen flex-col bg-bg text-ink"
      >
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
          {currentPage === 'image' && (
            <CompressImagePage
              items={imageItems}
              quality={quality}
              onQualityChange={setQuality}
              onFilesSelected={handleImageFilesSelected}
              onRecompressAll={handleRecompressImages}
              onRemoveItem={handleRemoveImage}
              onClearAll={handleClearImages}
            />
          )}

          {currentPage === 'sound' && (
            <CompressSoundPage
              items={soundItems}
              bitrate={bitrate}
              onBitrateChange={setBitrate}
              onFilesSelected={handleSoundFilesSelected}
              onRecompressAll={handleRecompressSounds}
              onRemoveItem={handleRemoveSound}
              onClearAll={handleClearSounds}
            />
          )}

          {currentPage === 'about' && <AboutPage onNavigate={handleNavigate} />}

          {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        </main>

        <footer className="mx-auto w-full max-w-4xl px-6 pb-4 text-center sm:px-8">
          <div className="border-t border-border pt-3">
            <p className="font-mono text-[11px] leading-none text-muted">
              © {CURRENT_YEAR} RFT Compress · Local Image &amp; Sound
            </p>
          </div>
        </footer>
      </div>

      <LoadingOverlay
        visible={isCompressing}
        label={loadingState?.label}
        completedCount={loadingState?.completed ?? 0}
        totalCount={loadingState?.total ?? 0}
        currentFileName={loadingState?.currentName}
      />
    </MotionConfig>
  )
}

export default App
