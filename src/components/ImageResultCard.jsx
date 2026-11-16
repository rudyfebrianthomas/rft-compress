import { motion } from 'motion/react'
import { formatBytes, getCompressionStats } from '../utils/compressImage.js'

export function ImageResultCard({ item, onRemove }) {
  const isReady = item.status === 'done'
  const isError = item.status === 'error'
  const stats = isReady
    ? getCompressionStats(item.originalSize, item.compressedSize)
    : null

  function handleDownload() {
    if (!item.compressedUrl) return
    const link = document.createElement('a')
    link.href = item.compressedUrl
    link.download = item.outputName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="checker-bg relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-border sm:h-20 sm:w-20">
          {item.previewUrl ? (
            <img
              src={item.previewUrl}
              alt={item.outputName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center font-mono text-xs text-muted">
              ...
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[15px] font-medium text-ink sm:text-base">
              {item.outputName}
            </h3>
            <span className="rounded-full border border-border bg-bg px-2 py-0.5 font-mono text-[11px] font-medium text-ink">
              {item.format}
            </span>
            {item.width > 0 && item.height > 0 && (
              <span className="font-mono text-xs text-muted">
                {item.width}×{item.height}
                {item.frameCount > 1 ? ` · ${item.frameCount}f` : ''}
              </span>
            )}
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
            <p className="text-xs text-muted">Compressing…</p>
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
              {item.error || 'Could not compress this image.'}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 self-end sm:self-center">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!isReady}
          className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full bg-accent px-4 text-xs font-medium text-accent-ink transition-opacity hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-35 sm:text-sm"
        >
          Download
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.outputName}`}
          title={`Remove ${item.outputName}`}
          className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full text-muted transition-colors hover:bg-bg hover:text-ink active:scale-[0.96]"
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
