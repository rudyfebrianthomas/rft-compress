export const IMAGE_COMPRESS_CONFIG = {
  title: 'Compress images to WebP and GIF',
  subtitle: 'Fast, private compression inside your browser. Nothing is uploaded.',
  sectionAriaLabel: 'Image upload and quality',
  qualityLabel: 'Quality',
  qualityMin: 30,
  qualityMax: 95,
  qualityStep: 5,
  reapplyLabel: 'Re-apply',
  zipFilename: 'compressed-images.zip',
  resultsAriaLabel: 'Compressed images',
  loadingLabel: 'Compressing images',
  allowedFormatsLabel: 'PNG, JPG, WEBP, BMP, AVIF, GIF',
  dropZone: {
    accept:
      '.png,.jpg,.jpeg,.webp,.avif,.bmp,.gif,image/png,image/jpeg,image/webp,image/avif,image/bmp,image/gif',
    ariaLabel: 'Upload images by dragging and dropping or clicking to browse',
    idleTitle: 'Drop images here or browse',
    dragTitle: 'Drop images to compress',
    formatHint: 'PNG · JPG · WEBP · BMP · AVIF → WEBP / GIF → GIF',
    buttonLabel: 'Select images',
  },
} as const

export const SOUND_COMPRESS_CONFIG = {
  title: 'Compress sound to MP3',
  subtitle:
    'Shrink WAV, MP3, OGG, FLAC, and M4A audio in your browser. Nothing is uploaded.',
  sectionAriaLabel: 'Sound upload and bitrate',
  bitrateLabel: 'Bitrate',
  bitrateAriaLabel: 'MP3 bitrate',
  bitrateOptions: [64, 96, 128, 192] as const,
  reapplyLabel: 'Re-apply',
  zipFilename: 'compressed-sound.zip',
  resultsAriaLabel: 'Compressed audio files',
  loadingLabel: 'Compressing sound',
  allowedFormatsLabel: 'WAV, MP3, OGG, FLAC, M4A, AAC, WebM',
  dropZone: {
    accept: 'audio/*,.mp3,.wav,.ogg,.flac,.m4a,.aac,.webm,.opus,.aiff,.wma',
    ariaLabel:
      'Upload audio files by dragging and dropping or clicking to browse',
    idleTitle: 'Drop audio files here or browse',
    dragTitle: 'Drop audio files to compress',
    formatHint: 'WAV · MP3 · OGG · FLAC · M4A · AAC → MP3',
    buttonLabel: 'Select audio',
  },
} as const

export const RESULTS_TEXT = {
  headingPrefix: 'Results',
  emptyMessage: 'No compressed files available.',
  zippingLabel: 'Zipping…',
  downloadAllLabel: 'Download all',
  zipSuffix: '.zip',
  clearLabel: 'Clear',
  downloadLabel: 'Download',
  downloadedLabel: 'Downloaded',
  defaultProcessingLabel: 'Compressing…',
  defaultErrorLabel: 'Could not compress this file.',
  imageProcessingLabel: 'Compressing…',
  imageErrorLabel: 'Could not compress this image.',
  soundProcessingLabel: 'Encoding MP3…',
  soundErrorLabel: 'Could not compress this audio file.',
  defaultLoadingLabel: 'Compressing files',
  completedSuffix: 'completed',
} as const

export const UPLOAD_ERROR_HIDE_MS = 5000

