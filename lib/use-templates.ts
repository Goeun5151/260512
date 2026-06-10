'use client'

import { useCallback, useEffect, useState } from 'react'
import { defaultTemplates, type Template } from './templates'

// NOTE: storage layer is isolated here. To add cloud sharing later, swap the
// localStorage read/write for a Supabase client — UI doesn't change.
const STORAGE_KEY = 'hanjul-templates-v1'
const SELECTED_KEY = 'hanjul-selected-template-v1'

function load(): Template[] {
  if (typeof window === 'undefined') return defaultTemplates()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultTemplates()
    const parsed = JSON.parse(raw) as Template[]
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultTemplates()
    return parsed
  } catch {
    return defaultTemplates()
  }
}

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates())
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setTemplates(load())
    setLoaded(true)
  }, [])

  const persist = useCallback((next: Template[]) => {
    setTemplates(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }, [])

  const updateTemplate = useCallback(
    (id: string, patch: Partial<Template>) => {
      persist(load().map((t) => (t.id === id ? { ...t, ...patch } : t)))
    },
    [persist],
  )

  const resetTemplates = useCallback(() => persist(defaultTemplates()), [persist])

  return { templates, loaded, updateTemplate, resetTemplates }
}

/** The template id the user last chose to apply when sharing a record. */
export function useSelectedTemplate() {
  const [selectedId, setSelectedId] = useState<string>('t1')
  useEffect(() => {
    try {
      const v = window.localStorage.getItem(SELECTED_KEY)
      if (v) setSelectedId(v)
    } catch {}
  }, [])
  const select = useCallback((id: string) => {
    setSelectedId(id)
    try { window.localStorage.setItem(SELECTED_KEY, id) } catch {}
  }, [])
  return { selectedId, select }
}
