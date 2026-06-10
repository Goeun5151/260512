'use client'

import { useCallback, useEffect, useState } from 'react'

// 태그 키워드 마스터 목록. (추후 클라우드 공유 시 이 저장소만 교체)
const STORAGE_KEY = 'hanjul-tags-v1'
const DEFAULT_TAGS = ['위로', '명언', '영감', '사랑', '인생']

function load(): string[] {
  if (typeof window === 'undefined') return DEFAULT_TAGS
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_TAGS
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return DEFAULT_TAGS
    return parsed.filter((t) => typeof t === 'string')
  } catch {
    return DEFAULT_TAGS
  }
}

export function useTags() {
  const [tags, setTags] = useState<string[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setTags(load())
    setLoaded(true)
  }, [])

  const persist = useCallback((next: string[]) => {
    setTags(next)
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch {}
  }, [])

  const addTag = useCallback((raw: string) => {
    const t = raw.trim()
    if (!t) return
    const cur = load()
    if (cur.includes(t)) return
    persist([...cur, t])
  }, [persist])

  const removeTag = useCallback((t: string) => {
    persist(load().filter((x) => x !== t))
  }, [persist])

  return { tags, loaded, addTag, removeTag }
}
