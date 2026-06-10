'use client'

import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'
import { Download } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { TemplateCard } from '@/components/template-card'
import { useTemplates, useSelectedTemplate } from '@/lib/use-templates'
import type { BookRecord } from '@/lib/types'
import { cn } from '@/lib/utils'

type Props = {
  record: BookRecord | null
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function ShareCardDialog({ record, open, onOpenChange }: Props) {
  const { templates } = useTemplates()
  const { selectedId, select } = useSelectedTemplate()
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [saving, setSaving] = useState(false)

  if (!record) return null
  const template = templates.find((t) => t.id === selectedId) ?? templates[0]

  async function saveImage() {
    if (!cardRef.current) return
    setSaving(true)
    try {
      const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true })
      const link = document.createElement('a')
      link.download = `한줄기록-${Date.now()}.png`
      link.href = dataUrl
      link.click()
      toast.success('카드 이미지를 저장했어요.')
    } catch {
      toast.error('이미지 저장에 실패했어요.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 p-0 sm:max-w-md">
        <DialogTitle className="border-b px-5 py-3 text-base">카드로 공유</DialogTitle>

        <div className="px-5 py-4">
          <div className="mx-auto w-64">
            <TemplateCard record={record} template={template} innerRef={(el) => (cardRef.current = el)} />
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {templates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => select(t.id)}
                className={cn(
                  'flex-shrink-0 rounded-md border px-3 py-1.5 text-xs transition-colors',
                  t.id === template.id
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:text-foreground',
                )}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-5 py-3">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>닫기</Button>
          <Button onClick={saveImage} disabled={saving} className="gap-1.5">
            <Download className="size-4" />
            {saving ? '저장 중…' : '이미지로 저장'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
