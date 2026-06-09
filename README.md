# 한줄기록 (One-Line Book)

책 속 문장을 모아두고, 매일 다시 꺼내 보는 앱.

이 저장소는 **v0로 만든 웹 UI(Next.js)를 그대로** 사용하고, **Capacitor**로 감싸
안드로이드 앱으로 빌드합니다. 즉 웹과 앱의 UI가 **100% 동일**합니다.

## 스택
- **UI/로직**: Next.js 16 + React 19 + Tailwind 4 (v0 생성 코드 그대로)
- **앱 패키징**: Capacitor 8 (`com.onelinebook`)
- **책 검색**: Kakao Book API (클라이언트에서 직접 호출, 네이티브에선 CapacitorHttp로 CORS 우회)
- **저장**: 브라우저 localStorage (앱 내 영구 저장)

## 기능
- 한 줄 기록(문장·책·저자·페이지·메모·표지), 책 검색 자동 입력
- 오늘의 한 줄 / 내 서재(검색·정렬·리스트/그리드)
- 즐겨찾기 · 공유 · 수정 · 삭제

## 개발 (웹)
```bash
npm install --legacy-peer-deps
npm run dev            # http://localhost:3000
```

## 안드로이드 빌드
```bash
# 1) (선택) 책 검색 키 설정
cp .env.example .env.local   # NEXT_PUBLIC_KAKAO_REST_KEY 입력 (없어도 동작)

# 2) 웹 정적 빌드 + 네이티브 동기화
npm run cap:sync             # = next build && cap sync android

# 3) Android Studio 열기
npm run cap:open            # 또는 android/ 폴더를 Android Studio로 열어 Run
```
> APK/AAB 빌드는 Android Studio(또는 로컬 Android SDK)에서 진행합니다.
> 웹 코드를 수정하면 `npm run cap:sync`로 다시 동기화하세요.

## 책 검색 키 (무료)
[Kakao Developers](https://developers.kakao.com) → 앱 추가 → REST API 키 →
`.env.local`의 `NEXT_PUBLIC_KAKAO_REST_KEY`에 입력. 키가 없으면 책 정보를
직접 입력하는 방식으로 폴백합니다.

## 구조
```
app/            # Next.js 페이지 (page.tsx, layout.tsx, globals.css)
components/     # daily-view, library-view, record-card, record-form-dialog, book-search ...
lib/            # types, use-records(localStorage), book-search(Kakao)
android/        # Capacitor가 생성한 안드로이드 프로젝트
capacitor.config.ts
```
