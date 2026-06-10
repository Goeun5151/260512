'use client'

import { Bold, Underline, Italic, AlignLeft, AlignCenter, AlignRight, Check, Image as ImageIcon } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { TemplateCard } from '@/components/template-card'
import {
  BG_SWATCHES, TEXT_SWATCHES, FONT_OPTIONS, DEFAULT_BG_IMAGES,
  type AlignKey, type FontKey, type Template, type TextStyle, type TitleFormat,
} from '@/lib/templates'
import { cn } from '@/lib/utils'

const SAMPLE = {
  sentence: '사람은 자신이 본 것만큼만 세상을 이해한다.',
  bookTitle: '데미안',
  author: '헤르만 헤세',
  chapter: '3장',
  page: '87',
  cover: '/placeholder.svg',
}

type Props = {
  template: Template
  onChange: (patch: Partial<Template>) => void
}

export function TemplateEditor({ template: t, onChange }: Props) {
  return (
    <div>
      {/* 고정 미리보기 */}
      <div className="sticky top-0 z-10 -mx-1 bg-background px-1 pb-4 pt-1">
        <div className="mx-auto w-56">
          <TemplateCard record={SAMPLE} template={t} />
        </div>
      </div>

      {/* 스크롤되는 컨트롤 */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>템플릿 이름</Label>
          <Input value={t.name} onChange={(e) => onChange({ name: e.target.value })} className="bg-background" />
        </div>

        <Section title="배경">
          <Swatches values={BG_SWATCHES} current={t.background} onPick={(c) => onChange({ background: c, backgroundImage: '' })} />
          {/* 기본 제공 배경 이미지 */}
          <div className="mt-3 flex gap-2">
            {DEFAULT_BG_IMAGES.map((bg) => (
              <button
                key={bg.src}
                type="button"
                aria-label={bg.label}
                onClick={() => onChange({ backgroundImage: bg.src })}
                className={cn(
                  'h-14 w-11 overflow-hidden rounded-md border-2 transition-transform',
                  t.backgroundImage === bg.src ? 'border-foreground scale-105' : 'border-border',
                )}
              >
                <img src={bg.src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border bg-background px-3 py-2 text-sm hover:bg-accent">
              <ImageIcon className="size-4" />
              내 사진 선택
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file) onChange({ backgroundImage: await fileToDataUrl(file) })
                  e.target.value = ''
                }}
              />
            </label>
            {t.backgroundImage ? (
              <button
                type="button"
                onClick={() => onChange({ backgroundImage: '' })}
                className="rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                배경 사진 제거
              </button>
            ) : null}
          </div>
        </Section>

        <Section title="기록 문장">
          <StyleControls
            value={t.sentence}
            onChange={(sentence) => onChange({ sentence })}
            trailing={
              <Toggle active={t.showQuote} onClick={() => onChange({ showQuote: !t.showQuote })}>따옴표</Toggle>
            }
          />
        </Section>

        <Section title="책 제목">
          <StyleControls value={t.title} onChange={(title) => onChange({ title })} minSize={1.45} maxSize={4.4} />
          <div className="mt-3">
            <Label className="text-xs text-muted-foreground">제목 포맷</Label>
            <div className="mt-1.5 flex gap-2">
              {([
                ['brackets', '《제목》'],
                ['corner', '「제목」'],
                ['dash', '— 제목 —'],
              ] as [TitleFormat, string][]).map(([fmt, lbl]) => (
                <Toggle key={fmt} active={t.titleFormat === fmt} onClick={() => onChange({ titleFormat: fmt })}>
                  {lbl}
                </Toggle>
              ))}
            </div>
          </div>
        </Section>

        <Section title="작가 · 챕터 · 페이지">
          <div className="mb-3 flex flex-wrap gap-2">
            <CheckChip label="작가" checked={t.showAuthor} onClick={() => onChange({ showAuthor: !t.showAuthor })} />
            <CheckChip label="챕터" checked={t.showChapter} onClick={() => onChange({ showChapter: !t.showChapter })} />
            <CheckChip label="페이지" checked={t.showPage} onClick={() => onChange({ showPage: !t.showPage })} />
          </div>
          <StyleControls value={t.meta} onChange={(meta) => onChange({ meta })} minSize={1.45} maxSize={4.4} />
        </Section>

        <Section title="책 표지">
          <div className="flex items-center justify-between">
            <span className="text-sm">표지 표시</span>
            <Toggle active={t.cover.show} onClick={() => onChange({ cover: { ...t.cover, show: !t.cover.show } })}>
              {t.cover.show ? '켜짐' : '꺼짐'}
            </Toggle>
          </div>
          {t.cover.show && (
            <div className="mt-3 space-y-3">
              <Range label="크기" min={0.15} max={0.7} step={0.01} value={t.cover.size}
                onChange={(v) => onChange({ cover: { ...t.cover, size: v } })} />
              <Range label="회전" min={-45} max={45} step={1} value={t.cover.rotation}
                onChange={(v) => onChange({ cover: { ...t.cover, rotation: v } })} />
              <Range label="가로 위치" min={0.1} max={0.9} step={0.01} value={t.cover.x}
                onChange={(v) => onChange({ cover: { ...t.cover, x: v } })} />
              <Range label="세로 위치" min={0.1} max={0.9} step={0.01} value={t.cover.y}
                onChange={(v) => onChange({ cover: { ...t.cover, y: v } })} />
            </div>
          )}
        </Section>
      </div>
    </div>
  )
}

function StyleControls({ value, onChange, minSize = 0.725, maxSize = 2.2, trailing }: {
  value: TextStyle; onChange: (v: TextStyle) => void; minSize?: number; maxSize?: number; trailing?: React.ReactNode
}) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={value.font} onValueChange={(v) => onChange({ ...value, font: v as FontKey })}>
          <SelectTrigger className="h-9 w-28 bg-background"><SelectValue /></SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((f) => (
              <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Toggle active={value.bold} onClick={() => onChange({ ...value, bold: !value.bold })}><Bold className="size-4" /></Toggle>
        <Toggle active={value.italic} onClick={() => onChange({ ...value, italic: !value.italic })}><Italic className="size-4" /></Toggle>
        <Toggle active={value.underline} onClick={() => onChange({ ...value, underline: !value.underline })}><Underline className="size-4" /></Toggle>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as AlignKey[]).map((a) => (
            <Toggle key={a} active={value.align === a} onClick={() => onChange({ ...value, align: a })}>
              {a === 'left' ? <AlignLeft className="size-4" /> : a === 'center' ? <AlignCenter className="size-4" /> : <AlignRight className="size-4" />}
            </Toggle>
          ))}
        </div>
        {trailing}
      </div>
      <Range label="글자 크기" min={minSize} max={maxSize} step={0.025} value={value.size}
        onChange={(v) => onChange({ ...value, size: v })} />
      <div className="grid grid-cols-2 gap-3">
        <Range label="가로 위치" min={0.05} max={0.95} step={0.01} value={value.x}
          onChange={(v) => onChange({ ...value, x: v })} />
        <Range label="세로 위치" min={0.05} max={0.95} step={0.01} value={value.y}
          onChange={(v) => onChange({ ...value, y: v })} />
      </div>
      <Swatches values={TEXT_SWATCHES} current={value.color} onPick={(c) => onChange({ ...value, color: c })} />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-card/40 p-4">
      <p className="mb-3 text-sm font-semibold">{title}</p>
      {children}
    </div>
  )
}

