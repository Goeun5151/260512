'use client'

import { useCallback, useEffect, useState } from 'react'
import { type AppTheme, DEFAULT_THEME, applyTheme, loadTheme, saveTheme } from './theme'

export function useTheme() {
  const [theme, setTheme] = useState<AppTheme>(DEFAULT_THEME)

  useEffect(() => {
    setTheme(loadTheme())
  }, [])

  const update = useCallback((patch: Partial<AppTheme>) => {
    setTheme((cur) => {
      const next = { ...cur, ...patch }
      saveTheme(next)
      applyTheme(next)
      return next
    })
  }, [])

  const reset = useCallback(() => {
    setTheme(DEFAULT_THEME)
    saveTheme(DEFAULT_THEME)
    applyTheme(DEFAULT_THEME)
  }, [])

  return { theme, update, reset }
}
