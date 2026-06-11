'use client'

import { useState } from 'react'
import { ScanText, ImagePlus, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { recognizeLines, type OcrEngine } from '@/lib/ocr'
import { cn } from '@/lib/utils'

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  onInsert: (text: string) => void
}

export function OcrDialog({ open, onOpenChange, onInsert }: Props) {
  const [lines, setLines] = useState<string[]>([])
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const [engine, setEngine] = useState<OcrEngine | null>(null)
  const [nativeError, setNativeError] = useState<string | undefined>()

  function reset() {
    setLines([]); setSelected(new Set()); setLoading(false); setProgress(0); setDone(false)
    setEngine(null); setNativeError(undefined)
  }

  async function handleFile(file: File) {
    reset()
    setLoading(true)
    try {
      const result = await recognizeLines(file, (p) => setProgress(p))
      setLines(result.lines)
      setEngine(result.engine)
      setNativeError(result.nativeError)
      setSelected(new Set(result.lines.map((_, i) => i))) // 기본 전체 선택
      setDone(true)
    } catch {
      toast.error('문자 인식에 실패했어요. (첫 실행은 인터넷이 필요해요)')
    } finally {
      setLoading(false)
    }
  }

  function toggle(i: number) {
    setSelected((cur) => {
      const next = new Set(cur)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }

  function insert() {
    const text = lines.filter((_, i) => selected.has(i)).join(' ').trim()
    if (!text) { toast.error('선택한 줄이 없어요.'); return }
    onInsert(text)
    onOpenChange(false)
    reset()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset() }}>
      <DialogContent className="gap-0 p-0 sm:max-w-md">
        <DialogTitle className="border-b px-5 py-3 text-base">사진에서 문자 인식</DialogTitle>

        <div className="max-h-[60vh] overflow-y-auto px-5 py-4">
          {!done && !loading ? (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed py-12 text-center hover:bg-accent">
              <ImagePlus className="size-7 text-muted-foreground" />
              <span className="text-sm font-medium">사진 / 스크린샷 선택</span>
              <span className="text-xs text-muted-foreground">갤러리에서 고르거나 촬영</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = '' }}
              />
            </label>
          ) : null}

          {loading ? (
            <div className="py-10 text-center">
              <ScanText className="mx-auto size-7 animate-pulse text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">문자 인식 중… {Math.round(progress * 100)}%</p>
              <div className="mx-auto mt-3 h-1.5 w-48 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-foreground transition-all" style={{ width: `${progress * 100}%` }} />
              </div>
            </div>
          ) : null}

          {done && !loading ? (
            lines.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">인식된 글자가 없어요. 다른 사진을 시도해보세요.</p>
            ) : (
              <div className="space-y-1.5">
                <p className="mb-2 text-xs text-muted-foreground">넣을 줄을 선택하세요.</p>
                <div className="mb-2 rounded-md bg-muted px-2 py-1 text-[11px] leading-snug text-muted-foreground">
                  엔진: {engine === 'mlkit-korean' ? 'ML Kit 한국어(네이티브)' : 'Tesseract(웹 폴백)'}
                  {nativeError ? <span className="block text-amber-700">네이티브 실패: {nativeError}</span> : null}
                </div>
                {lines.map((line, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggle(i)}
                    className={cn(
                      'flex w-full items-start gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors',
                      selected.has(i) ? 'border-primary bg-primary/10' : 'bg-background text-muted-foreground',
                    )}
                  >
                    <span className={cn('mt-0.5 inline-flex size-4 flex-shrink-0 items-center justify-center rounded border', selected.has(i) ? 'border-primary bg-primary text-primary-foreground' : 'border-current')}>
                      {selected.has(i) ? <Check className="size-3" /> : null}
                    </span>
                    <span className="text-foreground">{line}</span>
                  </button>
                ))}
              </div>
            )
          ) : null}
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-5 py-3">
          {done ? (
            <Button variant="ghost" onClick={() => reset()}>다시 선택</Button>
          ) : null}
          <Button variant="ghost" onClick={() => onOpenChange(false)}>닫기</Button>
          <Button onClick={insert} disabled={!done || selected.size === 0}>선택 넣기</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
