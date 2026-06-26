# [0007] Shadow Engine 명세 작성

- **Type:** New Spec
- **Status:** Resolved
- **Priority:** High
- **Affects:** `engines/Shadow/ShadowEngine.md`
- **Reported:** 2026-06-26
- **Resolved:** 2026-06-26

## Description

`engines/Shadow/` 디렉터리와 `ShadowEngine.md`가 존재하지 않았다. CoreSpec §5.9에 역할 정의와 한계는 있으나, 다른 엔진과의 인터페이스 계약, 숨겨진 타이머 시스템, 확률 분포 조정 알고리즘, 배경 사건 처리 프로토콜, GM 접근 인터페이스가 명세되지 않은 상태였다.

## Motivation

Mission Engine(§11.2)이 `hidden_timer: true` 타이머를 Shadow Engine에 위임하도록 정의됐고, Director Engine이 Shadow Engine 완료 신호를 수신하는 구조가 이미 확립됐다. Shadow Engine 명세가 없으면 타이머 위임의 수신 측 계약이 없다.

## Scope

- [x] Requires creation of new document(s): `engines/Shadow/ShadowEngine.md`
- [x] World-agnostic (engine-layer)
- [x] Engine-level change (goes in `engines/Shadow/`)

## Changes Made

신규 파일 `engines/Shadow/ShadowEngine.md` v1.0.0 작성. 주요 내용:

**데이터 구조:**
- `ShadowState` 전체 스키마: 숨겨진 타이머 레지스트리 / 확률 분포 버퍼 / 페이싱 보조 상태 / 배경 사건 큐 / NPC 음모 추적 5개 서브 구조
- `ShadowEvent` 스키마: 7가지 이벤트 타입 및 `disclosure_level` (gm_only | can_hint | can_reveal)
- `HiddenTimerRegistration`, `PacingAssistRequest`, `DCAdjustment`, `BackgroundEventRegistration`, `AgendaRegistration` 등 6가지 입력 스키마

**프로토콜:**
- **§5 숨겨진 타이머**: 등록 → 카운트다운 → 만료 3단계. notification_threshold로 임박 암시 신호 발행. revelation_condition으로 플레이어 공개 전환.
- **§6 확률 분포 조정**: running_luck_score (-1.0 ~ +1.0) 기반 DC 자동 보정. 최대 ±7 (DC의 ±15% 이내). 서사적 판정·연속 조정 후 불적용 조건.
- **§7 페이싱 보조**: 페이싱 상태별 보조 동작 테이블. 클라이맥스 luck_boost. atmosphere_cue 신호.
- **§8 배경 사건·NPC 음모**: 등록·진행·발행 프로토콜. 음모 progress 기반 threshold 트리거.
- **§9 Shadow 이벤트**: disclosure_level 3단계, urgency 3단계에 따른 Director Engine 처리 행동 테이블.
- **§10 GM 접근**: ShadowStateSnapshot 조회. 5가지 수동 조작 허용 항목. 조작 로그 필수.

**검증 규칙:** SV-SHD-001 ~ SV-SHD-009 (9개 항목, Fatal 3개 포함).

## Design Decisions

**±15% 제한 구현**: CoreSpec §5.9.2를 DC의 ±15%로 해석하여 ±7 클램프로 구현했다 (DC 15 기준으로 ≈ 13.3% ~ 16.7%의 중간값). `SV-SHD-001`이 Fatal로 이를 강제한다.

**클라이맥스 편향 소극적 적용**: 클라이맥스에서 luck_boost를 DC -3 ~ -5 범위로 제한했다. "영웅적 판정 성공 가능성 소폭 향상"이 목표이며, 클라이맥스를 "항상 성공"으로 만드는 것을 피하기 위한 설계다.

**배경 사건과 NPC 자율 행동의 분리**: NPC Engine §11은 플레이어가 없는 지역에서의 Major NPC 자율 행동을 담당하고, Shadow Engine §8은 그 중 플레이어에게 비노출인 음모·배경 사건을 추적한다. 두 시스템이 같은 사건을 이중 처리하지 않도록 등록 주체를 구분했다.

**독립 실행 원칙**: Shadow Engine은 외부 엔진의 쿼리를 기다리지 않는다. World Engine의 `TimeAdvanceNotification`을 수신하는 순간 자율적으로 타이머와 배경 사건을 진행시킨다.

## Notes

- 참조: `core/CoreSpec.md` §5.9, §8.3, §12.1.3
- `SV-SHD-003` (Shadow 내부 정보 플레이어 노출)는 Fatal 등급. Shadow Engine의 존재 자체가 노출되면 게임 경험이 파괴된다.
