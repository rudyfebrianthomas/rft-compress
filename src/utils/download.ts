import { zip } from 'fflate'

export interface ZipSourceItem {
  outputName: string
  compressedBlob: Blob | null
}

export function triggerUrlDownload(url: string, filename: string): void {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  try {
    triggerUrlDownload(url, filename)
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}

export function getUniqueFilename(
  filename: string,
  usedNames: Set<string>,
): string {
  if (!usedNames.has(filename)) {
    usedNames.add(filename)
    return filename
  }

  const dotIndex = filename.lastIndexOf('.')
  const base = dotIndex > 0 ? filename.slice(0, dotIndex) : filename
  const ext = dotIndex > 0 ? filename.slice(dotIndex) : ''

  let counter = 2
  let candidate = `${base} (${counter})${ext}`
  while (usedNames.has(candidate)) {
    counter += 1
    candidate = `${base} (${counter})${ext}`
  }
  usedNames.add(candidate)
  return candidate
}

export async function buildZipBytes(
  items: ZipSourceItem[],
): Promise<Uint8Array<ArrayBuffer>> {
  const usedNames = new Set<string>()
  const entries: Record<string, Uint8Array> = {}

  for (const item of items) {
    if (!item.compressedBlob) continue
    const uniqueName = getUniqueFilename(item.outputName, usedNames)
    entries[uniqueName] = new Uint8Array(await item.compressedBlob.arrayBuffer())
  }

  return new Promise((resolve, reject) => {
    zip(entries, { level: 0 }, (err, data) => {
      if (err) reject(err)
      else resolve(new Uint8Array(data))
    })
  })
}

export async function downloadItemsAsZip(
  items: ZipSourceItem[],
  zipFilename: string,
): Promise<void> {
  const zipBytes = await buildZipBytes(items)
  const zipBlob = new Blob([zipBytes], { type: 'application/zip' })
  triggerBlobDownload(zipBlob, zipFilename)
}
