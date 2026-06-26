# [0302] SCP TRPG Director 시스템 프롬프트 작성 (SCP-0003)

- **Type:** Prompt
- **Status:** Resolved
- **Priority:** High
- **Module Internal ID:** SCP-0003
- **Affects:** `modules/scp/prompts/SCP_Director_SystemPrompt.md` (신규 생성)
- **Reported:** 2026-06-26
- **Resolved:** 2026-06-26

## Description

SCP TRPG를 실제로 진행할 때 AI(Claude 등)에게 부여할 시스템 프롬프트가 없었다.
Director용 프롬프트를 작성하여 채팅창에 바로 붙여넣어 사용할 수 있는 형태로 만든다.

## Changes Made

**신규 생성 파일:**

| 파일 | 역할 |
|------|------|
| `modules/scp/prompts/SCP_Director_SystemPrompt.md` | Director 시스템 프롬프트 본문 + 사용 가이드 |

**디렉토리 생성:** `modules/scp/prompts/`

## Design Decisions

**Shadow 분리 유지**: Director는 ShadowSecrets 문서에 접근하지 않는 구조로 설계. GM이 `[GM 알림]` 형식으로 수동 개입하는 구조. Shadow Engine의 타이머, 확률 조정, NPC 음모는 Director에게 투명하지 않음.

**GM 개입 프로토콜 5종 정의**: `[GM 알림]`, `[GM 지시]`, `[GM 수정]`, `[GM RP]`, `[GM 공개 허가]`. 모두 플레이어에게 서술하지 않고 내부 처리.

**추리 흐름 4단계 명시**: 탐색 → 단서 축적 → 추리 선언 → 결과. 각 단계에서 Director가 할 수 없는 것(정답 확인, 해석 강요)을 명확히 함.

**SAN 0 처리**: Director는 판정 불이익(-4)을 알리지만 행동 이상의 구체적 내용은 플레이어가 결정. 연기 자율성 존중.

**비밀 미션 격리**: Director는 비밀 미션 내용을 모름. 완료 선언 시 `[GM 확인 필요]` 형식으로 GM에게 위임.

**챕터 정산 재단 문서 형식**: 세계관 일관성을 위해 정산 요약을 재단 내부 보고서 형식으로 처리.

## Notes

- 시스템 프롬프트 본문은 코드 블록(```` ``` ````) 안에 넣어 복사하기 쉽게 함
- `modules/scp/prompts/tone.md`는 SCPModule.md에서 예정됐으나 SCP_ToneGuide.md가 사실상 동일 역할을 하므로, 이 파일이 그 역할을 겸함
- Claude.ai 프로젝트 지침(Project Instructions)에 붙여넣는 것을 권장 — 매 세션마다 재입력 불필요
