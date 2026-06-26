# [0006] Mission Engine 명세 작성

- **Type:** New Spec
- **Status:** Resolved
- **Priority:** High
- **Affects:** `engines/Mission/MissionEngine.md`
- **Reported:** 2026-06-26
- **Resolved:** 2026-06-26

## Description

`engines/Mission/` 디렉터리와 `MissionEngine.md`가 존재하지 않았다. CoreSpec §5.7에 역할 정의는 있으나, 다른 엔진과의 인터페이스 계약, 임무 수명 주기 프로토콜, Emergent Mission 시스템, 임무 실패 결과 처리가 명세되지 않은 상태였다.

## Motivation

Director Engine(§6.2)이 Mission Engine으로 `MissionEngineQuery`를 전달하고, NPC Engine(§10.2)이 NPC 사망 시 `mission_events`를 발행하는 구조가 이미 정의돼 있다. Mission Engine 명세가 없으면 이 인터페이스의 수신 측 계약이 없어 엔진 간 연계가 불완전하다.

## Scope

- [x] Requires creation of new document(s): `engines/Mission/MissionEngine.md`
- [x] World-agnostic (engine-layer)
- [x] Engine-level change (goes in `engines/Mission/`)

## Changes Made

신규 파일 `engines/Mission/MissionEngine.md` v1.0.0 작성. 주요 내용:

**데이터 구조:**
- `MissionState` 전체 스키마: id/type/status/objectives/failure_conditions/time_limit/rewards/consequences/prerequisite_missions/unlocks_missions/blocks_missions/source
- 임무 유형 5가지: main | side | faction | personal | emergent

**프로토콜:**
- **§5 임무 생성**: 모듈 `content/missions.yaml` 로드 및 초기화. 등록 원칙 4가지 (세계 내 논리, on_fail 필수, 실패 가능성, 세계관 일관성).
- **§6 활성화 및 추적**: prerequisite 조건 기반 활성화 프로토콜. 매 턴 목표 진행 점검 절차.
- **§7 목표 진행 판정**: 6가지 조건 유형(존재/위치/처치/설득/세력/사건). 숨겨진 목표 및 선택 목표 처리 규칙.
- **§8 완료·실패 처리**: 각 9단계 절차. on_fail 강제 발행 원칙 (CoreSpec §5.7.3).
- **§9 Emergent Mission**: 감지 트리거 4가지(약속/발견/개입/부채). 생성 프로토콜. 플레이어 통지 금지 원칙.
- **§10 연쇄 효과**: prerequisite → 활성화 연쇄, blocks_missions → 실패 시 영구 잠금, 캠페인 3단 act 정렬.
- **§11 시간 제한**: 남은 시간 계산식. hidden_timer Shadow Engine 연계. 25% 경고 처리.

**검증 규칙:** SV-MIS-001 ~ SV-MIS-010 (10개 항목, Fatal 2개 포함).

## Design Decisions

**"실패 불가능한 임무 금지" 원칙 명문화**: CoreSpec §5.7.3를 `SV-MIS-003` (Error — 등록 거부)으로 구현. `on_fail`이 비어 있으면 임무 자체가 등록되지 않는다.

**플레이어 강제 수락 Fatal 처리**: `SV-MIS-004`를 Fatal 등급으로 설정. 임무 수락은 반드시 플레이어 선언에 의한다. 자동 수락 로직이 발생하면 즉시 차단 후 롤백.

**Emergent Mission 통지 방식**: 메타 알림("새 임무가 등록되었습니다") 금지. 세계와 NPC의 반응을 통한 간접 암시만 허용. OOC 질문 시에는 목록에 포함.

**blocks_missions 영구 잠금**: 임무 실패로 닫힌 가능성은 되돌릴 수 없다. 세계의 결과에 무게를 부여하기 위한 설계.

## Notes

- `engines/Mission/` 디렉터리를 신규 생성했다.
- Shadow Engine과의 협력: hidden_timer 관리는 Shadow Engine에 위임. Mission Engine은 만료 판정만 수행.
- 참조: `core/CoreSpec.md` §5.7, §13.1, §15.2.3
