import { motion } from 'motion/react'
import { useRef, useState } from 'react'

export function DropZone({ onFilesSelected, disabled = false }) {
  const inputRef = useRef(null)
  const dragDepthRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  function handleDragEnter(e) {
    e.preventDefault()
    e.stopPropagation()
    dragDepthRef.current += 1
    setIsDragging(true)
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy'
    }
  }

  function handleDragLeave(e) {
    e.preventDefault()
    e.stopPropagation()
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1)
    if (dragDepthRef.current === 0) {
      setIsDragging(false)
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    e.stopPropagation()
    dragDepthRef.current = 0
    setIsDragging(false)
    if (disabled) return

    const files = Array.from(e.dataTransfer?.files || [])
    if (files.length > 0) {
      onFilesSelected(files)
    }
  }

  function handleInputChange(e) {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      onFilesSelected(files)
    }
    e.target.value = ''
  }

  function openPicker() {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openPicker()
    }
  }

  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label="Upload images by dragging and dropping or clicking to browse"
      onClick={openPicker}
      onKeyDown={handleKeyDown}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      animate={{ scale: isDragging ? 1.006 : 1 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
      className={`group relative flex min-h-[280px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-14 text-center transition-all sm:min-h-[320px] ${
        isDragging
          ? 'border-accent bg-accent/[0.06]'
          : 'border-border-strong bg-surface/60 hover:border-ink/45 hover:bg-surface'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*,.gif,.png,.jpg,.jpeg,.webp,.avif,.bmp"
        onChange={handleInputChange}
        className="sr-only"
      />

      <div
        className={`mb-5 grid h-12 w-12 place-items-center rounded-full border transition-colors ${
          isDragging
            ? 'border-accent bg-accent text-accent-ink'
            : 'border-border bg-bg text-ink group-hover:border-border-strong'
        }`}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M12 15V4M12 4L7.5 8.5M12 4L16.5 8.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 15.5V18C4 19.1046 4.89543 20 6 20H18C19.1046 20 20 19.1046 20 18V15.5"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <p className="text-xl font-medium tracking-tight text-ink sm:text-2xl">
        {isDragging ? 'Drop images to compress' : 'Drop images here or browse'}
      </p>
      <p className="mt-2 font-mono text-xs tracking-wide text-muted">
        PNG · JPG · WEBP · BMP · AVIF → WEBP &nbsp;/&nbsp; GIF → GIF
      </p>

      <span className="mt-7 inline-flex min-h-[44px] items-center rounded-full bg-accent px-6 text-sm font-medium text-accent-ink transition-transform group-hover:opacity-90 group-active:scale-[0.98]">
        Select images
      </span>
    </motion.div>
  )
}
