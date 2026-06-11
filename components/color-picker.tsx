'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

// ── HSL ⇄ HEX ──
function hexToHsl(hex: string): { h: number; s: number; l: number } {
  let c = hex.replace('#', '')
  if (c.length === 3) c = c.split('').map((x) => x + x).join('')
  if (!/^[0-9a-fA-F]{6}$/.test(c)) return { h: 0, s: 0, l: 0 }
  const r = parseInt(c.slice(0, 2), 16) / 255
  const g = parseInt(c.slice(2, 4), 16) / 255
  const b = parseInt(c.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

function hslToHex(h: number, s: number, l: number): string {
  const sN = s / 100, lN = l / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = sN * Math.min(lN, 1 - lN)
  const f = (n: number) => {
    const color = lN - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
    return Math.round(255 * color).toString(16).padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

const HUE_TRACK =
  'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)'

export function ColorPicker({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  const [open, setOpen] = useState(false)
  const [h, setH] = useState(0)
  const [s, setS] = useState(0)
  const [l, setL] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      const c = hexToHsl(value)
      setH(c.h); setS(c.s); setL(c.l)
    }
    // value를 매번 동기화하면 드래그 중 튕김 → 열 때만 초기화
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [open])

  function emit(nh: number, ns: number, nl: number) {
    onChange(hslToHex(nh, ns, nl))
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="커스텀 색상"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'size-7 rounded-full border-2 transition-transform',
          open ? 'border-foreground scale-110' : 'border-border',
        )}
        style={{ background: value }}
      />
      {open && (
        <div className="absolute right-0 z-50 mt-2 w-60 rounded-2xl border bg-popover p-4 shadow-xl">
          <div className="mb-4 flex items-center gap-2.5">
            <div className="size-10 flex-shrink-0 rounded-xl border" style={{ background: value }} />
            <input
              value={value.toUpperCase()}
              onChange={(e) => {
                let v = e.target.value.trim()
                if (!v.startsWith('#')) v = `#${v}`
                if (/^#[0-9a-fA-F]{0,6}$/.test(v)) {
                  onChange(v)
                  if (/^#[0-9a-fA-F]{6}$/.test(v)) {
                    const c = hexToHsl(v)
                    setH(c.h); setS(c.s); setL(c.l)
                  }
                }
              }}
              className="h-9 w-full rounded-lg border bg-background px-2.5 font-mono text-sm tracking-wider outline-none focus:border-foreground"
            />
          </div>
          <div className="space-y-3.5">
            <Slider label="색조" min={0} max={360} value={h} track={HUE_TRACK}
              onChange={(v) => { setH(v); emit(v, s, l) }} />
            <Slider label="채도" min={0} max={100} value={s}
              track={`linear-gradient(to right, hsl(${h} 0% ${l}%), hsl(${h} 100% ${l}%))`}
              onChange={(v) => { setS(v); emit(h, v, l) }} />
            <Slider label="명도" min={0} max={100} value={l}
              track={`linear-gradient(to right, #000, hsl(${h} ${s}% 50%), #fff)`}
              onChange={(v) => { setL(v); emit(h, s, v) }} />
          </div>
        </div>
      )}
    </div>
  )
}

function Slider({ label, min, max, value, track, onChange }: {
  label: string; min: number; max: number; value: number; track: string; onChange: (v: number) => void
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-medium text-muted-foreground">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="spectrum-range w-full"
        style={{ background: track }}
      />
    </label>
  )
}
