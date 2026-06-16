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

// 진짜 공유(Supabase) 연결 전까지 준비중 표시
const COMING_SOON = true

export function SharedView({ onImport }: Props) {
  const { picks, refresh, toggleLike, isLiked } = useShared()
  const { templates } = useTemplates()

  if (COMING_SOON) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <Users className="size-6 text-muted-foreground" />
        </div>
        <h2 className="mt-5 text-lg font-semibold">공유 서재는 곧 열려요</h2>
        <p className="mt-2 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
          다른 사람들이 기록한 문장을 둘러보고 내 서재로 담아오는 기능을 준비하고 있어요.
        </p>
      </div>
    )
  }

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
