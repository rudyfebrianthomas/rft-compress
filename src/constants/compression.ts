export const IMAGE_COMPRESS_CONFIG = {
  title: 'Compress images to WebP and GIF',
  subtitle: 'Fast, private compression inside your browser. Nothing is uploaded.',
  qualityLabel: 'Quality',
  qualityMin: 30,
  qualityMax: 95,
  qualityStep: 5,
  reapplyLabel: 'Re-apply',
  zipFilename: 'compressed-images.zip',
  resultsAriaLabel: 'Compressed images',
  loadingLabel: 'Compressing images',
  dropZone: {
    accept: 'image/*,.gif,.png,.jpg,.jpeg,.webp,.avif,.bmp',
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
  bitrateLabel: 'Bitrate',
  bitrateAriaLabel: 'MP3 bitrate',
  bitrateOptions: [64, 96, 128, 192] as const,
  reapplyLabel: 'Re-apply',
  zipFilename: 'compressed-sound.zip',
  resultsAriaLabel: 'Compressed audio files',
  loadingLabel: 'Compressing sound',
  dropZone: {
    accept: 'audio/*,.mp3,.wav,.ogg,.flac,.m4a,.aac,.webm',
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
  defaultProcessingLabel: 'Compressing…',
  defaultErrorLabel: 'Could not compress this file.',
  imageProcessingLabel: 'Compressing…',
  imageErrorLabel: 'Could not compress this image.',
  soundProcessingLabel: 'Encoding MP3…',
  soundErrorLabel: 'Could not compress this audio file.',
  defaultLoadingLabel: 'Compressing files',
  completedSuffix: 'completed',
} as const

