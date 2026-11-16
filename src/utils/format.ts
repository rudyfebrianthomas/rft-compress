export interface CompressionStats {
  savedBytes: number
  percent: number
  description: string
}

export interface AcceptedFile<T extends { name: string; size: number; lastModified?: number; type: string } = File> {
  file: T
  key: string
}

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function getCompressionStats(
  originalSize: number,
  compressedSize: number,
): CompressionStats {
  const savedBytes = originalSize - compressedSize
  const percent = originalSize > 0 ? (savedBytes / originalSize) * 100 : 0

  let description: string
  if (savedBytes > 0) {
    description = `${percent.toFixed(1)}% compressed — saved ${formatBytes(savedBytes)}`
  } else if (savedBytes === 0) {
    description = '0.0% compressed — same size as original'
  } else {
    description = `${Math.abs(percent).toFixed(1)}% larger than original — lower setting to shrink`
  }

  return {
    savedBytes,
    percent,
    description,
  }
}

export function replaceExtension(filename: string, nextExt: string): string {
  const dotIndex = filename.lastIndexOf('.')
  const base = dotIndex > 0 ? filename.slice(0, dotIndex) : filename
  return `${base}.${nextExt}`
}

export function getFileSignature(file: {
  name: string
  size: number
  lastModified?: number
  type: string
}): string {
  return `${file.name}::${file.size}::${file.lastModified ?? 0}::${file.type}`
}

export function partitionNewFiles<
  T extends { name: string; size: number; lastModified?: number; type: string },
>(
  fileList: T[],
  existingItems: Array<{ fileKey?: string; file: T }>,
  isSupported: (file: T) => boolean,
): { accepted: Array<AcceptedFile<T>>; skippedCount: number } {
  const seen = new Set(
    existingItems.map((item) => item.fileKey || getFileSignature(item.file)),
  )
  const accepted: Array<AcceptedFile<T>> = []
  let skippedCount = 0

  for (const file of fileList) {
    if (!isSupported(file)) continue
    const key = getFileSignature(file)
    if (seen.has(key)) {
      skippedCount += 1
      continue
    }
    seen.add(key)
    accepted.push({ file, key })
  }

  return { accepted, skippedCount }
}
