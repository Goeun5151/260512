import type { BookSearchResult } from '@/lib/types'

export type BookSearchResponse = {
  results: BookSearchResult[]
  needKey?: boolean
}

// Kakao REST key, baked in at build time. Set NEXT_PUBLIC_KAKAO_REST_KEY in .env.local
const KAKAO_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_KEY ?? ''

type KakaoDoc = {
  title: string
  authors: string[]
  publisher: string
  thumbnail: string
  contents: string
}

/**
 * Searches Kakao's book API directly from the client. Inside the Capacitor
 * native shell we use CapacitorHttp (bypasses CORS); on the web we fall back to
 * fetch. Without a key, the caller shows the manual-entry notice.
 */
export async function searchBooks(query: string): Promise<BookSearchResponse> {
  const q = query.trim()
  if (!q) return { results: [] }
  if (!KAKAO_KEY) return { results: [], needKey: true }

  const url =
    'https://dapi.kakao.com/v3/search/book?sort=accuracy&size=12&query=' +
    encodeURIComponent(q)
  const headers = { Authorization: `KakaoAK ${KAKAO_KEY}` }

  try {
    const data = await request(url, headers)
    const docs: KakaoDoc[] = data?.documents ?? []
    return {
      results: docs.map((d) => ({
        title: d.title,
        authors: d.authors ?? [],
        publisher: d.publisher ?? '',
        thumbnail: d.thumbnail ?? '',
        contents: d.contents ?? '',
      })),
    }
  } catch {
    return { results: [] }
  }
}

async function request(url: string, headers: Record<string, string>): Promise<any> {
  // Prefer Capacitor native HTTP when available (avoids CORS in the webview).
  try {
    const mod: any = await import('@capacitor/core')
    const cap = mod?.Capacitor
    if (cap?.isNativePlatform?.()) {
      const res = await mod.CapacitorHttp.request({ method: 'GET', url, headers })
      return typeof res.data === 'string' ? JSON.parse(res.data) : res.data
    }
  } catch {
    // @capacitor/core not present (pure web) — fall through to fetch
  }
  const res = await fetch(url, { headers })
  return res.json()
}
