import { useCallback, useEffect, useState } from 'react'
import type { PageId } from '../types.ts'

export function getPageFromHash(): PageId {
  const hash = window.location.hash.toLowerCase()
  if (hash === '#image' || hash === '#images') return 'image'
  if (hash === '#sound' || hash === '#audio') return 'sound'
  if (hash === '#about') return 'about'
  return 'home'
}

export function useHashRoute() {
  const [currentPage, setCurrentPage] = useState<PageId>(getPageFromHash)

  useEffect(() => {
    function handleHashChange() {
      setCurrentPage(getPageFromHash())
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = useCallback((page: PageId) => {
    setCurrentPage(page)
    const nextHash = `#${page}`
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, '', nextHash)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return { currentPage, navigate }
}
