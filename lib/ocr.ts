// 하이브리드 OCR
// - 폰(네이티브): Google ML Kit 한국어 모델 (한글 정확도 ↑↑) — 직접 만든 KoreanOcr 플러그인
// - 웹(크롬 미리보기): Tesseract.js (kor) + 흑백/이진화 전처리
export type OcrEngine = 'mlkit-korean' | 'tesseract'
export type OcrResult = {
  lines: string[]
  engine: OcrEngine
  nativeError?: string // 네이티브 시도가 실패해 웹 엔진으로 폴백한 경우의 사유
}

export async function recognizeLines(
  file: File,
  onProgress?: (p: number) => void,
): Promise<OcrResult> {
  let nativeError: string | undefined
  let isNative = false
  try {
    const { Capacitor } = await import('@capacitor/core')
    isNative = Capacitor.isNativePlatform()
    if (isNative) {
      onProgress?.(0.4)
      const lines = await recognizeNative(file)
      onProgress?.(1)
      return { lines, engine: 'mlkit-korean' }
    }
  } catch (e) {
    // 네이티브 OCR 실패 사유를 숨기지 않고 기록 (조용한 폴백이 문제 원인을 가렸음)
    nativeError = e instanceof Error ? e.message : String(e)
  }
  const lines = await recognizeTesseract(file, onProgress)
  return { lines, engine: 'tesseract', nativeError: isNative ? (nativeError ?? '네이티브 결과 없음') : nativeError }
}

// ── 네이티브: ML Kit 한국어 모델 (KoreanOcr 커스텀 플러그인) ──
type KoreanOcrResult = { text: string; lines: { text: string }[] }
type KoreanOcrPlugin = {
  detectText(opts: { base64Image: string; rotation?: number }): Promise<KoreanOcrResult>
}

async function recognizeNative(file: File): Promise<string[]> {
  const { registerPlugin } = await import('@capacitor/core')
  const KoreanOcr = registerPlugin<KoreanOcrPlugin>('KoreanOcr')
  const base64 = await fileToBase64(file)
  const res = await KoreanOcr.detectText({ base64Image: base64 })
  const lines = (res.lines ?? []).map((l) => l.text.trim()).filter(Boolean)
  if (lines.length) return lines
  return res.text.split('\n').map((s) => s.trim()).filter(Boolean)
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).replace(/^data:.*;base64,/, ''))
    r.onerror = reject
    r.readAsDataURL(file)
  })
}

// ── 웹: Tesseract.js ──
async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** 흑백 + 대비 + Otsu 이진화 + 작은 사진 업스케일. */
async function preprocess(file: File): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    const longest = Math.max(img.width, img.height)
    const scale = Math.min(2.2, Math.max(1, 1700 / longest))
    const w = Math.round(img.width * scale)
    const h = Math.round(img.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, w, h)
    const imgData = ctx.getImageData(0, 0, w, h)
    const d = imgData.data
    // grayscale + histogram
    const hist = new Array(256).fill(0)
    const gray = new Uint8ClampedArray(w * h)
    for (let i = 0, p = 0; i < d.length; i += 4, p++) {
      const g = Math.round(0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2])
      gray[p] = g
      hist[g]++
    }
    // Otsu threshold
    const total = w * h
    let sum = 0
    for (let t = 0; t < 256; t++) sum += t * hist[t]
    let sumB = 0, wB = 0, maxVar = 0, threshold = 128
    for (let t = 0; t < 256; t++) {
      wB += hist[t]
      if (wB === 0) continue
      const wF = total - wB
      if (wF === 0) break
      sumB += t * hist[t]
      const mB = sumB / wB
      const mF = (sum - sumB) / wF
      const between = wB * wF * (mB - mF) * (mB - mF)
      if (between > maxVar) { maxVar = between; threshold = t }
    }
    // binarize (살짝 여유 둬서 흐린 글자도 살림)
    const thr = threshold + 8
    for (let i = 0, p = 0; i < d.length; i += 4, p++) {
      const v = gray[p] >= thr ? 255 : 0
      d[i] = d[i + 1] = d[i + 2] = v
    }
    ctx.putImageData(imgData, 0, 0)
    return canvas
  } finally {
    URL.revokeObjectURL(url)
  }
}

async function recognizeTesseract(file: File, onProgress?: (p: number) => void): Promise<string[]> {
  const { createWorker } = await import('tesseract.js')
  const canvas = await preprocess(file)
  const worker = await createWorker('kor', 1, {
    logger: (m: { status: string; progress: number }) => {
      if (m.status === 'recognizing text') onProgress?.(m.progress)
    },
  })
  try {
    await worker.setParameters({
      tessedit_pageseg_mode: '4' as never,
      preserve_interword_spaces: '1',
    })
    const { data } = await worker.recognize(canvas)
    return data.text
      .split('\n')
      .map((s) => s.replace(/\s+/g, ' ').trim())
      .filter((s) => s.length > 1)
  } finally {
    await worker.terminate()
  }
}
