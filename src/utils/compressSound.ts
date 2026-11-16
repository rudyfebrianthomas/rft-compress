import { Mp3Encoder } from '@breezystack/lamejs'
import { replaceExtension } from './format.ts'

export interface CompressedSoundResult {
  blob: Blob
  duration: number
  sampleRate: number
  channels: number
  bitrate: number
  outputName: string
  format: 'MP3'
}

const LAME_SAMPLE_RATES = new Set([
  8000, 11025, 12000, 16000, 22050, 24000, 32000, 44100, 48000,
])

const AUDIO_EXT_RE = /\.(mp3|wav|ogg|flac|m4a|aac|webm|opus|aiff|wma)$/i

export function isAudioFile(file: { type: string; name: string }): boolean {
  return file.type.startsWith('audio/') || AUDIO_EXT_RE.test(file.name)
}

export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const total = Math.round(seconds)
  const mins = Math.floor(total / 60)
  const secs = total % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function floatToInt16(float32: Float32Array): Int16Array {
  const out = new Int16Array(float32.length)
  for (let i = 0; i < float32.length; i++) {
    const clamped = Math.max(-1, Math.min(1, float32[i]))
    out[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff
  }
  return out
}

async function normalizeSampleRate(
  audioBuffer: AudioBuffer,
): Promise<AudioBuffer> {
  if (LAME_SAMPLE_RATES.has(audioBuffer.sampleRate)) {
    return audioBuffer
  }
  const targetRate = 44100
  const channels = Math.min(2, audioBuffer.numberOfChannels || 1)
  const frameCount = Math.max(1, Math.ceil(audioBuffer.duration * targetRate))
  const offline = new OfflineAudioContext(channels, frameCount, targetRate)
  const source = offline.createBufferSource()
  source.buffer = audioBuffer
  source.connect(offline.destination)
  source.start(0)
  return offline.startRendering()
}

export async function encodePcmToMp3(
  channelsData: Float32Array[],
  sampleRate: number,
  bitrate = 128,
  shouldYield = false,
): Promise<Array<Uint8Array<ArrayBuffer>>> {
  const channels = channelsData.length >= 2 ? 2 : 1
  const encoder = new Mp3Encoder(channels, sampleRate, bitrate)
  const left = floatToInt16(channelsData[0])
  const right = channels === 2 ? floatToInt16(channelsData[1]) : null
  const chunkSize = 1152
  const parts: Array<Uint8Array<ArrayBuffer>> = []

  for (let i = 0, block = 0; i < left.length; i += chunkSize, block++) {
    const leftChunk = left.subarray(i, i + chunkSize)
    const encoded = right
      ? encoder.encodeBuffer(leftChunk, right.subarray(i, i + chunkSize))
      : encoder.encodeBuffer(leftChunk)
    if (encoded.length > 0) {
      parts.push(new Uint8Array(encoded))
    }
    if (shouldYield && block % 40 === 39) {
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
  }

  const tail = encoder.flush()
  if (tail.length > 0) {
    parts.push(new Uint8Array(tail))
  }

  return parts
}

export async function compressSoundFile(
  file: File,
  bitrate = 128,
): Promise<CompressedSoundResult> {
  const AudioCtx =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!AudioCtx) {
    throw new Error('Web Audio API is not supported in this browser.')
  }

  const ctx = new AudioCtx()
  let decoded: AudioBuffer
  try {
    const arrayBuffer = await file.arrayBuffer()
    decoded = await ctx.decodeAudioData(arrayBuffer)
  } catch {
    throw new Error(`Unable to decode audio file "${file.name}".`)
  } finally {
    await ctx.close().catch(() => {})
  }

  const normalized = await normalizeSampleRate(decoded)
  const channels = Math.min(2, normalized.numberOfChannels || 1)
  const channelsData: Float32Array[] = [normalized.getChannelData(0)]
  if (channels === 2) {
    channelsData.push(normalized.getChannelData(1))
  }

  const mp3Parts = await encodePcmToMp3(
    channelsData,
    normalized.sampleRate,
    bitrate,
    true,
  )

  return {
    blob: new Blob(mp3Parts, { type: 'audio/mp3' }),
    duration: normalized.duration,
    sampleRate: normalized.sampleRate,
    channels,
    bitrate,
    outputName: replaceExtension(file.name, 'mp3'),
    format: 'MP3',
  }
}
