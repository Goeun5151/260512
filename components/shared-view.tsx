'use client'

import { Heart, Shuffle, BookmarkPlus, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useShared, type SharedQuote } from '@/lib/use-shared'
import { cn } from '@/lib/utils'

type Props = {
  onImport: (q: SharedQuote) => void
}

export function SharedView({ onImport }: Props) {
  const { picks, refresh, toggleLike, isLiked } = useShared()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="size-4" />
          <span className="text-xs font-medium uppercase tracking-widest">공유 서재</span>
        </div>
        <Button variant="ghost" size="sm" onClick={refresh} className="gap-1.5 text-muted-foreground">
          <Shuffle className="size-4" />다른 글 보기
        </Button>
      </div>

      <div className="space-y-3">
        {picks.map((q) => {
          const liked = isLiked(q.id)
          const meta = [q.bookTitle, q.author].filter(Boolean).join(' · ') || '제목 미정'
          return (
            <div key={q.id} className="paper rounded-xl border p-4 shadow-sm">
              <blockquote className="text-pretty text-[15px] font-medium leading-relaxed">
                {q.sentence}
              </blockquote>
              <p className="mt-2 text-xs text-muted-foreground">{meta}</p>
              <div className="mt-3 flex items-center gap-1 border-t pt-3">
                <Button variant="ghost" size="sm" onClick={() => toggleLike(q.id)} className="gap-1.5">
                  <Heart className={cn('size-4', liked && 'fill-foreground text-foreground')} />
                  {q.likes + (liked ? 1 : 0)}
                </Button>
                <div className="flex-1" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { onImport(q); toast.success('내 서재에 담았어요.') }}
                  className="gap-1.5"
                >
                  <BookmarkPlus className="size-4" />담아오기
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
