import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { formatDuration } from '../utils/compressSound.js'
import { triggerUrlDownload } from '../utils/download.js'
import { formatBytes, getCompressionStats } from '../utils/format.js'

export function SoundResultCard({ item, onRemove }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const isReady = item.status === 'done'
  const isError = item.status === 'error'
  const stats = isReady
    ? getCompressionStats(item.originalSize, item.compressedSize)
    : null

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
  }, [item.compressedUrl])

  function handleTogglePlay() {
    const audio = audioRef.current
    if (!audio || !item.compressedUrl) return
    if (audio.paused) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }

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
      {item.compressedUrl && (
        <audio
          ref={audioRef}
          src={item.compressedUrl}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          className="sr-only"
        />
      )}

      <div className="flex min-w-0 items-center gap-4">
        <button
          type="button"
          onClick={handleTogglePlay}
          disabled={!isReady}
          aria-label={
            isPlaying
              ? `Pause ${item.outputName}`
              : `Play ${item.outputName}`
          }
          title={isPlaying ? 'Pause preview' : 'Play preview'}
          className="grid size-14 shrink-0 cursor-pointer place-items-center rounded-xl border border-border bg-bg text-ink transition-colors hover:border-border-strong hover:bg-surface-elevated active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40 sm:size-16"
        >
          {isPlaying ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <rect x="6" y="5" width="4" height="14" rx="1" />
              <rect x="14" y="5" width="4" height="14" rx="1" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M8 5.5v13l11-6.5-11-6.5Z" />
            </svg>
          )}
        </button>

        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[15px] font-medium text-ink sm:text-base">
              {item.outputName}
            </h3>
            <span className="rounded-full border border-border bg-bg px-2 py-0.5 font-mono text-[11px] font-medium text-ink">
              {item.format}
            </span>
            {item.duration > 0 && (
              <span className="font-mono text-xs text-muted">
                {formatDuration(item.duration)} ·{' '}
                {Math.round(item.sampleRate / 100) / 10} kHz ·{' '}
                {item.channels === 1 ? 'Mono' : 'Stereo'}
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
            <p className="text-xs text-muted">Encoding MP3…</p>
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
              {item.error || 'Could not compress this audio file.'}
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
