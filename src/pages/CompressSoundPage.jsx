import { AnimatePresence, motion } from 'motion/react'
import { DropZone } from '../components/DropZone.jsx'
import { SoundResultCard } from '../components/SoundResultCard.jsx'
import { formatBytes, getCompressionStats } from '../utils/format.js'

const BITRATE_OPTIONS = [64, 96, 128, 192]

export function CompressSoundPage({
  items,
  bitrate,
  onBitrateChange,
  onFilesSelected,
  onRecompressAll,
  onRemoveItem,
  onClearAll,
}) {
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

  function handleDownloadAll() {
    readyItems.forEach((item, idx) => {
      setTimeout(() => {
        const link = document.createElement('a')
        link.href = item.compressedUrl
        link.download = item.outputName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }, idx * 140)
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-10"
    >
      <section className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2.5">
          <h1 className="font-display text-3xl font-medium tracking-[-0.03em] text-ink sm:text-5xl">
            Compress sound to MP3
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted">
            Shrink WAV, MP3, OGG, FLAC, and M4A audio in your browser. Nothing is
            uploaded.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
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
      </section>

      <section aria-label="Sound upload dropzone">
        <DropZone
          onFilesSelected={onFilesSelected}
          accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a,.aac,.webm"
          ariaLabel="Upload audio files by dragging and dropping or clicking to browse"
          idleTitle="Drop audio files here or browse"
          dragTitle="Drop audio files to compress"
          formatHint="WAV · MP3 · OGG · FLAC · M4A · AAC → MP3"
          buttonLabel="Select audio"
        />
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
                  Encoding uploaded audio…
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadAll}
                disabled={readyItems.length === 0}
                className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35"
              >
                Download all ({readyItems.length})
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
