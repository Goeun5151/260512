'use client'

import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { ColorPicker } from '@/components/color-picker'
import { useTheme } from '@/lib/use-theme'
import { THEME_BG_PRESETS, THEME_BORDER_PRESETS, THEME_TEXT_PRESETS } from '@/lib/theme'
import { cn } from '@/lib/utils'

export default function ThemePage() {
  const { theme, update, reset } = useTheme()

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
        <h1 className="text-xl font-bold tracking-tight">테마</h1>
        <div className="flex-1" />
        <button type="button" onClick={reset} className="text-xs text-muted-foreground hover:text-foreground">
          기본값으로
        </button>
      </header>

      <p className="mb-3 text-xs text-muted-foreground">
        배경 · 박스 테두리 · 글자 색을 직접 골라요. 고르면 앱 전체에 바로 적용돼요.
      </p>

      {/* 미리보기 박스 */}
      <div
        className="mb-4 rounded-xl border-2 p-4"
        style={{ background: theme.bg, borderColor: theme.border }}
      >
        <p className="text-sm font-semibold" style={{ color: theme.text }}>미리보기</p>
        <p className="mt-1 text-xs" style={{ color: theme.text, opacity: 0.6 }}>
          배경 · 테두리 · 글자색이 이렇게 보여요.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border bg-card/40 p-4">
        <ThemeRow label="배경 색상" value={theme.bg} presets={THEME_BG_PRESETS} onPick={(c) => update({ bg: c })} />
        <ThemeRow label="박스 테두리 색상" value={theme.border} presets={THEME_BORDER_PRESETS} onPick={(c) => update({ border: c })} />
        <ThemeRow label="글자 색상" value={theme.text} presets={THEME_TEXT_PRESETS} onPick={(c) => update({ text: c })} />
      </div>
    </div>
  )
}

function ThemeRow({ label, value, presets, onPick }: {
  label: string; value: string; presets: string[]; onPick: (c: string) => void
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <div className="flex flex-wrap items-center gap-2">
        {presets.map((c) => (
          <button
            key={c}
            type="button"
            aria-label={c}
            onClick={() => onPick(c)}
            className={cn(
              'size-7 rounded-full border-2 transition-transform',
              value.toLowerCase() === c.toLowerCase() ? 'border-primary scale-110' : 'border-border',
            )}
            style={{ background: c }}
          />
        ))}
        <ColorPicker value={value} onChange={onPick} />
      </div>
    </div>
  )
}
