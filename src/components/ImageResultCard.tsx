import { RESULTS_TEXT } from '../constants/compression.ts'
import type { ImageItem } from '../types.ts'
import { ResultRow } from './ResultRow.tsx'

interface ImageResultCardProps {
  item: ImageItem
  onRemove: (id: string) => void
  onDownloaded?: (id: string) => void
}

export function ImageResultCard({
  item,
  onRemove,
  onDownloaded,
}: ImageResultCardProps) {
  const meta =
    item.width > 0 && item.height > 0 ? `${item.width}×${item.height}` : ''

  const media = (
    <div className="checker-bg relative size-16 shrink-0 overflow-hidden rounded-xl border border-border sm:size-20">
      {item.previewUrl ? (
        <img
          src={item.previewUrl}
          alt={item.outputName}
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
      ) : (
        <div className="grid size-full place-items-center font-mono text-xs text-muted">
          ...
        </div>
      )}
    </div>
  )

  return (
    <ResultRow
      item={item}
      meta={meta}
      media={media}
      onRemove={onRemove}
      onDownloaded={onDownloaded}
      processingLabel={RESULTS_TEXT.imageProcessingLabel}
      fallbackError={RESULTS_TEXT.imageErrorLabel}
    />
  )
}
