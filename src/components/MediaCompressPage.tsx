import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import type { BaseMediaItem } from '../types.ts'
import { CompressionResultsSection } from './CompressionResultsSection.tsx'
import { DropZone } from './DropZone.tsx'

interface DropZoneCopy {
  accept: string
  ariaLabel: string
  idleTitle: string
  dragTitle: string
  formatHint: string
  buttonLabel: string
}

interface MediaCompressPageProps<T extends BaseMediaItem> {
  title: string
  subtitle: string
  sectionAriaLabel: string
  controls: ReactNode
  hasStaleSetting: boolean
  reapplyLabel: string
  dropZone: DropZoneCopy
  items: T[]
  zipFilename: string
  resultsAriaLabel: string
  duplicateNotice?: string
  uploadError?: string
  onFilesSelected: (files: File[]) => void
  onRecompressAll: () => void
  onMarkDownloaded?: (ids: string[]) => void
  onClearAll: () => void
  renderItem: (item: T) => ReactNode
}

export function MediaCompressPage<T extends BaseMediaItem>({
  title,
  subtitle,
  sectionAriaLabel,
  controls,
  hasStaleSetting,
  reapplyLabel,
  dropZone,
  items,
  zipFilename,
  resultsAriaLabel,
  duplicateNotice = '',
  uploadError = '',
  onFilesSelected,
  onRecompressAll,
  onMarkDownloaded,
  onClearAll,
  renderItem,
}: MediaCompressPageProps<T>) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="space-y-10"
    >
      <section className="space-y-2.5">
        <h1 className="font-display text-3xl font-medium tracking-[-0.03em] text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted">
          {subtitle}
        </p>
      </section>

      <section aria-label={sectionAriaLabel} className="space-y-3">
        <div className="flex min-h-11 flex-wrap items-center justify-between gap-3">
          {controls}

          {hasStaleSetting && (
            <button
              type="button"
              onClick={onRecompressAll}
              className="inline-flex min-h-9 cursor-pointer items-center rounded-full border border-border-strong px-3.5 text-xs font-medium text-ink transition-colors hover:bg-surface active:scale-[0.98]"
            >
              {reapplyLabel}
            </button>
          )}
        </div>

        <DropZone onFilesSelected={onFilesSelected} {...dropZone} />

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
          zipFilename={zipFilename}
          ariaLabel={resultsAriaLabel}
          onClearAll={onClearAll}
          onDownloaded={onMarkDownloaded}
          renderItem={renderItem}
        />
      )}
    </motion.div>
  )
}
