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

      {/* 인스타그램풍 2단 그리드 */}
      <div className="grid grid-cols-2 gap-3">
        {picks.map((q, i) => {
          const liked = isLiked(q.id)
          const tpl = templates[i % templates.length]
          return (
            <div key={q.id} className="relative overflow-hidden rounded-xl border">
              <TemplateCard
                record={{ sentence: q.sentence, bookTitle: q.bookTitle, author: q.author, chapter: '', page: q.page ?? '', cover: '' }}
                template={tpl}
              />
              {/* 하단 액션 오버레이 */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/45 to-transparent px-2 py-2">
                <button
                  type="button"
                  onClick={() => toggleLike(q.id)}
                  className="inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 text-xs text-white backdrop-blur"
                >
                  <Heart className={cn('size-3.5', liked && 'fill-white')} />
                  {q.likes + (liked ? 1 : 0)}
                </button>
                <button
                  type="button"
                  onClick={() => { onImport(q); toast.success('내 서재에 담았어요.') }}
                  className="inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-1 text-xs font-medium text-black backdrop-blur"
                >
                  <BookmarkPlus className="size-3.5" />담기
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
