'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useTags } from '@/lib/use-tags'

export default function TagsPage() {
  const { tags, addTag, removeTag } = useTags()
  const [newTag, setNewTag] = useState('')

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 pb-16 sm:px-6">
      <header className="flex items-center gap-2 pt-8 pb-4">
        <Link href="/" aria-label="뒤로" className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent">
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">태그</h1>
      </header>

      <p className="mb-4 text-xs text-muted-foreground">
        태그 키워드를 저장해두면, 기록할 때 골라서 달고 내 서재에서 태그별로 모아볼 수 있어요.
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 rounded-full border bg-background px-3 py-1.5 text-sm">
            {t}
            <button type="button" aria-label={`${t} 삭제`} onClick={() => removeTag(t)} className="text-muted-foreground hover:text-foreground">
              <X className="size-3.5" />
            </button>
          </span>
        ))}
        {tags.length === 0 ? <span className="text-xs text-muted-foreground">저장된 태그가 없어요.</span> : null}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => { e.preventDefault(); addTag(newTag); setNewTag('') }}
      >
        <Input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="새 태그 입력" className="bg-background" />
        <Button type="submit" className="flex-shrink-0 gap-1.5"><Plus className="size-4" />추가</Button>
      </form>
    </div>
  )
}
