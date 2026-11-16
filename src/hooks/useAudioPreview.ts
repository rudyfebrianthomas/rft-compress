import { useEffect, useRef, useState } from 'react'

export function useAudioPreview(sourceUrl: string | null) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
  }, [sourceUrl])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio || !sourceUrl) return
    if (audio.paused) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }

  return {
    audioRef,
    isPlaying,
    setIsPlaying,
    togglePlay,
  }
}
