import { motion } from 'motion/react'
import { CompressionResultsSection } from '../components/CompressionResultsSection.tsx'
import { DropZone } from '../components/DropZone.tsx'
import { ImageResultCard } from '../components/ImageResultCard.tsx'
import { IMAGE_COMPRESS_CONFIG } from '../constants/compression.ts'
import type { ImageItem } from '../types.ts'

interface CompressImagePageProps {
  items: ImageItem[]
  quality: number
  duplicateNotice?: string
  uploadError?: string
  onQualityChange: (quality: number) => void
  onFilesSelected: (files: File[]) => void
  onRecompressAll: () => void
  onMarkDownloaded?: (ids: string[]) => void
  onRemoveItem: (id: string) => void
  onClearAll: () => void
}

export function CompressImagePage({
  items,
  quality,
  duplicateNotice = '',
  uploadError = '',
  onQualityChange,
  onFilesSelected,
  onRecompressAll,
  onMarkDownloaded,
  onRemoveItem,
  onClearAll,
}: CompressImagePageProps) {
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
          {IMAGE_COMPRESS_CONFIG.title}
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted">
          {IMAGE_COMPRESS_CONFIG.subtitle}
        </p>
      </section>

      <section aria-label="Image upload and quality" className="space-y-3">
        <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <label
              htmlFor="quality-range"
              className="text-sm font-medium text-muted"
            >
              {IMAGE_COMPRESS_CONFIG.qualityLabel}
            </label>
            <input
              id="quality-range"
              type="range"
              min={IMAGE_COMPRESS_CONFIG.qualityMin}
              max={IMAGE_COMPRESS_CONFIG.qualityMax}
              step={IMAGE_COMPRESS_CONFIG.qualityStep}
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
              {IMAGE_COMPRESS_CONFIG.reapplyLabel}
            </button>
          )}
        </div>

        <DropZone
          onFilesSelected={onFilesSelected}
          {...IMAGE_COMPRESS_CONFIG.dropZone}
        />

        {uploadError && (
          <p role="alert" className="font-mono text-xs text-error">
            {uploadError}
          </p>
        )}

        {duplicateNotice && (
          <p role="status" className="font-mono text-xs text-muted">
            {duplicateNotice}
          </p>
        )}
      </section>

      {items.length > 0 && (
        <CompressionResultsSection
          items={items}
          zipFilename={IMAGE_COMPRESS_CONFIG.zipFilename}
          ariaLabel={IMAGE_COMPRESS_CONFIG.resultsAriaLabel}
          onClearAll={onClearAll}
          onDownloaded={onMarkDownloaded}
          renderItem={(item) => (
            <ImageResultCard
              key={item.id}
              item={item}
              onRemove={onRemoveItem}
              onDownloaded={(id) => onMarkDownloaded?.([id])}
            />
          )}
        />
      )}
    </motion.div>
  )
}
