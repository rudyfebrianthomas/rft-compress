import { describe, expect, it } from 'vitest'
import {
  formatBytes,
  getCompressionStats,
  partitionNewFiles,
  replaceExtension,
  summarizeCompressionItems,
} from './format.ts'

describe('formatBytes', () => {
  it('formats bytes across units', () => {
    expect(formatBytes(0)).toBe('0 B')
    expect(formatBytes(512)).toBe('512 B')
    expect(formatBytes(2048)).toBe('2.0 KB')
    expect(formatBytes(1024 * 1024)).toBe('1.00 MB')
  })

  it('guards invalid byte inputs', () => {
    expect(formatBytes(-1)).toBe('0 B')
    expect(formatBytes(Number.NaN)).toBe('0 B')
  })
})

describe('getCompressionStats', () => {
  it('reports savings and larger-file cases', () => {
    expect(getCompressionStats(1000, 400).description).toBe(
      '60.0% compressed — saved 600 B',
    )
    expect(getCompressionStats(500, 500).description).toBe(
      '0.0% compressed — same size as original',
    )
    expect(getCompressionStats(500, 600).description).toBe(
      '20.0% larger than original — lower setting to shrink',
    )
  })
})

describe('replaceExtension', () => {
  it('replaces existing extension or appends when missing', () => {
    expect(replaceExtension('photo.png', 'webp')).toBe('photo.webp')
    expect(replaceExtension('archive', 'zip')).toBe('archive.zip')
  })
})

describe('partitionNewFiles', () => {
  const isPng = (f: { type: string; name: string }) =>
    f.type === 'image/png' || f.name.endsWith('.png')

  it('separates accepted, duplicate, and unsupported files', () => {
    const existing = [
      {
        file: { name: 'dup.png', size: 10, lastModified: 1, type: 'image/png' },
      },
    ]
    const incoming = [
      { name: 'fresh.png', size: 20, lastModified: 2, type: 'image/png' },
      { name: 'dup.png', size: 10, lastModified: 1, type: 'image/png' },
      { name: 'vector.svg', size: 15, lastModified: 3, type: 'image/svg+xml' },
      { name: 'notes.pdf', size: 30, lastModified: 4, type: 'application/pdf' },
    ]

    const result = partitionNewFiles(incoming, existing, isPng)
    expect(result.accepted).toHaveLength(1)
    expect(result.accepted[0].file.name).toBe('fresh.png')
    expect(result.skippedCount).toBe(1)
    expect(result.invalidNames).toEqual(['vector.svg', 'notes.pdf'])
  })
})

describe('summarizeCompressionItems', () => {
  it('sums totals only for done items with compressed blobs', () => {
    const summary = summarizeCompressionItems([
      {
        status: 'done',
        originalSize: 1000,
        compressedSize: 250,
        compressedBlob: new Blob(['ok']),
      },
      {
        status: 'processing',
        originalSize: 500,
        compressedSize: 0,
        compressedBlob: null,
      },
    ])

    expect(summary.readyItems).toHaveLength(1)
    expect(summary.totalOriginal).toBe(1000)
    expect(summary.totalCompressed).toBe(250)
    expect(summary.overallStats?.savedBytes).toBe(750)
  })
})
