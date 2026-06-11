// 앱 전체 테마(배경색·테두리색·폰트색) 팔레트.
// CSS 변수(--background/--foreground/--border 등)를 런타임에 덮어써서 적용한다.
export type ThemePalette = {
  id: string
  name: string
  // 미리보기용 대표 3색
  bg: string
  border: string
  text: string
  // 실제 적용되는 토큰 모음
  vars: Record<string, string>
}

function buildVars(p: {
  bg: string; card: string; text: string
  muted: string; mutedText: string; accent: string; border: string
}): Record<string, string> {
  return {
    '--background': p.bg,
    '--foreground': p.text,
    '--card': p.card,
    '--card-foreground': p.text,
    '--popover': p.card,
    '--popover-foreground': p.text,
    '--primary': p.text,
    '--primary-foreground': p.bg,
    '--secondary': p.muted,
    '--secondary-foreground': p.text,
    '--muted': p.muted,
    '--muted-foreground': p.mutedText,
    '--accent': p.accent,
    '--accent-foreground': p.text,
    '--border': p.border,
    '--input': p.border,
    '--ring': p.mutedText,
  }
}

export const THEME_PALETTES: ThemePalette[] = [
  {
    id: 'ivory', name: '아이보리', bg: '#FAF8F1', border: '#E4DFD4', text: '#232120',
    vars: buildVars({
      bg: '#FAF8F1', card: '#FFFFFF', text: '#232120',
      muted: '#F0ECE3', mutedText: '#847D72', accent: '#ECE7DC', border: '#E4DFD4',
    }),
  },
  {
    id: 'white', name: '화이트', bg: '#FFFFFF', border: '#E6E6E8', text: '#1A1A1A',
    vars: buildVars({
      bg: '#FFFFFF', card: '#FFFFFF', text: '#1A1A1A',
      muted: '#F4F4F5', mutedText: '#71717A', accent: '#F0F0F1', border: '#E6E6E8',
    }),
  },
  {
    id: 'dark', name: '다크', bg: '#1A1714', border: '#3A352F', text: '#F0EBE0',
    vars: buildVars({
      bg: '#1A1714', card: '#232020', text: '#F0EBE0',
      muted: '#2A2622', mutedText: '#A39C90', accent: '#312C27', border: '#3A352F',
    }),
  },
]

export const DEFAULT_THEME_ID = 'ivory'
export const THEME_KEY = 'hanjul-theme-v1'

/** 선택한 테마의 CSS 변수를 <html>에 적용. */
export function applyTheme(id: string) {
  if (typeof document === 'undefined') return
  const p = THEME_PALETTES.find((x) => x.id === id) ?? THEME_PALETTES[0]
  const root = document.documentElement
  for (const [k, v] of Object.entries(p.vars)) root.style.setProperty(k, v)
}
