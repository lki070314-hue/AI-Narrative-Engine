# [0005] NPC Engine 명세 작성

- **Type:** New Spec
- **Status:** Resolved
- **Priority:** High
- **Affects:** `engines/NPC/NPCEngine.md`
- **Reported:** 2026-06-26
- **Resolved:** 2026-06-26

## Description

기존 `engines/NPC/NPCEngine.md`는 Draft v0.1 상태였으며, 포맷이 다른 엔진 명세와 불일치했다. NPC 생성 주체 문제(Creator Engine #0002 결정과의 충돌), 자율 행동 프로토콜, 사망 처리 절차, Director Engine 쿼리 인터페이스, QA 검증 규칙이 누락되어 있었다.

## Motivation

Issue #0002에서 Creator Engine이 NPC를 생성하지 않도록 결정했다. 이에 따라 NPC 생성 책임이 NPC Engine에 있음을 명확히 명세해야 하며, Creator Engine·Director Engine·World Engine 명세와 일관된 인터페이스를 갖춰야 한다.

## Scope

- [x] Requires changes to existing document(s): `engines/NPC/NPCEngine.md`
- [x] World-agnostic (engine-layer)
- [x] Engine-level change (goes in `engines/NPC/`)

## Changes Made

기존 Draft v0.1 내용을 기반으로 전면 재작성. 주요 추가·변경 사항:

**신규 추가:**
- **§5 NPC 생성 프로토콜**: Creator Engine 제외 이후 NPC가 어떻게 생성되는지 명세. 사전 정의 NPC 초기화(모듈 npcs.yaml), 동적 생성(Director 요청), NPC 승격 규칙 포함.
- **§11 자율 행동 프로토콜**: TimeAdvanceNotification 수신 시 처리 방식. 플레이어 존재 지역 예외 처리 포함.
- **NPCEngineQuery 스키마**: `type: reaction | dialogue | create | autonomous_action` 4가지 타입 정의. Director Engine과의 인터페이스 통일.
- **사망 처리 프로토콜 (§10.2)**: 5단계 절차(World/Mission/Memory 이벤트 발행) 명세.
- **세력 전파 규칙**: World Engine 지배 세력 변경 시 NPC disposition 보정 로직.
- **QA 검증 규칙**: SV-NPC-001 ~ SV-NPC-009 (9개 항목, Fatal 3개 포함).

**개선:**
- 문서 메타데이터 헤더 추가 (Creator/Director/World Engine 포맷 통일)
- `faction_id`, `trust_permanent_debuff`, `relationship_type` 필드 스키마에 추가
- 호감도 경계값별 NPC 행동 경향 테이블 추가

## Design Decisions

**NPC 생성 주체 명확화**: Creator Engine(Issue #0002) 결정에 따라 NPC 인스턴스 생성 전담이 NPC Engine임을 §5에서 명문화했다. 세계관 모듈의 `content/npcs.yaml`이 사전 정의 NPC의 유일한 원천이다.

**Background NPC 세션 소멸**: Background NPC는 세션 종료 시 자동 소멸하여 메모리 비효율을 방지한다. Save Engine에 저장하지 않는다.

**자율 행동 Major 한정**: Minor·Background NPC의 자율 행동은 세계관 일관성보다 처리 비용이 더 크다고 판단하여 Major NPC에만 전체 계산을 적용한다.

## Notes

- 관련 파일: `engines/NPC/00_NPC_SystemPrompt.md` (본 명세와 일관성 확인 필요 — 시스템 프롬프트의 NPC seed 생성 관련 내용 제거 권고)
- `SV-NPC-002`(secret 무단 노출), `SV-NPC-003`(플레이어 행동 서술)은 Fatal 등급으로 즉시 차단.
- 참조: `core/CoreSpec.md` §5.6, §11.4, §12.2.4, §13.2
