# Shadow Engine Specification

**문서 식별자:** `engines/Shadow/ShadowEngine.md`
**버전:** v1.0.0
**상태:** Draft
**최종 수정:** 2026-06-26
**참조:** `core/CoreSpec.md` §5.9, §8.3, §12.1.3

---

## 목차

1. [목적](#1-목적)
2. [책임 범위](#2-책임-범위)
3. [아키텍처 및 인터페이스](#3-아키텍처-및-인터페이스)
4. [Shadow 상태 구조](#4-shadow-상태-구조)
5. [숨겨진 타이머 시스템](#5-숨겨진-타이머-시스템)
6. [확률 분포 조정 시스템](#6-확률-분포-조정-시스템)
7. [페이싱 보조 시스템](#7-페이싱-보조-시스템)
8. [배경 사건 및 NPC 음모 추적](#8-배경-사건-및-npc-음모-추적)
9. [Shadow 이벤트 발행](#9-shadow-이벤트-발행)
10. [GM 접근 인터페이스](#10-gm-접근-인터페이스)
11. [검증 규칙](#11-검증-규칙)

---

# 1. 목적

Shadow Engine은 플레이어에게 직접 노출되지 않는 세계의 이면을 관리하는 엔진이다. 타이머, 확률 균형, 페이싱 보조, 배경 사건, NPC의 숨겨진 의도가 이 엔진의 관리 대상이다.

Shadow Engine은 게임의 *규칙*을 바꾸지 않는다. 게임의 *느낌*을 관리한다. 숙련된 GM이 세션 분위기를 암묵적으로 조율하는 것처럼, 세계 규칙의 테두리 안에서 최소한의 개입으로 캠페인의 내러티브 품질을 유지한다.

---

# 2. 책임 범위

## 2.1 Shadow Engine이 하는 것

| 항목 | 설명 |
|------|------|
| **숨겨진 타이머 관리** | 플레이어가 인식하지 못하는 카운트다운을 추적하고 만료 시 이벤트를 발행한다. |
| **확률 분포 조정** | 세션 내 판정 결과 분포를 추적하고, 운/불운이 과도하게 편중되지 않도록 DC를 미세 보정한다. |
| **페이싱 보조** | Director Engine의 페이싱 상태를 수신하여 장면의 긴장감을 뒷받침하는 소극적 조정을 수행한다. |
| **배경 사건 추적** | 플레이어가 없는 장소에서 진행되는 세계 사건과 NPC 활동을 추적하고 결과를 발행한다. |
| **NPC 음모 추적** | 플레이어가 아직 인식하지 못한 NPC의 숨겨진 목표 진행 상황을 관리한다. |
| **GM 상태 보고** | GM의 요청 시 Shadow Engine의 현재 상태를 완전히 노출한다. |

## 2.2 Shadow Engine이 하지 않는 것

| 금지 항목 | 이유 |
|-----------|------|
| **확립된 세계 규칙 위반** | 물리·마법 규칙, 세계관 원칙은 Shadow Engine의 개입 범위 밖이다. |
| **플레이어 선택 결과 임의 변경** | 플레이어가 선택하고 판정이 완료된 결과는 소급 수정 불가이다. |
| **판정 결과 소급 수정** | 이미 확정된 주사위 결과를 변경하는 것은 허용되지 않는다. |
| **일관된 편향** | 특정 플레이어나 세력에게 유리하거나 불리한 방향으로 지속 편향하지 않는다. |
| **±15% 초과 보정** | 확률 조정 총량은 DC의 ±15%를 초과하지 않는다 (CoreSpec §5.9.2). |
| **플레이어에게 Shadow 상태 노출** | Shadow Engine의 존재와 작동 내용은 플레이어에게 비노출이다. |
| **서술 텍스트 직접 생성** | 서술은 Director Engine이 담당한다. Shadow Engine은 신호만 발행한다. |

---

# 3. 아키텍처 및 인터페이스

## 3.1 다른 엔진과의 관계

```
[Mission Engine] ─── hidden_timer_registration ───┐
[World Engine]   ─── hidden_timer_registration ───┤
[Director Engine]─── timer_registration            │
                 ─── pacing_assist_request    ────►[Shadow Engine]
                                                         │
                      shadow_event ◄─────────────────────┤
                    (timer_expired,                       │
                     background_event,                    │
                     agenda_signal,                       │
                     pacing_signal)                       │
                                                          │
 [World Engine] ◄─── world_effects ───────────────────────┤
                 (배경 사건 결과)                          │
                                                          │
 [NPC Engine]   ◄─── agenda_trigger ──────────────────────┤
                 (음모 전진 알림)                          │
                                                          │
 [GM Interface] ◄─── shadow_state_snapshot ───────────────┘
                 (요청 시 전체 상태 보고)
```

Shadow Engine은 독립적으로 작동하며 외부 쿼리를 능동적으로 요청하지 않는다. 다른 엔진이 등록(registration)하고, Shadow Engine이 결과를 발행(event emit)한다.

## 3.2 인터페이스 계약

### 3.2.1 입력 (Inputs)

| 변수명 | 타입 | 출처 | 설명 |
|--------|------|------|------|
| `hidden_timer_registration` | HiddenTimerRegistration | Mission / World / Director | 새 숨겨진 타이머 등록 요청. |
| `pacing_assist_request` | PacingAssistRequest | Director Engine | 현재 페이싱 상태와 긴장도를 전달하여 보조 조정을 요청한다. |
| `roll_result_report` | RollResultReport | Director Engine | 판정 완료 후 결과를 통보하여 확률 분포 버퍼를 갱신한다. |
| `time_advance_notification` | TimeAdvanceNotification | World Engine | 세계 시간 경과를 통보하여 타이머 카운트다운과 배경 사건을 진행시킨다. |
| `background_event_registration` | BackgroundEventRegistration | World / NPC Engine | 배경에서 진행 중인 사건 등록. |
| `agenda_registration` | AgendaRegistration | NPC Engine | 플레이어 비가시 NPC 목표 등록. |

### 3.2.2 HiddenTimerRegistration 스키마

```yaml
hidden_timer_registration:
  timer_id: string                   # htmr_{캠페인_약어}_{순번}
  label: string                      # GM용 설명 레이블
  owner_type: mission | world_event | director | shadow_internal
  owner_id: string
  duration_seconds: int              # 활성화 후 총 지속 시간
  trigger_action:
    type: mission_fail | world_event_activate | shadow_scene | npc_action
    target_id: string
    description: string
  notification_threshold: int | null # 이 값(초) 이하가 되면 Director에 암시 신호 발행
  revelation_condition: string | null # 이 조건 충족 시 타이머가 플레이어에게 공개됨
```

### 3.2.3 출력 (Outputs)

| 변수명 | 타입 | 조건 | 설명 |
|--------|------|------|------|
| `shadow_event` | ShadowEvent | 이벤트 발생 시 | Director Engine에 전달되는 이벤트. 서술 통합 신호. |
| `dc_adjustment` | DCAdjustment \| null | 판정 요청 시 | 확률 보정이 필요한 경우 DC 조정값. null이면 보정 없음. |
| `world_effects` | List[WorldEffect] | 배경 사건 확정 시 | World Engine에 발행하는 세계 변화. |
| `agenda_trigger` | AgendaTrigger \| null | NPC 음모 전진 시 | NPC Engine에 전달되는 음모 진행 신호. |
| `shadow_state_snapshot` | ShadowStateSnapshot | GM 요청 시 | Shadow Engine 전체 상태 보고서. |

---

# 4. Shadow 상태 구조

## 4.1 ShadowState 스키마

```yaml
shadow_state:
  metadata:
    campaign_id: string
    session_id: string
    last_updated_at: int           # epoch_seconds

  # 1. 숨겨진 타이머 레지스트리
  hidden_timers:
    - timer_id: string
      label: string
      owner_type: mission | world_event | director | shadow_internal
      owner_id: string
      status: active | expired | revealed | cancelled
      triggered_at_epoch: int      # 만료 시각 (epoch_seconds)
      notification_threshold: int | null
      revelation_condition: string | null
      expired_at_epoch: int | null # 실제 만료 시각

  # 2. 확률 분포 버퍼
  roll_buffer:
    session_total_rolls: int
    success_count: int
    failure_count: int
    running_luck_score: float      # -1.0 (연속 실패) ~ +1.0 (연속 성공)
    current_dc_adjustment: int     # 현재 적용 중인 DC 보정값 (-7 ~ +7, ≤ ±15%)
    adjustment_log:
      - roll_id: string
        raw_dc: int
        adjusted_dc: int
        outcome: success | failure
        adjustment_applied: int

  # 3. 페이싱 보조 상태
  pacing_assist:
    current_pacing: rising_action | climax | falling_action | resolution
    tension_level: int             # 0-10
    active_adjustments:
      - adjustment_type: dc_pressure | luck_boost | atmosphere_cue
        magnitude: int             # -7 ~ +7 (% 단위)
        scope: this_roll | this_scene | this_session
        reason: string             # GM 로그용

  # 4. 배경 사건 큐
  background_events:
    - event_id: string             # shd_evt_{abbr}_{seq}
      description: string
      status: pending | active | resolved
      scheduled_at_epoch: int
      resolved_at_epoch: int | null
      world_effects: list[WorldEffect]
      visibility: gm_only | can_hint | can_reveal

  # 5. NPC 음모 추적
  npc_agendas:
    - agenda_id: string            # shd_agd_{abbr}_{seq}
      npc_id: string
      agenda_description: string
      progress: int                # 0 ~ 100
      trigger_thresholds:
        - threshold: int           # 이 progress 수치 도달 시
          action_type: world_effect | director_hint | mission_create
          target_id: string | null
          description: string
      status: active | completed | revealed | abandoned
```

---

# 5. 숨겨진 타이머 시스템

## 5.1 타이머 등록

Mission Engine, World Engine, Director Engine이 `HiddenTimerRegistration`을 전달하면 Shadow Engine은 다음 절차로 타이머를 등록한다.

```
1. 중복 timer_id 확인 (이미 존재하면 등록 거부 후 경고)
2. triggered_at_epoch = 현재 epoch_seconds + duration_seconds 계산
3. status: active로 hidden_timers에 추가
4. notification_threshold가 있으면 알림 예정 시각 계산
```

## 5.2 타이머 카운트다운 처리

World Engine이 `TimeAdvanceNotification`을 전달할 때마다 Shadow Engine은 모든 active 타이머를 점검한다.

```
각 active 타이머에 대해:
  remaining = triggered_at_epoch - current_epoch_seconds

  if remaining ≤ 0:
    → 타이머 만료: 5.3 만료 처리 프로토콜 실행

  elif notification_threshold is not null
       AND remaining ≤ notification_threshold:
    → 암시 신호 발행: shadow_event (event_type: timer_warning) 생성
      Director Engine에 전달 (서술에 긴장감 신호로 통합)
```

## 5.3 타이머 만료 처리 프로토콜

```
1. status: expired로 전환
2. expired_at_epoch: 현재 epoch_seconds 기록
3. trigger_action.type에 따라 처리:
   - mission_fail → Mission Engine에 report_event 쿼리 발행
   - world_event_activate → World Engine에 WorldEffect 발행
   - shadow_scene → Director Engine에 shadow_event (event_type: timer_expired) 전달
   - npc_action → NPC Engine에 agenda_trigger 전달
4. Director Engine에 shadow_event 알림 (urgency에 따라 즉시 또는 장면 전환 시)
```

## 5.4 타이머 공개 처리

`revelation_condition`이 충족되면 타이머가 플레이어에게 공개될 수 있다. 이 경우:

```
1. status: revealed로 전환
2. Director Engine에 shadow_event (event_type: timer_revealed) 전달
3. Director Engine은 서술을 통해 플레이어에게 기한의 존재를 자연스럽게 노출
   → "어딘가에서 무언가가 빠르게 움직이고 있다는 느낌이 든다"가 아니라
      세계 논리 안에서의 직접 암시 ("메리가 초조한 표정으로 말한다: '시간이 없어요.'")
```

---

# 6. 확률 분포 조정 시스템

## 6.1 원칙

Shadow Engine의 확률 조정은 게임의 *공정성* 인식을 유지하기 위한 것이다. 장기적으로 판정 결과는 명세된 확률에 수렴해야 한다.

**조정 한계:** 어떠한 경우에도 DC 조정값의 절대값이 원래 DC의 15%를 초과하지 않는다.

**예시:** DC 15인 판정의 경우, 최대 조정 범위는 DC 13 ~ DC 17이다.

## 6.2 Luck Score 계산

판정 결과가 보고될 때마다 `running_luck_score`를 갱신한다.

```
판정 성공 시: running_luck_score += 0.1
판정 실패 시: running_luck_score -= 0.1

클램프: -1.0 ≤ running_luck_score ≤ +1.0

DC 조정값 계산:
  raw_adjustment = running_luck_score × (-7)
  # 행운이 많으면(+1.0) DC를 +7 올려 조금 어렵게
  # 불운이 많으면(-1.0) DC를 -7 낮춰 조금 쉽게

  final_adjustment = clamp(raw_adjustment, -7, +7)
  → current_dc_adjustment 갱신
```

## 6.3 DC 조정 발행

Director Engine이 판정 처리 전에 DC 조정을 요청하면 Shadow Engine은 `DCAdjustment`를 반환한다.

```yaml
dc_adjustment:
  original_dc: int
  adjustment_value: int       # -7 ~ +7
  adjusted_dc: int            # original_dc + adjustment_value
  reason: luck_balance        # GM 로그용. 플레이어에게 노출 불가
```

## 6.4 조정 불적용 조건

다음 판정에는 DC 조정을 적용하지 않는다.

| 조건 | 이유 |
|------|------|
| 서사적으로 결정적인 판정 (임무 완료 여부 결정) | 세계 결과의 무게를 유지해야 한다 |
| 플레이어가 명시적으로 강점을 활용하는 판정 (관련 특성 보유, 높은 스킬 숙련도) | 플레이어 선택의 결과가 희석되어서는 안 된다 |
| 연속 3회 이상 조정이 적용된 직후 | 연속 조정은 분포를 오히려 왜곡할 수 있다 |

---

# 7. 페이싱 보조 시스템

## 7.1 목적

페이싱 보조는 Director Engine의 서사 의도를 세계 메커니즘 측면에서 지원한다. Director Engine이 클라이맥스를 구성할 때 세계의 우연이 그 흐름을 방해하지 않도록 미세 조정한다.

## 7.2 PacingAssistRequest 스키마

```yaml
pacing_assist_request:
  current_pacing: rising_action | climax | falling_action | resolution
  tension_level: int           # 0-10 (Director의 scene_state.tension_level)
  request_type: atmosphere | probability | both
```

## 7.3 페이싱 상태별 보조 동작

| 페이싱 상태 | tension_level | Shadow Engine 보조 동작 |
|-------------|---------------|------------------------|
| `rising_action` | 0 ~ 5 | 조정 없음. 세계의 자연스러운 흐름 유지 |
| `rising_action` | 6 ~ 10 | 배경 사건 중 위협 관련 항목을 `can_hint` 상태로 전환. Director가 암시 신호를 받음 |
| `climax` | 모든 값 | `luck_boost`: DC 조정을 -3 ~ -5 범위로 편향. 영웅적 판정이 성공할 가능성을 소폭 높임. 단, §6.4 불적용 조건 우선 |
| `falling_action` | 모든 값 | 조정 없음. 결과를 그대로 반영 |
| `resolution` | 모든 값 | 배경 사건 중 `pending` 항목을 처리 타이밍에 올림. 세계 정리 단계 지원 |

**클라이맥스 편향의 한계:** 클라이맥스 DC 편향은 해당 세션 누적 조정값이 ±15%를 초과하지 않는 범위에서만 적용된다. 이미 한도에 도달했으면 페이싱 보조 없이 진행한다.

## 7.4 atmosphere_cue 신호

`request_type: atmosphere`를 포함하면 Shadow Engine은 현재 배경 사건 큐에서 서사 분위기와 일치하는 항목을 선별하여 Director Engine에 `atmosphere_cue`를 전달한다.

```yaml
# shadow_event (event_type: atmosphere_cue)
atmosphere_cue:
  cue_type: threat_approaching | ally_in_danger | opportunity_window | ominous_silence
  source_event_id: string
  suggested_disclosure: subtle_hint | direct_foreshadow
  # Director Engine이 이 정보를 서술에 자연스럽게 통합하는 방식을 결정
```

---

# 8. 배경 사건 및 NPC 음모 추적

## 8.1 배경 사건 (Background Events)

배경 사건은 플레이어가 없는 장소에서 세계가 독립적으로 진행하는 사건이다. World Engine과 NPC Engine이 등록하며, Shadow Engine이 타이밍을 관리하고 결과를 발행한다.

```yaml
background_event_registration:
  event_id: string
  description: string          # 무슨 일이 어디서 진행되는가
  scheduled_at_epoch: int      # 이 시각에 결과를 확정
  world_effects: list[WorldEffect]  # 확정 시 World Engine에 발행
  visibility: gm_only | can_hint | can_reveal
  cancellation_condition: string | null  # 이 조건 충족 시 사건이 취소됨
```

**발행 프로토콜:**

```
scheduled_at_epoch 도달 시:
  1. cancellation_condition 점검 (충족 시 status: cancelled로 전환, 종료)
  2. status: resolved로 전환
  3. world_effects를 World Engine에 발행
  4. visibility에 따라:
     - gm_only: 기록만 유지, 플레이어 서술 없음
     - can_hint: Director Engine에 atmosphere_cue 전달
     - can_reveal: Director Engine에 shadow_event (event_type: background_event) 전달
```

## 8.2 NPC 음모 (NPC Agendas)

NPC 음모는 NPC Engine이 등록하는 NPC의 숨겨진 목표 진행 상황이다. NPC의 `goals.primary`와 별개로, 플레이어가 전혀 인식하지 못한 채 진행되는 장기 계획을 추적한다.

```yaml
agenda_registration:
  agenda_id: string
  npc_id: string
  agenda_description: string
  initial_progress: int        # 0 ~ 100
  trigger_thresholds:
    - threshold: int
      action_type: world_effect | director_hint | mission_create | npc_action
      target_id: string | null
      description: string
```

**음모 진행:**

```
time_advance_notification 수신 시 각 active 음모에 대해:
  1. 세계 상태(WorldState)와 NPC 상태를 기반으로 진행도(progress) 증가량 계산
     (NPC가 목표를 향해 행동할 환경인가, 방해 요소가 있는가)
  2. progress 갱신
  3. trigger_thresholds에 도달한 항목 실행:
     - world_effect → World Engine에 WorldEffect 발행
     - director_hint → Director Engine에 shadow_event (event_type: agenda_signal) 전달
     - mission_create → Mission Engine에 emergent_context 전달 (새 임무 생성 제안)
     - npc_action → NPC Engine에 agenda_trigger 전달
  4. progress = 100이면 status: completed, 최종 world_effect 발행
```

**음모 공개 (Revelation):**

플레이어의 조사 행동, 관련 NPC와의 대화, 또는 세계 사건의 결과로 음모가 드러날 수 있다. 공개 시:

```
status: revealed로 전환
→ Director Engine에 shadow_event (event_type: agenda_revealed) 전달
→ 이후 음모 관련 정보는 NPC Engine의 knowledge.public으로 이관
```

---

# 9. Shadow 이벤트 발행

## 9.1 ShadowEvent 스키마

```yaml
shadow_event:
  id: string                   # shd_{캠페인_약어}_{seq}
  event_type: timer_expired | timer_warning | timer_revealed | background_event | atmosphere_cue | agenda_signal | agenda_revealed
  source_id: string            # 타이머 ID, 배경 사건 ID, 음모 ID 등
  description: string          # Director Engine이 서술에 통합할 사건 내용
  urgency: immediate | next_scene | next_session
  world_effects: list[WorldEffect]
  mission_events: list[MissionEvent]
  disclosure_level: gm_only | can_hint | can_reveal
```

## 9.2 Director Engine의 Shadow 이벤트 처리

Director Engine은 Shadow 이벤트를 수신하면 `disclosure_level`에 따라 처리한다.

| disclosure_level | Director Engine 처리 |
|-----------------|----------------------|
| `gm_only` | 서술에 포함하지 않는다. 내부 상태 갱신만 수행. |
| `can_hint` | 세계 묘사를 통한 간접 암시를 서술에 포함할 수 있다. 수치·이름 직접 언급 금지. |
| `can_reveal` | 사건의 결과를 직접 서술에 포함한다. 플레이어가 인식할 수 있는 세계 변화로 표현. |

**urgency에 따른 처리 타이밍:**

| urgency | 처리 타이밍 |
|---------|------------|
| `immediate` | 현재 턴 서술에 즉시 통합 |
| `next_scene` | 다음 장면 전환 시 통합 |
| `next_session` | 다음 세션 시작 상황에 통합 |

---

# 10. GM 접근 인터페이스

## 10.1 Shadow State 조회

GM은 Shadow Engine의 현재 상태를 완전히 조회할 수 있다. 플레이어는 어떠한 방법으로도 Shadow Engine의 내용에 접근할 수 없다.

GM 조회 시 `ShadowStateSnapshot`을 반환한다.

```yaml
shadow_state_snapshot:
  generated_at: string           # ISO 8601 타임스탬프
  campaign_id: string
  session_id: string

  timer_summary:
    active_count: int
    expiring_soon: list[string]  # 3세션 내 만료 타이머 ID 목록
    expired_this_session: list[string]

  luck_summary:
    running_luck_score: float
    current_dc_adjustment: int
    session_success_rate: float  # 이번 세션 성공률

  background_event_summary:
    pending_count: int
    next_scheduled: string | null  # 가장 가까운 예정 사건 설명 (GM용)

  agenda_summary:
    - npc_id: string
      agenda_description: string
      progress: int
      next_threshold: int | null
```

## 10.2 GM 수동 개입

GM은 다음 Shadow 상태를 수동으로 조작할 수 있다.

| 조작 항목 | 허용 여부 | 처리 |
|-----------|-----------|------|
| 타이머 취소 | 허용 | status: cancelled. 트리거 액션 미실행 |
| 타이머 기간 수정 | 허용 | triggered_at_epoch 갱신. 이유 GM 로그에 기록 |
| 배경 사건 취소·즉시 실행 | 허용 | 즉시 실행 시 cancellation_condition 무시 |
| DC 조정값 수동 재설정 | 허용 | running_luck_score, current_dc_adjustment 초기화. 이유 기록 필수 |
| NPC 음모 progress 수동 조정 | 허용 | 진행도 직접 설정. threshold 재점검 후 필요 시 트리거 실행 |

GM 수동 개입은 모두 `adjustment_log`에 기록되며 이유 없는 조작은 Warning을 발행한다.

---

# 11. 검증 규칙

QA Engine은 Shadow Engine의 상태와 처리에 대해 다음 항목을 검증한다.

| 규칙 ID | 검증 항목 | 위반 시 처리 |
|---------|-----------|-------------|
| `SV-SHD-001` | `current_dc_adjustment`의 절대값이 원래 DC의 15%를 초과하는가 | Fatal — 보정값을 최대 허용값으로 클램프, 오류 기록 |
| `SV-SHD-002` | 이미 확정된 판정 결과에 DC 조정이 소급 적용되었는가 | Fatal — 즉시 취소, 원래 결과 복원 |
| `SV-SHD-003` | 플레이어 대면 출력에 Shadow Engine 내부 정보(조정값, 타이머 수치, 음모 progress)가 포함되었는가 | Fatal — 즉시 출력 차단 |
| `SV-SHD-004` | `gm_only` Shadow 이벤트가 서술 텍스트에 반영되었는가 | Error — 해당 서술 플래그, Director Engine에 재생성 요청 |
| `SV-SHD-005` | 확립된 세계 규칙을 위반하는 world_effect가 배경 사건에 포함되었는가 | Error — 해당 WorldEffect 제거 후 재검토 요청 |
| `SV-SHD-006` | 동일 timer_id가 중복 등록되었는가 | Warning — 두 번째 등록 거부, 기존 타이머 유지 |
| `SV-SHD-007` | 세션 내 성공/실패 편향이 한 방향으로 10연속을 초과했는가 | Warning — 조정 시스템이 작동 중인지 확인. running_luck_score 기록 |
| `SV-SHD-008` | §6.4 불적용 조건에 해당하는 판정에 DC 조정이 적용되었는가 | Error — 조정 취소, 원래 DC로 복원 |
| `SV-SHD-009` | GM 수동 개입 로그에 이유가 기록되지 않았는가 | Warning — 이유 없는 조작으로 마킹, 내용 검토 권고 |

---

**END OF ShadowEngine v1.0.0**
