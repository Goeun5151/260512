'use client'

import type { CSSProperties } from 'react'
import type { BookRecord } from '@/lib/types'
import { fontCss, formatTitle, type TextStyle, type Template } from '@/lib/templates'

// 카드 안에서의 위치 (요소 중심을 x,y에)
function posStyle(s: TextStyle): CSSProperties {
  return {
    position: 'absolute',
    left: `${s.x * 100}%`,
    top: `${s.y * 100}%`,
    transform: 'translate(-50%, -50%)',
    width: '84%',
    textAlign: s.align,
  }
}

// 글자 스타일. 폰트 크기는 cqw(카드 폭 %)로 비례.
function typeStyle(s: TextStyle, fontCqw: number): CSSProperties {
  return {
    margin: 0,
    fontFamily: fontCss(s.font),
    color: s.color,
    textAlign: s.align,
    fontWeight: s.bold ? 700 : 400,
    fontStyle: s.italic ? 'italic' : 'normal',
    textDecoration: s.underline ? 'underline' : 'none',
    fontSize: `${s.size * fontCqw}cqw`,
    lineHeight: 1.5,
  }
}

type Props = {
  record: Pick<BookRecord, 'sentence' | 'bookTitle' | 'author' | 'chapter' | 'page' | 'cover'>
  template: Template
  innerRef?: (el: HTMLDivElement | null) => void
}

/** Renders a record as a styled, shareable card per the given template. */
export function TemplateCard({ record, template: t, innerRef }: Props) {
  const title = formatTitle(record.bookTitle, t.titleFormat)
  const metaParts: string[] = []
  if (t.showAuthor && record.author) metaParts.push(record.author)
  if (t.showChapter && record.chapter) metaParts.push(record.chapter)
  if (t.showPage && record.page) metaParts.push(`p.${record.page}`)
  const meta = metaParts.join('  ·  ')

  return (
    <div
      ref={innerRef}
      className="relative w-full overflow-hidden rounded-xl"
      style={{ aspectRatio: '6 / 9', background: t.background, containerType: 'inline-size' }}
    >
      {/* background image (사용자 사진) */}
      {t.backgroundImage ? (
        <img src={t.backgroundImage} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      ) : null}

      {/* cover — always portrait (2:3) */}
      {t.cover.show && record.cover ? (
        <img
          src={record.cover || '/placeholder.svg'}
          alt=""
          className="pointer-events-none absolute rounded shadow-md"
          style={{
            width: `${t.cover.size * 100}%`,
            aspectRatio: '2 / 3',
            objectFit: 'cover',
            left: `${t.cover.x * 100}%`,
            top: `${t.cover.y * 100}%`,
            transform: `translate(-50%, -50%) rotate(${t.cover.rotation}deg)`,
          }}
        />
      ) : null}

      {/* 기록 문장 (+ 선택 시 왼쪽 큰 따옴표, 연하게 — 메인화면처럼) */}
      <div style={posStyle(t.sentence)}>
        {t.showQuote ? (
          <span
            style={{
              display: 'block',
              textAlign: 'left',
              fontFamily: 'Georgia, serif',
              fontSize: `${t.sentence.size * 9}cqw`,
              lineHeight: 0.6,
              color: t.sentence.color,
              opacity: 0.25,
              marginBottom: '0.5cqw',
            }}
          >
            “
          </span>
        ) : null}
        <p style={typeStyle(t.sentence, 3.4)}>{record.sentence}</p>
      </div>

      {title ? <p style={{ ...posStyle(t.title), ...typeStyle(t.title, 2.1) }}>{title}</p> : null}
      {meta ? <p style={{ ...posStyle(t.meta), ...typeStyle(t.meta, 1.8) }}>{meta}</p> : null}
    </div>
  )
}
