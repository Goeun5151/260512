'use client'

// 광고 배너 자리. 실제 AdMob 연동은 AdMob 앱ID 발급 후 네이티브에서 붙임.
// (지금은 위치/높이 확보용 placeholder)
export function AdBanner() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex h-12 items-center justify-center border-t border-border bg-background/95 text-[11px] text-muted-foreground backdrop-blur">
      광고 영역 · AdMob 연동 예정
    </div>
  )
}
