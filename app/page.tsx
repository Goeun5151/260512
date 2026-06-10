'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DailyView } from '@/components/daily-view'
import { LibraryView } from '@/components/library-view'
import { SharedView } from '@/components/shared-view'
import { publishShared, type SharedQuote } from '@/lib/use-shared'
import { downloadCsv } from '@/lib/export'
import { RecordFormDialog } from '@/components/record-form-dialog'
import { RecordDetailDialog } from '@/components/record-detail-dialog'
import { useRecords } from '@/lib/use-records'
import type { BookRecord } from '@/lib/types'
import { cn } from '@/lib/utils'

type Tab = 'today' | 'library' | 'shared'

export default function Page() {
  const router = useRouter()
  const {
    records,
    loaded,
    addRecord,
    updateRecord,
    deleteRecord,
    toggleFavorite,
  } = useRecords()

  const [tab, setTab] = useState<Tab>('today')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<BookRecord | null>(null)
  const [selected, setSelected] = useState<BookRecord | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)

  const selectedLive = selected
    ? records.find((r) => r.id === selected.id) ?? selected
    : null

  const titleOptions = useMemo(
    () => Array.from(new Set(records.map((r) => r.bookTitle.trim()).filter(Boolean))),
    [records],
  )
  const authorOptions = useMemo(
    () => Array.from(new Set(records.map((r) => r.author.trim()).filter(Boolean))),
    [records],
  )

  function openAdd() {
    setEditing(null)
    setFormOpen(true)
  }

  function openDetail(record: BookRecord) {
    setSelected(record)
    setDetailOpen(true)
  }

  function handleSubmit(data: {
    sentence: string
    bookTitle: string
    author: string
    chapter: string
    page: string
    memo: string
    cover: string
    tags: string[]
    visibility: 'private' | 'public'
  }) {
    if (editing) {
      updateRecord(editing.id, data)
      toast.success('기록을 수정했어요.')
    } else {
      addRecord(data)
      toast.success(data.visibility === 'public' ? '한 줄을 기록하고 공유했어요.' : '한 줄을 기록했어요.')
    }
    if (data.visibility === 'public') {
      publishShared({ sentence: data.sentence, bookTitle: data.bookTitle, author: data.author, page: data.page })
    }
    setFormOpen(false)
    setEditing(null)
  }

  function importShared(q: SharedQuote) {
    addRecord({
      sentence: q.sentence, bookTitle: q.bookTitle, author: q.author,
      chapter: '', page: q.page ?? '', memo: '', cover: '', tags: [], visibility: 'private',
    })
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 pb-28 sm:px-6">
      <header className="pt-10 pb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">독서기록</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              책 속 문장을 모아두고, 매일 다시 꺼내 보는 곳
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label="설정"
              className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <Settings className="size-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-28">
              <DropdownMenuItem onClick={() => router.push('/settings')}>템플릿</DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/settings/tags')}>태그</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  if (records.length === 0) { toast.error('내보낼 기록이 없어요.'); return }
                  downloadCsv(records)
                  toast.success('CSV로 내보냈어요.')
                }}
              >
                내보내기(CSV)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <nav className="mt-6 flex gap-1 rounded-lg border bg-background p-1">
          <TabButton active={tab === 'today'} onClick={() => setTab('today')}>
            오늘의 한 줄
          </TabButton>
          <TabButton active={tab === 'library'} onClick={() => setTab('library')}>
            내 서재
          </TabButton>
          <TabButton active={tab === 'shared'} onClick={() => setTab('shared')}>
            공유 서재
          </TabButton>
        </nav>
      </header>

      <main className="flex-1">
        {!loaded ? (
          <div className="space-y-3">
            <div className="h-40 animate-pulse rounded-2xl bg-muted" />
            <div className="h-16 animate-pulse rounded-xl bg-muted" />
          </div>
        ) : tab === 'today' ? (
          <DailyView records={records} onOpen={openDetail} onAdd={openAdd} />
        ) : tab === 'library' ? (
          <LibraryView
            records={records}
            onOpen={openDetail}
            onToggleFavorite={toggleFavorite}
          />
        ) : (
          <SharedView onImport={importShared} />
        )}
      </main>

      <Button
        onClick={openAdd}
        size="lg"
        className="fixed bottom-6 left-1/2 z-40 h-12 -translate-x-1/2 rounded-full px-6 shadow-lg"
      >
        <Plus className="size-5" />한 줄 기록
      </Button>

      <RecordFormDialog
        open={formOpen}
        onOpenChange={(v) => {
          setFormOpen(v)
          if (!v) setEditing(null)
        }}
        initial={editing}
        titleOptions={titleOptions}
        authorOptions={authorOptions}
        onSubmit={handleSubmit}
      />

      <RecordDetailDialog
        record={selectedLive}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onToggleFavorite={toggleFavorite}
        onEdit={(record) => {
          setDetailOpen(false)
          setEditing(record)
          setFormOpen(true)
        }}
        onDelete={deleteRecord}
        onSelectTemplate={(id, templateId) => updateRecord(id, { templateId })}
      />
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex-1 rounded-md py-2 text-sm font-medium transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}
