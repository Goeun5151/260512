'use client'

import { Heart, Shuffle, BookmarkPlus, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { TemplateCard } from '@/components/template-card'
import { useTemplates } from '@/lib/use-templates'
import { useShared, type SharedQuote } from '@/lib/use-shared'
import { cn } from '@/lib/utils'

type Props = {
  onImport: (q: SharedQuote) => void
}

export function SharedView({ onImport }: Props) {
  const { picks, refresh, toggleLike, isLiked } = useShared()
  const { templates } = useTemplates()

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

      {/* 인스타그램풍 1열 피드: 카드 + 구분선 + 아이콘 */}
      <div className="space-y-5">
        {picks.map((q, i) => {
          const liked = isLiked(q.id)
          const tpl = templates[i % templates.length]
          return (
            <div key={q.id} className="mx-auto w-[70%] overflow-hidden rounded-xl border bg-card">
              <TemplateCard
                record={{ sentence: q.sentence, bookTitle: q.bookTitle, author: q.author, chapter: '', page: q.page ?? '', cover: '' }}
                template={tpl}
              />
              {/* 회색 구분선 아래 액션 아이콘 */}
              <div className="flex items-center gap-4 border-t px-4 py-2.5">
                <button
                  type="button"
                  aria-label="좋아요"
                  onClick={() => toggleLike(q.id)}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Heart className={cn('size-5', liked && 'fill-foreground text-foreground')} />
                  {q.likes + (liked ? 1 : 0)}
                </button>
                <button
                  type="button"
                  aria-label="담기"
                  onClick={() => { onImport(q); toast.success('내 서재에 담았어요.') }}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <BookmarkPlus className="size-5" />담기
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
