import type { BaseMediaItem, ImageItem, SoundItem } from '../types.ts'
import { type CompressedImageResult, isGifFile } from './compressImage.ts'
import type { CompressedSoundResult } from './compressSound.ts'

export function createItemId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function revokeItemUrls(item: BaseMediaItem): void {
  if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl)
  if (item.fallbackPreviewUrl) URL.revokeObjectURL(item.fallbackPreviewUrl)
}

export function formatDuplicateNotice(skippedCount: number): string {
  if (skippedCount <= 0) return ''
  return `Skipped ${skippedCount} duplicate ${skippedCount === 1 ? 'file' : 'files'} already uploaded.`
}

export function formatInvalidFormatError(
  invalidNames: string[],
  allowedFormats: string,
): string {
  if (invalidNames.length === 0) return ''
  const preview = invalidNames
    .slice(0, 3)
    .map((name) => `"${name}"`)
    .join(', ')
  const extra =
    invalidNames.length > 3 ? ` (+${invalidNames.length - 3} more)` : ''
  return `Unsupported file format: ${preview}${extra}. Allowed: ${allowedFormats}.`
}

export function createPendingImageItem(
  file: File,
  fileKey: string,
  quality: number,
): ImageItem {
  const fallbackPreviewUrl = URL.createObjectURL(file)
  return {
    id: createItemId(),
    fileKey,
    file,
    outputName: file.name,
    format: isGifFile(file) ? 'GIF' : 'WEBP',
    originalSize: file.size,
    compressedSize: 0,
    compressedBlob: null,
    compressedUrl: null,
    fallbackPreviewUrl,
    previewUrl: fallbackPreviewUrl,
    width: 0,
    height: 0,
    qualityUsed: quality,
    status: 'processing',
    error: null,
  }
}

export function applyImageResult(
  item: ImageItem,
  result: CompressedImageResult,
  quality: number,
  compressedUrl: string,
): ImageItem {
  if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl)
  return {
    ...item,
    status: 'done',
    compressedSize: result.blob.size,
    compressedBlob: result.blob,
    compressedUrl,
    previewUrl: compressedUrl,
    outputName: result.outputName,
    format: result.format,
    width: result.width,
    height: result.height,
    qualityUsed: quality,
    error: null,
  }
}

export function createPendingSoundItem(
  file: File,
  fileKey: string,
  bitrate: number,
): SoundItem {
  return {
    id: createItemId(),
    fileKey,
    file,
    outputName: file.name,
    format: 'MP3',
    originalSize: file.size,
    compressedSize: 0,
    compressedBlob: null,
    compressedUrl: null,
    duration: 0,
    sampleRate: 0,
    channels: 2,
    bitrateUsed: bitrate,
    status: 'processing',
    error: null,
  }
}

export function applySoundResult(
  item: SoundItem,
  result: CompressedSoundResult,
  bitrate: number,
  compressedUrl: string,
): SoundItem {
  if (item.compressedUrl) URL.revokeObjectURL(item.compressedUrl)
  return {
    ...item,
    status: 'done',
    compressedSize: result.blob.size,
    compressedBlob: result.blob,
    compressedUrl,
    outputName: result.outputName,
    format: result.format,
    duration: result.duration,
    sampleRate: result.sampleRate,
    channels: result.channels,
    bitrateUsed: bitrate,
    error: null,
  }
}
