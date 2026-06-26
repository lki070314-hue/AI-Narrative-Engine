# [0004] World Engine 명세 작성

- **Type:** New Spec
- **Status:** Resolved
- **Priority:** High
- **Affects:** `engines/World/WorldEngine.md`
- **Reported:** 2026-06-26
- **Resolved:** 2026-06-26

## Description

기존 `engines/World/WorldEngine.md`는 Draft v0.1 상태였으며, 포맷이 다른 엔진(Creator, Director) 명세와 불일치했다. 입력/출력 인터페이스 계약, WorldSeed 초기화 프로토콜, WorldEffect 처리 명세, QA 검증 규칙이 없었다.

## Motivation

Director Engine이 WorldEffect 이벤트를 World Engine에 전달하고, Creator Engine의 WorldSeed를 World Engine이 수신하는 연계 구조가 이미 Designer, Creator 명세에 정의됐다. World Engine 명세가 이를 수용하지 않으면 세 엔진 간 인터페이스가 불일치한다.

## Scope

- [x] Requires changes to existing document(s): `engines/World/WorldEngine.md`
- [x] World-agnostic (engine-layer)
- [x] Engine-level change (goes in `engines/World/`)

## Changes Made

기존 Draft v0.1 내용을 기반으로 전면 재작성. 주요 추가·변경 사항:

- **인터페이스 계약 추가:** 입력 5개(world_seed, saved_world_state, world_effects, time_advance_request, active_module), 출력 4개(world_state, autonomous_report, world_snapshot, state_change_log) 명세.
- **WorldSeed → WorldState 변환 프로토콜 추가:** Creator Engine과의 연계 명확화.
- **세계 규칙 파일 바인딩 명세 추가:** world_rules.yaml 유무에 따른 처리 기준 정의.
- **WorldEffect 스키마 신규 정의:** Director/NPC/Mission Engine이 World Engine에 전달하는 변화 요청 구조 표준화.
- **WorldEffect 적용 순서 정의:** 동일 턴 복수 효과 충돌 시 처리 우선순위.
- **세력 자율 행동 계산 프로토콜 개선:** 플레이어 존재 지역 예외 처리 명시 (Fatal 방지 조건).
- **QA 검증 규칙 추가:** SV-WLD-001 ~ SV-WLD-009 (9개 항목).
- **포맷 통일:** Creator/Director Engine 명세와 동일한 구조 적용.

## Notes

- 기존 Draft v0.1의 모든 핵심 내용(시간 단위, 날씨 생성, 지역 상태 갱신, 스냅샷 포맷)은 보존하고 구조화했다.
- 참조: `core/CoreSpec.md` §5.4, §11, §13
- `SV-WLD-006` (미발견 지역 노출)과 `SV-WLD-007` (플레이어 존재 지역 자동 확정)은 Fatal 등급.
