import { MotionConfig } from 'motion/react'
import { useState } from 'react'
import { Header } from './components/Header.tsx'
import { LoadingOverlay } from './components/LoadingOverlay.tsx'
import {
  IMAGE_COMPRESS_CONFIG,
  SOUND_COMPRESS_CONFIG,
} from './constants/compression.ts'
import { SITE_TEXT } from './constants/navigation.ts'
import { useBatchRunner } from './hooks/useBatchRunner.ts'
import { useHashRoute } from './hooks/useHashRoute.ts'
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

function App() {
  const { currentPage, navigate } = useHashRoute()
  const { theme, toggleTheme } = useTheme()
  const { loadingState, runBatch } = useBatchRunner()

  const [quality, setQuality] = useState(0.8)
  const [bitrate, setBitrate] = useState(128)

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
        <Header
          currentPage={currentPage}
          onNavigate={navigate}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main
          id="main-content"
          className="mx-auto w-full max-w-4xl flex-1 px-6 py-12 sm:px-8 sm:py-16"
        >
          {currentPage === 'image' && (
            <CompressImagePage
              items={imageQueue.items}
              quality={quality}
              duplicateNotice={imageQueue.duplicateNotice}
              uploadError={imageQueue.uploadError}
              onQualityChange={setQuality}
              onFilesSelected={imageQueue.handleFilesSelected}
              onRecompressAll={imageQueue.handleRecompressAll}
              onRemoveItem={imageQueue.handleRemoveItem}
              onClearAll={imageQueue.handleClearAll}
            />
          )}

          {currentPage === 'sound' && (
            <CompressSoundPage
              items={soundQueue.items}
              bitrate={bitrate}
              duplicateNotice={soundQueue.duplicateNotice}
              uploadError={soundQueue.uploadError}
              onBitrateChange={setBitrate}
              onFilesSelected={soundQueue.handleFilesSelected}
              onRecompressAll={soundQueue.handleRecompressAll}
              onRemoveItem={soundQueue.handleRemoveItem}
              onClearAll={soundQueue.handleClearAll}
            />
          )}

          {currentPage === 'about' && <AboutPage onNavigate={navigate} />}

          {currentPage === 'home' && <HomePage onNavigate={navigate} />}
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

export default App
