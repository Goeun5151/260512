'use client'

import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'

// 실 광고 단위(출시 빌드)와 구글 테스트 단위(개발 빌드)를 자동 분기.
// 자기 앱에서 실 광고를 클릭하면 AdMob 계정이 정지될 수 있어 개발 중엔 테스트 광고만 노출.
const REAL_BANNER_ID = 'ca-app-pub-5780622261506159/2431792023'
const TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111'
const isProd = process.env.NODE_ENV === 'production'
const BANNER_ID = isProd ? REAL_BANNER_ID : TEST_BANNER_ID

let initialized = false

/**
 * 네이티브(안드로이드)에서만 하단 배너 광고를 띄움.
 * 웹/SSR에서는 아무것도 렌더하지 않음.
 */
export function AdBanner() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    let cancelled = false

    ;(async () => {
      try {
        const { AdMob, BannerAdSize, BannerAdPosition } = await import('@capacitor-community/admob')
        if (!initialized) {
          await AdMob.initialize({ initializeForTesting: !isProd })
          initialized = true
        }
        if (cancelled) return
        await AdMob.showBanner({
          adId: BANNER_ID,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0,
          isTesting: !isProd,
        })
      } catch (e) {
        // 광고 로드 실패는 앱 동작에 영향 없도록 무시
        console.warn('[AdMob] banner failed', e)
      }
    })()

    return () => {
      cancelled = true
      if (!Capacitor.isNativePlatform()) return
      import('@capacitor-community/admob')
        .then(({ AdMob }) => AdMob.hideBanner().catch(() => {}))
        .catch(() => {})
    }
  }, [])

  return null
}
