# World Engine Specification

**문서 식별자:** `engines/World/WorldEngine.md`
**버전:** v1.0.0
**상태:** Draft
**최종 수정:** 2026-06-26
**참조:** `core/CoreSpec.md` §5.4, §11, §13

---

## 목차

1. [목적](#1-목적)
2. [책임 범위](#2-책임-범위)
3. [아키텍처 및 인터페이스](#3-아키텍처-및-인터페이스)
4. [세계 상태 데이터 구조](#4-세계-상태-데이터-구조)
5. [세계 초기화 프로토콜](#5-세계-초기화-프로토콜)
6. [시간 흐름 시스템](#6-시간-흐름-시스템)
7. [지역 상태 관리](#7-지역-상태-관리)
8. [환경 시스템](#8-환경-시스템)
9. [세계 자율 진행](#9-세계-자율-진행)
10. [WorldEffect 처리](#10-worldeffect-처리)
11. [스냅샷 및 직렬화](#11-스냅샷-및-직렬화)
12. [검증 규칙](#12-검증-규칙)

---

# 1. 목적

World Engine은 캠페인이 진행되는 동안 세계의 상태를 일관되게 유지하고 자율적으로 진행시키는 엔진이다.

이 엔진은 Creator Engine이 생성한 WorldSeed를 수신하여 세계의 초기 상태(WorldState)를 구성하고, 이후 플레이어의 행동 결과와 세계 자체의 내부 논리에 따라 상태를 지속적으로 갱신한다. 세계는 플레이어가 보고 있는 장면 밖에서도 멈추지 않는다. 세력은 목표를 향해 움직이고, 이벤트는 카운트다운을 소모하며, 자원은 변화한다.

World Engine은 세계관에 중립적이다. 어떤 설정이든 동일한 구조로 처리한다.

---

# 2. 책임 범위

## 2.1 World Engine이 하는 것

| 항목 | 설명 |
|------|------|
| **WorldSeed 초기화** | Creator Engine의 WorldSeed를 수신하여 최초 WorldState를 구성한다. |
| **WorldState 유지 및 제공** | 세션 전체에서 일관된 세계 상태 데이터를 관리하고 다른 엔진에 제공한다. |
| **시간 경과 처리** | 플레이어 행동과 연동하여 세계 내 시각을 갱신한다. |
| **지역 상태 갱신** | 위협도, 자원량, 인구 밀도, 지배 세력 등 지역의 동적 상태를 추적·갱신한다. |
| **환경 시뮬레이션** | 날씨, 계절, 재해 등 전역 환경 변화를 처리한다. |
| **세계 자율 진행** | 세션 시작 시 경과 시간 동안의 NPC·세력 행동 결과를 계산한다. |
| **WorldEffect 수신 및 반영** | Director Engine 및 다른 엔진이 보내는 세계 변화 이벤트를 처리한다. |
| **스냅샷 생성** | Save Engine과 Memory Engine이 상태를 보존할 수 있도록 직렬화된 스냅샷을 생성한다. |

## 2.2 World Engine이 하지 않는 것

| 금지 항목 | 이유 |
|-----------|------|
| **NPC 인스턴스 생성·관리** | NPC 데이터는 NPC Engine의 전담 영역이다. World Engine은 NPC의 위치(location_id)만 추적한다. |
| **임무 생성·판정** | 임무 로직은 Mission Engine의 전담 영역이다. |
| **플레이어에게 미발견 지역 정보 노출** | `discovered: false` 지역의 상태는 서술에 직접 포함되지 않는다. |
| **판정 결과 결정** | 세력 충돌 계산의 판정은 가이드라인을 제공하되, 최종 결과는 판정 시스템을 따른다. |
| **서술 생성** | 세계 상태 변화를 내러티브로 변환하는 것은 Director Engine의 역할이다. |

---

# 3. 아키텍처 및 인터페이스

## 3.1 다른 엔진과의 관계

```
[Creator Engine]
  world_seed ──────────────────────► [World Engine]
                                            │
              ┌─────────────────────────────┤
              │  (세션 시작)                │
              ▼                             │ world_state (읽기 전용 제공)
  자율 진행 결과 보고                        ├──────────────► [Director Engine]
  (autonomous_report)                       ├──────────────► [NPC Engine]
              │                             ├──────────────► [Mission Engine]
              ▼                             ├──────────────► [Shadow Engine]
      [Director Engine]                     └──────────────► [QA Engine]
              │
              │ world_effects (이벤트)
              ▼
      [World Engine] ──world_snapshot──► [Save Engine]
                     ──state_change_log──► [Memory Engine]
```

## 3.2 인터페이스 계약

### 3.2.1 입력 (Inputs)

| 변수명 | 타입 | 필수 | 시점 | 설명 |
|--------|------|------|------|------|
| `world_seed` | WorldSeed | Y | 캠페인 최초 시작 | Creator Engine이 생성한 초기 세계 구조. WorldState 초기화에 사용한다. |
| `saved_world_state` | WorldState | Y | 세션 재개 시 | Save Engine이 복원한 이전 세션의 WorldState. |
| `world_effects` | List[WorldEffect] | N | 매 턴 | Director Engine, NPC Engine, Mission Engine이 전달하는 세계 변화 이벤트. |
| `time_advance_request` | TimeAdvanceRequest | N | 행동 처리 후 | Director Engine이 요청하는 시간 경과 처리. 소모 시간과 원인 행동을 포함한다. |
| `active_module` | ModuleContext | Y | 세션 전체 | 활성화된 세계관 모듈. `world_rules.yaml`을 포함하면 그 규칙을 우선 적용한다. |

### 3.2.2 출력 (Outputs)

| 변수명 | 타입 | 시점 | 설명 |
|--------|------|------|------|
| `world_state` | WorldState | 요청 시 | 현재 세계 상태. 다른 엔진에 읽기 전용으로 제공된다. |
| `autonomous_report` | AutonomousReport | 세션 시작 시 | 세션 간 경과 시간 동안 발생한 세계 자율 진행 결과 요약. Director Engine에 전달된다. |
| `world_snapshot` | WorldStateSnapshot | 저장 트리거 시 | Save Engine에 전달하는 직렬화된 세계 상태. |
| `state_change_log` | List[StateChange] | 세션 종료 시 | Memory Engine에 전달하는 이번 세션의 세계 변화 이력. |

---

# 4. 세계 상태 데이터 구조

WorldState는 세계관에 독립적인 범용 구조다. 세계관 모듈이 정의하는 구체적 내용은 이 구조의 각 필드를 채우는 방식으로만 반영된다.

## 4.1 WorldState 스키마

```yaml
world_state:
  metadata:
    version: "1.0.0"
    world_module: string             # 활성화된 세계관 모듈 식별자
    last_updated_session: int        # 마지막으로 갱신된 세션 번호
    last_updated_at: int             # 마지막 갱신 시각 (epoch_seconds)

  timeline:
    current_time:
      epoch_seconds: int             # 누적 초 (시간 연산 절대 기준값)
      formatted: string              # 세계관 포맷 시각 (예: "Year 412, Day 80, 09:00")
      cycle: day | twilight | night
      season: spring | summer | autumn | winter
    time_scale: float                # 실시간 대비 게임 시간 배율 (기본값: 1.0)

  environment:
    global_weather: clear | overcast | rainy | snowy | storm
    temperature_celsius: float
    active_disasters:
      - id: string
        name: string
        severity: minor | major | critical
        remaining_duration: int      # 남은 지속 시간 (초)

  locations:
    - id: string                     # loc_{캠페인_약어}_{순번}
      name: string
      description: string
      connected_to: list[string]     # 연결된 location ID 목록
      discovered: bool               # 플레이어가 방문·인지했는지 여부
      status:
        population_density: none | sparse | moderate | dense
        threat_level: int            # 0 (안전) ~ 10 (치명적)
        resource_abundance: int      # 0 (황폐) ~ 10 (풍족)
        controlling_faction: string | null  # 지배 세력 ID
      active_events:
        - id: string
          name: string
          countdown: int             # 이벤트 해결·폭발까지 남은 시간 (초)
          is_permanent: bool
      current_occupants: list[string]  # 현재 존재하는 주요 개체 ID (PC, NPC)

  factions:
    - id: string                     # fac_{캠페인_약어}_{순번}
      name: string
      disposition_to_player: int     # -100 ~ +100
      influence: int                 # 0 ~ 100
      resources:
        wealth: int                  # 0 ~ 10
        manpower: int                # 0 ~ 10
        military_strength: int       # 0 ~ 10
      current_goal: string           # 세력의 현재 최우선 목표
      relations:
        - faction_id: string
          disposition: int           # -100 ~ +100

  global_events:
    - id: string                     # evt_{캠페인_약어}_{순번}
      name: string
      description: string
      trigger_condition: string
      status: pending | active | resolved
      countdown: int | null          # 발생·완료까지 남은 세계 시간 (초), null이면 비정형
      visibility: visible | hidden   # hidden이면 Shadow Engine 관할, 플레이어 비노출
```

---

# 5. 세계 초기화 프로토콜

## 5.1 WorldSeed → WorldState 변환

캠페인 최초 세션 시작 시 World Engine은 Creator Engine의 `world_seed`를 수신하여 최초 WorldState를 구성한다.

```
[Creator Engine] ──world_seed──► [World Engine]

1. world_seed.metadata → world_state.metadata 복사
2. world_seed.timeline_anchor → world_state.timeline.current_time 초기화
3. world_seed.locations → world_state.locations 초기화
   └── 각 location의 status 기본값 적용:
       threat_level: 0, resource_abundance: 5, population_density: moderate
       (세계관 모듈 world_rules.yaml에 재정의가 있으면 그 값을 우선 적용)
4. world_seed.factions → world_state.factions 초기화
   └── initial_disposition_to_player, initial_influence 값 사용
5. world_seed.global_event_seeds → world_state.global_events 초기화
   └── status: pending, countdown: estimated_countdown_days * 86400 (초 환산)
6. world_seed.conflict_seeds → 각 관련 faction의 relations 갱신
7. 환경 초기화: 시작 계절의 날씨 테이블에서 첫 날씨 생성 (§8.1 프로토콜 적용)
8. 초기화 완료 후 Director Engine에 autonomous_report: null 전달
   (첫 세션은 자율 진행 없음)
```

## 5.2 세계 규칙 파일 바인딩

활성화된 세계관 모듈의 `world_rules.yaml`이 존재하면 World Engine은 이를 로드하여 기본 물리 법칙 대신 적용한다.

`world_rules.yaml`이 없는 경우 다음 기본 규칙을 적용한다.

| 기본 규칙 | 내용 |
|-----------|------|
| **인과관계** | 모든 변화에는 원인이 있다. 원인 없는 상태 변화는 처리하지 않는다. |
| **정보 이동 속도** | 정보는 전달 수단(사신, 신호, 문서)을 통해서만 이동한다. 즉각적 전달 수단이 없으면 이동 시간을 계산한다. |
| **자원 희소성** | 모든 자원은 유한하다. 소비된 자원은 자연 회복 또는 생산 활동 없이 증가하지 않는다. |

---

# 6. 시간 흐름 시스템

## 6.1 시간 단위

모든 시간 연산은 `epoch_seconds`(누적 초)를 절대 기준으로 한다.

| 단위 | 초 환산 | 주요 용도 |
|------|---------|-----------|
| 라운드 (Round) | 6초 | 전투 |
| 분 (Minute) | 60초 | 단기 행동, 탐색 |
| 시간 (Hour) | 3,600초 | 이동, 조사, 대화 |
| 일 (Day) | 86,400초 | 장거리 이동, 세력 행동, 휴식 |

## 6.2 행동별 시간 소모 기준표

세계관 모듈의 `world_rules.yaml`에 재정의가 없으면 아래 기본값을 적용한다.

| 행동 분류 | 예시 | 기본 소모 시간 |
|-----------|------|----------------|
| 즉각 행동 | 물건 줍기, 짧은 관찰 | 1분 ~ 5분 |
| 장면 대화 | NPC 협상, 정보 수집 | 10분 ~ 30분 |
| 정밀 조사 | 비밀문 탐색, 단서 분석 | 20분 ~ 1시간 |
| 지역 내 탐색 | 던전 구역 탐험, 구역 수색 | 1시간 ~ 2시간 |
| 지역 간 이동 | 인접 장소로 이동 | 거리 및 수단에 따름 |
| 전투 | 교전 | 라운드 수 × 6초 + 정리 10분 |
| 단기 휴식 | 응급 처치, 숨 고르기 | 1시간 |
| 장기 휴식 | 수면, 캠핑 | 8시간 |

**이동 속도 기준 (도보 기준, 세계관 모듈 재정의 가능):**

| 이동 수단 | 시간당 거리 |
|-----------|------------|
| 도보 | 4km |
| 마차·승마 | 8km |
| 쾌속 수단 (기차, 비행정 등) | 세계관 모듈 정의 |

## 6.3 다운타임 처리

플레이어가 모험을 중단하거나 세션 간 공백이 발생할 때 처리한다.

```
1. 다운타임 기간 선언 (플레이어 또는 GM)
   예: "한 달간 연구에 집중한다"
2. epoch_seconds += 선언된 기간 (초 환산)
3. 경과 시간 동안 누적된 자율 진행 계산 (§9 프로토콜 전면 적용)
4. 계절 변경, 날씨 변화, 재해 여부 처리
5. Director Engine에 autonomous_report 전달 (다운타임 요약 포함)
```

---

# 7. 지역 상태 관리

## 7.1 지역 그래프 구조

세계 지도는 **노드(Location)** 와 **엣지(Connection)** 로 구성된 토폴로지 그래프다.

- 두 지역 A와 B 사이에 `connected_to` 관계가 있어야 직접 이동이 가능하다.
- 연결이 차단되면(전투, 재해, 세력 봉쇄 등) World Engine은 해당 엣지를 비활성화하고 대체 경로를 탐색한다.
- 연결이 없는 경로로의 이동 요청이 오면 World Engine은 이동 불가 사유를 Director Engine에 반환한다.

## 7.2 지역 동적 상태 갱신 규칙

지역의 네 가지 핵심 변수는 세계 진행 중 다음 규칙에 따라 갱신된다.

### 위협도 (threat_level)

| 조건 | 변화 |
|------|------|
| 인접 적대 세력의 영향력이 증가하거나 지역 자원량이 0에 도달 | +1 ~ +2 (일 단위) |
| 플레이어가 위협 요소 제거 | -1 ~ -3 (즉시) |
| 지배 세력이 방어력을 강화하는 WorldEffect 수신 | -1 (즉시) |
| threat_level ≥ 8 | 이 지역의 조우 위험도 한 등급 상승 |

### 자원량 (resource_abundance)

| 조건 | 변화 |
|------|------|
| 세력의 수확·채굴 활동 (일 단위) | -1 |
| 자연 회복 (계절 기반, 봄·여름 활성) | +0.5 ~ +1 (일 단위) |
| 세력의 자원 투자 WorldEffect | +지정량 (즉시) |
| 재해 발생 | -2 ~ -5 (즉시) |

### 인구 밀도 (population_density)

| 조건 | 변화 |
|------|------|
| threat_level ≥ 7 이 3일 이상 지속 | dense → moderate → sparse (단계적) |
| threat_level ≤ 3 이 7일 이상 지속 + resource_abundance ≥ 6 | sparse → moderate → dense (단계적) |

### 지배 세력 (controlling_faction)

세력 간 영향력 충돌 결과로 변경된다. (§9.2 참조)
변경 시 해당 지역의 NPC 우호도 기본값은 신 지배 세력의 `disposition_to_player`로 보정된다.

## 7.3 안개 처리 (Fog of War)

`discovered: false`인 지역에 대해 World Engine은 다음 규칙을 적용한다.

- 해당 지역의 상태(threat_level, controlling_faction 등)는 플레이어에게 수치로 노출하지 않는다.
- 플레이어가 미발견 지역에 대한 정보를 요청하면 Director Engine은 현재 캐릭터가 알 수 있는 범위 내의 간접 정보만 제공한다.
- World Engine은 미발견 지역도 동일하게 자율 진행을 처리한다. 플레이어가 방문하기 전에 이미 요새가 함락되거나 자원이 고갈될 수 있다.
- 플레이어가 처음 방문하거나 신뢰할 수 있는 정보를 입수하면 `discovered: true`로 전환된다.

---

# 8. 환경 시스템

## 8.1 날씨 생성 프로토콜

매일 오전 06:00 (게임 내 시각)에 World Engine은 다음 단계로 날씨를 결정한다.

**1단계: 계절별 기본 확률 참조**

| 계절 | clear | overcast | rainy | snowy | storm |
|------|-------|----------|-------|-------|-------|
| 봄 (spring) | 60% | 25% | 15% | 0% | 0% |
| 여름 (summer) | 40% | 30% | 20% | 0% | 10% |
| 가을 (autumn) | 55% | 25% | 15% | 0% | 5% |
| 겨울 (winter) | 30% | 35% | 0% | 25% | 10% |

**2단계: 지속성 가중치 반영**

전날 날씨가 rainy, snowy, storm이면 같은 날씨 발생 확률에 +20%를 더한다.

**3단계: 이상 기후 판정**

100면체 판정에서 99~100이 나오면 `active_disasters`에 특수 재해를 추가한다.

세계관 모듈의 `world_rules.yaml`에 날씨 테이블이 정의되어 있으면 그 테이블을 우선한다.

## 8.2 환경 페널티

Director Engine은 World Engine의 `global_weather` 값을 기반으로 서술에 다음 페널티를 적용한다.

| 날씨 | 이동 속도 | 판정 영향 | 감각 제약 |
|------|-----------|-----------|-----------|
| clear | 없음 | 없음 | 없음 |
| overcast | 없음 | 없음 | 가시거리 미세 감소 |
| rainy | -20% | 불 다루기·추적 DC +2 | 청각 감지 DC +1 |
| snowy | -40% | 체력 저항 매 시간 판정 | 시야 차단, 흔적 매몰 |
| storm | -60% | 원거리 공격 DC +4 | 가시거리 5m 이내, 통신 두절 |

## 8.3 재해 처리

`active_disasters`에 등록된 재해는 `remaining_duration`이 0이 될 때까지 지속된다. 재해 기간 동안:

- 해당하는 지역의 `threat_level` +2 보정이 자동 적용된다.
- `resource_abundance` 매일 -1 소모가 추가 적용된다.
- Director Engine이 서술에 재해 상황을 반영한다.

---

# 9. 세계 자율 진행

World Engine은 세션 시작 시 또는 게임 내 시간이 1일 이상 경과했을 때 자율 진행을 처리한다. 이 처리는 플레이어가 보지 않는 동안에도 세계가 살아 움직인다는 원칙(CoreSpec §13.3.1)을 구현한다.

## 9.1 세션 시작 자율 진행 프로토콜

```
1. 이전 세션 종료 시각과 현재 세션 시작 시각의 차이(elapsed_seconds) 계산
2. 경과 일수만큼 날씨 생성 프로토콜 반복 실행 (최종 날씨만 WorldState에 반영)
3. 경과 일수만큼 지역 상태 갱신 반복 실행 (§7.2 규칙 적용)
4. 세력 자율 행동 계산 (§9.2 프로토콜 적용)
5. 전역 이벤트 카운트다운 처리 (§9.3 프로토콜 적용)
6. 변경된 항목 목록 집계 → autonomous_report 생성
7. Director Engine에 autonomous_report 전달
```

`autonomous_report`의 내용은 세계에서 발생한 사실만을 포함한다. 플레이어에게 이 내용을 어떻게 서술할지는 Director Engine이 결정한다.

## 9.2 세력 자율 행동 계산

매 경과 일수마다 각 세력에 대해 다음 순서로 처리한다.

```
1. 세력의 current_goal 확인
   └── 목표가 특정 지역 장악이면 해당 지역과 현재 지배 세력을 식별

2. 행동 가능 여부 확인
   └── resources.manpower < 2 이면 행동 불가 (이번 일차 처리 건너뜀)

3. 영향력 대결 (목표 지역에 경쟁 세력이 있을 경우)
   공격측 판정값 = influence + resources.military_strength + 1d10
   방어측 판정값 = influence + resources.military_strength + 1d10
   (동점은 방어측 우세 — CoreSpec §8.6 준용)

4. 결과 처리
   공격측 승리: 해당 지역 controlling_faction → 공격측 ID로 갱신
               방어측 resources.manpower -1, influence -2
   방어측 승리: 공격측 resources.manpower -1
               공격측 influence -1

5. 결과를 state_change_log에 기록
```

단, 플레이어가 해당 지역에 현재 존재하는 경우 세력 충돌은 Director Engine에 active event로 전달하고 World Engine이 직접 결과를 적용하지 않는다.

## 9.3 전역 이벤트 카운트다운

`global_events`의 `status: pending` 이벤트 중 `countdown`이 있는 항목은 매일 `countdown -= 86400`을 적용한다.

```
countdown ≤ 0이 되면:
  status: pending → active 로 전환
  해당 이벤트의 trigger_condition에 정의된 WorldEffect를 자동 발생시킨다
  visibility: visible이면 → Director Engine에 이벤트 발생 알림
  visibility: hidden이면  → Shadow Engine에만 전달, Director Engine에 비노출
```

`status: active` 이벤트는 WorldEffect가 반영된 상태이며, 플레이어의 개입 또는 별도 해결 조건을 통해서만 `resolved`로 전환된다.

---

# 10. WorldEffect 처리

## 10.1 WorldEffect 스키마

WorldEffect는 다른 엔진이 World Engine에 전달하는 세계 변화 요청이다.

```yaml
world_effect:
  id: string                         # eff_{캠페인_약어}_{순번}
  source_action_id: string           # 이 효과를 유발한 행동 ID
  source_engine: Director | NPC | Mission | Shadow
  effect_type: location | faction | event | connection | entity_position
  target_id: string                  # 변경 대상 ID (location, faction, event ID 등)
  operation: add | update | remove
  changes:
    - field: string                  # 변경할 필드 경로 (예: "status.threat_level")
      delta: int | null              # 수치 변화량 (+/-). 수치 필드에만 사용.
      new_value: any | null          # 절대값 설정. delta가 null일 때 사용.
  is_permanent: bool                 # false면 countdown 이후 자동 복구
  countdown: int | null              # is_permanent: false일 때 복구까지 남은 시간 (초)
```

## 10.2 단기 변화 vs 영구 변화

| 구분 | is_permanent | 예시 | 처리 |
|------|-------------|------|------|
| **단기 변화** | false | 폭우로 인한 도로 침수, 몬스터 일시 출몰 | countdown 감소 후 자동 복구 |
| **영구 변화** | true | 교량 파괴, 주요 NPC 사망, 요새 함락 | 별도 복구 이벤트 없으면 지속 |

영구 변화가 발생하면 Save Engine에 즉시 체크포인트 저장을 요청한다.

## 10.3 WorldEffect 적용 순서

같은 턴에 복수의 WorldEffect가 수신된 경우 다음 순서로 적용한다.

```
1. entity_position (개체 위치 변경) — 먼저 적용하여 이후 효과의 대상을 정확히 함
2. event (이벤트 상태 변경)
3. connection (지역 연결 변경)
4. location (지역 상태 변경)
5. faction (세력 상태 변경)
```

동일 대상에 동일 필드를 변경하는 복수 효과가 충돌하면 `source_engine` 우선순위에 따른다.
우선순위: Director > NPC > Mission > Shadow

---

# 11. 스냅샷 및 직렬화

## 11.1 WorldStateSnapshot 스키마

```yaml
world_state_snapshot:
  snapshot_id: string                # UUID
  created_at_real: string            # ISO 8601 실제 세계 시각
  created_at_world: int              # 스냅샷 생성 시점의 epoch_seconds
  world_module: string
  engine_version: string
  session_count: int
  trigger_type: session_start | session_end | world_change | manual
  state_hash: string                 # WorldState 전체의 SHA-256 해시 (무결성 검증용)
  full_state: WorldState             # 이 시점의 전체 WorldState
  delta_from_previous:               # 이전 스냅샷 대비 변경 항목 목록 (차분 저장용)
    - path: string                   # 변경된 필드 경로
      op: add | replace | remove
      value: any
```

## 11.2 버전 호환성 규칙

| 조건 | 처리 |
|------|------|
| Major.Minor 일치 | 추가 변환 없이 로드 허용 |
| Patch만 다름 | 누락 필드에 기본값 채워 자동 마이그레이션 |
| Minor 버전 하위 호환 | 변환 스크립트 적용 후 로드 시도 |
| Major 버전 불일치 | 로드 차단. GM에게 오류 보고 |

---

# 12. 검증 규칙

QA Engine은 World Engine의 상태와 처리에 대해 다음 항목을 검증한다.

| 규칙 ID | 검증 항목 | 위반 시 처리 |
|---------|-----------|-------------|
| `SV-WLD-001` | WorldState의 모든 location `connected_to` 참조가 실제 존재하는 location ID를 가리키는가 | Error — 참조 오류 목록 반환, Director Engine에 해당 연결 사용 금지 알림 |
| `SV-WLD-002` | WorldState의 모든 `controlling_faction` 값이 실제 존재하는 faction ID인가 | Error — 해당 location의 controlling_faction을 null로 초기화 |
| `SV-WLD-003` | 동일 location에 `discovered: true`이지만 `current_occupants`에 등록된 개체 ID가 존재하지 않는 경우 | Warning — 로그에 기록, 계속 진행 |
| `SV-WLD-004` | WorldEffect 처리 후 수치 필드(threat_level, resource_abundance 등)가 허용 범위를 벗어났는가 | Error — 경계값으로 클램프 후 GM에 고지 |
| `SV-WLD-005` | 자율 진행 결과 `status: resolved`인 이벤트가 WorldState에서 제거되지 않고 남아 있는가 | Warning — 해당 이벤트 archive 처리 권고 |
| `SV-WLD-006` | `discovered: false` 지역의 정보가 Director Engine에 직접 노출된 흔적이 있는가 | Fatal — 즉시 차단, 해당 서술 플래그 |
| `SV-WLD-007` | 플레이어가 존재하는 지역에서 세력 충돌이 World Engine에 의해 자동 확정되었는가 | Fatal — 즉시 차단, Director Engine에 active event로 재전달 |
| `SV-WLD-008` | 영구 변화(is_permanent: true) 발생 후 Save Engine 체크포인트 요청이 이루어졌는가 | Warning — 즉시 체크포인트 요청 |
| `SV-WLD-009` | WorldStateSnapshot의 state_hash가 full_state 재계산값과 일치하는가 | Fatal — 스냅샷 무효화, 이전 스냅샷으로 롤백 요청 |

---

**END OF WorldEngine v1.0.0**
