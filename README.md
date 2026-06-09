# 책속의 한줄 (One-Line Book)

책을 읽다 마음에 남은 **한 문장**을 기록하고, 매일 한 줄씩 다시 만나는 안드로이드 앱.
2012년 스마트앱어워드를 받았던 옛 "책속의 한줄" 앱을 현대 기술 스택으로 새로 만든 버전입니다.

## ✨ 기능

- **한줄 기록** — 문장 / 책 제목 / 저자 / 페이지 / 내 생각(메모) 저장
- **책 검색 연동** — 네이버 책 검색 API로 제목·저자·표지 자동 채우기 (키 없으면 수동 입력으로 자동 폴백)
- **내 서재** — 최신순 / 즐겨찾기 / 책순 정렬, 전체 텍스트 검색
- **오늘의 한줄** — 저장한 문장 중 하나를 매일 띄워주는 카드
- **하루한줄 알림** — 원하는 시각에 매일 한 줄을 알림으로
- **공유** — 한 문장을 예쁜 형식으로 다른 앱에 공유
- **따뜻한 종이 감성 테마** — 라이트 / 다크 / 시스템 따름

## 🛠 기술 스택

| 영역 | 사용 기술 |
|------|-----------|
| 언어 | Kotlin |
| UI | Jetpack Compose + Material 3 |
| 아키텍처 | MVVM (ViewModel + StateFlow), 수동 DI 컨테이너 |
| 로컬 저장 | Room |
| 설정 저장 | DataStore (Preferences) |
| 네트워크 | Retrofit + OkHttp + kotlinx.serialization |
| 이미지 | Coil |
| 백그라운드 | WorkManager (하루한줄 알림 스케줄링) |

- `minSdk 26` · `targetSdk 34` · `compileSdk 34`
- 모듈 구조: `data`(local/remote/repository) → `di` → `ui`(theme/navigation/screens) → `notification`/`util`

## 🚀 빌드 방법

> ⚠️ 이 저장소에는 Android SDK가 포함돼 있지 않습니다. **Android Studio**(Koala 이상 권장) 또는
> 로컬에 Android SDK가 설치된 환경에서 빌드하세요.

1. Android Studio에서 프로젝트 열기 → Gradle Sync
2. (선택) 책 검색을 쓰려면 `local.properties.example`을 `local.properties`로 복사 후 키 입력:
   ```properties
   naver.clientId=YOUR_CLIENT_ID
   naver.clientSecret=YOUR_CLIENT_SECRET
   ```
   키는 [네이버 개발자 센터](https://developers.naver.com/apps)에서 "검색" API로 발급.
   **키가 없어도 앱은 정상 동작**하며, 책 정보를 직접 입력하는 방식으로 폴백합니다.
3. 실행 (`Run 'app'`)

CLI 빌드:
```bash
./gradlew assembleDebug
```

## 📁 디렉터리

```
app/src/main/java/com/onelinebook/
├─ data/
│  ├─ local/        # Room: Quote, QuoteDao, OneLineDatabase
│  ├─ remote/       # 네이버 책 검색 API (Retrofit)
│  ├─ repository/   # QuoteRepository, BookSearchRepository, SortOrder
│  └─ prefs/        # DataStore 설정
├─ di/              # AppContainer (수동 DI)
├─ notification/    # 하루한줄 Worker + Notifier
├─ ui/
│  ├─ theme/        # 종이 감성 컬러 / 타이포그래피
│  ├─ navigation/   # 라우트 정의
│  ├─ home, editor, detail, booksearch, settings
│  └─ components/   # QuoteCard, BookCover, EmptyState
├─ util/            # 공유 / 날짜 포맷
├─ MainActivity.kt  # NavHost
└─ OneLineApp.kt    # Application + 알림 채널
```
