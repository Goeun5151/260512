'use client'

import { useCallback, useEffect, useState } from 'react'
import { THEME_PALETTES, DEFAULT_THEME_ID, THEME_KEY, applyTheme } from './theme'

export function useTheme() {
  const [themeId, setThemeId] = useState(DEFAULT_THEME_ID)

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(THEME_KEY)
      if (v) setThemeId(v)
    } catch {}
  }, [])

  const select = useCallback((id: string) => {
    setThemeId(id)
    try { window.localStorage.setItem(THEME_KEY, id) } catch {}
    applyTheme(id)
  }, [])

  return { themeId, select, palettes: THEME_PALETTES }
}
