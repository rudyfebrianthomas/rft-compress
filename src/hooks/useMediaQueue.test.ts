import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { UPLOAD_ERROR_HIDE_MS } from '../constants/compression.ts'
import type { BaseMediaItem } from '../types.ts'
import { useMediaQueue } from './useMediaQueue.ts'

describe('useMediaQueue', () => {
  const originalCreateObjectURL = URL.createObjectURL
  const originalRevokeObjectURL = URL.revokeObjectURL

  beforeEach(() => {
    vi.useFakeTimers()
    URL.createObjectURL = vi.fn(() => 'blob:mock-url')
    URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    vi.useRealTimers()
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
  })

  function setupQueue() {
    return renderHook(() =>
      useMediaQueue<BaseMediaItem, number, { blob: Blob }>({
        setting: 0.8,
        loadingLabel: 'Compressing',
        allowedFormats: 'PNG, JPG',
        isSupported: (file) => file.name.endsWith('.png'),
        createPending: (file, fileKey) => ({
          id: 'item-1',
          fileKey,
          file,
          outputName: file.name,
          format: 'WEBP',
          originalSize: file.size,
          compressedSize: 0,
          compressedBlob: null,
          compressedUrl: null,
          status: 'processing',
          error: null,
          downloaded: false,
        }),
        compress: async () => ({ blob: new Blob(['compressed']) }),
        applyResult: (item, result, _setting, compressedUrl) => ({
          ...item,
          status: 'done',
          compressedSize: result.blob.size,
          compressedBlob: result.blob,
          compressedUrl,
          outputName: 'photo.webp',
          downloaded: false,
        }),
        runBatch: async (entries, _label, runner) => {
          for (const entry of entries) {
            await runner(entry)
          }
        },
      }),
    )
  }

  it('shows unsupported format error and hides it after 5s', () => {
    const { result } = setupQueue()
    const badFile = new File(['<svg/>'], 'icon.svg', { type: 'image/svg+xml' })

    act(() => {
      result.current.handleFilesSelected([badFile])
    })

    expect(result.current.uploadError).toContain('"icon.svg"')
    expect(result.current.uploadError).toContain('PNG, JPG')

    act(() => {
      vi.advanceTimersByTime(UPLOAD_ERROR_HIDE_MS - 1)
    })
    expect(result.current.uploadError).not.toBe('')

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(result.current.uploadError).toBe('')
  })

  it('tracks downloaded state and resets on recompress', async () => {
    const { result } = setupQueue()
    const goodFile = new File(['png'], 'photo.png', { type: 'image/png' })

    await act(async () => {
      result.current.handleFilesSelected([goodFile])
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].status).toBe('done')
    expect(result.current.items[0].downloaded).toBe(false)

    act(() => {
      result.current.handleMarkDownloaded(['item-1'])
    })
    expect(result.current.items[0].downloaded).toBe(true)

    await act(async () => {
      result.current.handleRecompressAll()
    })
    expect(result.current.items[0].downloaded).toBe(false)
  })
})
