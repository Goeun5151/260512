import type { BookRecord } from './types'

function esc(v: string): string {
  return `"${(v ?? '').replace(/"/g, '""')}"`
}

export function recordsToCsv(records: BookRecord[]): string {
  const header = ['문장', '책제목', '저자', '챕터', '페이지', '메모', '태그', '공개', '즐겨찾기', '작성일']
  const rows = records.map((r) =>
    [
      r.sentence,
      r.bookTitle,
      r.author,
      r.chapter ?? '',
      r.page,
      r.memo,
      (r.tags ?? []).join('|'),
      r.visibility === 'public' ? '공유' : '개인',
      r.favorite ? 'Y' : '',
      new Date(r.createdAt).toISOString().slice(0, 10),
    ]
      .map((x) => esc(String(x ?? '')))
      .join(','),
  )
  // ﻿: 엑셀에서 한글 깨짐 방지(BOM)
  return '﻿' + [header.join(','), ...rows].join('\r\n')
}

export function downloadCsv(records: BookRecord[]) {
  const csv = recordsToCsv(records)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `한줄기록_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
