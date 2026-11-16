import { MediaCompressPage } from '../components/MediaCompressPage.tsx'
import { SoundResultCard } from '../components/SoundResultCard.tsx'
import { SOUND_COMPRESS_CONFIG } from '../constants/compression.ts'
import type { SoundItem } from '../types.ts'

interface CompressSoundPageProps {
  items: SoundItem[]
  bitrate: number
  duplicateNotice?: string
  uploadError?: string
  onBitrateChange: (bitrate: number) => void
  onFilesSelected: (files: File[]) => void
  onRecompressAll: () => void
  onMarkDownloaded?: (ids: string[]) => void
  onRemoveItem: (id: string) => void
  onClearAll: () => void
}

export function CompressSoundPage({
  items,
  bitrate,
  duplicateNotice = '',
  uploadError = '',
  onBitrateChange,
  onFilesSelected,
  onRecompressAll,
  onMarkDownloaded,
  onRemoveItem,
  onClearAll,
}: CompressSoundPageProps) {
  const hasStaleBitrate = items.some(
    (item) => item.status === 'done' && item.bitrateUsed !== bitrate,
  )

  const bitrateControls = (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted">
        {SOUND_COMPRESS_CONFIG.bitrateLabel}
      </span>
      <div
        role="group"
        aria-label={SOUND_COMPRESS_CONFIG.bitrateAriaLabel}
        className="inline-flex items-center rounded-full border border-border bg-surface/60 p-1"
      >
        {SOUND_COMPRESS_CONFIG.bitrateOptions.map((option) => {
          const active = bitrate === option
          return (
            <button
              key={option}
              type="button"
              onClick={() => onBitrateChange(option)}
              aria-pressed={active}
              className={`min-h-8.5 cursor-pointer rounded-full px-3 font-mono text-xs font-medium transition-colors ${
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
  )

  return (
    <MediaCompressPage
      title={SOUND_COMPRESS_CONFIG.title}
      subtitle={SOUND_COMPRESS_CONFIG.subtitle}
      sectionAriaLabel={SOUND_COMPRESS_CONFIG.sectionAriaLabel}
      controls={bitrateControls}
      hasStaleSetting={hasStaleBitrate}
      reapplyLabel={SOUND_COMPRESS_CONFIG.reapplyLabel}
      dropZone={SOUND_COMPRESS_CONFIG.dropZone}
      items={items}
      zipFilename={SOUND_COMPRESS_CONFIG.zipFilename}
      resultsAriaLabel={SOUND_COMPRESS_CONFIG.resultsAriaLabel}
      duplicateNotice={duplicateNotice}
      uploadError={uploadError}
      onFilesSelected={onFilesSelected}
      onRecompressAll={onRecompressAll}
      onMarkDownloaded={onMarkDownloaded}
      onClearAll={onClearAll}
      renderItem={(item) => (
        <SoundResultCard
          key={item.id}
          item={item}
          onRemove={onRemoveItem}
          onDownloaded={(id) => onMarkDownloaded?.([id])}
        />
      )}
    />
  )
}
