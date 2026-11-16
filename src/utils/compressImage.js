import { GIFEncoder, applyPalette, quantize } from 'gifenc/dist/gifenc.esm.js'
import omggif from 'omggif'

const { GifReader } = omggif

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export function getCompressionStats(originalSize, compressedSize) {
  const savedBytes = originalSize - compressedSize
  const percent = originalSize > 0 ? (savedBytes / originalSize) * 100 : 0

  let description
  if (savedBytes > 0) {
    description = `${percent.toFixed(1)}% compressed — saved ${formatBytes(savedBytes)}`
  } else if (savedBytes === 0) {
    description = '0.0% compressed — same size as original'
  } else {
    description = `${Math.abs(percent).toFixed(1)}% larger than original — lower quality to shrink`
  }

  return {
    savedBytes,
    percent,
    description,
  }
}

export function isGifFile(file) {
  return (
    file.type === 'image/gif' ||
    file.name.toLowerCase().endsWith('.gif')
  )
}

function replaceExtension(filename, nextExt) {
  const dotIndex = filename.lastIndexOf('.')
  const base = dotIndex > 0 ? filename.slice(0, dotIndex) : filename
  return `${base}.${nextExt}`
}

async function decodeImageToCanvas(file) {
  let width = 0
  let height = 0
  let drawable = null
  let objectUrl = null

  try {
    if (typeof createImageBitmap === 'function') {
      const bitmap = await createImageBitmap(file)
      width = bitmap.width
      height = bitmap.height
      drawable = bitmap
    }
  } catch {
    drawable = null
  }

  if (!drawable) {
    objectUrl = URL.createObjectURL(file)
    drawable = await new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error(`Unable to decode "${file.name}".`))
      img.src = objectUrl
    })
    width = drawable.naturalWidth || drawable.width
    height = drawable.naturalHeight || drawable.height
  }

  try {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Canvas 2D context is unavailable.')
    ctx.drawImage(drawable, 0, 0, width, height)
    return { canvas, width, height }
  } finally {
    if (drawable && typeof drawable.close === 'function') {
      drawable.close()
    }
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl)
    }
  }
}

export async function compressToWebp(file, quality = 0.8) {
  const { canvas, width, height } = await decodeImageToCanvas(file)

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result)
        else reject(new Error(`Failed to encode "${file.name}" as WebP.`))
      },
      'image/webp',
      quality,
    )
  })

  return {
    blob,
    width,
    height,
    frameCount: 1,
    outputName: replaceExtension(file.name, 'webp'),
    format: 'WEBP',
  }
}

function clearRectRgba(rgba, canvasWidth, x, y, w, h) {
  const xEnd = Math.min(canvasWidth, x + w)
  const yEnd = y + h
  for (let row = Math.max(0, y); row < yEnd; row++) {
    const rowStart = (row * canvasWidth + Math.max(0, x)) * 4
    const rowEnd = (row * canvasWidth + xEnd) * 4
    if (rowEnd > rowStart) {
      rgba.fill(0, rowStart, rowEnd)
    }
  }
}

export async function compressGifBuffer(bytes, quality = 0.8) {
  const reader = new GifReader(bytes)
  const width = reader.width
  const height = reader.height
  const frameCount = reader.numFrames()

  if (frameCount === 0) {
    throw new Error('GIF contains no frames.')
  }

  // Map 0.3..0.95 quality into 24..160 palette colors for reliable GIF size reduction.
  const maxColors = Math.max(16, Math.min(256, Math.round(12 + quality * 148)))
  const rawLoop = reader.loopCount()
  const repeat = rawLoop === null ? -1 : rawLoop

  const canvasRgba = new Uint8ClampedArray(width * height * 4)
  const prevCanvasRgba = new Uint8ClampedArray(width * height * 4)
  const frames = []
  let anyAlpha = false

  for (let i = 0; i < frameCount; i++) {
    const info = reader.frameInfo(i)
    if (info.disposal === 3) {
      prevCanvasRgba.set(canvasRgba)
    }

    reader.decodeAndBlitFrameRGBA(i, canvasRgba)
    const pixels = new Uint8ClampedArray(canvasRgba)

    let frameHasAlpha = false
    for (let p = 3; p < pixels.length; p += 4) {
      if (pixels[p] < 128) {
        frameHasAlpha = true
        anyAlpha = true
        break
      }
    }

    frames.push({
      pixels,
      delay: (info.delay || 10) * 10,
      hasAlpha: frameHasAlpha,
    })

    if (info.disposal === 2) {
      clearRectRgba(canvasRgba, width, info.x, info.y, info.width, info.height)
    } else if (info.disposal === 3) {
      canvasRgba.set(prevCanvasRgba)
    }

    if (i % 8 === 7) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  // Build one shared Global Color Table so frames don't repeat 768-byte local palettes.
  const totalPixelsPerFrame = width * height
  const targetSamplePixels = 65536
  const sampleStep = Math.max(
    1,
    Math.floor((totalPixelsPerFrame * frameCount) / targetSamplePixels),
  )
  const sampleList = []
  for (let f = 0; f < frameCount; f++) {
    const px = frames[f].pixels
    for (let p = 0; p < totalPixelsPerFrame; p += sampleStep) {
      const idx = p * 4
      sampleList.push(px[idx], px[idx + 1], px[idx + 2], px[idx + 3])
    }
  }
  const canDeltaEncode = !anyAlpha && frameCount > 1
  if (canDeltaEncode) {
    // Include one transparent sentinel sample so the global palette reserves an alpha slot.
    sampleList.push(0, 0, 0, 0)
  }

  const useAlphaFormat = anyAlpha || canDeltaEncode
  const format = useAlphaFormat ? 'rgba4444' : 'rgb444'
  const globalPalette = quantize(new Uint8Array(sampleList), maxColors, {
    format,
    oneBitAlpha: useAlphaFormat,
  })
  const transparentIndex = useAlphaFormat
    ? globalPalette.findIndex((color) => color[3] === 0)
    : -1

  const gif = GIFEncoder()
  let prevIndexed = null

  for (let i = 0; i < frameCount; i++) {
    const { pixels, delay, hasAlpha } = frames[i]
    const indexed = applyPalette(pixels, globalPalette, format)

    let frameOutput = indexed
    let frameTransparent = transparentIndex >= 0 && hasAlpha
    let dispose = frameTransparent ? 2 : 1

    if (canDeltaEncode && transparentIndex >= 0 && i > 0 && prevIndexed) {
      // Mark unchanged pixels transparent so LZW encodes long identical runs.
      const delta = new Uint8Array(indexed.length)
      for (let k = 0; k < indexed.length; k++) {
        delta[k] = indexed[k] === prevIndexed[k] ? transparentIndex : indexed[k]
      }
      frameOutput = delta
      frameTransparent = true
      dispose = 1
    }

    gif.writeFrame(frameOutput, width, height, {
      palette: i === 0 ? globalPalette : undefined,
      delay,
      repeat: i === 0 ? repeat : undefined,
      transparent: frameTransparent,
      transparentIndex: transparentIndex >= 0 ? transparentIndex : 0,
      dispose,
    })

    prevIndexed = indexed

    if (i % 8 === 7) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  gif.finish()
  return {
    bytes: gif.bytesView(),
    width,
    height,
    frameCount,
  }
}

export async function compressGif(file, quality = 0.8) {
  const inputBytes = new Uint8Array(await file.arrayBuffer())
  const { bytes, width, height, frameCount } = await compressGifBuffer(
    inputBytes,
    quality,
  )

  return {
    blob: new Blob([bytes], { type: 'image/gif' }),
    width,
    height,
    frameCount,
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
