import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import type { BaseMediaItem } from '../types.ts'
import { triggerUrlDownload } from '../utils/download.ts'
import { formatBytes, getCompressionStats } from '../utils/format.ts'

interface ResultRowProps {
  item: BaseMediaItem
  meta?: string
  media: ReactNode
  onRemove: (id: string) => void
  processingLabel?: string
  fallbackError?: string
}

export function ResultRow({
  item,
  meta,
  media,
  onRemove,
  processingLabel = 'Compressing…',
  fallbackError = 'Could not compress this file.',
}: ResultRowProps) {
  const isReady = item.status === 'done'
  const isError = item.status === 'error'
  const stats = isReady
    ? getCompressionStats(item.originalSize, item.compressedSize)
    : null

  function handleDownload() {
    if (!item.compressedUrl) return
    triggerUrlDownload(item.compressedUrl, item.outputName)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4"
    >
      <div className="flex min-w-0 items-center gap-4">
        {media}

        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[15px] font-medium text-ink sm:text-base">
              {item.outputName}
            </h3>
            <span className="rounded-full border border-border bg-bg px-2 py-0.5 font-mono text-[11px] font-medium text-ink">
              {item.format}
            </span>
            {meta && <span className="font-mono text-xs text-muted">{meta}</span>}
          </div>

          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 font-mono text-xs text-muted tabular-nums sm:text-[13px]">
            <span>{formatBytes(item.originalSize)}</span>
            {isReady && (
              <>
                <span aria-hidden="true">→</span>
                <strong className="font-medium text-ink">
                  {formatBytes(item.compressedSize)}
                </strong>
              </>
            )}
          </div>

          {item.status === 'processing' && (
            <p className="text-xs text-muted">{processingLabel}</p>
          )}

          {isReady && stats && (
            <p
              className={`text-xs font-medium sm:text-[13px] ${
                stats.savedBytes > 0 ? 'text-ink' : 'text-muted'
              }`}
            >
              {stats.description}
            </p>
          )}

          {isError && (
            <p className="text-xs text-error sm:text-[13px]">
              {item.error || fallbackError}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-center">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!isReady}
          className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-accent px-4 text-xs font-medium text-accent-ink transition-opacity hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 sm:text-sm"
        >
          Download
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.outputName}`}
          title={`Remove ${item.outputName}`}
          className="inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-bg hover:text-ink active:scale-[0.96]"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </motion.article>
  )
}
