'use client'

import { useMemo } from 'react'
import { Sparkles, Plus, BookMarked } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { BookRecord } from '@/lib/types'

type Props = {
  records: BookRecord[]
  onOpen: (record: BookRecord) => void
  onAdd: () => void
}

export function DailyView({ records, onOpen, onAdd }: Props) {
  const daily = useMemo(() => {
    if (records.length === 0) return null
    const today = new Date()
    const seed =
      today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    return records[seed % records.length]
  }, [records])

  const recent = useMemo(
    () =>
      [...records]
        .sort((a, b) => b.createdAt - a.createdAt)
        .filter((r) => r.id !== daily?.id)
        .slice(0, 3),
    [records, daily],
  )

  if (records.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <BookMarked className="size-6 text-muted-foreground" />
        </div>
        <h2 className="mt-5 text-balance text-lg font-semibold">
          첫 문장을 기록해보세요
        </h2>
        <p className="mt-2 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
          책을 읽다 마음에 닿은 한 줄을 남기면, 매일 이곳에서 다시 만날 수 있어요.
        </p>
        <Button className="mt-6" onClick={onAdd}>
          <Plus className="size-4" />첫 기록 남기기
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-3 flex items-center gap-2 text-muted-foreground">
          <Sparkles className="size-4" />
          <span className="text-xs font-medium uppercase tracking-widest">
            오늘의 한 줄
          </span>
        </div>
        {daily && (
          <button
            type="button"
            onClick={() => onOpen(daily)}
            className="paper block w-full rounded-2xl border px-7 py-10 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            <span className="font-serif text-6xl leading-none text-muted-foreground/40">
              &ldquo;
            </span>
            <blockquote className="mt-2 text-balance text-2xl font-semibold leading-relaxed tracking-tight md:text-[28px]">
              {daily.sentence}
            </blockquote>
            <p className="mt-6 text-sm text-muted-foreground">
              {[daily.bookTitle, daily.author].filter(Boolean).join(' · ') ||
                '제목 미정'}
              {daily.page ? ` · p.${daily.page}` : ''}
            </p>
          </button>
        )}
      </section>

      {recent.length > 0 && (
        <section>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            최근 기록
          </h2>
          <div className="space-y-3">
            {recent.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => onOpen(r)}
                className="paper flex w-full items-center gap-4 rounded-xl border p-4 text-left shadow-sm transition-shadow hover:shadow-md"
              >
                <blockquote className="line-clamp-1 flex-1 text-sm font-medium">
                  {r.sentence}
                </blockquote>
                <span className="flex-shrink-0 text-xs text-muted-foreground">
                  {r.bookTitle || '제목 미정'}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
