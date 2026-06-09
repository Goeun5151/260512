'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, Loader2, BookOpen } from 'lucide-react'
import { Input } from '@/components/ui/input'
import type { BookSearchResult } from '@/lib/types'
import { searchBooks } from '@/lib/book-search'
import { cn } from '@/lib/utils'

type Props = {
  onSelect: (book: BookSearchResult) => void
}

export function BookSearch({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BookSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [needKey, setNeedKey] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current)
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setOpen(false)
      return
    }
    timer.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchBooks(q)
        setNeedKey(Boolean(data.needKey))
        setResults(data.results ?? [])
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 400)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [query])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="책 제목을 검색해 표지·저자 자동 입력"
          className="bg-background pl-9"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {needKey && (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          카카오 책 검색 키(KAKAO_REST_API_KEY)가 아직 설정되지 않았어요. 아래
          항목을 직접 입력해도 기록할 수 있습니다.
        </p>
      )}

      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-lg border bg-popover p-1 shadow-lg">
          {results.map((book, i) => (
            <button
              key={`${book.title}-${i}`}
              type="button"
              onClick={() => {
                onSelect(book)
                setOpen(false)
                setQuery('')
                setResults([])
              }}
              className={cn(
                'flex w-full items-start gap-3 rounded-md p-2 text-left transition-colors',
                'hover:bg-accent focus:bg-accent focus:outline-none',
              )}
            >
              <div className="flex h-14 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
                {book.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={book.thumbnail || '/placeholder.svg'}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BookOpen className="size-4 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{book.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {book.authors.join(', ') || '저자 미상'}
                  {book.publisher ? ` · ${book.publisher}` : ''}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
