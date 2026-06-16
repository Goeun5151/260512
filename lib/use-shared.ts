'use client'

import { useCallback, useEffect, useState } from 'react'

// ⚠️ 공유 DB 스텁. 지금은 로컬(샘플 풀 + 내가 공유한 글)로 동작.
// 나중에 이 파일만 Supabase 클라이언트로 교체하면 진짜 사용자 간 공유가 됨.
export type SharedQuote = {
  id: string
  sentence: string
  bookTitle: string
  author: string
  page?: string
  likes: number
}

const PUB_KEY = 'hanjul-shared-pub-v1'
const LIKE_KEY = 'hanjul-shared-likes-v1'

const SEED: SharedQuote[] = [
  { id: 's1', sentence: '우리의 최고와 최악의 모습을 다 봤으면서도 똑같이 아껴주는 사람들을 위하여.', bookTitle: 'A Crown for Christmas', author: '', likes: 312 },
  { id: 's2', sentence: '네 인생을 흔들 만한 사람이 아니면 흘려보내라.', bookTitle: '', author: '', likes: 287 },
  { id: 's3', sentence: '어제의 비로 오늘을 적실 필요 없듯이, 내일의 비 때문에 오늘 우산을 펼 필요는 없다.', bookTitle: '', author: '', likes: 198 },
  { id: 's4', sentence: '우리가 듣는 모든 것은 사실이 아니라 의견일 뿐이며, 우리가 보는 모든 것은 진실이 아니라 관점일 뿐이다.', bookTitle: '명상록', author: '마르쿠스 아우렐리우스', likes: 421 },
  { id: 's5', sentence: '행복은 강도가 아니라 빈도다.', bookTitle: '굿 라이프', author: '최인철', likes: 256 },
  { id: 's6', sentence: '사람은 자신이 본 것만큼만 세상을 이해한다.', bookTitle: '데미안', author: '헤르만 헤세', likes: 342 },
]

function loadPub(): SharedQuote[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(window.localStorage.getItem(PUB_KEY) || '[]') } catch { return [] }
}
function loadLikes(): string[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(window.localStorage.getItem(LIKE_KEY) || '[]') } catch { return [] }
}

function sample<T>(arr: T[], n: number): T[] {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n)
}

/** 기록을 공유 DB(스텁)에 올림. 같은 문장이 이미 있으면 중복 추가 안 함. */
export function publishShared(q: Omit<SharedQuote, 'id' | 'likes'>) {
  const norm = (s: string) => s.replace(/\s+/g, ' ').trim()
  const target = norm(q.sentence)
  if (!target) return
  const exists = [...SEED, ...loadPub()].some((x) => norm(x.sentence) === target)
  if (exists) return // 이미 공유 DB에 있음 → 중복 방지
  const pub = loadPub()
  pub.unshift({ ...q, id: `p-${Date.now()}`, likes: 0 })
  try { window.localStorage.setItem(PUB_KEY, JSON.stringify(pub)) } catch {}
}

export function useShared() {
  const [pool, setPool] = useState<SharedQuote[]>(SEED)
  const [picks, setPicks] = useState<SharedQuote[]>([])
  const [liked, setLiked] = useState<string[]>([])

  useEffect(() => {
    const p = [...loadPub(), ...SEED]
    setPool(p)
    setLiked(loadLikes())
    setPicks(sample(p, 5))
  }, [])

  const refresh = useCallback(() => setPicks(sample(pool, 5)), [pool])

  const toggleLike = useCallback((id: string) => {
    setLiked((cur) => {
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
      try { window.localStorage.setItem(LIKE_KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const isLiked = useCallback((id: string) => liked.includes(id), [liked])

  return { picks, refresh, toggleLike, isLiked }
}
