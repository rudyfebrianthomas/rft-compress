import { useEffect, useRef, useState } from 'react'
import type { SoundItem } from '../types.ts'
import { formatDuration } from '../utils/compressSound.ts'
import { ResultRow } from './ResultRow.tsx'

interface SoundResultCardProps {
  item: SoundItem
  onRemove: (id: string) => void
}

export function SoundResultCard({ item, onRemove }: SoundResultCardProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const isReady = item.status === 'done'

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

  const meta =
    item.duration > 0
      ? `${formatDuration(item.duration)} · ${Math.round(item.sampleRate / 100) / 10} kHz · ${item.channels === 1 ? 'Mono' : 'Stereo'}`
      : ''

  const media = (
    <>
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
      <button
        type="button"
        onClick={handleTogglePlay}
        disabled={!isReady}
        aria-label={
          isPlaying ? `Pause ${item.outputName}` : `Play ${item.outputName}`
        }
        title={isPlaying ? 'Pause preview' : 'Play preview'}
        className="grid size-14 shrink-0 cursor-pointer place-items-center rounded-xl border border-border bg-bg text-ink transition-colors hover:border-border-strong hover:bg-surface-elevated active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-40 sm:size-16"
      >
        {isPlaying ? (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 5.5v13l11-6.5-11-6.5Z" />
          </svg>
        )}
      </button>
    </>
  )

  return (
    <ResultRow
      item={item}
      meta={meta}
      media={media}
      onRemove={onRemove}
      processingLabel="Encoding MP3…"
      fallbackError="Could not compress this audio file."
    />
  )
}
