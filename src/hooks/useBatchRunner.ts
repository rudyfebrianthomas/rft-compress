import { useCallback, useState } from 'react'
import type { BaseMediaItem, LoadingState } from '../types.ts'

export function useBatchRunner() {
  const [loadingState, setLoadingState] = useState<LoadingState | null>(null)

  const runBatch = useCallback(
    async <T extends BaseMediaItem>(
      entries: T[],
      label: string,
      runner: (entry: T) => Promise<void>,
    ): Promise<void> => {
      setLoadingState({
        label,
        total: entries.length,
        completed: 0,
        currentName: entries[0]?.outputName ?? '',
      })

      try {
        for (let i = 0; i < entries.length; i++) {
          const entry = entries[i]
          setLoadingState((prev) =>
            prev ? { ...prev, currentName: entry.outputName } : prev,
          )
          // Yield a frame so the full-screen overlay paints progress before WASM/CPU work.
          await new Promise((resolve) => setTimeout(resolve, 16))
          await runner(entry)
          setLoadingState((prev) =>
            prev ? { ...prev, completed: i + 1 } : prev,
          )
        }
      } finally {
        setLoadingState(null)
      }
    },
    [],
  )

  return { loadingState, runBatch }
}
