import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { DropZone } from '../components/DropZone.jsx'
import { ImageResultCard } from '../components/ImageResultCard.jsx'
import { downloadItemsAsZip } from '../utils/download.js'
import { formatBytes, getCompressionStats } from '../utils/format.js'

export function CompressImagePage({
  items,
  quality,
  duplicateNotice = '',
  onQualityChange,
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

  const hasStaleQuality = items.some(
    (item) => item.status === 'done' && item.qualityUsed !== quality,
  )

  async function handleDownloadAll() {
    if (isZipping || readyItems.length === 0) return
    setIsZipping(true)
    try {
      await downloadItemsAsZip(readyItems, 'compressed-images.zip')
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
          Compress images to WebP and GIF
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted">
          Fast, private compression inside your browser. Nothing is uploaded.
        </p>
      </section>

      <section aria-label="Image upload and quality" className="space-y-3">
        <div className="flex min-h-[44px] flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <label
              htmlFor="quality-range"
              className="text-sm font-medium text-muted"
            >
              Quality
            </label>
            <input
              id="quality-range"
              type="range"
              min="30"
              max="95"
              step="5"
              value={Math.round(quality * 100)}
              onChange={(e) => onQualityChange(Number(e.target.value) / 100)}
              className="h-1.5 w-36 cursor-pointer accent-accent sm:w-44"
            />
            <span className="min-w-[3.25rem] text-right font-mono text-sm font-medium text-ink tabular-nums">
              {Math.round(quality * 100)}%
            </span>
          </div>

          {hasStaleQuality && (
            <button
              type="button"
              onClick={onRecompressAll}
              className="inline-flex min-h-[36px] cursor-pointer items-center rounded-full border border-border-strong px-3.5 text-xs font-medium text-ink transition-colors hover:bg-surface active:scale-[0.98]"
            >
              Re-apply
            </button>
          )}
        </div>

        <DropZone onFilesSelected={onFilesSelected} />

        {duplicateNotice && (
          <p role="status" className="font-mono text-xs text-muted">
            {duplicateNotice}
          </p>
        )}
      </section>

      {items.length > 0 && (
        <section aria-label="Compressed images" className="space-y-4">
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
                <ImageResultCard
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
