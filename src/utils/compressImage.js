import encodeWebp from '@jsquash/webp/encode.js'
import gifsicle from 'gifsicle-wasm-browser'
import {
  formatBytes,
  getCompressionStats,
  replaceExtension,
} from './format.js'

export { formatBytes, getCompressionStats }

export function isGifFile(file) {
  return (
    file.type === 'image/gif' ||
    file.name.toLowerCase().endsWith('.gif')
  )
}

async function decodeDrawable(blob, name = 'image') {
  try {
    if (typeof createImageBitmap === 'function') {
      const bitmap = await createImageBitmap(blob)
      return {
        drawable: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => bitmap.close(),
      }
    }
  } catch {
    // Fall through to HTMLImageElement decoding.
  }

  const objectUrl = URL.createObjectURL(blob)
  const img = await new Promise((resolve, reject) => {
    const el = new Image()
    el.onload = () => resolve(el)
    el.onerror = () => reject(new Error(`Unable to decode "${name}".`))
    el.src = objectUrl
  })

  return {
    drawable: img,
    width: img.naturalWidth || img.width,
    height: img.naturalHeight || img.height,
    cleanup: () => URL.revokeObjectURL(objectUrl),
  }
}

async function decodeToImageData(file) {
  const { drawable, width, height, cleanup } = await decodeDrawable(file, file.name)
  try {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context is unavailable.')
    ctx.drawImage(drawable, 0, 0, width, height)
    return {
      imageData: ctx.getImageData(0, 0, width, height),
      width,
      height,
    }
  } finally {
    cleanup()
  }
}

async function getImageDimensions(blob, name) {
  try {
    const { width, height, cleanup } = await decodeDrawable(blob, name)
    cleanup()
    return { width, height }
  } catch {
    return { width: 0, height: 0 }
  }
}

export async function compressToWebp(file, quality = 0.8) {
  const { imageData, width, height } = await decodeToImageData(file)
  const webpQuality = Math.max(1, Math.min(100, Math.round(quality * 100)))
  const buffer = await encodeWebp(imageData, { quality: webpQuality })

  return {
    blob: new Blob([buffer], { type: 'image/webp' }),
    width,
    height,
    frameCount: 1,
    outputName: replaceExtension(file.name, 'webp'),
    format: 'WEBP',
  }
}

export async function compressGif(file, quality = 0.8) {
  const lossy = Math.max(10, Math.min(180, Math.round((1 - quality) * 200)))
  const optLevel = file.size > 5 * 1024 * 1024 ? '-O1' : '-O2'

  const outFiles = await gifsicle.run({
    input: [{ file, name: 'input.gif' }],
    command: [`${optLevel} --lossy=${lossy} input.gif -o /out/out.gif`],
  })

  if (!Array.isArray(outFiles) || outFiles.length === 0) {
    throw new Error(`Failed to compress "${file.name}".`)
  }

  const outputBlob = outFiles[0]
  const { width, height } = await getImageDimensions(outputBlob, file.name)

  return {
    blob: outputBlob,
    width,
    height,
    frameCount: 1,
    outputName: replaceExtension(file.name, 'gif'),
    format: 'GIF',
  }
}

export async function compressImageFile(file, quality = 0.8) {
  if (isGifFile(file)) {
    return compressGif(file, quality)
  }
  return compressToWebp(file, quality)
}
