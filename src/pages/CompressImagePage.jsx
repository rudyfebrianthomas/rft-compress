import { motion } from 'motion/react'
import { CompressionResultsSection } from '../components/CompressionResultsSection.jsx'
import { DropZone } from '../components/DropZone.jsx'
import { ImageResultCard } from '../components/ImageResultCard.jsx'

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
  const hasStaleQuality = items.some(
    (item) => item.status === 'done' && item.qualityUsed !== quality,
  )

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
        <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
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
            <span className="min-w-13 text-right font-mono text-sm font-medium text-ink tabular-nums">
              {Math.round(quality * 100)}%
            </span>
          </div>

          {hasStaleQuality && (
            <button
              type="button"
              onClick={onRecompressAll}
              className="inline-flex min-h-9 cursor-pointer items-center rounded-full border border-border-strong px-3.5 text-xs font-medium text-ink transition-colors hover:bg-surface active:scale-[0.98]"
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
        <CompressionResultsSection
          items={items}
          zipFilename="compressed-images.zip"
          ariaLabel="Compressed images"
          onClearAll={onClearAll}
          renderItem={(item) => (
            <ImageResultCard
              key={item.id}
              item={item}
              onRemove={onRemoveItem}
            />
          )}
        />
      )}
    </motion.div>
  )
}
