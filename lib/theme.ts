// 앱 테마: 사용자가 직접 3색(배경 / 박스 테두리 / 글자)을 고른다.
// 고른 3색에서 나머지 토큰(muted/accent 등)을 자동 파생해 CSS 변수로 적용.
export type AppTheme = {
  bg: string // 배경 색상
  border: string // 박스 테두리 색상
  text: string // 글자 색상
}

export const DEFAULT_THEME: AppTheme = { bg: '#FAF8F1', border: '#E4DFD4', text: '#232120' }
export const THEME_KEY = 'hanjul-theme-v2'

function clamp(n: number) { return Math.max(0, Math.min(255, n)) }
function parseHex(hex: string) {
  let c = hex.replace('#', '')
  if (c.length === 3) c = c.split('').map((x) => x + x).join('')
  const n = parseInt(c || '000000', 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}
function toHex(c: { r: number; g: number; b: number }) {
  return '#' + [c.r, c.g, c.b].map((v) => clamp(Math.round(v)).toString(16).padStart(2, '0')).join('')
}
/** a와 b를 t(0~1) 비율로 섞은 색. */
function mix(a: string, b: string, t: number) {
  const A = parseHex(a), B = parseHex(b)
  return toHex({ r: A.r + (B.r - A.r) * t, g: A.g + (B.g - A.g) * t, b: A.b + (B.b - A.b) * t })
}

export function themeVars(t: AppTheme): Record<string, string> {
  const muted = mix(t.bg, t.border, 0.55)
  const accent = mix(t.bg, t.border, 0.72)
  const mutedText = mix(t.text, t.bg, 0.42)
  return {
    '--background': t.bg,
    '--foreground': t.text,
    '--card': t.bg,
    '--card-foreground': t.text,
    '--popover': t.bg,
    '--popover-foreground': t.text,
    '--primary': t.text,
    '--primary-foreground': t.bg,
    '--secondary': muted,
    '--secondary-foreground': t.text,
    '--muted': muted,
    '--muted-foreground': mutedText,
    '--accent': accent,
    '--accent-foreground': t.text,
    '--border': t.border,
    '--input': t.border,
    '--ring': mutedText,
  }
}

/** 테마를 <html>에 적용. */
export function applyTheme(t: AppTheme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const vars = themeVars(t)
  for (const [k, v] of Object.entries(vars)) root.style.setProperty(k, v)
}

export function loadTheme(): AppTheme {
  if (typeof window === 'undefined') return DEFAULT_THEME
  try {
    const raw = window.localStorage.getItem(THEME_KEY)
    if (!raw) return DEFAULT_THEME
    const p = JSON.parse(raw)
    if (p && typeof p.bg === 'string' && typeof p.border === 'string' && typeof p.text === 'string') return p
    return DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}

export function saveTheme(t: AppTheme) {
  try { window.localStorage.setItem(THEME_KEY, JSON.stringify(t)) } catch {}
}

// 선택 편의를 위한 추천 색상
export const THEME_BG_PRESETS = ['#FAF8F1', '#FFFFFF', '#F5F2EA', '#F0F4F3', '#1A1714', '#14110E', '#0F1115']
export const THEME_BORDER_PRESETS = ['#E4DFD4', '#E6E6E8', '#D6CFC2', '#C9C9CC', '#000000', '#3A352F', '#4A453E']
export const THEME_TEXT_PRESETS = ['#232120', '#1A1A1A', '#444444', '#6E6E6E', '#FFFFFF', '#F0EBE0']
