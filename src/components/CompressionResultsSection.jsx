import { AnimatePresence } from 'motion/react'
import { useState } from 'react'
import { downloadItemsAsZip } from '../utils/download.js'
import { formatBytes, getCompressionStats } from '../utils/format.js'

export function CompressionResultsSection({
  items,
  zipFilename,
  ariaLabel,
  renderItem,
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

  async function handleDownloadAll() {
    if (isZipping || readyItems.length === 0) return
    setIsZipping(true)
    try {
      await downloadItemsAsZip(readyItems, zipFilename)
    } finally {
      setIsZipping(false)
    }
  }

  return (
    <section aria-label={ariaLabel} className="space-y-4">
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
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-accent px-5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35"
          >
            {isZipping
              ? 'Zipping…'
              : `Download all (${readyItems.length}) · .zip`}
          </button>
          <button
            type="button"
            onClick={onClearAll}
            className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full px-4 text-sm font-medium text-muted transition-colors hover:bg-surface hover:text-ink active:scale-[0.98]"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface/50">
        <AnimatePresence initial={false}>
          {items.map(renderItem)}
        </AnimatePresence>
      </div>
    </section>
  )
}
