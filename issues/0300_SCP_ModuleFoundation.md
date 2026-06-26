# [0300] SCP 모듈 기본 구조 작성 (SCP-0001)

- **Type:** New Module
- **Status:** Resolved
- **Priority:** High
- **Module Internal ID:** SCP-0001
- **Affects:** `modules/scp/` (신규 생성)
- **Reported:** 2026-06-26
- **Resolved:** 2026-06-26

## Description

`modules/scp/` 디렉터리가 존재하지 않았다. AI Narrative Engine 위에서 작동하는 SCP 재단풍 TRPG 모듈의 기본 구조를 신규 작성한다.

## Motivation

엔진 레이어(engines/) 명세가 완성됨에 따라 실제 세계관 모듈을 구현하는 첫 사례로 SCP 재단 테마를 선택. "퇴사 시스템"을 핵심 승리 조건으로 하는 독자적 모듈 규격을 확립한다.

## Scope

- [x] Requires creation of new directory: `modules/scp/`
- [x] World-specific module (goes in `modules/scp/`)
- [x] 8개 명세 파일 신규 작성
- [ ] character/, mechanics/, content/ YAML 파일은 후속 이슈에서 작성 예정

## Changes Made

**신규 생성 파일:**

| 파일 | 역할 |
|------|------|
| `SCPModule.md` | 모듈 총괄 메타데이터, 엔진 바인딩, 세계관 공리 |
| `SCP_ToneGuide.md` | Director Engine 서술 어조 가이드 |
| `SCP_CampaignStructure.md` | 챕터제 캠페인 구조 |
| `SCP_RetirementSystem.md` | 퇴사 포인트 시스템 및 6가지 엔딩 분기 |
| `SCP_PlayerRoles.md` | 5개 직책 상세 정의 및 클리어런스 시스템 |
| `SCP_MissionSystem.md` | 개인·비밀·추리 임무 시스템 규격 |
| `SCP_SecretRule.md` | 비밀 정보 관리 및 배신 메커니즘 |
| `SCP_ChapterTemplate.md` | 챕터 제작 표준 양식 |

## Design Decisions

**퇴사 유형 6가지 설계:** 단순 탈출이 아닌 6가지 퇴사 방식(명예퇴직/자발적이탈/기억소거퇴직/내부전복/이형화/소각처분회피)을 직책 이력 기반 조건으로 분기. 동일한 RP 100 달성이 서로 다른 결말을 만든다.

**비밀 미션 충돌 설계:** 파티 내 한 쌍의 비밀 미션만 직접 충돌하도록 권고. 배신이 게임을 망치지 않고 서사 긴장을 만드는 수준으로 조율.

**추리 선택지 오답 처리:** 오답은 처벌이 아닌 다른 이야기의 시작. 오답으로 더 복잡한 상황이 만들어지되 즉각 파국은 없다.

**창작 SCP 통합 허용:** 공식 SCP 위키 개체와 캠페인 맞춤 창작 SCP를 혼합 사용 가능한 구조. 공식 개체와 직접 충돌하지 않는 한 자유롭게 추가 가능.

## Pending (후속 이슈 필요)

- `modules/scp/character/archetypes.yaml` — 직책별 아키타입 YAML
- `modules/scp/mechanics/sanity.yaml` — SAN 시스템 상세 YAML
- `modules/scp/mechanics/clearance.yaml` — 클리어런스 레벨 시스템 YAML
- `modules/scp/content/factions.yaml` — 재단 내부 세력 정의
- `modules/scp/content/npcs.yaml` — 기본 NPC 목록

## Notes

- 참조: `core/CoreSpec.md` §6, §7
- 의존 모듈: `modules/generic/` (generic 모듈 상속)
- SCP 공식 세계관 참조는 분위기·구조에 한정. 구체적 개체 통계는 각 캠페인에서 정의.
