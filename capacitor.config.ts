import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.onelinebook',
  appName: '독서기록',
  webDir: 'out',
  // 개발 중 실시간 리로드가 필요하면 아래를 잠깐 추가(출시 전 제거):
  // server: { url: 'http://192.168.0.66:3000', cleartext: true },
}

export default config
