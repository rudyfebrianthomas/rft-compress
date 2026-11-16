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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
    >
      <div className="flex min-w-0 items-center gap-4">
        <div className="checker-bg relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-border sm:h-24 sm:w-24">
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

        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-medium text-ink sm:text-lg">
              {item.outputName}
            </h3>
            <span className="rounded border border-border bg-bg px-2 py-0.5 font-mono text-xs font-medium text-accent">
              {item.format}
            </span>
            {item.width > 0 && item.height > 0 && (
              <span className="font-mono text-xs text-muted">
                {item.width}×{item.height}
                {item.frameCount > 1 ? ` · ${item.frameCount} frames` : ''}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-sm tabular-nums">
            <span className="text-muted">
              Original: <strong className="font-medium text-ink">{formatBytes(item.originalSize)}</strong>
            </span>
            {isReady && (
              <>
                <span aria-hidden="true" className="text-muted">
                  →
                </span>
                <span className="text-muted">
                  Compressed:{' '}
                  <strong className="font-medium text-ink">
                    {formatBytes(item.compressedSize)}
                  </strong>
                </span>
              </>
            )}
          </div>

          {item.status === 'processing' && (
            <p className="text-sm text-muted">Compressing in browser…</p>
          )}

          {isReady && stats && (
            <p
              className={`text-sm font-medium ${
                stats.savedBytes > 0 ? 'text-accent' : 'text-muted'
              }`}
            >
              {stats.description}
            </p>
          )}

          {isError && (
            <p className="text-sm text-error">
              {item.error || 'Could not compress this image.'}
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
        <button
          type="button"
          onClick={handleDownload}
          disabled={!isReady}
          className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg bg-accent px-4 text-sm font-medium text-accent-ink transition-transform hover:brightness-95 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Download
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.outputName}`}
          className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-lg border border-border bg-bg px-4 text-sm font-medium text-ink transition-colors hover:border-border-strong hover:bg-surface-elevated active:scale-[0.98]"
        >
          Remove
        </button>
      </div>
    </motion.article>
  )
}
