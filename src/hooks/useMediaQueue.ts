import { useEffect, useRef, useState } from 'react'
import { UPLOAD_ERROR_HIDE_MS } from '../constants/compression.ts'
import type { BaseMediaItem } from '../types.ts'
import { partitionNewFiles } from '../utils/format.ts'
import {
  formatDuplicateNotice,
  formatInvalidFormatError,
  revokeItemUrls,
} from '../utils/mediaItems.ts'

export type RunBatchFn = <T extends BaseMediaItem>(
  entries: T[],
  label: string,
  runner: (entry: T) => Promise<void>,
) => Promise<void>

interface UseMediaQueueOptions<
  TItem extends BaseMediaItem,
  TSetting,
  TResult extends { blob: Blob },
> {
  setting: TSetting
  loadingLabel: string
  allowedFormats: string
  isSupported: (file: File) => boolean
  createPending: (file: File, fileKey: string, setting: TSetting) => TItem
  compress: (file: File, setting: TSetting) => Promise<TResult>
  applyResult: (
    item: TItem,
    result: TResult,
    setting: TSetting,
    compressedUrl: string,
  ) => TItem
  runBatch: RunBatchFn
}

export function useMediaQueue<
  TItem extends BaseMediaItem,
  TSetting,
  TResult extends { blob: Blob },
>({
  setting,
  loadingLabel,
  allowedFormats,
  isSupported,
  createPending,
  compress,
  applyResult,
  runBatch,
}: UseMediaQueueOptions<TItem, TSetting, TResult>) {
  const itemsRef = useRef<TItem[]>([])
  const errorTimerRef = useRef<number | undefined>(undefined)
  const [items, setItems] = useState<TItem[]>([])
  const [duplicateNotice, setDuplicateNotice] = useState('')
  const [uploadError, setUploadError] = useState('')

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  useEffect(() => {
    return () => {
      window.clearTimeout(errorTimerRef.current)
      itemsRef.current.forEach(revokeItemUrls)
    }
  }, [])

  function updateUploadError(message: string): void {
    window.clearTimeout(errorTimerRef.current)
    setUploadError(message)
    if (!message) return
    errorTimerRef.current = window.setTimeout(() => {
      setUploadError('')
    }, UPLOAD_ERROR_HIDE_MS)
  }

  async function processEntry(
    id: string,
    file: File,
    targetSetting: TSetting,
  ): Promise<void> {
    try {
      const result = await compress(file, targetSetting)
      const compressedUrl = URL.createObjectURL(result.blob)

      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? applyResult(item, result, targetSetting, compressedUrl)
            : item,
        ),
      )
    } catch (err) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: 'error',
                error:
                  err instanceof Error ? err.message : 'Compression failed.',
              }
            : item,
        ),
      )
    }
  }

  function handleFilesSelected(fileList: File[]): void {
    const { accepted, skippedCount, invalidNames } = partitionNewFiles(
      fileList,
      items,
      isSupported,
    )
    setDuplicateNotice(formatDuplicateNotice(skippedCount))
    updateUploadError(formatInvalidFormatError(invalidNames, allowedFormats))
    if (accepted.length === 0) return

    const newEntries = accepted.map(({ file, key }) =>
      createPending(file, key, setting),
    )
    setItems((prev) => [...newEntries, ...prev])
    void runBatch(newEntries, loadingLabel, (entry) =>
      processEntry(entry.id, entry.file, setting),
    )
  }

  function handleRecompressAll(): void {
    const snapshot = items
    setDuplicateNotice('')
    updateUploadError('')
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        status: 'processing',
        error: null,
        downloaded: false,
      })),
    )
    void runBatch(snapshot, loadingLabel, (item) =>
      processEntry(item.id, item.file, setting),
    )
  }

  function handleMarkDownloaded(ids: string[]): void {
    if (ids.length === 0) return
    const idSet = new Set(ids)
    setItems((prev) =>
      prev.map((item) =>
        idSet.has(item.id) ? { ...item, downloaded: true } : item,
      ),
    )
  }

  function handleRemoveItem(id: string): void {
    setDuplicateNotice('')
    updateUploadError('')
    setItems((prev) => {
      const target = prev.find((item) => item.id === id)
      if (target) revokeItemUrls(target)
      return prev.filter((item) => item.id !== id)
    })
  }

  function handleClearAll(): void {
    setDuplicateNotice('')
    updateUploadError('')
    setItems((prev) => {
      prev.forEach(revokeItemUrls)
      return []
    })
  }

  return {
    items,
    duplicateNotice,
    uploadError,
    handleFilesSelected,
    handleRecompressAll,
    handleMarkDownloaded,
    handleRemoveItem,
    handleClearAll,
  }
}
