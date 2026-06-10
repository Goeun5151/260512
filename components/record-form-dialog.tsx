'use client'

import { useEffect, useState } from 'react'
import { BookOpen, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { BookSearch } from '@/components/book-search'
import { useTags } from '@/lib/use-tags'
import { cn } from '@/lib/utils'
import type { BookRecord, BookSearchResult } from '@/lib/types'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial?: BookRecord | null
  onSubmit: (data: {
    sentence: string
    bookTitle: string
    author: string
    chapter: string
    page: string
    memo: string
    cover: string
    tags: string[]
  }) => void
}

const empty = {
  sentence: '',
  bookTitle: '',
  author: '',
  chapter: '',
  page: '',
  memo: '',
  cover: '',
  tags: [] as string[],
}

export function RecordFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
}: Props) {
  const [form, setForm] = useState(empty)
  const { tags: allTags, addTag } = useTags()
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (open) {
      setForm(
        initial
          ? {
              sentence: initial.sentence,
              bookTitle: initial.bookTitle,
              author: initial.author,
              chapter: initial.chapter ?? '',
              page: initial.page,
              memo: initial.memo,
              cover: initial.cover,
              tags: initial.tags ?? [],
            }
          : empty,
      )
    }
  }, [open, initial])

  function toggleTag(tag: string) {
    setForm((f) => ({
      ...f,
      tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag],
    }))
  }

  function handleSelectBook(book: BookSearchResult) {
    setForm((f) => ({
      ...f,
      bookTitle: book.title,
      author: book.authors.join(', '),
      cover: book.thumbnail,
    }))
  }

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const canSave = form.sentence.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-lg tracking-tight">
            {initial ? '기록 수정' : '한 줄 기록하기'}
          </DialogTitle>
          <DialogDescription className="text-xs">
            마음에 닿은 책 속 문장을 남겨보세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="sentence">책 속 문장</Label>
            <Textarea
              id="sentence"
              value={form.sentence}
              onChange={(e) => set('sentence', e.target.value)}
              placeholder="오래 기억하고 싶은 한 줄을 적어주세요."
              className="min-h-28 resize-none bg-background text-base leading-relaxed"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>책 검색</Label>
            <BookSearch onSelect={handleSelectBook} />
          </div>

          {form.cover ? (
            <div className="flex items-center gap-3 rounded-lg border bg-muted/40 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={form.cover || '/placeholder.svg'}
                alt=""
                className="h-16 w-11 flex-shrink-0 rounded object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {form.bookTitle || '제목 미정'}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {form.author || '저자 미상'}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 flex-shrink-0"
                onClick={() => set('cover', '')}
                aria-label="표지 제거"
              >
                <X className="size-4" />
              </Button>
            </div>
          ) : null}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input
                id="title"
                value={form.bookTitle}
                onChange={(e) => set('bookTitle', e.target.value)}
                placeholder="직접 입력 가능"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="author">저자</Label>
              <Input
                id="author"
                value={form.author}
                onChange={(e) => set('author', e.target.value)}
                placeholder="직접 입력 가능"
                className="bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="chapter">챕터</Label>
              <Input
                id="chapter"
                value={form.chapter}
                onChange={(e) => set('chapter', e.target.value)}
                placeholder="예: 3장 / 프롤로그"
                className="bg-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="page">페이지</Label>
              <Input
                id="page"
                value={form.page}
                onChange={(e) => set('page', e.target.value)}
                placeholder="예: 124"
                className="bg-background"
                inputMode="numeric"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memo">메모</Label>
            <Textarea
              id="memo"
              value={form.memo}
              onChange={(e) => set('memo', e.target.value)}
              placeholder="이 문장에 대한 생각을 덧붙여도 좋아요. (선택)"
              className="min-h-20 resize-none bg-background leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <Label>태그</Label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-sm transition-colors',
                    form.tags.includes(tag)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'bg-background text-muted-foreground hover:text-foreground',
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const t = newTag.trim()
                    if (t) { addTag(t); toggleTag(t); setNewTag('') }
                  }
                }}
                placeholder="새 태그 입력 후 Enter"
                className="bg-background"
              />
            </div>
          </div>
        </div>

        <DialogFooter className="border-t px-6 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            disabled={!canSave}
            onClick={() => {
              onSubmit({
                sentence: form.sentence.trim(),
                bookTitle: form.bookTitle.trim(),
                author: form.author.trim(),
                chapter: form.chapter.trim(),
                page: form.page.trim(),
                memo: form.memo.trim(),
                cover: form.cover,
                tags: form.tags,
              })
            }}
          >
            <BookOpen className="size-4" />
            {initial ? '수정 완료' : '기록하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
