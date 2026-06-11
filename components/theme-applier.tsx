'use client'

import { useEffect } from 'react'
import { applyTheme, DEFAULT_THEME_ID, THEME_KEY } from '@/lib/theme'

/** 저장된 테마를 앱 시작 시 <html>에 적용 (모든 라우트 공통). */
export function ThemeApplier() {
  useEffect(() => {
    let id = DEFAULT_THEME_ID
    try { id = window.localStorage.getItem(THEME_KEY) || DEFAULT_THEME_ID } catch {}
    applyTheme(id)
  }, [])
  return null
}
