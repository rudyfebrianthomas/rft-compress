import { AnimatePresence, motion } from 'motion/react'
import { DropZone } from '../components/DropZone.jsx'
import { ImageResultCard } from '../components/ImageResultCard.jsx'
import { formatBytes, getCompressionStats } from '../utils/compressImage.js'

export function HomePage({
  items,
  quality,
  onQualityChange,
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

  const hasStaleQuality = items.some(
    (item) => item.status === 'done' && item.qualityUsed !== quality,
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="space-y-10"
    >
      <section className="space-y-4">
        <h1 className="max-w-3xl text-4xl font-medium tracking-[-0.04em] text-ink sm:text-5xl">
          Compress images to WebP and GIF
        </h1>
        <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
          Shrink PNG, JPG, WebP, BMP, and animated GIF files directly in your
          browser with zero server uploads.
        </p>
      </section>

      <section aria-label="Upload and quality settings" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface px-5 py-3.5">
          <div className="flex flex-wrap items-center gap-4">
            <label
              htmlFor="quality-range"
              className="text-sm font-medium text-ink"
            >
              Compression quality
            </label>
            <input
              id="quality-range"
              type="range"
              min="30"
              max="95"
              step="5"
              value={Math.round(quality * 100)}
              onChange={(e) => onQualityChange(Number(e.target.value) / 100)}
              className="h-2 w-40 cursor-pointer accent-accent sm:w-52"
            />
            <span className="rounded border border-border bg-bg px-2.5 py-1 font-mono text-sm font-medium text-accent tabular-nums">
              {Math.round(quality * 100)}%
            </span>
          </div>

          {hasStaleQuality && (
            <button
              type="button"
              onClick={onRecompressAll}
              className="inline-flex min-h-[44px] cursor-pointer items-center rounded-lg border border-accent/50 bg-bg px-4 text-sm font-medium text-accent transition-colors hover:bg-accent hover:text-accent-ink active:scale-[0.98]"
            >
              Apply {Math.round(quality * 100)}% to existing images
            </button>
          )}
        </div>

        <DropZone onFilesSelected={onFilesSelected} />
      </section>

      {items.length > 0 && (
        <section aria-label="Compressed images" className="space-y-5">
          <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-medium tracking-tight text-ink">
                Uploaded images ({items.length})
              </h2>
              {overallStats ? (
                <p className="font-mono text-sm text-muted tabular-nums">
                  {formatBytes(totalOriginal)} → {formatBytes(totalCompressed)} ·{' '}
                  <span
                    className={
                      overallStats.savedBytes > 0 ? 'text-accent' : 'text-muted'
                    }
                  >
                    {overallStats.description}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-muted">Processing uploaded files…</p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadAll}
                disabled={readyItems.length === 0}
                className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-ink transition-transform hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Download all ({readyItems.length})
              </button>
              <button
                type="button"
                onClick={onClearAll}
                className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg border border-border bg-bg px-4 text-sm font-medium text-ink transition-colors hover:border-white/30 hover:bg-surface-elevated active:scale-[0.98]"
              >
                Clear all
              </button>
            </div>
          </div>

          <div className="space-y-3">
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
