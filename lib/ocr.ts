// 이미지에서 한국어 텍스트 인식 (Tesseract.js)
// - 한국어 전용 모델(영어 섞으면 한글을 라틴으로 오인식해서 정확도 급락)
// - 흑백 + 대비 보정 전처리로 사진 인식률 개선
// 언어 데이터는 첫 실행 시 받아서 캐시됨(인터넷 1회 필요).

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

/** 흑백 + 대비 강화 + 너무 작은 이미지는 살짝 확대. */
async function preprocess(file: File): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    const longest = Math.max(img.width, img.height)
    // 작은 사진은 ~1600px까지 키워서 글자 또렷하게 (최대 2배)
    const scale = Math.min(2, Math.max(1, 1600 / longest))
    const w = Math.round(img.width * scale)
    const h = Math.round(img.height * scale)
    const canvas = document.createElement('canvas')
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, w, h)
    const imgData = ctx.getImageData(0, 0, w, h)
    const d = imgData.data
    const contrast = 1.4
    for (let i = 0; i < d.length; i += 4) {
      const gray = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]
      let v = (gray - 128) * contrast + 128
      v = v < 0 ? 0 : v > 255 ? 255 : v
      d[i] = d[i + 1] = d[i + 2] = v
    }
    ctx.putImageData(imgData, 0, 0)
    return canvas
  } finally {
    URL.revokeObjectURL(url)
  }
}

export async function recognizeLines(
  file: File,
  onProgress?: (p: number) => void,
): Promise<string[]> {
  const { createWorker } = await import('tesseract.js')
  const canvas = await preprocess(file)
  const worker = await createWorker('kor', 1, {
    logger: (m: { status: string; progress: number }) => {
      if (m.status === 'recognizing text') onProgress?.(m.progress)
    },
  })
  try {
    await worker.setParameters({
      tessedit_pageseg_mode: '4' as never, // 한 컬럼(책 페이지)
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
