// 이미지에서 한국어/영어 텍스트 인식 (Tesseract.js — 웹뷰/브라우저에서 동작)
// 언어 데이터는 첫 실행 시 받아서 캐시됨(인터넷 1회 필요).
export async function recognizeLines(
  image: File | string,
  onProgress?: (p: number) => void,
): Promise<string[]> {
  const Tesseract = (await import('tesseract.js')).default
  const { data } = await Tesseract.recognize(image, 'kor+eng', {
    logger: (m: { status: string; progress: number }) => {
      if (m.status === 'recognizing text') onProgress?.(m.progress)
    },
  })
  return data.text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}
