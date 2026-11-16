import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { RESULTS_TEXT } from '../constants/compression.ts'

interface LoadingOverlayProps {
  visible: boolean
  completedCount: number
  totalCount: number
  currentFileName?: string
  label?: string
}

export function LoadingOverlay({
  visible,
  completedCount,
  totalCount,
  currentFileName,
  label = RESULTS_TEXT.defaultLoadingLabel,
}: LoadingOverlayProps) {
  useEffect(() => {
    if (!visible) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-busy="true"
          aria-label={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg/90 px-6 text-center backdrop-blur-xs"
        >
          <div className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-surface p-8">
            <div
              aria-hidden="true"
              className="mx-auto size-9 animate-spin rounded-full border-2 border-border-strong border-t-ink"
            />
            <div className="space-y-1.5">
              <p className="text-lg font-medium tracking-tight text-ink">
                {label}
              </p>
              <p className="font-mono text-xs text-muted tabular-nums">
                {completedCount} / {totalCount} {RESULTS_TEXT.completedSuffix}
              </p>
              {currentFileName && (
                <p className="truncate font-mono text-xs text-muted">
                  {currentFileName}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
