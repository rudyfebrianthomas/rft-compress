import { ImageResultCard } from '../components/ImageResultCard.tsx'
import { MediaCompressPage } from '../components/MediaCompressPage.tsx'
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

  const qualityControls = (
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
  )

  return (
    <MediaCompressPage
      title={IMAGE_COMPRESS_CONFIG.title}
      subtitle={IMAGE_COMPRESS_CONFIG.subtitle}
      sectionAriaLabel={IMAGE_COMPRESS_CONFIG.sectionAriaLabel}
      controls={qualityControls}
      hasStaleSetting={hasStaleQuality}
      reapplyLabel={IMAGE_COMPRESS_CONFIG.reapplyLabel}
      dropZone={IMAGE_COMPRESS_CONFIG.dropZone}
      items={items}
      zipFilename={IMAGE_COMPRESS_CONFIG.zipFilename}
      resultsAriaLabel={IMAGE_COMPRESS_CONFIG.resultsAriaLabel}
      duplicateNotice={duplicateNotice}
      uploadError={uploadError}
      onFilesSelected={onFilesSelected}
      onRecompressAll={onRecompressAll}
      onMarkDownloaded={onMarkDownloaded}
      onClearAll={onClearAll}
      renderItem={(item) => (
        <ImageResultCard
          key={item.id}
          item={item}
          onRemove={onRemoveItem}
          onDownloaded={(id) => onMarkDownloaded?.([id])}
        />
      )}
    />
  )
}
