'use client'

import { useCallback, useEffect, useState } from 'react'
import { defaultTemplates, type Template } from './templates'

// NOTE: storage layer is isolated here. To add cloud sharing later, swap the
// localStorage read/write for a Supabase client — UI doesn't change.
const STORAGE_KEY = 'hanjul-templates-v1'
const SELECTED_KEY = 'hanjul-selected-template-v1'

// Fill in any fields missing from older saved templates (forward-compatible).
function normalize(t: any): Template {
  const d = defaultTemplates()[0]
  return {
    id: t?.id ?? `t-${Math.random().toString(36).slice(2, 8)}`,
    name: t?.name ?? '템플릿',
    background: t?.background ?? d.background,
    backgroundImage: t?.backgroundImage ?? '',
    sentence: { ...d.sentence, ...(t?.sentence ?? {}) },
    title: { ...d.title, ...(t?.title ?? {}) },
    titleFormat: t?.titleFormat ?? d.titleFormat,
    meta: { ...d.meta, ...(t?.meta ?? {}) },
    showAuthor: t?.showAuthor ?? true,
    showChapter: t?.showChapter ?? false,
    showPage: t?.showPage ?? true,
    cover: { ...d.cover, ...(t?.cover ?? {}) },
  }
}

function load(): Template[] {
  if (typeof window === 'undefined') return defaultTemplates()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultTemplates()
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed) || parsed.length === 0) return defaultTemplates()
    return parsed.map(normalize)
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
