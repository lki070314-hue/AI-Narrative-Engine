# [0003] Director Engine 명세 작성

- **Type:** New Spec
- **Status:** Resolved
- **Priority:** High
- **Affects:** `engines/Director/DirectorEngine.md`
- **Reported:** 2026-06-26
- **Resolved:** 2026-06-26

## Description

Director Engine의 상세 명세 문서가 존재하지 않았다. 시스템 프롬프트(`00_Director_SystemPrompt.md`)만 있었으며, 엔진의 중앙 오케스트레이터 역할, 입력/출력 계약, 세션 처리 루프, 엔진 호출 프로토콜, 검증 규칙이 정의되어 있지 않았다.

## Motivation

Director Engine은 CoreSpec §4.2의 데이터 흐름에서 중앙 허브 역할을 수행한다. 명세 없이는 NPC Engine, Mission Engine, Save Engine과의 호출 시점과 방식이 불명확하여 일관된 캠페인 운영이 불가능하다.

## Scope

- [x] Requires new document
- [ ] Requires changes to existing document(s)
- [x] World-agnostic (engine-layer)
- [x] Engine-level change (goes in `engines/Director/`)

## Acceptance Criteria

- [x] `engines/Director/DirectorEngine.md` 생성
- [x] CoreSpec §4.2 데이터 흐름 준수
- [x] 입력/출력 명세 작성
- [x] 세션 시작·턴 처리·종료 루프 정의
- [x] 플레이어 선언 유형 분류 및 처리 흐름 정의
- [x] NPC Engine 호출 시점·방식 명세
- [x] Mission Engine 호출 시점·방식 명세
- [x] Save Engine 호출 시점·방식 명세
- [x] 플레이어 행동 강제 금지 규칙 명문화
- [x] 서술 금지 패턴 목록 정의
- [x] QA 검증 규칙 포함

## Design Decisions

**두 단계 구조:** Director Engine은 단일 처리 단위가 아니라 "처리 단계(엔진 호출 결정)"와 "서술 단계(narrative 생성)"의 두 단계로 분리되었다. 이는 CoreSpec §4.2의 데이터 흐름도에 Director Engine이 두 번 등장하는 구조를 반영한다.

**World Engine은 직접 쿼리하지 않음:** Director Engine은 World Engine에 직접 쿼리하지 않고 WorldEffect 이벤트를 전달하는 단방향 방식을 사용한다. World Engine의 상태는 세션 시작과 전환 시점에 수신하는 것으로 충분하다.

**Shadow Engine 연동 방식:** Director Engine은 Shadow Engine에 명시적으로 쿼리하지 않는다. Shadow Engine이 자율적으로 처리하고 처리 완료 신호만 보내는 방식으로 설계하여, Director가 Shadow의 내부 동작에 접근하지 못하도록 설계 차원에서 분리했다.

## Notes

- 관련 파일: `engines/Director/00_Director_SystemPrompt.md` (본 명세와 일관성 확인 필요)
- 참조: `core/CoreSpec.md` §4.2, §5.3, §10, §12, §13
- `SV-DIR-001` (플레이어 행동 서술)과 `SV-DIR-008` (내부 정보 노출)은 Fatal 등급으로 설정하여 즉시 차단.
