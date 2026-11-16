import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { BaseMediaItem } from '../types.ts'
import * as downloadUtils from '../utils/download.ts'
import { ResultRow } from './ResultRow.tsx'

function makeItem(overrides: Partial<BaseMediaItem> = {}): BaseMediaItem {
  return {
    id: 'row-1',
    fileKey: 'photo.png:100:1',
    file: new File(['data'], 'photo.png', { type: 'image/png' }),
    outputName: 'photo.webp',
    format: 'WEBP',
    originalSize: 1000,
    compressedSize: 400,
    compressedBlob: new Blob(['out']),
    compressedUrl: 'blob:out',
    status: 'done',
    error: null,
    downloaded: false,
    ...overrides,
  }
}

describe('ResultRow', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('triggers download and notifies parent when Download is clicked', () => {
    const downloadSpy = vi
      .spyOn(downloadUtils, 'triggerUrlDownload')
      .mockImplementation(() => {})
    const onDownloaded = vi.fn()

    render(
      <ResultRow
        item={makeItem({ downloaded: false })}
        media={<div />}
        onRemove={vi.fn()}
        onDownloaded={onDownloaded}
      />,
    )

    const btn = screen.getByRole('button', { name: 'Download' })
    fireEvent.click(btn)

    expect(downloadSpy).toHaveBeenCalledWith('blob:out', 'photo.webp')
    expect(onDownloaded).toHaveBeenCalledWith('row-1')
  })

  it('renders Downloaded label after item is marked downloaded', () => {
    render(
      <ResultRow
        item={makeItem({ downloaded: true })}
        media={<div />}
        onRemove={vi.fn()}
        onDownloaded={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Downloaded' }),
    ).toBeInTheDocument()
  })
})
