'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, RotateCcw, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { TemplateEditor } from '@/components/template-editor'
import { useTemplates, useSelectedTemplate } from '@/lib/use-templates'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { templates, loaded, updateTemplate, resetTemplates } = useTemplates()
  const { selectedId: defaultTemplateId, select: setDefaultTemplate } = useSelectedTemplate()
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
        <Button size="sm" onClick={() => toast.success('저장했어요.')} className="gap-1.5">
          <Check className="size-4" />저장
        </Button>
      </header>

      <section>
        <h2 className="mb-1 text-sm font-semibold">기록 카드 템플릿</h2>
        <p className="mb-3 text-xs text-muted-foreground">
          5개의 템플릿을 미리 꾸며두고, 기록할 때 골라서 적용해요.
        </p>

        {/* 기본 템플릿 선택 */}
        <div className="mb-4 rounded-lg border bg-card/40 p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">기본 템플릿 (새 기록에 자동 선택)</p>
          <div className="flex flex-wrap gap-1.5">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => { setDefaultTemplate(t.id); toast.success(`기본 템플릿: ${t.name}`) }}
                className={cn(
                  'rounded-full border px-3 py-1 text-xs transition-colors',
                  defaultTemplateId === t.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground',
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

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
