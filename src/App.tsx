import { MotionConfig } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Redirect, Route, Router, Switch, useLocation } from 'wouter'
import { Header } from './components/Header.tsx'
import { LoadingOverlay } from './components/LoadingOverlay.tsx'
import {
  IMAGE_COMPRESS_CONFIG,
  SOUND_COMPRESS_CONFIG,
} from './constants/compression.ts'
import { PAGE_ROUTES, SITE_TEXT } from './constants/navigation.ts'
import { useBatchRunner } from './hooks/useBatchRunner.ts'
import { useMediaQueue } from './hooks/useMediaQueue.ts'
import { useTheme } from './hooks/useTheme.ts'
import { AboutPage } from './pages/AboutPage.tsx'
import { CompressImagePage } from './pages/CompressImagePage.tsx'
import { CompressSoundPage } from './pages/CompressSoundPage.tsx'
import { HomePage } from './pages/HomePage.tsx'
import { compressImageFile, isImageFile } from './utils/compressImage.ts'
import { compressSoundFile, isAudioFile } from './utils/compressSound.ts'
import {
  applyImageResult,
  applySoundResult,
  createPendingImageItem,
  createPendingSoundItem,
} from './utils/mediaItems.ts'

const CURRENT_YEAR = new Date().getFullYear()
const ROUTER_BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

function AppShell() {
  const [location] = useLocation()
  const isFirstRenderRef = useRef(true)
  const { theme, toggleTheme } = useTheme()
  const { loadingState, runBatch } = useBatchRunner()

  const [quality, setQuality] = useState(0.8)
  const [bitrate, setBitrate] = useState(128)

  useEffect(() => {
    if (isFirstRenderRef.current) {
      isFirstRenderRef.current = false
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [location])

  const imageQueue = useMediaQueue({
    setting: quality,
    loadingLabel: IMAGE_COMPRESS_CONFIG.loadingLabel,
    allowedFormats: IMAGE_COMPRESS_CONFIG.allowedFormatsLabel,
    isSupported: isImageFile,
    createPending: createPendingImageItem,
    compress: compressImageFile,
    applyResult: applyImageResult,
    runBatch,
  })

  const soundQueue = useMediaQueue({
    setting: bitrate,
    loadingLabel: SOUND_COMPRESS_CONFIG.loadingLabel,
    allowedFormats: SOUND_COMPRESS_CONFIG.allowedFormatsLabel,
    isSupported: isAudioFile,
    createPending: createPendingSoundItem,
    compress: compressSoundFile,
    applyResult: applySoundResult,
    runBatch,
  })

  const isCompressing = loadingState !== null

  return (
    <MotionConfig reducedMotion="user">
      <div
        inert={isCompressing || undefined}
        className="flex min-h-screen flex-col bg-bg text-ink"
      >
        <Header theme={theme} onToggleTheme={toggleTheme} />

        <main
          id="main-content"
          className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 sm:px-8 sm:py-16"
        >
          <Switch>
            <Route path={PAGE_ROUTES.home}>
              <HomePage />
            </Route>
            <Route path="/home">
              <Redirect to={PAGE_ROUTES.home} />
            </Route>
            <Route path={PAGE_ROUTES.image}>
              <CompressImagePage
                items={imageQueue.items}
                quality={quality}
                duplicateNotice={imageQueue.duplicateNotice}
                uploadError={imageQueue.uploadError}
                onQualityChange={setQuality}
                onFilesSelected={imageQueue.handleFilesSelected}
                onRecompressAll={imageQueue.handleRecompressAll}
                onMarkDownloaded={imageQueue.handleMarkDownloaded}
                onRemoveItem={imageQueue.handleRemoveItem}
                onClearAll={imageQueue.handleClearAll}
              />
            </Route>
            <Route path="/images">
              <Redirect to={PAGE_ROUTES.image} />
            </Route>
            <Route path={PAGE_ROUTES.sound}>
              <CompressSoundPage
                items={soundQueue.items}
                bitrate={bitrate}
                duplicateNotice={soundQueue.duplicateNotice}
                uploadError={soundQueue.uploadError}
                onBitrateChange={setBitrate}
                onFilesSelected={soundQueue.handleFilesSelected}
                onRecompressAll={soundQueue.handleRecompressAll}
                onMarkDownloaded={soundQueue.handleMarkDownloaded}
                onRemoveItem={soundQueue.handleRemoveItem}
                onClearAll={soundQueue.handleClearAll}
              />
            </Route>
            <Route path="/audio">
              <Redirect to={PAGE_ROUTES.sound} />
            </Route>
            <Route path={PAGE_ROUTES.about}>
              <AboutPage />
            </Route>
            <Route>
              <Redirect to={PAGE_ROUTES.home} />
            </Route>
          </Switch>
        </main>

        <footer className="mx-auto w-full max-w-4xl px-6 pb-4 text-center sm:px-8">
          <div className="border-t border-border pt-3">
            <p className="font-mono text-[11px] leading-none text-muted">
              © {CURRENT_YEAR} {SITE_TEXT.brand} · {SITE_TEXT.footerTagline}
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

function App() {
  return (
    <Router base={ROUTER_BASE}>
      <AppShell />
    </Router>
  )
}

export default App
