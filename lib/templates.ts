import type { BookRecord } from './types'

// ── Text styling for a text element (sentence / title / meta) ──
export type FontKey = 'pretendard' | 'serif' | 'gothic' | 'mono'
export type AlignKey = 'left' | 'center' | 'right'

export type TextStyle = {
  font: FontKey
  color: string // hex
  align: AlignKey
  bold: boolean
  underline: boolean
  size: number // 1 = base
}

// 책 제목 표시 포맷 3종
export type TitleFormat = 'brackets' | 'corner' | 'dash'

export type CoverStyle = {
  show: boolean
  size: number // 0.15 ~ 0.7 (relative to card width)
  rotation: number // deg
  x: number // 0..1 center position
  y: number // 0..1 center position
}

export type Template = {
  id: string
  name: string
  background: string // hex
  sentence: TextStyle
  title: TextStyle
  titleFormat: TitleFormat
  // 작가 · 챕터 · 페이지 (세 항목이 같은 스타일을 공유)
  meta: TextStyle
  showAuthor: boolean
  showChapter: boolean
  showPage: boolean
  cover: CoverStyle
}

export const FONT_OPTIONS: { key: FontKey; label: string; css: string }[] = [
  { key: 'pretendard', label: '프리텐다드', css: "'Pretendard Variable', Pretendard, sans-serif" },
  { key: 'serif', label: '명조', css: 'serif' },
  { key: 'gothic', label: '고딕', css: 'sans-serif' },
  { key: 'mono', label: '모노', css: 'monospace' },
]

export function fontCss(key: FontKey): string {
  return FONT_OPTIONS.find((f) => f.key === key)?.css ?? FONT_OPTIONS[0].css
}

export function formatTitle(title: string, fmt: TitleFormat): string {
  if (!title) return ''
  switch (fmt) {
    case 'brackets': return `《${title}》`
    case 'corner': return `「${title}」`
    case 'dash': return `— ${title} —`
  }
}

export const BG_SWATCHES = [
  '#FAF8F1', '#FFFFFF', '#F2EFE9', '#EAE3D6', '#E7ECEF',
  '#F6E6E6', '#E7F0E8', '#2A2724', '#14110E',
]
export const TEXT_SWATCHES = [
  '#232120', '#6E6E6E', '#FFFFFF', '#8A6A4F', '#B5524B', '#3A6B5A', '#3C5A8A',
]

const baseSentence = (): TextStyle => ({
  font: 'pretendard', color: '#232120', align: 'center', bold: true, underline: false, size: 1,
})
const baseTitle = (): TextStyle => ({
  font: 'pretendard', color: '#847D72', align: 'center', bold: false, underline: false, size: 1,
})
const baseMeta = (): TextStyle => ({
  font: 'pretendard', color: '#847D72', align: 'center', bold: false, underline: false, size: 0.85,
})
const baseCover = (): CoverStyle => ({ show: false, size: 0.28, rotation: 0, x: 0.5, y: 0.82 })
const showFlags = () => ({ showAuthor: true, showChapter: false, showPage: true })

/** Five default templates (editable & extensible — later syncable to cloud). */
export function defaultTemplates(): Template[] {
  return [
    {
      id: 't1', name: '미니멀', background: '#FAF8F1',
      sentence: baseSentence(), title: baseTitle(), titleFormat: 'brackets',
      meta: baseMeta(), ...showFlags(), cover: baseCover(),
    },
    {
      id: 't2', name: '명조 클래식', background: '#FFFFFF',
      sentence: { ...baseSentence(), font: 'serif', bold: false, size: 1.1 },
      title: { ...baseTitle(), font: 'serif' }, titleFormat: 'dash',
      meta: { ...baseMeta(), font: 'serif' }, ...showFlags(), cover: baseCover(),
    },
    {
      id: 't3', name: '크라프트', background: '#EAE3D6',
      sentence: { ...baseSentence(), align: 'left' },
      title: { ...baseTitle(), align: 'left' }, titleFormat: 'brackets',
      meta: { ...baseMeta(), align: 'left' }, ...showFlags(),
      cover: { ...baseCover(), show: true, x: 0.82, y: 0.2, size: 0.22 },
    },
    {
      id: 't4', name: '다크', background: '#14110E',
      sentence: { ...baseSentence(), color: '#F5F0E6' },
      title: { ...baseTitle(), color: '#B6A993' }, titleFormat: 'corner',
      meta: { ...baseMeta(), color: '#B6A993' }, ...showFlags(), cover: baseCover(),
    },
    {
      id: 't5', name: '카드+표지', background: '#F2EFE9',
      sentence: { ...baseSentence(), size: 0.95 },
      title: baseTitle(), titleFormat: 'brackets',
      meta: baseMeta(), ...showFlags(),
      cover: { ...baseCover(), show: true, x: 0.5, y: 0.82, size: 0.3 },
    },
  ]
}
