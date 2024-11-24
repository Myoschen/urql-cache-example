'use client'

import { useCallback, useMemo } from 'react'

export function useClipboard() {
  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      if (err instanceof Error) throw err
    }
  }, [])

  return useMemo(() => ({ copy }), [copy])
}
