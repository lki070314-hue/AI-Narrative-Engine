# Mission Engine Specification

**문서 식별자:** `engines/Mission/MissionEngine.md`
**버전:** v1.0.0
**상태:** Draft
**최종 수정:** 2026-06-26
**참조:** `core/CoreSpec.md` §5.7, §13.1, §15.2.3

---

## 목차

1. [목적](#1-목적)
2. [책임 범위](#2-책임-범위)
3. [아키텍처 및 인터페이스](#3-아키텍처-및-인터페이스)
4. [임무 데이터 구조](#4-임무-데이터-구조)
5. [임무 생성 프로토콜](#5-임무-생성-프로토콜)
6. [임무 활성화 및 추적](#6-임무-활성화-및-추적)
7. [목표 진행 판정](#7-목표-진행-판정)
8. [완료·실패 처리 프로토콜](#8-완료실패-처리-프로토콜)
9. [Emergent Mission 시스템](#9-emergent-mission-시스템)
10. [임무 간 관계 및 연쇄 효과](#10-임무-간-관계-및-연쇄-효과)
11. [임무 시간 제한 시스템](#11-임무-시간-제한-시스템)
12. [검증 규칙](#12-검증-규칙)

---

# 1. 목적

Mission Engine은 캠페인에서 발생하는 모든 임무(퀘스트)의 생성, 활성화, 목표 추적, 완료·실패 판정, 그리고 결과의 세계 반영을 담당하는 엔진이다.

임무는 세계 안에서 자연스럽게 발생하고 자연스럽게 끝난다. 임무의 완료 여부와 관계없이 결과는 세계에 반드시 흔적을 남긴다. "실패해도 아무것도 달라지지 않는" 임무는 존재하지 않는다.

---

# 2. 책임 범위

## 2.1 Mission Engine이 하는 것

| 항목 | 설명 |
|------|------|
| **임무 초기화** | 세계관 모듈이 정의한 임무를 로드하고 비활성 상태로 등록한다. |
| **임무 활성화** | 트리거 조건이 충족되면 임무를 active 상태로 전환한다. |
| **목표 진행 추적** | Director Engine의 요청에 따라 각 목표의 완료 조건 충족 여부를 판정한다. |
| **완료·실패 확정** | 임무의 완료 또는 실패를 확정하고 결과 WorldEffect를 발행한다. |
| **Emergent Mission 감지·생성** | 플레이어의 행동에서 새로운 임무가 발생하는 조건을 감지하고 즉석 임무를 생성한다. |
| **임무 간 연쇄 처리** | 임무 완료·실패가 선행 조건인 다른 임무의 활성화 여부를 처리한다. |
| **시간 제한 처리** | 기한이 있는 임무의 남은 시간을 추적하고 만료 시 자동 실패 처리한다. |

## 2.2 Mission Engine이 하지 않는 것

| 금지 항목 | 이유 |
|-----------|------|
| **임무 결과 서술** | 서술 생성은 Director Engine의 역할이다. |
| **플레이어에게 임무를 강제 수락** | 모든 임무 수락은 플레이어 선언에 의한다. |
| **세계 상태 직접 수정** | WorldEffect 이벤트를 World Engine에 발행할 뿐이다. |
| **NPC 행동 결정** | 임무 NPC의 반응은 NPC Engine에 위임한다. |
| **숨겨진 타이머 관리** | 플레이어에게 비노출인 임무 타이머는 Shadow Engine이 병행 관리한다. |

---

# 3. 아키텍처 및 인터페이스

## 3.1 다른 엔진과의 관계

```
[세계관 모듈 content/missions.yaml]
          │ 임무 초기화
          ▼
  [Mission Engine] ◄── MissionEngineQuery ◄── [Director Engine]
          │                                          ▲
          │  mission_updates                         │ mission_updates
          │  director_notifications                  │ (임무 상태 변경 알림)
          │
          │  world_effects ──────────────────────► [World Engine]
          │                     (완료·실패 결과 반영)
          │
          │  save_trigger ───────────────────────► [Save Engine]
          │             (주요 임무 완료·실패 시 체크포인트)
          │
          │  memory_events ──────────────────────► [Memory Engine]
          │                     (임무 이력 기록)
          │
          ▼
  NPC Engine → [Mission Engine]: npc_death_event (관련 임무 점검)
  World Engine → [Mission Engine]: global_event_triggered (임무 조건 변화 알림)
```

## 3.2 인터페이스 계약

### 3.2.1 입력 (Inputs)

| 변수명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `mission_engine_query` | MissionEngineQuery | Y | 처리 요청. 타입에 따라 진행 확인·생성·활성화 등을 처리한다. |
| `mission_states` | List[MissionState] | Y | 현재 세션에서 관리 중인 모든 임무 상태. Save Engine에서 복원된다. |
| `world_state` | WorldState | Y | 임무 조건 평가 및 결과 반영에 사용하는 현재 세계 상태. |
| `active_module` | ModuleContext | Y | 활성화된 세계관 모듈. 임무 템플릿과 보상 정의를 포함한다. |

### 3.2.2 MissionEngineQuery 스키마

```yaml
mission_engine_query:
  type: check_progress | activate | deactivate | report_npc_death | report_event | check_emergent | create
  mission_id: string | null        # check_emergent·create 타입이면 null
  trigger_action: ResolvedAction | null
  trigger_event:                   # report_npc_death·report_event 타입에서 사용
    event_type: npc_death | world_event | time_expired
    entity_id: string | null       # 사망 NPC ID 또는 이벤트 ID
  world_state: WorldState
  emergent_context:                # check_emergent·create 타입에서 사용
    trigger_description: string    # 임무 발생 계기 설명
    related_npc_ids: list[string]
    related_location_id: string | null
    player_intent: string          # 플레이어가 선언한 의도
```

### 3.2.3 출력 (Outputs)

| 변수명 | 타입 | 조건 | 설명 |
|--------|------|------|------|
| `mission_updates` | List[MissionUpdate] | 상태 변경 발생 시 | 변경된 임무의 이전·이후 상태 목록. Director Engine에 전달된다. |
| `world_effects` | List[WorldEffect] | 완료·실패 확정 시 | 임무 결과로 발생하는 세계 변화. World Engine에 전달된다. |
| `save_trigger` | SaveTrigger \| null | 주요 임무 해결 시 | Save Engine 체크포인트 요청. |
| `memory_events` | List[MemoryEvent] | 임무 완료·실패 시 | Memory Engine에 전달하는 임무 이력 기록. |
| `new_mission` | MissionState \| null | create·check_emergent 시 | 새로 생성된 임무. |

---

# 4. 임무 데이터 구조

## 4.1 MissionState 스키마

```yaml
mission:
  # 1. 식별 정보
  id: string                           # mis_{캠페인_약어}_{순번}
  type: main | side | faction | personal | emergent
  title: string
  description: string                  # 세계 내 맥락 중심 설명. 메타 용어 없음
  status: inactive | active | completed | failed

  # 2. 목표 목록
  objectives:
    - id: string                       # obj_{임무_id}_{순번}
      description: string
      status: pending | active | completed | failed
      required: bool                   # false면 선택 목표. 미완료가 실패 조건 아님
      hidden: bool                     # true면 플레이어에게 목표 자체 비표시
      trigger_condition: string | null # 이 목표가 pending → active로 전환되는 조건
      completion_condition: string     # 이 목표가 completed로 전환되는 조건

  # 3. 실패 조건
  failure_conditions:
    - id: string
      description: string
      condition: string                # 이 조건이 충족되면 즉시 임무 실패

  # 4. 시간 제한
  time_limit: int | null               # 활성화 후 허용 시간 (초). null이면 무기한
  activated_at_epoch: int | null       # 활성화 시점 (epoch_seconds)
  hidden_timer: bool                   # true면 플레이어에게 타이머 비표시 (Shadow Engine 연계)

  # 5. 보상
  rewards:
    experience: int
    items: list[string]                # item ID 목록
    faction_reputation:
      - faction_id: string
        delta: int                     # -100 ~ +100
    narrative_unlock: string | null    # 완료 시 열리는 스토리 서술 힌트

  # 6. 결과
  consequences:
    on_complete: list[WorldEffect]     # 완료 시 World Engine에 발행할 효과
    on_fail: list[WorldEffect]         # 실패 시 World Engine에 발행할 효과

  # 7. 연관 관계
  related_npcs: list[string]           # NPC ID 목록
  related_locations: list[string]      # location ID 목록
  prerequisite_missions: list[string]  # 이 임무 활성화 전 완료 필요 임무 ID 목록
  unlocks_missions: list[string]       # 이 임무 완료 시 활성화되는 임무 ID 목록
  blocks_missions: list[string]        # 이 임무 실패 시 영구 비활성화되는 임무 ID 목록

  # 8. 메타 정보
  source: module | emergent | gm_created
  origin_description: string           # 세계 내 논리로 이 임무가 발생한 이유
  created_session: int
  activated_session: int | null
  resolved_session: int | null
```

## 4.2 임무 유형 정의

| 유형 | 설명 | 실패 결과 규모 |
|------|------|--------------|
| `main` | 캠페인 전체의 주요 갈등과 직결. 세계의 큰 흐름을 결정한다 | 세계 구조적 변화 |
| `side` | 독립적인 소규모 사건. 완료·실패가 main 흐름에 간접 영향 | 지역·세력 수준 변화 |
| `faction` | 특정 세력과의 관계에서 발생. 완료 여부가 세력 disposition에 영향 | 세력 관계 변화 |
| `personal` | 플레이어 캐릭터의 배경·목표와 연결. 캐릭터 성장에 기여 | 캐릭터 관계·성장 |
| `emergent` | 플레이어 행동에서 즉발 생성. 사전 정의 없이 세계 논리에서 자연 발생 | 상황에 따라 가변 |

---

# 5. 임무 생성 프로토콜

## 5.1 모듈 정의 임무 초기화 (세션 최초 시작 시)

```
1. 세계관 모듈의 content/missions.yaml (또는 별도 임무 파일) 로드
2. 각 임무를 MissionState 스키마에 맵핑
3. 모든 임무를 status: inactive로 등록
4. prerequisite_missions가 없는 임무 중 즉시 활성화 조건을 만족하는 임무는
   status: active로 전환 (§6.1 활성화 프로토콜 적용)
5. 식별자 부여: mis_{캠페인_약어}_{순번}
6. MissionState 목록을 Save Engine에 전달
```

## 5.2 임무 등록 원칙

모듈 정의 임무는 반드시 다음을 충족해야 한다. 이를 충족하지 않는 임무는 QA Engine이 경고를 발행한다.

| 원칙 | 세부 내용 |
|------|-----------|
| **세계 내 논리** | `origin_description`이 명확하게 기술되어야 한다. 맥락 없는 임무는 등록되지 않는다 |
| **결과의 세계 반영** | `consequences.on_complete` 또는 `consequences.on_fail` 중 적어도 하나가 비어 있지 않아야 한다 |
| **실패 가능성** | `failure_conditions`가 존재하거나 `time_limit`이 설정되어 있어야 한다. 실패 불가능한 임무는 등록되지 않는다 |
| **세계관 일관성** | `related_npcs`와 `related_locations`에 등록된 ID가 WorldState에 존재해야 한다 |

---

# 6. 임무 활성화 및 추적

## 6.1 임무 활성화 프로토콜

`status: inactive` 임무가 다음 조건 중 하나를 충족하면 `status: active`로 전환한다.

```
1. prerequisite_missions가 모두 status: completed인 경우
   AND
2. 활성화 트리거 조건 중 하나가 충족된 경우:
   - 플레이어가 관련 NPC와 대화
   - 플레이어가 관련 장소 방문 (discovered: true 전환)
   - 선행 임무의 on_complete WorldEffect가 발행된 경우
   - GM이 직접 활성화 요청

활성화 시:
  activated_session: 현재 세션 번호
  activated_at_epoch: 현재 epoch_seconds
  hidden_timer: true이면 Shadow Engine에 타이머 등록 요청
```

## 6.2 활성 임무 추적

Director Engine은 매 턴 처리 후 `type: check_progress` 쿼리를 Mission Engine에 전달할 수 있다. Mission Engine은 다음을 점검한다.

```
모든 status: active 임무에 대해:
  1. 각 objective의 completion_condition이 현재 resolved_action 및 world_state와 충족되는지 확인
  2. 충족된 objective는 status: completed로 갱신
  3. failure_conditions가 충족되었는지 확인
  4. time_limit이 있으면 남은 시간 계산 (§11 참조)
  5. 변경 사항이 있으면 mission_updates에 포함
```

---

# 7. 목표 진행 판정

## 7.1 목표 완료 조건 평가

각 objective의 `completion_condition`은 자연어로 기술된 조건이다. Mission Engine은 `resolved_action`과 `world_state`를 기반으로 조건 충족 여부를 판정한다.

**조건 유형 및 처리:**

| 조건 유형 | 예시 | 판정 기준 |
|-----------|------|-----------|
| **존재 확인** | "열쇠 아이템을 보유한다" | character.equipment 또는 carried 목록 확인 |
| **위치 도달** | "특정 장소를 방문한다" | world_state location의 discovered 상태 확인 |
| **NPC 처치** | "대상 NPC를 제거한다" | NPC Engine의 life_status: dead 이벤트 수신 확인 |
| **NPC 설득** | "NPC의 동의를 얻는다" | NPC Engine의 disposition 변화 또는 명시적 동의 대화 확인 |
| **세력 변화** | "특정 세력의 영향력을 약화시킨다" | world_state faction.influence 기준값 이하 확인 |
| **사건 발생** | "특정 전역 이벤트가 활성화된다" | world_state global_events status 확인 |

## 7.2 숨겨진 목표 처리

`hidden: true`인 목표는 플레이어에게 목표 자체를 표시하지 않는다.

- 목표가 완료되면 Director Engine에 `hidden_objective_completed: true` 플래그와 함께 알린다.
- Director Engine은 이를 서술에 자연스럽게 반영한다. ("어느 순간, 당신은 무언가를 이룬 것 같은 느낌을 받았습니다.")
- 플레이어가 OOC로 목표 목록을 요청하면 숨겨진 목표는 표시하지 않는다.

## 7.3 선택 목표 처리

`required: false`인 목표는 미완료가 임무 실패 조건이 아니다.

- 완료 시 추가 보상(`rewards`)이 지급된다.
- 완료 시 `unlocks_missions`에 추가 임무가 등록될 수 있다.
- 임무 완료 판정에 포함되지 않는다.

---

# 8. 완료·실패 처리 프로토콜

## 8.1 완료 확정 프로토콜

```
완료 조건: 모든 required: true 목표의 status = completed

완료 확정 절차:
  1. mission.status: active → completed
  2. resolved_session: 현재 세션 번호 기록
  3. consequences.on_complete의 모든 WorldEffect를 World Engine에 발행
  4. rewards 처리:
     a. experience: 플레이어 캐릭터에 경험치 지급 신호 (Director Engine 경유)
     b. faction_reputation: WorldEffect로 세력 disposition 갱신
     c. items: Director Engine에 아이템 획득 알림
  5. unlocks_missions 임무들의 활성화 조건 점검 (§6.1 재실행)
  6. Save Engine에 save_trigger 발행 (type: mission_resolved)
  7. Memory Engine에 mission_completed MemoryEvent 전달
  8. Director Engine에 mission_updates 전달 (완료 알림)
```

## 8.2 실패 확정 프로토콜

```
실패 조건 (다음 중 하나):
  - failure_conditions 중 하나가 충족됨
  - time_limit이 설정된 경우 time_remaining ≤ 0
  - 필수 NPC가 사망했고 임무가 더 이상 진행 불가능

실패 확정 절차:
  1. mission.status: active → failed
  2. resolved_session: 현재 세션 번호 기록
  3. consequences.on_fail의 모든 WorldEffect를 World Engine에 발행
     → on_fail이 비어 있으면 SV-MIS-003 오류 (§12 참조)
  4. blocks_missions 임무들을 status: inactive에서 영구 비활성 처리
     (blocked 상태 추가: 플레이어가 다시 시도 불가)
  5. Save Engine에 save_trigger 발행 (type: mission_resolved)
  6. Memory Engine에 mission_failed MemoryEvent 전달
  7. Director Engine에 mission_updates 전달 (실패 알림, 세계 결과 포함)
```

## 8.3 실패 결과의 세계 반영 원칙

임무 실패는 CoreSpec §5.7.3의 원칙에 따라 반드시 세계에 흔적을 남긴다. `on_fail`에 포함되어야 할 WorldEffect의 유형:

| 임무 유형 | on_fail에 포함되어야 하는 변화 예시 |
|-----------|----------------------------------|
| `main` | 주요 갈등이 악화. 적대 세력의 influence +10~+30. 주요 장소 threat_level 상승 |
| `side` | 관련 NPC의 상황 악화. 지역 resource_abundance 감소 |
| `faction` | 해당 세력의 disposition_to_player 하락. 세력 resources 감소 |
| `personal` | 관련 NPC의 disposition 영구 하락. 캐릭터의 특정 기회 상실 |
| `emergent` | 발생 원인이 된 상황이 해결되지 않고 악화 |

---

# 9. Emergent Mission 시스템

## 9.1 정의

Emergent Mission은 플레이어의 행동에서 자연스럽게 발생하는 임무다. 사전에 모듈에 정의되어 있지 않으며, 플레이어의 선언이 새로운 의무나 목표를 만들어낼 때 즉석으로 생성된다.

## 9.2 Emergent Mission 발생 감지

Director Engine이 `type: check_emergent` 쿼리를 전달하면 Mission Engine은 `emergent_context`를 분석하여 임무화 여부를 판정한다.

**자동 감지 트리거:**

| 상황 | 설명 |
|------|------|
| **약속·계약** | 플레이어가 NPC에게 특정 행동을 약속했고, 이행하지 않으면 결과가 발생한다 |
| **문제 발견** | 플레이어가 아직 알려지지 않은 위험·문제를 발견했고, 방치 시 세계에 영향이 생긴다 |
| **자발적 개입** | 플레이어가 진행 중인 사건에 개입하기로 선언했다 |
| **부채 발생** | 플레이어가 도움을 받거나 자원을 빌려 갚아야 할 의무가 생겼다 |

## 9.3 Emergent Mission 생성 프로토콜

```
check_emergent 쿼리 수신 시:

1. emergent_context 분석
   - trigger_description과 player_intent에서 목표 추출
   - related_npc_ids, related_location_id를 임무 관계로 등록

2. 임무 생성 가능 여부 확인
   - 이미 동일 맥락의 active 임무가 존재하면 생성 건너뜀
   - player_intent가 명확하지 않으면 Director Engine에 재확인 요청

3. MissionState 생성
   - type: emergent
   - source: emergent
   - title: player_intent에서 자동 생성
   - objectives: trigger_description 기반으로 1~2개 목표 생성
   - failure_conditions: 약속 불이행, 방치 기한 초과 등 자연스러운 조건
   - consequences.on_fail: 관련 NPC disposition 하락, 세계 상태 악화 등
   - status: active (즉시 활성화)

4. new_mission 반환
5. Director Engine에 임무 생성 사실 알림
   (서술에 자연스럽게 통합 — "당신은 어느새 새로운 과제를 떠맡게 되었습니다"와 같은
    직접적 문장 금지. 세계 묘사로 암시)
```

## 9.4 Emergent Mission 플레이어 통지

Emergent Mission의 존재를 플레이어에게 직접 알리지 않는다. 세계와 NPC의 반응을 통해 간접적으로 드러난다.

- **금지:** "새로운 임무: 메리를 구출하라가 등록되었습니다."
- **허용:** 메리가 기다리고 있다는 암시, NPC들의 기대 어린 시선 등의 서술 신호

플레이어가 OOC로 현재 임무 목록을 요청하는 경우에는 `emergent` 임무도 포함하여 표시한다.

---

# 10. 임무 간 관계 및 연쇄 효과

## 10.1 선행 조건 (prerequisite_missions)

임무 A의 `prerequisite_missions`에 임무 B가 등록된 경우, 임무 B가 `completed`가 되기 전에는 임무 A가 `inactive`에서 전환되지 않는다.

```
임무 B 완료 확정 시:
  → 임무 B를 prerequisite로 가진 모든 inactive 임무를 검색
  → 각 임무의 나머지 prerequisite가 모두 completed인지 확인
  → 조건 충족 시 활성화 프로토콜 (§6.1) 실행
```

## 10.2 잠금 (blocks_missions)

임무 A의 `blocks_missions`에 임무 B가 등록된 경우, 임무 A가 실패하면 임무 B는 영구 비활성화된다.

```
임무 A 실패 확정 시:
  → blocks_missions 목록의 모든 임무에 status: blocked 설정
  → blocked 임무는 이후 어떤 조건도 활성화시킬 수 없음
  → Director Engine에 "특정 가능성이 사라졌다"는 신호 전달 (서술 반영용)
```

## 10.3 캠페인 3단 구조와의 정렬

Mission Engine은 CoreSpec §13.1.1의 캠페인 3단 구조(Act 1/2/3)를 지원하기 위해 임무를 act 단계와 연결할 수 있다.

```yaml
# MissionState 선택 필드 (모듈이 사용하는 경우)
campaign_act: 1 | 2 | 3 | null
```

- `main` 임무는 act 단계에 따라 순차 활성화된다.
- act 전환은 Director Engine이 판단하며 Mission Engine에 통보한다.
- Mission Engine은 새 act에 해당하는 `main` 임무를 활성화한다.

---

# 11. 임무 시간 제한 시스템

## 11.1 시간 제한 계산

`time_limit`이 설정된 임무는 매 턴 처리 후 남은 시간을 계산한다.

```
time_remaining = time_limit - (current_epoch_seconds - activated_at_epoch)

time_remaining ≤ 0이면:
  → 즉시 실패 확정 프로토콜 (§8.2) 실행
  → trigger_event.event_type: time_expired로 처리
```

## 11.2 숨겨진 타이머 (hidden_timer: true)

`hidden_timer: true`이면 플레이어에게 남은 시간을 표시하지 않는다.

- Shadow Engine에 타이머 등록을 요청하고 Shadow Engine이 병행 추적한다.
- 시간 만료가 임박하면 Shadow Engine이 세계 내 암시 신호(NPC의 초조한 반응, 환경 변화 등)를 Director Engine에 제공할 수 있다. 수치 자체는 노출하지 않는다.
- 플레이어가 OOC로 기한을 물어보면 "정확한 기한은 알 수 없습니다"로 응답한다.

## 11.3 시간 경고 처리

`hidden_timer: false`인 임무에서 `time_remaining`이 `time_limit`의 25% 이하가 되면 Director Engine에 경고 신호를 전달한다. 서술 방식은 Director Engine이 결정한다.

---

# 12. 검증 규칙

QA Engine은 Mission Engine의 상태와 처리에 대해 다음 항목을 검증한다.

| 규칙 ID | 검증 항목 | 위반 시 처리 |
|---------|-----------|-------------|
| `SV-MIS-001` | 활성화된 임무의 `related_npcs` 목록에 `life_status: dead`인 NPC가 필수 목표의 완료 조건으로 등록되어 있는가 | Error — 해당 목표를 failed로 처리, 임무 실패 가능성 점검 |
| `SV-MIS-002` | 임무 완료 확정 후 `consequences.on_complete` 처리 없이 `status: completed`로 전환되었는가 | Warning — 즉시 on_complete 처리 재실행 |
| `SV-MIS-003` | 등록된 임무의 `consequences.on_fail`이 비어 있는가 | Error — 등록 거부. "실패해도 달라지지 않는 임무" 원칙 위반 |
| `SV-MIS-004` | 플레이어가 선언하지 않은 임무 수락이 자동 처리되었는가 | Fatal — 즉시 차단. 임무 상태를 이전으로 롤백 |
| `SV-MIS-005` | 임무 완료·실패 확정 후 Save Engine 체크포인트 요청이 이루어졌는가 | Warning — 즉시 저장 요청 |
| `SV-MIS-006` | `hidden: true` 목표 내용이 플레이어 대면 출력에 포함되었는가 | Fatal — 즉시 출력 차단 |
| `SV-MIS-007` | `blocks_missions`에 등록된 임무가 실패 확정 후에도 active 상태를 유지하는가 | Error — 즉시 blocked 처리 |
| `SV-MIS-008` | Emergent Mission의 `consequences.on_fail`이 비어 있는가 | Error — 생성 거부. on_fail 재정의 요청 |
| `SV-MIS-009` | `prerequisite_missions` 미완료 상태에서 임무가 active로 전환되었는가 | Error — 즉시 inactive 복원, 원인 기록 |
| `SV-MIS-010` | `time_remaining ≤ 0`인데 임무가 여전히 active 상태인가 | Error — 즉시 실패 확정 프로토콜 실행 |

---

**END OF MissionEngine v1.0.0**
