export type BookRecord = {
  id: string
  sentence: string
  bookTitle: string
  author: string
  chapter: string
  page: string
  memo: string
  cover: string
  templateId?: string // 이 기록이 쓰는 카드 템플릿
  tags?: string[] // 다중 태그
  visibility?: 'private' | 'public' // 개인/공유
  favorite: boolean
  createdAt: number
  updatedAt: number
}

export type SortMode = 'recent' | 'favorite' | 'book'
export type ViewMode = 'list' | 'grid'

export type BookSearchResult = {
  title: string
  authors: string[]
  publisher: string
  thumbnail: string
  contents: string
}
