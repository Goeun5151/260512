import type { NewRecordInput } from './use-records'

// 따옴표/콤마/줄바꿈을 처리하는 간단한 CSV 파서
function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  // BOM 제거
  const s = text.replace(/^﻿/, '')
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++ }
        else inQuotes = false
      } else field += c
    } else {
      if (c === '"') inQuotes = true
      else if (c === ',') { row.push(field); field = '' }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = '' }
      else if (c === '\r') { /* skip */ }
      else field += c
    }
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row) }
  return rows.filter((r) => r.some((c) => c.trim() !== ''))
}

const HEADER = ['문장', '책제목', '저자', '챕터', '페이지', '메모', '태그', '공개', '즐겨찾기', '작성일']

/** CSV 텍스트 → 새 기록 배열. 우리가 내보낸 형식 기준(컬럼 순서대로). */
export function csvToRecords(text: string): NewRecordInput[] {
  const rows = parseCsv(text)
  if (rows.length === 0) return []
  // 헤더 행이면 건너뜀
  let start = 0
  const first = rows[0].map((c) => c.trim())
  if (first[0] === HEADER[0] || first.join(',').includes('책제목')) start = 1

  const out: NewRecordInput[] = []
  for (let i = start; i < rows.length; i++) {
    const r = rows[i]
    const sentence = (r[0] ?? '').trim()
    if (!sentence) continue
    const dateStr = (r[9] ?? '').trim()
    const ts = dateStr ? new Date(`${dateStr}T12:00:00`).getTime() : Date.now()
    out.push({
      sentence,
      bookTitle: (r[1] ?? '').trim(),
      author: (r[2] ?? '').trim(),
      chapter: (r[3] ?? '').trim(),
      page: (r[4] ?? '').trim(),
      memo: (r[5] ?? '').trim(),
      cover: '',
      tags: (r[6] ?? '').split('|').map((t) => t.trim()).filter(Boolean),
      visibility: (r[7] ?? '').trim() === '공유' ? 'public' : 'private',
      favorite: (r[8] ?? '').trim().toUpperCase() === 'Y',
      createdAt: Number.isNaN(ts) ? Date.now() : ts,
    })
  }
  return out
}

export function readFileText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result))
    r.onerror = reject
    r.readAsText(file, 'utf-8')
  })
}
