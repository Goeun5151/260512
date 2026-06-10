export const metadata = { title: '개인정보처리방침 — 독서기록 / Quote Log' }

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-10 text-sm leading-relaxed">
      <h1 className="text-xl font-bold">개인정보처리방침 (Privacy Policy)</h1>
      <p className="mt-1 text-xs text-muted-foreground">최종 업데이트: 2026-06-10</p>

      <section className="mt-6 space-y-2">
        <h2 className="font-semibold">1. 수집·저장하는 정보</h2>
        <p>
          독서기록(Quote Log)은 별도의 서버 계정 없이 동작합니다. 사용자가 입력한
          기록(문장·책 제목·저자·페이지·메모·태그·표지 이미지·템플릿 설정)은 모두
          <b> 사용자 기기 내부(로컬 저장소)</b>에만 저장되며, 개발자 서버로 전송되지 않습니다.
        </p>
      </section>

      <section className="mt-5 space-y-2">
        <h2 className="font-semibold">2. 외부 서비스</h2>
        <ul className="list-disc pl-5">
          <li>
            <b>카카오 책 검색 API</b>: 책 정보를 가져오기 위해 사용자가 입력한 검색어가
            카카오 서버로 전송됩니다. (검색 결과 표시 목적)
          </li>
          <li>
            <b>문자 인식(OCR)</b>: 선택한 사진의 글자 인식은 기기 내부에서 처리되며,
            이미지는 외부로 업로드되지 않습니다.
          </li>
        </ul>
      </section>

      <section className="mt-5 space-y-2">
        <h2 className="font-semibold">3. 권한</h2>
        <ul className="list-disc pl-5">
          <li><b>사진/저장소</b>: 배경 이미지 설정 및 OCR을 위한 이미지 선택에만 사용됩니다.</li>
          <li><b>카메라</b>: 문장 촬영(OCR) 시에만 사용되며, 기기 내부에서 처리됩니다.</li>
        </ul>
      </section>

      <section className="mt-5 space-y-2">
        <h2 className="font-semibold">4. 광고</h2>
        <p>
          향후 광고(Google AdMob)가 도입될 수 있으며, 그 경우 광고 식별자 등 일부
          정보가 광고 제공에 사용될 수 있습니다. 도입 시 본 방침을 갱신합니다.
        </p>
      </section>

      <section className="mt-5 space-y-2">
        <h2 className="font-semibold">5. 데이터 삭제</h2>
        <p>
          앱 데이터는 기기에만 있으므로, 앱 삭제 또는 앱 내 데이터 삭제로 모든 기록이
          제거됩니다.
        </p>
      </section>

      <section className="mt-5 space-y-2">
        <h2 className="font-semibold">6. 문의</h2>
        <p>문의: your-email@example.com</p>
      </section>

      <hr className="my-8" />

      <h1 className="text-lg font-bold">Privacy Policy (English)</h1>
      <p className="mt-3">
        Quote Log works without any server account. All your records (sentences, book
        title, author, page, memo, tags, cover image, template settings) are stored
        <b> only on your device</b> (local storage) and are never sent to our servers.
      </p>
      <p className="mt-3">
        <b>Kakao Book Search:</b> your search query is sent to Kakao to fetch book info.
        <b> OCR:</b> text recognition runs on-device; images are not uploaded.
        <b> Permissions:</b> photos/camera are used only for background images and OCR,
        processed on-device. <b>Ads:</b> Google AdMob may be added later; this policy will
        be updated accordingly. Uninstalling the app removes all data. Contact:
        your-email@example.com
      </p>
    </div>
  )
}
