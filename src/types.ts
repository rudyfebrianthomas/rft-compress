export type PageId = 'home' | 'image' | 'sound' | 'about'

export type ThemeMode = 'light' | 'dark'

export type ItemStatus = 'processing' | 'done' | 'error'

export interface BaseMediaItem {
  id: string
  fileKey: string
  file: File
  outputName: string
  format: string
  originalSize: number
  compressedSize: number
  compressedBlob: Blob | null
  compressedUrl: string | null
  fallbackPreviewUrl?: string
  status: ItemStatus
  error: string | null
  downloaded: boolean
}

export interface ImageItem extends BaseMediaItem {
  format: 'WEBP' | 'GIF'
  previewUrl: string | null
  width: number
  height: number
  qualityUsed: number
}

export interface SoundItem extends BaseMediaItem {
  format: 'MP3'
  duration: number
  sampleRate: number
  channels: number
  bitrateUsed: number
}

export interface LoadingState {
  label: string
  total: number
  completed: number
  currentName: string
}
