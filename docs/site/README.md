# 4인 라운드 입력 수집기

이 디렉터리는 라이브 캠페인 테스트를 위한 임시 MVP 입력 수집기입니다. 백엔드 없이 GitHub Pages에서 바로 실행되는 정적 웹 도구이며, 4명의 플레이어 라운드 행동을 모아 GM/Director 프롬프트로 변환합니다.

## 기능

- 고정 플레이어 슬롯 4개: P1 Chernov Van, P2 Noel Rowan, P3 Kaney Chiakey, P4 Wei Feirun
- 플레이어별 `행동`, `대사`, `의도 / 보충 설명` 입력
- 캠페인 제목, 세션 번호, 라운드 번호, 현재 장면 요약 입력
- 브라우저 `localStorage` 저장
- 4명 제출 완료 시 `라운드 입력 완료` 표시
- GM/Director 프롬프트 복사
- 라운드 JSON 내보내기 / 가져오기

## 로컬 미리보기

파일만 열어도 동작합니다.

```powershell
start docs/site/index.html
```

간단한 로컬 서버로 확인하려면 저장소 루트에서 실행합니다.

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

## 저장 데이터

브라우저 저장 키는 다음 값을 사용합니다.

```text
ai-narrative-engine-round-state-v1
```

JSON 내보내기에는 메타데이터, 플레이어 입력, 내보내기 시각, 생성된 GM 프롬프트가 포함됩니다.
