# [0303] SCP TRPG Shadow Director 시스템 프롬프트 작성 (SCP-0004)

- **Type:** Prompt
- **Status:** Resolved
- **Priority:** High
- **Module Internal ID:** SCP-0004
- **Affects:** `modules/scp/prompts/SCP_Shadow_SystemPrompt.md` (신규 생성)
- **Reported:** 2026-06-26
- **Resolved:** 2026-06-26

## Description

Director AI가 장면을 진행하는 동안 비밀·반전·히든 타이머·비밀 미션·추리 정답을 별도 관리하는 Shadow Director AI 프롬프트가 없었다. Director에게 비밀 정보가 유출되지 않도록 두 AI를 분리 운용하는 구조를 만든다.

## Changes Made

**신규 생성 파일:**
`modules/scp/prompts/SCP_Shadow_SystemPrompt.md`

## Design Decisions

**GM도 놀랄 수 있는 구조**: Shadow Director는 쿼리 응답형으로 설계. GM이 묻지 않으면 먼저 공개하지 않는다. 타이머 발동·비밀 미션 충돌·NPC 음모 threshold 같은 조건부 정보는 조건이 충족될 때만 신호를 발행한다.

**3계층 공개 구조**:
- 계층 1 (GM 전용, Director 전달 금지): 추리 정답, 비밀 미션 내용, 타 플레이어 RP, Shadow 수치
- 계층 2 (조건부 공개, Director 신호 전달): 타이머 발동, NPC 음모 threshold, 감시 수준 변화
- 계층 3 (결과만 공개): 추리 결론 선택 후 세계 반응 방향

**3종 신호 형식 설계**:
- `[Atmosphere: subtle_hint]`: 분위기 암시. GM이 Director에 전달.
- `[Director Signal: can_reveal]`: 특정 사건/현상 삽입. GM이 번역하여 전달.
- `[GM Only]`: Director 전달 금지. GM 직접 처리.

**비밀 누설 방지 체크리스트 6항목**: Shadow Director가 모든 출력 전 내부 실행. 위반 감지 시 자체 수정 + GM 보고.

**추리 정답 처리**: 정답/오답 표현 사용 금지. "이 결론에 따라 세계는 다음과 같이 반응한다"로만 출력. 모든 결론이 동등하게 서술됨.

**관리자 권한 명령어**: `관리자 권한으로 전체 공개` 명시 명령으로만 전체 공개. 일반 "전부 말해줘" 요청으로는 공개 안 됨.

**Director·Shadow 동시 운용법**: §3에 두 창 워크플로우, 세션 흐름 예시, Shadow 없이 Director만 쓸 때의 차이를 상세 기술.

## Notes

- Shadow Director는 별도 채팅창(다른 대화, 다른 프로젝트)에서 실행하는 것이 원칙이다
- `[Shadow 초기화]` 명령으로 ShadowSecrets + RP + 비밀 미션 + 단서 풀을 한 번에 주입하는 구조
- Director의 `[GM 확인 필요]` 신호 → Shadow Director에서 비밀 미션 완료 판정 → `[GM RP]`로 Director에 반영하는 순환 구조 설계됨
