import { motion } from 'motion/react'
import { CompressionResultsSection } from '../components/CompressionResultsSection.tsx'
import { DropZone } from '../components/DropZone.tsx'
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-10"
    >
      <section className="space-y-2.5">
        <h1 className="font-display text-3xl font-medium tracking-[-0.03em] text-ink sm:text-5xl">
          {SOUND_COMPRESS_CONFIG.title}
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted">
          {SOUND_COMPRESS_CONFIG.subtitle}
        </p>
      </section>

      <section aria-label="Sound upload and bitrate" className="space-y-3">
        <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
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

          {hasStaleBitrate && (
            <button
              type="button"
              onClick={onRecompressAll}
              className="inline-flex min-h-9 cursor-pointer items-center rounded-full border border-border-strong px-3.5 text-xs font-medium text-ink transition-colors hover:bg-surface active:scale-[0.98]"
            >
              {SOUND_COMPRESS_CONFIG.reapplyLabel}
            </button>
          )}
        </div>

        <DropZone
          onFilesSelected={onFilesSelected}
          {...SOUND_COMPRESS_CONFIG.dropZone}
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
          zipFilename={SOUND_COMPRESS_CONFIG.zipFilename}
          ariaLabel={SOUND_COMPRESS_CONFIG.resultsAriaLabel}
          onClearAll={onClearAll}
          onDownloaded={onMarkDownloaded}
          renderItem={(item) => (
            <SoundResultCard
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
