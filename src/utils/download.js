import { zip } from 'fflate'

export function triggerUrlDownload(url, filename) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function triggerBlobDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  try {
    triggerUrlDownload(url, filename)
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}

export function getUniqueFilename(filename, usedNames) {
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

export async function buildZipBytes(items) {
  const usedNames = new Set()
  const entries = {}

  for (const item of items) {
    if (!item.compressedBlob) continue
    const uniqueName = getUniqueFilename(item.outputName, usedNames)
    entries[uniqueName] = new Uint8Array(await item.compressedBlob.arrayBuffer())
  }

  return new Promise((resolve, reject) => {
    zip(entries, { level: 0 }, (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
}

export async function downloadItemsAsZip(items, zipFilename) {
  const zipBytes = await buildZipBytes(items)
  const zipBlob = new Blob([zipBytes], { type: 'application/zip' })
  triggerBlobDownload(zipBlob, zipFilename)
}
