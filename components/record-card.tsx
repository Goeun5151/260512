'use client'

import { Star, BookOpen } from 'lucide-react'
import type { BookRecord, ViewMode } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  record: BookRecord
  view: ViewMode
  onOpen: (record: BookRecord) => void
  onToggleFavorite: (id: string) => void
}

export function RecordCard({ record, view, onOpen, onToggleFavorite }: Props) {
  const meta = [record.bookTitle, record.author].filter(Boolean).join(' · ')

  if (view === 'grid') {
    return (
      <button
        type="button"
        onClick={() => onOpen(record)}
        className="paper group relative flex h-full flex-col rounded-xl border p-5 text-left shadow-sm transition-shadow hover:shadow-md"
      >
        <FavoriteButton record={record} onToggle={onToggleFavorite} />
        <blockquote className="line-clamp-5 flex-1 text-pretty text-[15px] font-medium leading-relaxed">
          {record.sentence}
        </blockquote>
        <div className="mt-4 flex items-center gap-2 border-t pt-3">
          <Cover record={record} className="h-10 w-7" />
          <div className="min-w-0">
            <p className="truncate text-xs font-medium">
              {record.bookTitle || '제목 미정'}
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              {record.author || '저자 미상'}
              {record.page ? ` · p.${record.page}` : ''}
            </p>
          </div>
        </div>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={() => onOpen(record)}
      className="paper group relative flex w-full items-stretch gap-4 rounded-xl border p-4 text-left shadow-sm transition-shadow hover:shadow-md"
    >
      <Cover record={record} className="h-20 w-14 flex-shrink-0" />
      <div className="min-w-0 flex-1 pr-7">
        <blockquote className="line-clamp-2 text-pretty text-[15px] font-medium leading-relaxed">
          {record.sentence}
        </blockquote>
        <p className="mt-2 truncate text-xs text-muted-foreground">
          {meta || '제목 미정'}
          {record.page ? ` · p.${record.page}` : ''}
        </p>
      </div>
      <FavoriteButton record={record} onToggle={onToggleFavorite} />
    </button>
  )
}

function Cover({
  record,
  className,
}: {
  record: BookRecord
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-shrink-0 items-center justify-center overflow-hidden rounded bg-muted',
        className,
      )}
    >
      {record.cover ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={record.cover || '/placeholder.svg'}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        <BookOpen className="size-4 text-muted-foreground" />
      )}
    </div>
  )
}

function FavoriteButton({
  record,
  onToggle,
}: {
  record: BookRecord
  onToggle: (id: string) => void
}) {
  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={record.favorite ? '즐겨찾기 해제' : '즐겨찾기'}
      onClick={(e) => {
        e.stopPropagation()
        onToggle(record.id)
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          e.stopPropagation()
          onToggle(record.id)
        }
      }}
      className="absolute right-3 top-3 inline-flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
    >
      <Star
        className={cn(
          'size-4',
          record.favorite && 'fill-foreground text-foreground',
        )}
      />
    </span>
  )
}
