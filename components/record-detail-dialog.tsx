'use client'

import { Heart, Share2, Pencil, Trash2, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { BookRecord } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  record: BookRecord | null
  open: boolean
  onOpenChange: (v: boolean) => void
  onToggleFavorite: (id: string) => void
  onEdit: (record: BookRecord) => void
  onDelete: (id: string) => void
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function RecordDetailDialog({
  record,
  open,
  onOpenChange,
  onToggleFavorite,
  onEdit,
  onDelete,
}: Props) {
  if (!record) return null

  async function handleShare() {
    if (!record) return
    const meta = [record.bookTitle, record.author].filter(Boolean).join(' · ')
    const text = `"${record.sentence}"${meta ? `\n— ${meta}` : ''}${
      record.page ? ` (p.${record.page})` : ''
    }`
    try {
      if (navigator.share) {
        await navigator.share({ text })
      } else {
        await navigator.clipboard.writeText(text)
        toast.success('문장을 클립보드에 복사했어요.')
      }
    } catch {
      // user cancelled share
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogTitle className="sr-only">기록 상세</DialogTitle>

        <div className="paper px-6 pb-6 pt-8">
          <span className="font-serif text-5xl leading-none text-muted-foreground/50">
            &ldquo;
          </span>
          <blockquote className="mt-1 text-pretty text-xl font-medium leading-relaxed">
            {record.sentence}
          </blockquote>

          <div className="mt-6 flex items-center gap-3 border-t pt-4">
            <div className="flex h-16 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
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
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {record.bookTitle || '제목 미정'}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {record.author || '저자 미상'}
                {record.chapter ? ` · ${record.chapter}` : ''}
                {record.page ? ` · p.${record.page}` : ''}
              </p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                {formatDate(record.createdAt)}
              </p>
            </div>
          </div>

          {record.memo ? (
            <div className="mt-4 rounded-lg border bg-muted/40 p-4">
              <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                메모
              </p>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {record.memo}
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-1 border-t px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleFavorite(record.id)}
            className="gap-1.5"
          >
            <Heart
              className={cn(
                'size-4',
                record.favorite && 'fill-foreground text-foreground',
              )}
            />
            즐겨찾기
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="gap-1.5"
          >
            <Share2 className="size-4" />
            공유
          </Button>
          <div className="flex-1" />
          <Button
            variant="ghost"
            size="icon"
            aria-label="수정"
            onClick={() => onEdit(record)}
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="삭제"
            className="text-destructive hover:text-destructive"
            onClick={() => {
              onDelete(record.id)
              onOpenChange(false)
              toast.success('기록을 삭제했어요.')
            }}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