function Toggle({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-2 text-sm transition-colors',
        active ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground hover:text-foreground',
      )}
    >
      {children}
    </button>
  )
}

function CheckChip({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm transition-colors',
        checked ? 'border-primary bg-primary text-primary-foreground' : 'bg-background text-muted-foreground',
      )}
    >
      <span className={cn('inline-flex size-4 items-center justify-center rounded border', checked ? 'border-primary-foreground' : 'border-current')}>
        {checked ? <Check className="size-3" /> : null}
      </span>
      {label}
    </button>
  )
}

function Swatches({ values, current, onPick }: { values: string[]; current: string; onPick: (c: string) => void }) {
  const isPreset = values.some((c) => c.toLowerCase() === current.toLowerCase())
  return (
    <div className="flex flex-wrap items-center gap-2">
      {values.map((c) => (
        <button
          key={c}
          type="button"
          aria-label={c}
          onClick={() => onPick(c)}
          className={cn(
            'size-7 rounded-full border-2 transition-transform',
            current.toLowerCase() === c.toLowerCase() ? 'border-foreground scale-110' : 'border-border',
          )}
          style={{ background: c }}
        />
      ))}
      {/* 커스텀 컬러 (원하는 색 아무거나) */}
      <label
        className={cn(
          'relative size-7 cursor-pointer overflow-hidden rounded-full border-2',
          !isPreset ? 'border-foreground scale-110' : 'border-border',
        )}
        style={{
          background: !isPreset
            ? current
            : 'conic-gradient(#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)',
        }}
        aria-label="커스텀 색상"
      >
        <input
          type="color"
          value={current}
          onChange={(e) => onPick(e.target.value)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </label>
    </div>
  )
}

// 갤러리에서 고른 사진을 적당히 축소·압축해서 data URL로 (localStorage 용량 절약)
async function fileToDataUrl(file: File, max = 1280, quality = 0.82): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.onerror = reject
    r.readAsDataURL(file)
  })
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = reject
    i.src = dataUrl
  })
  const scale = Math.min(1, max / Math.max(img.width, img.height))
  const w = Math.round(img.width * scale)
  const h = Math.round(img.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return dataUrl
  ctx.drawImage(img, 0, 0, w, h)
  return canvas.toDataURL('image/jpeg', quality)
}

function Range({ label, min, max, step, value, onChange }: {
  label: string; min: number; max: number; step: number; value: number; onChange: (v: number) => void
}) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="mt-1 w-full accent-foreground"
      />
    </label>
  )
}
