import type { Metadata, Viewport } from 'next'
import { Toaster } from '@/components/ui/sonner'
import { ThemeApplier } from '@/components/theme-applier'
import './globals.css'

export const metadata: Metadata = {
  title: '독서기록 — 책 속 문장을 모아두는 곳',
  description:
    '책 속 마음에 닿은 한 줄을 기록하고, 매일 다시 꺼내 보는 나만의 문장 서재.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  themeColor: '#f5f2ea',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className="bg-background">
      <body className="font-sans antialiased">
        <ThemeApplier />
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
