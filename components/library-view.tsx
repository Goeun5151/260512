'use client'

import { useMemo, useState } from 'react'
import { Search, LayoutGrid, List, BookMarked } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { RecordCard } from '@/components/record-card'
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

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = records
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
      sorted.sort(
        (a, b) =>
          Number(b.favorite) - Number(a.favorite) || b.createdAt - a.createdAt,
      )
    } else {
      sorted.sort((a, b) =>
        (a.bookTitle || '힣').localeCompare(b.bookTitle || '힣', 'ko'),
      )
    }
    return sorted
  }, [records, query, sort])

  return (
    <div className="space-y-5">
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
            <Button
              variant="ghost"
              size="icon"
              aria-label="리스트 보기"
              className={cn('size-8', view === 'list' && 'bg-accent')}
              onClick={() => setView('list')}
            >
              <List className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="그리드 보기"
              className={cn('size-8', view === 'grid' && 'bg-accent')}
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length}개의 기록
      </p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 text-center">
          <BookMarked className="size-6 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">
            {query ? '검색 결과가 없어요.' : '아직 기록이 없어요.'}
          </p>
        </div>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {filtered.map((r) => (
            <RecordCard
              key={r.id}
              record={r}
              view="grid"
              onOpen={onOpen}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <RecordCard
              key={r.id}
              record={r}
              view="list"
              onOpen={onOpen}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  )
}
