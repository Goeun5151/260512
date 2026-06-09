'use client'

import { useCallback, useEffect, useState } from 'react'
import type { BookRecord } from './types'

const STORAGE_KEY = 'hanjul-records-v1'

function load(): BookRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as BookRecord[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function save(records: BookRecord[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch {
    // ignore quota errors
  }
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export type NewRecordInput = Omit<
  BookRecord,
  'id' | 'createdAt' | 'updatedAt' | 'favorite'
> & { favorite?: boolean }

export function useRecords() {
  const [records, setRecords] = useState<BookRecord[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setRecords(load())
    setLoaded(true)
  }, [])

  const persist = useCallback((next: BookRecord[]) => {
    setRecords(next)
    save(next)
  }, [])

  const addRecord = useCallback(
    (input: NewRecordInput) => {
      const now = Date.now()
      const record: BookRecord = {
        id: uid(),
        favorite: false,
        ...input,
        createdAt: now,
        updatedAt: now,
      }
      persist([record, ...load()])
      return record
    },
    [persist],
  )

  const updateRecord = useCallback(
    (id: string, patch: Partial<BookRecord>) => {
      const next = load().map((r) =>
        r.id === id ? { ...r, ...patch, updatedAt: Date.now() } : r,
      )
      persist(next)
    },
    [persist],
  )

  const deleteRecord = useCallback(
    (id: string) => {
      persist(load().filter((r) => r.id !== id))
    },
    [persist],
  )

  const toggleFavorite = useCallback(
    (id: string) => {
      const next = load().map((r) =>
        r.id === id ? { ...r, favorite: !r.favorite } : r,
      )
      persist(next)
    },
    [persist],
  )

  return {
    records,
    loaded,
    addRecord,
    updateRecord,
    deleteRecord,
    toggleFavorite,
  }
}
