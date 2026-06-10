'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { DailyView } from '@/components/daily-view'
import { LibraryView } from '@/components/library-view'
import { RecordFormDialog } from '@/components/record-form-dialog'
import { RecordDetailDialog } from '@/components/record-detail-dialog'
import { useRecords } from '@/lib/use-records'
import type { BookRecord } from '@/lib/types'
import { cn } from '@/lib/utils'

type Tab = 'today' | 'library'

export default function Page() {
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
  }) {
    if (editing) {
      updateRecord(editing.id, data)
      toast.success('기록을 수정했어요.')
    } else {
      addRecord(data)
      toast.success('한 줄을 기록했어요.')
    }
    setFormOpen(false)
    setEditing(null)
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 pb-28 sm:px-6">
      <header className="pt-10 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">한줄기록</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              책 속 문장을 모아두고, 매일 다시 꺼내 보는 곳
            </p>
          </div>
        </div>

        <nav className="mt-6 flex gap-1 rounded-lg border bg-background p-1">
          <TabButton active={tab === 'today'} onClick={() => setTab('today')}>
            오늘의 한 줄
          </TabButton>
          <TabButton
            active={tab === 'library'}
            onClick={() => setTab('library')}
          >
            내 서재
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
        ) : (
          <LibraryView
            records={records}
            onOpen={openDetail}
            onToggleFavorite={toggleFavorite}
          />
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
