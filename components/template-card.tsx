'use client'

import type { CSSProperties } from 'react'
import type { BookRecord } from '@/lib/types'
import { fontCss, formatTitle, type TextStyle, type Template } from '@/lib/templates'

function textStyleToCss(s: TextStyle): CSSProperties {
  return {
    fontFamily: fontCss(s.font),
    color: s.color,
    textAlign: s.align,
    fontWeight: s.bold ? 700 : 400,
    textDecoration: s.underline ? 'underline' : 'none',
  }
}

type Props = {
  record: Pick<BookRecord, 'sentence' | 'bookTitle' | 'author' | 'cover'>
  template: Template
  innerRef?: (el: HTMLDivElement | null) => void
}

/** Renders a record as a styled, shareable card per the given template. */
export function TemplateCard({ record, template: t, innerRef }: Props) {
  const title = formatTitle(record.bookTitle, t.titleFormat)
  const meta = [title, record.author].filter(Boolean).join('  ·  ')

  return (
    <div
      ref={innerRef}
      className="relative w-full overflow-hidden rounded-xl"
      style={{ aspectRatio: '4 / 5', background: t.background }}
    >
      {/* cover */}
      {t.cover.show && record.cover ? (
        <img
          src={record.cover || '/placeholder.svg'}
          alt=""
          className="pointer-events-none absolute rounded shadow-md"
          style={{
            width: `${t.cover.size * 100}%`,
            left: `${t.cover.x * 100}%`,
            top: `${t.cover.y * 100}%`,
            transform: `translate(-50%, -50%) rotate(${t.cover.rotation}deg)`,
          }}
        />
      ) : null}

      {/* text */}
      <div className="absolute inset-0 flex flex-col justify-center gap-4 px-[9%] py-[10%]">
        <p
          className="leading-relaxed"
          style={{ ...textStyleToCss(t.sentence), fontSize: `${t.sentence.size * 1.6}rem` }}
        >
          {record.sentence}
        </p>
        {meta ? (
          <p style={{ ...textStyleToCss(t.title), fontSize: `${t.title.size * 0.9}rem` }}>
            {meta}
          </p>
        ) : null}
      </div>
    </div>
  )
}
