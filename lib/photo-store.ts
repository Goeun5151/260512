'use client'

import { Capacitor } from '@capacitor/core'

// 기록 배경 사진을 localStorage(base64) 대신 앱 파일 저장소에 보관.
// 기록에는 상대 경로만 저장 → localStorage 용량 문제 해소.
// 사진은 앱 전용 저장소에 복사되므로 갤러리에서 원본을 지워도 안전.

const DIR_PREFIX = 'photos/'

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

/** 이미 저장소에 보관된 사진 경로인지(=리졸브 필요) 여부. data/url/preset 은 그대로 씀. */
export function isStoredPhoto(ref?: string): ref is string {
  return !!ref && !/^(data:|https?:|blob:)/.test(ref) && !ref.startsWith('/')
}

/** data URL을 앱 파일 저장소에 저장하고 상대 경로를 반환. */
export async function savePhoto(dataUrl: string): Promise<string> {
  const { Filesystem, Directory } = await import('@capacitor/filesystem')
  const path = `${DIR_PREFIX}${uid()}.jpg`
  const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl
  await Filesystem.writeFile({ path, data: base64, directory: Directory.Data, recursive: true })
  return path
}

/** 저장된 경로를 <img> src로 쓸 수 있는 형태로 변환. */
export async function loadPhotoSrc(path: string): Promise<string> {
  const { Filesystem, Directory } = await import('@capacitor/filesystem')
  if (Capacitor.isNativePlatform()) {
    const { uri } = await Filesystem.getUri({ path, directory: Directory.Data })
    return Capacitor.convertFileSrc(uri)
  }
  const res = await Filesystem.readFile({ path, directory: Directory.Data })
  return `data:image/jpeg;base64,${res.data}`
}

/** 저장된 사진 파일 삭제(정리). 실패는 무시. */
export async function deletePhoto(path: string) {
  if (!isStoredPhoto(path)) return
  try {
    const { Filesystem, Directory } = await import('@capacitor/filesystem')
    await Filesystem.deleteFile({ path, directory: Directory.Data })
  } catch {}
}
