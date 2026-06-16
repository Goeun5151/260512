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

export async function downloadCsv(records: BookRecord[]) {
  const csv = recordsToCsv(records)
  const filename = `독서기록_${new Date().toISOString().slice(0, 10)}.csv`

  const { Capacitor } = await import('@capacitor/core')
  if (Capacitor.isNativePlatform()) {
    // 안드로이드: <a download>가 동작하지 않으므로 파일로 저장 후 공유 시트로 내보냄
    const { Filesystem, Directory, Encoding } = await import('@capacitor/filesystem')
    const { Share } = await import('@capacitor/share')
    const res = await Filesystem.writeFile({
      path: filename,
      data: csv,
      directory: Directory.Cache,
      encoding: Encoding.UTF8,
    })
    await Share.share({
      title: filename,
      text: '독서기록 CSV 내보내기',
      url: res.uri,
      dialogTitle: 'CSV 내보내기',
    })
    return
  }

  // 웹(크롬): 일반 다운로드
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
