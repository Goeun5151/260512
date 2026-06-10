'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, RotateCcw, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { TemplateEditor } from '@/components/template-editor'
import { useTemplates } from '@/lib/use-templates'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { templates, loaded, updateTemplate, resetTemplates } = useTemplates()
  const [activeId, setActiveId] = useState<string>('t1')
  const active = templates.find((t) => t.id === activeId) ?? templates[0]

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 pb-16 sm:px-6">
      <header className="flex items-center gap-2 pt-8 pb-4">
        <Link
          href="/"
          aria-label="뒤로"
          className="inline-flex size-9 items-center justify-center rounded-md hover:bg-accent"
        >
          <ChevronLeft className="size-5" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">템플릿</h1>
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={resetTemplates} className="gap-1.5 text-muted-foreground">
          <RotateCcw className="size-4" />초기화
        </Button>
        <Button size="sm" onClick={() => toast.success('템플릿을 저장했어요.')} className="gap-1.5">
          <Check className="size-4" />저장
        </Button>
      </header>

      <section>
        <h2 className="mb-1 text-sm font-semibold">기록 카드 템플릿</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          5개의 템플릿을 미리 꾸며두고, 기록을 공유할 때 골라서 적용해요.
        </p>

        {/* template slots */}
        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveId(t.id)}
              className={cn(
                'flex-shrink-0 rounded-lg border px-3 py-2 text-sm transition-colors',
                t.id === active?.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'bg-background text-muted-foreground hover:text-foreground',
              )}
            >
              {t.name}
            </button>
          ))}
        </div>

        {loaded && active ? (
          <TemplateEditor template={active} onChange={(patch) => updateTemplate(active.id, patch)} />
        ) : null}
      </section>
    </div>
  )
}
