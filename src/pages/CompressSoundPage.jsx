import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { DropZone } from '../components/DropZone.jsx'
import { SoundResultCard } from '../components/SoundResultCard.jsx'
import { downloadItemsAsZip } from '../utils/download.js'
import { formatBytes, getCompressionStats } from '../utils/format.js'

const BITRATE_OPTIONS = [64, 96, 128, 192]

export function CompressSoundPage({
  items,
  bitrate,
  duplicateNotice = '',
  onBitrateChange,
  onFilesSelected,
  onRecompressAll,
  onRemoveItem,
  onClearAll,
}) {
  const [isZipping, setIsZipping] = useState(false)
  const readyItems = items.filter((item) => item.status === 'done')
  const totalOriginal = readyItems.reduce((sum, item) => sum + item.originalSize, 0)
  const totalCompressed = readyItems.reduce(
    (sum, item) => sum + item.compressedSize,
    0,
  )
  const overallStats =
    readyItems.length > 0
      ? getCompressionStats(totalOriginal, totalCompressed)
      : null

  const hasStaleBitrate = items.some(
    (item) => item.status === 'done' && item.bitrateUsed !== bitrate,
  )

  async function handleDownloadAll() {
    if (isZipping || readyItems.length === 0) return
    setIsZipping(true)
    try {
      await downloadItemsAsZip(readyItems, 'compressed-sound.zip')
    } finally {
      setIsZipping(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-10"
    >
      <section className="space-y-2.5">
        <h1 className="font-display text-3xl font-medium tracking-[-0.03em] text-ink sm:text-5xl">
          Compress sound to MP3
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted">
          Shrink WAV, MP3, OGG, FLAC, and M4A audio in your browser. Nothing is
          uploaded.
        </p>
      </section>

      <section aria-label="Sound upload and bitrate" className="space-y-3">
        <div className="flex min-h-[44px] flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted">Bitrate</span>
            <div
              role="group"
              aria-label="MP3 bitrate"
              className="inline-flex items-center rounded-full border border-border bg-surface/60 p-1"
            >
              {BITRATE_OPTIONS.map((option) => {
                const active = bitrate === option
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => onBitrateChange(option)}
                    aria-pressed={active}
                    className={`min-h-[34px] cursor-pointer rounded-full px-3 font-mono text-xs font-medium transition-colors ${
                      active
                        ? 'bg-accent text-accent-ink'
                        : 'text-muted hover:text-ink'
                    }`}
                  >
                    {option}k
                  </button>
                )
              })}
            </div>
          </div>

          {hasStaleBitrate && (
            <button
              type="button"
              onClick={onRecompressAll}
              className="inline-flex min-h-[36px] cursor-pointer items-center rounded-full border border-border-strong px-3.5 text-xs font-medium text-ink transition-colors hover:bg-surface active:scale-[0.98]"
            >
              Re-apply
            </button>
          )}
        </div>

        <DropZone
          onFilesSelected={onFilesSelected}
          accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a,.aac,.webm"
          ariaLabel="Upload audio files by dragging and dropping or clicking to browse"
          idleTitle="Drop audio files here or browse"
          dragTitle="Drop audio files to compress"
          formatHint="WAV · MP3 · OGG · FLAC · M4A · AAC → MP3"
          buttonLabel="Select audio"
        />

        {duplicateNotice && (
          <p role="status" className="font-mono text-xs text-muted">
            {duplicateNotice}
          </p>
        )}
      </section>

      {items.length > 0 && (
        <section aria-label="Compressed audio files" className="space-y-4">
          <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-lg font-medium tracking-tight text-ink">
                Results ({items.length})
              </h2>
              {overallStats ? (
                <p className="font-mono text-xs text-muted tabular-nums sm:text-sm">
                  {formatBytes(totalOriginal)} →{' '}
                  <strong className="font-medium text-ink">
                    {formatBytes(totalCompressed)}
                  </strong>{' '}
                  ·{' '}
                  <span
                    className={
                      overallStats.savedBytes > 0 ? 'text-ink' : 'text-muted'
                    }
                  >
                    {overallStats.description}
                  </span>
                </p>
              ) : (
                <p className="text-xs text-muted sm:text-sm">
                  No compressed files available.
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadAll}
                disabled={isZipping || readyItems.length === 0}
                className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35"
              >
                {isZipping
                  ? 'Zipping…'
                  : `Download all (${readyItems.length}) · .zip`}
              </button>
              <button
                type="button"
                onClick={onClearAll}
                className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-ink active:scale-[0.98]"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface/50">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <SoundResultCard
                  key={item.id}
                  item={item}
                  onRemove={onRemoveItem}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}
    </motion.div>
  )
}
