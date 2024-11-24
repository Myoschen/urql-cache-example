import { useCallback, useMemo, useRef, useState } from 'react'

import { useClipboard } from './use-clipboard'

export function useCopyState(intervalMs: number = 1500) {
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [copied, setCopied] = useState<boolean>(false)
  const clipboard = useClipboard()

  const copy = useCallback(async (text: string) => {
    try {
      await clipboard.copy(text)
      setCopied(true)
    } finally {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setCopied(false), intervalMs)
      } else {
        timerRef.current = setTimeout(() => setCopied(false), intervalMs)
      }
    }
  }, [clipboard, intervalMs])

  return useMemo(() => ({ copied, copy }), [copied, copy])
}
