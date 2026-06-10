import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.onelinebook',
  appName: '한줄기록',
  webDir: 'out',

  // ⚠️ 개발(실시간 리로드) 전용 — 앱이 PC의 dev 서버(npm run dev)를 실시간으로 봄.
  // PC와 폰/에뮬레이터가 같은 와이파이여야 하고, npm run dev 가 켜져 있어야 함.
  // 🚫 출시(빌드) 전에는 아래 server 블록을 반드시 지우세요. (안 그러면 PC가 꺼지면 앱이 안 뜸)
  server: {
    url: 'http://192.168.0.66:3000',
    cleartext: true,
  },
}

export default config
