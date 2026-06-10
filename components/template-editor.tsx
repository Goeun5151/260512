'use client'

import { Bold, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { TemplateCard } from '@/components/template-card'
import {
  BG_SWATCHES, TEXT_SWATCHES, FONT_OPTIONS,
  type AlignKey, type FontKey, type Template, type TextStyle, type TitleFormat,
} from '@/lib/templates'
import { cn } from '@/lib/utils'

const SAMPLE = {
  sentence: '사람은 자신이 본 것만큼만 세상을 이해한다.',
  bookTitle: '데미안',
  author: '헤르만 헤세',
  cover: '/placeholder.svg',
}

type Props = {
  template: Template
  onChange: (patch: Partial<Template>) => void
}

export function TemplateEditor({ template: t, onChange }: Props) {
  return (
    <div className="space-y-6">
      {/* preview */}
      <div className="mx-auto w-56">
        <TemplateCard record={SAMPLE} template={t} />
      </div>

      <div className="space-y-2">
        <Label>템플릿 이름</Label>
        <Input value={t.name} onChange={(e) => onChange({ name: e.target.value })} className="bg-background" />
      </div>

      <Section title="배경색">
        <Swatches values={BG_SWATCHES} current={t.background} onPick={(c) => onChange({ background: c })} />
      </Section>

      <Section title="기록 문장">
        <StyleControls value={t.sentence} onChange={(sentence) => onChange({ sentence })} />
      </Section>

      <Section title="책 제목">
        <StyleControls value={t.title} onChange={(title) => onChange({ title })} />
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
  )
}

function StyleControls({ value, onChange }: { value: TextStyle; onChange: (v: TextStyle) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Select value={value.font} onValueChange={(v) => onChange({ ...value, font: v as FontKey })}>
          <SelectTrigger className="h-9 w-32 bg-background"><SelectValue /></SelectTrigger>
          <SelectContent>
            {FONT_OPTIONS.map((f) => (
              <SelectItem key={f.key} value={f.key}>{f.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Toggle active={value.bold} onClick={() => onChange({ ...value, bold: !value.bold })}><Bold className="size-4" /></Toggle>
        <Toggle active={value.underline} onClick={() => onChange({ ...value, underline: !value.underline })}><Underline className="size-4" /></Toggle>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as AlignKey[]).map((a) => (
            <Toggle key={a} active={value.align === a} onClick={() => onChange({ ...value, align: a })}>
              {a === 'left' ? <AlignLeft className="size-4" /> : a === 'center' ? <AlignCenter className="size-4" /> : <AlignRight className="size-4" />}
            </Toggle>
          ))}
        </div>
      </div>
      <Range label="글자 크기" min={0.7} max={1.6} step={0.05} value={value.size}
        onChange={(v) => onChange({ ...value, size: v })} />
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

function Swatches({ values, current, onPick }: { values: string[]; current: string; onPick: (c: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
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
    </div>
  )
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
