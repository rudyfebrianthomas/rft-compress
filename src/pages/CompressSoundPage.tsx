import { motion } from 'motion/react'
import { CompressionResultsSection } from '../components/CompressionResultsSection.tsx'
import { DropZone } from '../components/DropZone.tsx'
import { SoundResultCard } from '../components/SoundResultCard.tsx'
import type { SoundItem } from '../types.ts'

const BITRATE_OPTIONS = [64, 96, 128, 192] as const

interface CompressSoundPageProps {
  items: SoundItem[]
  bitrate: number
  duplicateNotice?: string
  onBitrateChange: (bitrate: number) => void
  onFilesSelected: (files: File[]) => void
  onRecompressAll: () => void
  onRemoveItem: (id: string) => void
  onClearAll: () => void
}

export function CompressSoundPage({
  items,
  bitrate,
  duplicateNotice = '',
  onBitrateChange,
  onFilesSelected,
  onRecompressAll,
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
          Compress sound to MP3
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted">
          Shrink WAV, MP3, OGG, FLAC, and M4A audio in your browser. Nothing is
          uploaded.
        </p>
      </section>

      <section aria-label="Sound upload and bitrate" className="space-y-3">
        <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
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
              Re-apply
            </button>
          )}
        </div>

        <DropZone
          onFilesSelected={onFilesSelected}
          accept="audio/*,.mp3,.wav,.ogg,.flac,.m4a,.aac,.webm"
          ariaLabel="Upload audio files by dragging and dropping or clicking to browse"
          idleTitle="Drop audio files here or browse"
          dragTitle="Drop audio files to compress"
          formatHint="WAV · MP3 · OGG · FLAC · M4A · AAC → MP3"
          buttonLabel="Select audio"
        />

        {duplicateNotice && (
          <p role="status" className="font-mono text-xs text-muted">
            {duplicateNotice}
          </p>
        )}
      </section>

      {items.length > 0 && (
        <CompressionResultsSection
          items={items}
          zipFilename="compressed-sound.zip"
          ariaLabel="Compressed audio files"
          onClearAll={onClearAll}
          renderItem={(item) => (
            <SoundResultCard
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
