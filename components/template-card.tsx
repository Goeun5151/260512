'use client'

import type { CSSProperties } from 'react'
import type { BookRecord } from '@/lib/types'
import { fontCss, formatTitle, type TextStyle, type Template } from '@/lib/templates'

// font sizes are in cqw (% of card width) so text scales with the card size.
function textBlock(s: TextStyle, fontCqw: number): CSSProperties {
  return {
    position: 'absolute',
    left: `${s.x * 100}%`,
    top: `${s.y * 100}%`,
    transform: 'translate(-50%, -50%)',
    width: '84%',
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

      {/* text elements (each freely positioned) */}
      <p style={textBlock(t.sentence, 3.4)}>{record.sentence}</p>
      {title ? <p style={textBlock(t.title, 2.1)}>{title}</p> : null}
      {meta ? <p style={textBlock(t.meta, 1.8)}>{meta}</p> : null}
    </div>
  )
}
