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
  { id: 's1', sentence: '우리가 어떤 일을 끝까지 해내는 건, 그 일을 사랑하기 때문이다.', bookTitle: '몰입', author: '황농문', likes: 128 },
  { id: 's2', sentence: '사람은 자신이 본 것만큼만 세상을 이해한다.', bookTitle: '데미안', author: '헤르만 헤세', likes: 342 },
  { id: 's3', sentence: '오늘 걷지 않으면 내일은 뛰어야 한다.', bookTitle: '언어의 온도', author: '이기주', likes: 211 },
  { id: 's4', sentence: '어떻게 사느냐는 결국 무엇을 기억하느냐의 문제다.', bookTitle: '파친코', author: '이민진', likes: 97 },
  { id: 's5', sentence: '행복은 강도가 아니라 빈도다.', bookTitle: '굿 라이프', author: '최인철', likes: 256 },
  { id: 's6', sentence: '좋은 문장은 다시 읽고 싶어진다.', bookTitle: '미움받을 용기', author: '기시미 이치로', likes: 180 },
  { id: 's7', sentence: '삶이 있는 한 희망은 있다.', bookTitle: '', author: '키케로', likes: 401 },
  { id: 's8', sentence: '내일은 내일의 태양이 뜬다.', bookTitle: '바람과 함께 사라지다', author: '마거릿 미첼', likes: 150 },
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
