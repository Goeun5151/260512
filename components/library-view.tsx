'use client'

import { useMemo, useState } from 'react'
import { Search, LayoutGrid, List, BookMarked, Library, Heart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useTags } from '@/lib/use-tags'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { RecordCard } from '@/components/record-card'
import { TemplateCard } from '@/components/template-card'
import { useTemplates } from '@/lib/use-templates'
import type { BookRecord, SortMode, ViewMode } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  records: BookRecord[]
  onOpen: (record: BookRecord) => void
  onToggleFavorite: (id: string) => void
}

export function LibraryView({ records, onOpen, onToggleFavorite }: Props) {
  const [view, setView] = useState<ViewMode>('list')
  const [sort, setSort] = useState<SortMode>('recent')
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([]) // 다중선택
  const [groupByBook, setGroupByBook] = useState(false)
  const [favoritesOnly, setFavoritesOnly] = useState(false)

  const { tags: savedTags } = useTags()
  const { templates } = useTemplates()

  function toggleTag(tag: string) {
    setSelectedTags((cur) => (cur.includes(tag) ? cur.filter((t) => t !== tag) : [...cur, tag]))
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = records
    if (favoritesOnly) list = list.filter((r) => r.favorite)
    if (selectedTags.length) {
      list = list.filter((r) => (r.tags ?? []).some((t) => selectedTags.includes(t)))
    }
    if (q) {
      list = list.filter(
        (r) =>
          r.sentence.toLowerCase().includes(q) ||
          r.bookTitle.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q) ||
          r.memo.toLowerCase().includes(q),
      )
    }
    const sorted = [...list]
    if (sort === 'recent') {
      sorted.sort((a, b) => b.createdAt - a.createdAt)
    } else if (sort === 'favorite') {
      sorted.sort((a, b) => Number(b.favorite) - Number(a.favorite) || b.createdAt - a.createdAt)
    } else {
      sorted.sort((a, b) => (a.bookTitle || '힣').localeCompare(b.bookTitle || '힣', 'ko'))
    }
    return sorted
  }, [records, query, sort, selectedTags, favoritesOnly])

  const groups = useMemo(() => {
    if (!groupByBook) return null
    const map = new Map<string, BookRecord[]>()
    for (const r of filtered) {
      const key = r.bookTitle.trim() || '제목 미정'
      const arr = map.get(key) ?? []
      arr.push(r)
      map.set(key, arr)
    }
    return Array.from(map.entries())
  }, [filtered, groupByBook])

  function renderCards(items: BookRecord[]) {
    if (view === 'grid') {
      return (
        <div className="grid grid-cols-2 gap-3">
          {items.map((r) => {
            const tpl = templates.find((t) => t.id === r.templateId) ?? templates[0]
            return (
              <div key={r.id} className="relative">
                <button type="button" onClick={() => onOpen(r)} className="block w-full overflow-hidden rounded-xl border">
                  <TemplateCard record={r} template={tpl} />
                </button>
                <button
                  type="button"
                  aria-label="즐겨찾기"
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(r.id) }}
                  className="absolute right-2 top-2 inline-flex size-7 items-center justify-center rounded-full bg-background/70 backdrop-blur"
                >
                  <Heart className={cn('size-4', r.favorite && 'fill-foreground text-foreground')} />
                </button>
              </div>
            )
          })}
        </div>
      )
    }
    return (
      <div className="space-y-3">
        {items.map((r) => (
          <RecordCard key={r.id} record={r} view="list" onOpen={onOpen} onToggleFavorite={onToggleFavorite} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="문장 · 책 · 저자 · 메모 검색"
            className="bg-background pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={(v) => setSort(v as SortMode)}>
            <SelectTrigger className="w-32 bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">최신순</SelectItem>
              <SelectItem value="favorite">즐겨찾기순</SelectItem>
              <SelectItem value="book">책 제목순</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center rounded-md border bg-background p-0.5">
            <Button variant="ghost" size="icon" aria-label="즐겨찾기만 보기"
              className={cn('size-8', favoritesOnly && 'bg-accent')} onClick={() => setFavoritesOnly((v) => !v)}>
              <Heart className={cn('size-4', favoritesOnly && 'fill-foreground')} />
            </Button>
            <Button variant="ghost" size="icon" aria-label="책별로 묶어보기"
              className={cn('size-8', groupByBook && 'bg-accent')} onClick={() => setGroupByBook((v) => !v)}>
              <Library className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="리스트 보기"
              className={cn('size-8', view === 'list' && 'bg-accent')} onClick={() => setView('list')}>
              <List className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="그리드 보기"
              className={cn('size-8', view === 'grid' && 'bg-accent')} onClick={() => setView('grid')}>
              <LayoutGrid className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* 태그 다중선택 필터 (설정에 저장된 태그) */}
      {savedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <TagChip label="전체" active={selectedTags.length === 0} onClick={() => setSelectedTags([])} />
          {savedTags.map((t) => (
            <TagChip key={t} label={`#${t}`} active={selectedTags.includes(t)} onClick={() => toggleTag(t)} />
          ))}
        </div>
      )}

      <p className="text-xs text-muted-foreground">{filtered.length}개의 기록</p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
          <BookMarked className="size-6 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            {query || selectedTags.length ? '해당하는 기록이 없어요.' : '아직 기록이 없어요.'}
          </p>
        </div>
      ) : groups ? (
        <div className="space-y-6">
          {groups.map(([book, items]) => (
            <section key={book}>
              <div className="mb-2 flex items-baseline gap-2">
                <h3 className="text-sm font-semibold">{book}</h3>
                <span className="text-xs text-muted-foreground">{items.length}</span>
              </div>
              {renderCards(items)}
            </section>
          ))}
        </div>
      ) : (
        renderCards(filtered)
      )}
    </div>
  )
}

function TagChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-shrink-0 rounded-full border px-3 py-1 text-xs transition-colors',
        active ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
    </button>
  )
}
