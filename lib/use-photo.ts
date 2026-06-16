'use client'

import { useEffect, useState } from 'react'
import { isStoredPhoto, loadPhotoSrc } from './photo-store'

/** 기록 배경 사진 참조(경로 또는 data/url)를 화면에 쓸 src로 변환. */
export function useResolvedPhoto(ref?: string): string {
  const [src, setSrc] = useState(() => (ref && !isStoredPhoto(ref) ? ref : ''))

  useEffect(() => {
    if (!ref) { setSrc(''); return }
    if (!isStoredPhoto(ref)) { setSrc(ref); return } // data/url/preset → 그대로
    let alive = true
    loadPhotoSrc(ref).then((s) => { if (alive) setSrc(s) }).catch(() => { if (alive) setSrc('') })
    return () => { alive = false }
  }, [ref])

  return src
}
