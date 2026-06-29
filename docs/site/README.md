# 4인 라운드 입력 수집기

이 디렉터리는 라이브 캠페인 테스트를 위한 임시 MVP 입력 수집기입니다. GitHub Pages에서 실행되는 정적 웹 도구이며, 4명의 플레이어 라운드 행동을 모아 GM/Director 프롬프트로 변환합니다.

## 기능

- 고정 플레이어 슬롯 4개: P1 Chernov Van, P2 Noel Rowan, P3 Kaney Chiakey, P4 Wei Feirun
- 플레이어별 `행동`, `대사`, `의도 / 보충 설명` 입력
- 캠페인 제목, 세션 번호, 라운드 번호, 현재 장면 요약 입력
- 로컬 모드: 브라우저 `localStorage` 저장
- 온라인 공유 모드: Firebase Firestore의 `trpgRooms/{roomCode}` 문서로 실시간 공유
- 제출 시간순 처리 순서 표시
- 4명 제출 완료 시 `라운드 입력 완료` 표시
- GM/Director 프롬프트 복사
- 라운드 JSON 내보내기 / 가져오기

## 로컬 모드

`docs/site/app.js`의 Firebase 설정값이 비어 있으면 자동으로 로컬 모드로 실행됩니다.

로컬 모드는 백엔드 없이 동작하지만 같은 브라우저와 같은 기기에서만 입력이 보입니다. 저장 키는 다음 값을 사용합니다.

```text
ai-narrative-engine-round-state-v1
```

## 온라인 공유 모드

Firebase 설정값을 입력하고 룸 / 캠페인 코드를 지정하면 온라인 공유 모드로 실행됩니다. 같은 룸 코드를 입력한 기기들은 같은 Firestore 문서(`trpgRooms/{roomCode}`)를 실시간으로 구독합니다.

룸 코드 예시:

```text
redaction-session1
beta-test-room
```

각 플레이어 제출 데이터에는 `player_id`, `character`, `action`, `dialogue`, `intent`, `submitted_at`이 저장됩니다. GM 프롬프트는 `submitted_at` 오름차순으로 입력을 정렬하며, 시간이 같으면 `player_id` 순서로 처리합니다.

## Firebase 프로젝트 만들기

1. Firebase Console에서 새 프로젝트를 만듭니다.
2. 프로젝트 안에서 웹 앱을 추가합니다.
3. 웹 앱 설정에서 Firebase web config 값을 확인합니다.
4. Firestore Database를 생성합니다.
5. 테스트 중에는 아래 규칙을 임시로 적용할 수 있습니다.

`docs/site/app.js` 상단의 설정 영역에 web config를 붙여 넣습니다.

```javascript
const FIREBASE_CONFIG = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};
```

Firebase web config는 클라이언트 앱 식별 정보라서 웹에 노출될 수 있습니다. 단, 보안은 Firestore 보안 규칙으로 통제해야 하며 비밀 키를 넣으면 안 됩니다.

## Firestore 테스트 규칙

아래 규칙은 비공개 테스트 전용입니다. 누구나 해당 경로를 읽고 쓸 수 있으므로 공개 배포나 장기 운영에 사용하면 안 됩니다. 테스트 후에는 인증, 룸 코드 권한, 쓰기 검증을 포함한 제한 규칙으로 반드시 바꾸세요.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /trpgRooms/{roomId} {
      allow read, write: if true;
    }
  }
}
```

## 로컬 미리보기

파일만 열어도 로컬 모드는 동작합니다.

```powershell
start docs/site/index.html
```

Firebase CDN과 Firestore 동작까지 확인하려면 로컬 서버 사용을 권장합니다.

```powershell
python -m http.server 8000
```

그 다음 브라우저에서 `http://localhost:8000/docs/site/`를 엽니다.

## GitHub Pages 설정

1. GitHub 저장소의 `Settings`로 이동합니다.
2. `Pages` 메뉴를 엽니다.
3. `Build and deployment`의 Source를 `Deploy from a branch`로 설정합니다.
4. Branch를 배포 브랜치로 선택하고 폴더를 `/docs`로 설정합니다.
5. 저장 후 발급된 Pages URL에서 `/site/` 경로를 엽니다.

예: `https://<owner>.github.io/<repo>/site/`

## JSON 내보내기 / 가져오기

JSON 내보내기에는 룸 코드, 메타데이터, 플레이어 입력, 내보내기 시각, 생성된 GM 프롬프트가 포함됩니다. 가져온 JSON은 기본 형태를 검증한 뒤 현재 모드에 맞게 저장합니다.
