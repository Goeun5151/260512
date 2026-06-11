'use client'

import { useEffect } from 'react'
import { applyTheme, loadTheme } from '@/lib/theme'

/** 저장된 테마를 앱 시작 시 <html>에 적용 (모든 라우트 공통). */
export function ThemeApplier() {
  useEffect(() => {
    applyTheme(loadTheme())
  }, [])
  return null
}
