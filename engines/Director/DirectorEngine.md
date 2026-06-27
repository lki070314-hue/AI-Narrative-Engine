# Director Engine Specification

**문서 식별자:** `engines/Director/DirectorEngine.md`
**버전:** v1.1.1
**상태:** Draft
**최종 수정:** 2026-06-28
**참조:** `core/CoreSpec.md` §4.2, §5.3, §10, §12, §13 / `engines/Resolution/ResolutionEngine.md`

**Changelog v1.1.1:** Added §7.5.3 Director Support Sub-Engines referencing Pacing, Consequence, Scene Flow, and Output support documents for Beta02 preparation.

**Changelog v1.1.0:** Added §7.8 Consequence Generation Rule; added §7.9 Consequence Chaining; added §7.10 Response Length Limits; added §7.11 Scene Momentum; added §7.12 Resolution Transparency; added SV-DIR-014 through SV-DIR-018 to §10. Source: Beta01 live playtest post-session feedback.

---

## 목차

1. [목적](#1-목적)
2. [책임 범위](#2-책임-범위)
3. [아키텍처 및 인터페이스](#3-아키텍처-및-인터페이스)
4. [세션 처리 루프](#4-세션-처리-루프)
5. [플레이어 선언 처리](#5-플레이어-선언-처리)
6. [엔진 호출 프로토콜](#6-엔진-호출-프로토콜)
7. [서술 생성 규칙](#7-서술-생성-규칙)
   - 7.8 [결과 생성 규칙](#78-결과-생성-규칙)
   - 7.9 [결과 연쇄](#79-결과-연쇄)
   - 7.10 [응답 길이 제한](#710-응답-길이-제한)
   - 7.11 [장면 모멘텀](#711-장면-모멘텀)
   - 7.12 [Resolution 투명성](#712-resolution-투명성)
8. [데이터 구조 정의](#8-데이터-구조-정의)
9. [플레이어 자율성 보장 규칙](#9-플레이어-자율성-보장-규칙)
10. [검증 규칙](#10-검증-규칙)

---

# 1. 목적

Director Engine은 AI Narrative Engine의 중앙 처리 허브다.

이 엔진은 Creator Engine이 생성한 세계 위에서 캠페인을 진행시키며, 플레이어의 선언을 수신하고, 관련 엔진들을 호출하여 결과를 얻고, 플레이어에게 제공하는 최종 서술을 생성한다.

Director Engine은 두 가지 역할을 동시에 수행한다.

- **오케스트레이터(Orchestrator):** 플레이어 선언을 받아 어떤 엔진을 어떤 순서로 호출할지 결정하고 결과를 취합한다.
- **서술자(Narrator):** 취합된 결과를 플레이어에게 보여주는 일관된 내러티브 텍스트로 변환한다.

---

# 2. 책임 범위

## 2.1 Director Engine이 하는 것

| 항목 | 설명 |
|------|------|
| **세션 진행** | 세션 시작, 턴 처리, 세션 종료의 전체 흐름을 제어한다. |
| **플레이어 선언 수신 및 분류** | 플레이어의 자연어 입력을 수신하고 행동 유형을 분류한다. |
| **엔진 호출 결정** | 상황에 따라 NPC Engine, Mission Engine, Save Engine 등을 호출할지 결정한다. |
| **서술 생성** | 모든 엔진의 결과를 수신한 후 플레이어에게 제공하는 최종 내러티브를 생성한다. |
| **페이싱 관리** | 세션 전체의 긴장-이완 흐름을 추적하고 조절한다. |
| **장면 전환** | 위치 변경, 시간 경과, 목적 변경에 따른 장면 전환을 처리한다. |
| **메타 요청 처리** | OOC 질문, 규칙 확인, 저장 요청 등을 게임 내러티브와 분리하여 처리한다. |
| **상호작용 표면 제시** | 현재 장면에서 플레이어가 상호작용할 수 있는 단서, 대상, NPC 반응, 접근 경로를 자연스럽게 드러낸다. |

## 2.2 Director Engine이 하지 않는 것

| 금지 항목 | 이유 |
|-----------|------|
| **플레이어 행동 작성** | 플레이어가 선언하지 않은 행동을 서술에 포함하지 않는다. |
| **NPC 행동 독자 결정** | NPC의 대사, 반응, 행동은 NPC Engine에 위임한다. |
| **판정 결과 임의 결정** | 불확실한 결과는 판정 메커니즘에 따른다. 결과를 서사적으로 조정하지 않는다. |
| **성공 자동 가정** | 플레이어 행동은 먼저 시도로 취급하며, 불확실한 성공은 Resolution Engine 없이 확정하지 않는다. |
| **임무 상태 직접 수정** | 임무 완료/실패 판정은 Mission Engine에 위임한다. |
| **세계 상태 직접 수정** | 세계 변화는 World Engine을 통해서만 반영된다. |
| **메타 정보 노출** | 플레이어 캐릭터가 알 수 없는 수치, 숨겨진 사실, 엔진 내부 상태를 서술에 포함하지 않는다. |
| **이전 세션 기억 임의 사용** | Memory Engine이 제공한 컨텍스트 외의 과거 사건을 참조하지 않는다. |

---

# 3. 아키텍처 및 인터페이스

## 3.1 중앙 허브 위치

Director Engine은 CoreSpec §4.2의 데이터 흐름에서 두 지점에 위치한다.

```
플레이어 입력
     │
     ▼
[Compiler Engine] ──파싱·검증──► resolved_action
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  Director Engine │  ◄── Memory Engine (retrieved_context)
                              │  [처리 단계]      │  ◄── World Engine (world_state)
                              └─────────────────┘
                                       │
                     ┌─────────────────┼──────────────────┐
                     ▼                 ▼                  ▼
              [NPC Engine]    [Mission Engine]    [World Engine]
              NPC 반응 생성    임무 상태 갱신       세계 상태 갱신
                     │                 │                  │
                     └─────────────────┼──────────────────┘
                                       │
                                       ▼
                              [Shadow Engine]
                              숨겨진 처리 (비가시)
                                       │
                                       ▼
                              ┌─────────────────┐
                              │  Director Engine │
                              │  [서술 단계]      │
                              └─────────────────┘
                                       │
                     ┌─────────────────┼──────────────────┐
                     ▼                 ▼                  ▼
              [Memory Engine]   [Save Engine]      [QA Engine]
              컨텍스트 저장       상태 직렬화        일관성 검증
                                       │
                                       ▼
                              플레이어 출력 (서술 텍스트)
```

## 3.2 인터페이스 계약

### 3.2.1 입력 (Inputs)

| 변수명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `resolved_action` | ResolvedAction | Y | Compiler Engine이 파싱·검증을 완료한 플레이어 행동. CoreSpec §14.3.3 구조를 따른다. |
| `world_state` | WorldState | Y | World Engine이 관리하는 현재 세계 상태. |
| `retrieved_context` | MemoryContext | Y | Memory Engine이 현재 장면에 연관된 기억을 선별하여 제공한 컨텍스트. |
| `session_state` | SessionState | Y | 현재 세션의 진행 상태 (페이싱, 장면 ID, 세션 번호 등). |
| `active_module` | ModuleContext | Y | 활성화된 세계관 모듈 (서술 어조 가이드 포함). |

### 3.2.2 출력 (Outputs)

| 변수명 | 타입 | 설명 |
|--------|------|------|
| `narrative_text` | String | 플레이어에게 제공하는 최종 서술 텍스트. |
| `updated_scene_state` | SceneState | 이번 턴 처리 후 갱신된 장면 상태. |
| `engine_calls` | List[EngineCallRecord] | 이번 턴에 Director가 호출한 엔진 목록과 요청 내용 (로그용). |
| `save_trigger` | SaveTrigger \| null | 저장 트리거 발생 시 Save Engine에 전달하는 요청. 저장 불필요 시 null. |
| `clarification_request` | String \| null | 플레이어 선언이 불명확할 때 생성하는 명확화 질문. |

---

# 4. 세션 처리 루프

## 4.1 세션 시작 프로토콜

세션 시작 시 Director Engine은 다음 순서로 초기화를 수행한다.

```
1. Save Engine으로부터 이전 세션 상태 수신
   └── 첫 세션이면 Creator Engine의 starting_context를 사용
2. World Engine에 세션 간 경과 시간 처리 요청
   └── 세계 자율 진행 결과(세력 변화, 이벤트 카운트다운 등) 수신
3. Memory Engine에 세션 시작 컨텍스트 요청
   └── Tier 1 핵심 기억 + 관련 Tier 2 기억 수신
4. QA Engine에 상태 일관성 사전 점검 요청
5. 이전 세션 요약 서술 생성 (플레이어 확인용)
6. SessionState 초기화 (pacing_cycle_count: 0, session_pacing: rising_action)
```

이전 세션 요약은 편향되지 않는다. CoreSpec §13.4.2에 따라 플레이어에게 유리하거나 불리한 사실을 선별하지 않는다.

## 4.2 턴 처리 루프

하나의 턴은 플레이어가 선언을 완료하는 시점부터 Director Engine이 서술을 출력하는 시점까지다.

```
[플레이어 선언 수신]
        │
        ▼
[선언 유형 분류] ──► 메타 선언이면 → [메타 처리] → [내러티브 복귀 알림]
        │
        ▼ (게임 내 행동)
[Compiler Engine 전달] → resolved_action 수신
        │
        ▼
[Resolution Engine: 난이도 평가 및 결과 확정]
        │
        ▼
[처리 단계: 엔진 호출 결정]
  ├── NPC가 반응해야 하는가?     → NPC Engine 호출
  ├── 임무 상태가 변해야 하는가? → Mission Engine 호출
  └── 세계 상태가 변해야 하는가? → World Engine에 WorldEffect 전달
        │
        ▼
[Shadow Engine 처리]
  └── 숨겨진 타이머, 확률 보정, 비가시 사건 처리
        │
        ▼
[서술 단계]
  ├── Memory Engine에 이번 턴 이벤트 저장
  ├── QA Engine에 일관성 검증 요청
  ├── 저장 트리거 해당 시 → Save Engine 호출
  └── 최종 narrative_text 생성
        │
        ▼
[플레이어 출력]
```

## 4.3 세션 종료 프로토콜

플레이어 또는 GM이 세션 종료를 선언하거나 자연스러운 중단점에 도달했을 때 다음 순서로 처리한다.

```
1. 현재 장면 상태를 [Resolution] 페이싱으로 전환 (가능한 경우)
2. 마무리 서술 생성 (결과 정리, 다음 세션 암시)
3. QA Engine에 세션 종료 검증 요청
   └── 검증 항목: 세계 변화 저장 여부, 임무 상태 반영 여부, Memory 업데이트 여부
4. Memory Engine에 세션 종료 처리 요청
   └── Tier 3 임시 기억 압축 및 Tier 2 이전
5. Save Engine에 최종 상태 저장 요청
```

세션이 [Climax] 직전에 끊기지 않도록 조율한다. CoreSpec §5.3.4에 따라 [Rising Action]에서 끊기는 것은 허용된다.

---

# 5. 플레이어 선언 처리

## 5.1 선언 유형 분류

Director Engine이 수신하는 플레이어 선언은 다음 유형으로 분류한다.

| 유형 | 설명 | 예시 |
|------|------|------|
| **행동 선언** | 세계에 물리적·사회적 영향을 미치는 행동 | "문을 부수겠다", "적을 공격한다" |
| **대화 선언** | NPC나 다른 존재와의 대화 | "경비원에게 통행 허가를 요청한다" |
| **탐색 선언** | 환경이나 사물을 조사하는 행동 | "방을 샅샅이 뒤진다", "단서를 찾겠다" |
| **이동 선언** | 장소 이동 | "항구로 이동한다" |
| **휴식 선언** | 단기·장기 휴식 | "밤을 보내겠다", "잠시 쉬겠다" |
| **메타 선언** | OOC 발언, 규칙 질문, 저장 요청, 상태 확인 | "현재 체력이 얼마나 남았죠?", "저장해주세요" |

## 5.2 선언 처리 흐름

**게임 내 행동 선언 (행동·대화·탐색·이동·휴식):**

1. Compiler Engine에 raw input을 전달한다.
2. resolved_action을 수신한다.
3. 행동이 일상적이고 실패 가능성이 없는 경우를 제외하고 Resolution Engine에 `attempt_request`를 전달한다.
4. `resolution_result`를 수신한 뒤, 확정된 outcome과 현재 scene_state를 기반으로 호출할 엔진을 결정한다.
5. 필요한 엔진을 병렬 또는 순차로 호출한다.
6. 모든 결과를 취합하여 narrative_text를 생성한다.

**메타 선언:**

1. 내러티브를 일시 중단한다.
2. 요청에 따라 OOC 응답을 생성한다 (상태 표시, 규칙 설명, 저장 실행 등).
3. 처리 완료 후 "다시 게임으로 돌아옵니다."와 같이 명시적으로 내러티브로 복귀한다.
4. 메타 선언의 내용은 게임 내러티브에 영향을 주지 않는다.

## 5.3 모호한 선언 처리

플레이어의 선언이 두 가지 이상의 행동으로 해석될 수 있거나 필수 정보가 누락된 경우:

**돌이킬 수 없는(irreversible) 행동인 경우:**
- Compiler Engine의 판단을 따라 명확화를 요청한다.
- 해석을 임의로 선택하지 않는다.

**돌이킬 수 있는 행동인 경우:**
- Compiler Engine이 가장 자연스러운 해석을 선택한다.
- Director Engine은 해석한 행동을 서술 첫 부분에 명시한다.
  - 예: "당신이 경비원에게 다가가는 것으로 이해했습니다."

**불완전한 선언인 경우:**
- "무엇을 하시겠습니까?"가 아니라 누락된 정보를 구체적으로 묻는다.
  - 예: "누구를 공격하시겠습니까?"

## 5.4 행동은 시도다

Director Engine은 플레이어의 선언을 곧바로 성공한 사건으로 서술하지 않는다. 모든 행동 선언은 먼저 `attempt`로 취급한다.

Resolution Engine 없이 성공으로 서술할 수 있는 경우는 다음뿐이다.

- 실패 가능성이 의미 있는 결과를 만들지 않는다.
- 위험, 비용, 반대 세력, 시간 압박, 숨겨진 정보가 없다.
- 세계 상태를 크게 바꾸지 않는다.

다음 행동 유형은 기본적으로 Resolution Engine 검토 대상이다.

| 행동 유형 | 예시 | Director 처리 |
|-----------|------|---------------|
| combat | 공격, 방어, 제압 | 피해나 제압을 확정하지 않고 resolution_result를 기다린다. |
| stealth | 숨기, 잠입, 미행 | 들킴 여부를 자동 판단하지 않는다. |
| persuasion | 설득, 협박, 협상 | NPC의 동의를 자동 확정하지 않는다. |
| investigation | 조사, 추리, 단서 찾기 | 발견 내용을 Resolution과 Memory/World 컨텍스트에 맞춘다. |
| theft | 훔치기, 몰래 가져가기 | 획득, 발각, 흔적 여부를 Resolution으로 확정한다. |
| hacking | 시스템 접근, 우회, 데이터 추출 | 접근 성공과 추적 위험을 Resolution으로 확정한다. |
| social_interaction | 평판 만들기, 분위기 전환 | 관계 변화와 NPC 반응을 NPC/Resolution 결과에 맞춘다. |

## 5.5 예상 밖 행동 처리

플레이어가 문서에 없는 방식이나 장면이 예상하지 못한 방식으로 행동해도 Director Engine은 그 이유만으로 실패시키지 않는다.

처리 순서:

1. 플레이어의 선언된 의도를 보존한다.
2. 가장 가까운 행동 유형을 찾는다.
3. 현재 세계 상태에서 plausibility를 평가하도록 Resolution Engine에 전달한다.
4. 명확성이 부족하면 구체적인 확인 질문을 한다.
5. 가능한 경우 부분 성공, 비용, 새 위험, 지연, NPC 반응으로 자연스럽게 이어간다.

예상 밖 행동은 장기 캠페인의 새 단서, 새 임무, 관계 변화가 될 수 있다. 단, Director Engine은 숨겨진 정보나 세계관 규칙을 깨지 않는다.

---

# 6. 엔진 호출 프로토콜

Director Engine은 다른 엔진을 직접 호출할 수 없다. 엔진 간 통신은 CoreSpec §4.3에 따라 **쿼리(Query)** 또는 **이벤트(Event)** 방식으로만 이루어진다. 이 섹션은 Director Engine이 각 엔진과 통신하는 시점과 방식을 정의한다.

## 6.1 NPC Engine 호출

**호출 시점:**

| 조건 | 설명 |
|------|------|
| 플레이어가 NPC에게 대화를 건다 | 대화 선언의 대상이 NPC일 때 |
| 플레이어의 행동이 NPC에게 직접적 영향을 미친다 | 공격, 물건 전달, 지역 내 가시적 행동 등 |
| NPC가 플레이어와 같은 장소에 있고 장면이 변화한다 | 장면 전환, 전투 시작, 위협적 사건 발생 등 |
| NPC의 자율 행동 주기가 도래했다 | World Engine이 시간 경과를 보고하고 해당 NPC의 행동 주기가 만료된 경우 |

**쿼리 내용:**

```yaml
npc_engine_query:
  type: reaction | autonomous_action | dialogue
  npc_id: string
  trigger_action: ResolvedAction | null   # NPC 반응의 원인이 된 행동 (null이면 자율 행동)
  world_state: WorldState
  scene_context: SceneState
```

**수신 결과:** `npc_response` — NPC 대사 블록, 행동 묘사, updated_npc_state. Director Engine은 이를 narrative_text에 통합한다. NPC의 결정을 수정하지 않는다.

## 6.2 Resolution Engine 호출

**호출 시점:**

| 조건 | 설명 |
|------|------|
| 행동 성공 여부가 불확실하다 | 위험, 비용, 저항, 시간 압박, 숨겨진 정보가 있다. |
| 결과가 세계 상태를 바꿀 수 있다 | 피해, 이동, 획득, 발견, 관계 변화, 시스템 접근 등이 발생할 수 있다. |
| 행동이 전투, 은신, 설득, 조사, 절도, 해킹, 사회 상호작용에 해당한다 | 자동 성공이 아닌 attempt로 평가한다. |
| 플레이어가 예상 밖 접근을 시도한다 | 실패 처리 전에 plausibility를 평가한다. |

**쿼리 내용:**

```yaml
attempt_request:
  source_action_id: string
  actor_id: string
  action_type: combat | stealth | persuasion | investigation | theft | hacking | social_interaction | movement | item | other
  declared_intent: string
  target_ids: list[string]
  scene_context: SceneState
  world_state: WorldState
  retrieved_context: MemoryContext
  active_module: ModuleContext
```

**수신 결과:** `resolution_result` — 난이도 평가, 처리 방식, outcome, 비용, complication, discovered_facts, world_effects. Director Engine은 이 결과를 플레이어가 볼 수 있는 서술로 변환하되, 판정값·DC·내부 보정은 노출하지 않는다.

## 6.3 World Engine 연동

Director Engine은 World Engine에 직접 쿼리하지 않는다. World Engine은 세션 시작 시 자율 진행 결과를 Director Engine에 제공하며, 이후 Director Engine은 `world_effects`를 World Engine에 이벤트로 전달한다.

**이벤트 전달 시점:**
- resolved_action에 포함된 `world_effects`가 존재하는 경우
- NPC Engine의 결과가 세계 변화를 포함하는 경우

World Engine의 응답을 기다리지 않는다. World Engine의 업데이트는 다음 세계 상태 조회 시 반영된다.

## 6.4 Mission Engine 호출

**호출 시점:**

| 조건 | 설명 |
|------|------|
| 플레이어 행동이 활성 임무의 목표와 연결된다 | 목표 NPC 처치, 아이템 획득, 장소 방문 등 |
| 임무 실패 조건이 충족될 가능성이 있다 | 임무 타이머 만료 임박, 보호 대상 피해 등 |
| 새로운 Emergent Mission이 발생할 조건이 형성된다 | 플레이어가 자발적으로 새 목표를 향해 행동할 때 |
| 임무 완료 또는 실패가 확정되었다 | 마지막 목표 달성 또는 실패 조건 충족 |

**쿼리 내용:**

```yaml
mission_engine_query:
  type: check_progress | report_completion | report_failure | check_emergent
  mission_id: string | null    # null이면 전체 활성 임무 점검
  trigger_action: ResolvedAction
  world_state: WorldState
```

**수신 결과:** 임무 상태 갱신 결과. 완료·실패 시 `on_complete`/`on_fail` WorldEffect 목록 포함. Director Engine은 이 결과를 서술에 반영하고 World Engine에 WorldEffect를 전달한다.

## 6.5 Save Engine 호출

**자동 저장 트리거:**

| 트리거 조건 | 설명 |
|-------------|------|
| 세션 시작 | 이전 상태 불러오기 |
| 세션 종료 | 최종 상태 저장 |
| 주요 임무 완료·실패 | Mission Engine이 확정 보고 후 |
| 돌이킬 수 없는 세계 변화 발생 | 주요 NPC 사망, 요새 함락, 주요 계약 체결 등 |
| 플레이어 또는 GM의 명시적 저장 요청 | 메타 선언으로 처리 |

**저장 요청 내용:**

```yaml
save_trigger:
  trigger_type: session_start | session_end | mission_resolved | world_change | manual
  snapshot_target: full | checkpoint
  current_game_state: GameState
```

## 6.6 Memory Engine 연동

**컨텍스트 요청:** 세션 시작 및 장면 전환 시 현재 장면과 관련된 기억을 요청한다.

**이벤트 저장:** 매 턴 종료 시 이번 턴에서 발생한 사건을 Memory Engine에 전달한다.

```yaml
memory_store_event:
  session_id: string
  turn_timestamp: string
  resolved_action: ResolvedAction
  npc_responses: list[NPCResponse]
  world_effects: list[WorldEffect]
  mission_updates: list[MissionUpdate]
```

## 6.7 Shadow Engine 연동

Director Engine은 Shadow Engine에 직접 쿼리하지 않는다. Shadow Engine은 각 턴 처리 단계에서 자율적으로 처리하고 Director Engine에 비가시 처리 완료 신호만 전달한다. Director Engine은 Shadow Engine의 처리 결과를 서술에 노출하지 않는다.

---

# 7. 서술 생성 규칙

## 7.1 서술 원칙

**시점:** CoreSpec §10.1.1에 따라 기본 2인칭 현재시제. 세계관 모듈이 다른 시점을 지정하면 그에 따른다.

**감각 묘사:** 시각에 국한하지 않는다. 청각, 후각, 촉각을 상황에 따라 활용한다.

**정보 밀도:** 한 서술 블록에서 중요한 정보는 2~3개를 넘기지 않는다. 세부 정보는 탐색 행동의 결과로 드러난다.

**단서 배치:** 위험이나 기회를 암시하는 단서는 서술에 자연스럽게 포함된다. "여기에 단서가 있습니다"라고 직접 알리지 않는다.

## 7.2 Director 응답 전략

Director Engine은 플레이어 입력을 단순히 반복하거나 요청된 정보만 반환하지 않는다. 각 응답은 현재 결과를 서술하면서 다음 플레이 가능 지점을 자연스럽게 드러내야 한다.

응답에는 상황에 맞게 다음 요소를 포함한다.

- **가까운 상호작용 대상:** 문, 장치, 흔적, NPC, 이동 경로, 위험 신호처럼 플레이어가 건드릴 수 있는 요소.
- **이전에 확립된 사실:** Memory Engine 또는 현재 세션 컨텍스트에 있는 관련 사실.
- **현재 발견과 과거 사건의 연결:** 새 단서가 이전 사건, NPC, 장소, 임무와 닿아 있으면 짧게 연결한다.
- **선택 강요 없는 리드:** "해야 한다"가 아니라 세계 상태 묘사로 접근 가능성을 보여준다.

나쁜 패턴:

- 플레이어 질문을 그대로 되풀이한 뒤 한 문장 답변만 제공한다.
- 단서 하나만 답하고 장면의 다른 상호작용 가능성을 숨긴다.
- 이전에 제공된 관련 정보가 있는데도 새 발견을 고립된 사실처럼 처리한다.

좋은 패턴:

- 결과를 확정된 범위 안에서 말한다.
- 눈앞의 상호작용 지점을 2~3개 이하로 드러낸다.
- 관련 과거 사실을 한 문장 이하로 자연스럽게 연결한다.

## 7.3 Context Linking 규칙

새 정보, 발견, NPC 반응, 장소 변화, 임무 단서가 등장하면 Director Engine은 다음 컨텍스트를 확인한다.

| 확인 대상 | 질문 |
|-----------|------|
| previous NPCs | 이 정보와 관련된 NPC가 이전에 등장했는가? |
| previous locations | 이 장소나 흔적이 이전 장소와 연결되는가? |
| previous discovered clues | 이미 발견한 단서와 같은 패턴, 원인, 대상, 결과를 공유하는가? |
| active missions | 현재 활성 임무의 목표, 실패 조건, 보상, 위험과 관련되는가? |

관련 정보가 있으면 다음 원칙으로 서술한다.

1. 플레이어가 알 수 있는 사실만 참조한다.
2. Memory Engine이 제공하지 않은 과거 정보는 사용하지 않는다.
3. 연결은 암시 또는 짧은 회상으로 처리한다.
4. 연결이 확실하지 않으면 가능성으로만 표현한다.
5. 연결을 이유로 플레이어의 다음 행동을 강제하지 않는다.

## 7.4 Adaptive Detail Mode

플레이어가 정확히 다음 요청을 포함하면 압축 모드로 응답한다.

```text
[요청: 중요한 내용만]
```

압축 모드 규칙:

- 핵심 결과, 즉시 보이는 위험, 다음 상호작용 가능성만 포함한다.
- 감각 묘사는 최소화한다.
- 이전 사실 연결은 중요한 것 1개 이하만 포함한다.
- 장면 출력은 3~5문장 또는 짧은 목록으로 제한한다.

명시 요청이 없으면 Director Engine은 페이싱에 따라 길이를 자동 선택한다.

| 페이싱 단계 | 기본 길이 |
|-------------|-----------|
| Rising Action | 중간 길이. 단서와 분위기를 포함한다. |
| Climax | 짧고 즉각적. 결과와 위험을 우선한다. |
| Falling Action | 중간 길이. 결과, 비용, NPC 반응을 정리한다. |
| Resolution | 짧거나 보통. 다음 장면으로 연결되는 정보만 남긴다. |

긴 설명이 필요한 경우에도 한 번에 중요한 정보 2~3개를 넘기지 않는다.

## 7.5 페이싱 관리

Director Engine은 SessionState의 `session_pacing`을 추적하며 서술 강도를 조절한다.

| 페이싱 단계 | 서술 특성 | 길이 |
|-------------|-----------|------|
| **Rising Action** | 긴장감 구축, 위협 암시, 정보 단서 배치 | 중간. 감각 묘사 풍부 |
| **Climax** | 즉각적, 역동적, 결과 직접 묘사 | 짧고 빠름. 행당 1~2문장 |
| **Falling Action** | 결과 처리, 피해 확인, 여운 | 중간. 감정적 공간 허용 |
| **Resolution** | 안정화, 보상, 다음 장 암시 | 보통 길이. 정보 정리 |

하나의 세션 안에 최소 1개의 완성된 페이싱 사이클이 있어야 한다. Director Engine은 세션 내 `pacing_cycle_count`를 추적하며, 사이클이 0인 채 세션이 종료될 위험이 있을 때 자연스러운 절정 상황을 유도할 수 있다. 단, 이 유도는 세계 논리 안에서만 이루어진다.

## 7.5.1 Dynamic Event Pacing

The world should advance independently. Player action should not be the only trigger for change.

The Director may introduce logical world events after several meaningful player actions, especially when the scene has otherwise remained static. These events may come from NPC movement, environmental change, off-screen action, resource pressure, new information becoming available, or an escalating threat already present in the world state.

Dynamic events must follow established scenario logic and current world state. They must not expose hidden information, bypass required Resolution Engine checks, invalidate player choices, or force a predetermined outcome.

Event pacing should support tension without removing player agency. A useful live-play target is a minor logical event after 2-3 meaningful player actions, a major event after 5-7 meaningful player actions when the world state supports it, and a critical event only when a scenario phase or escalation condition justifies it.

## 7.5.2 Incident Pressure and Inventory Integrity

When repeated investigation does not create meaningful progression, the Director should introduce a logical pressure event that requires response. Pressure events may escalate an existing threat, change the environment, move an NPC, worsen a victim's condition, cut off a safe option, or force a choice between objectives. They must follow current world state and must not become random events.

The Director must respect character sheet equipment. Only declared equipment is automatically available. If a player attempts to use an unlisted item, the Director should state that the item is not currently listed and offer fair alternatives, such as searching the scene, requesting support, accessing a supply point, improvising with listed equipment, or trying another method.

Character role, job, or authority may justify a Resolution Engine check to access equipment, but must not create automatic possession.

## 7.5.3 Director Support Sub-Engines

The following Director-side support documents refine live-play behavior without creating new top-level architecture engines:

- `engines/Director/PacingEngine.md` - prevents static play and breaks repeated low-impact investigation loops.
- `engines/Director/ConsequenceEngine.md` - ensures meaningful actions create direct and secondary consequences.
- `engines/Director/SceneFlowEngine.md` - keeps each scene active, interruptible, and transition-ready.
- `engines/Director/OutputEngine.md` - keeps normal live-play responses concise and consequence-focused.

These support documents operate through existing Director responsibilities and existing engine boundaries. They do not override Resolution outcomes, Shadow Engine hidden-information handling, character sheet inventory limits, or player agency rules.

## 7.6 장면 전환

다음 조건 중 하나가 충족되면 장면 전환을 수행한다.

- 위치 변경: 플레이어가 새 장소로 이동
- 시간 경과: 생략 가능한 시간이 흐름
- 목적 변경: 다른 목표로 초점 이동
- 강도 변경: 긴장-이완 전환

장면 전환 시 SceneState를 갱신하고 Memory Engine에 이전 장면 종료를 알린다.

흥미롭지 않은 이동과 대기는 생략한다.

- 허용: "사흘 뒤, 당신은 마침내 항구 도시에 도착했습니다."
- 금지: 사흘의 이동 과정을 턴 단위로 서술

생략된 시간 동안 발생한 세계 변화는 World Engine에서 수신하여 한 문장으로 요약 제공한다.

## 7.7 서술 금지 패턴

다음 서술 패턴은 어떤 상황에서도 사용하지 않는다.

| 금지 패턴 | 이유 |
|-----------|------|
| 플레이어의 내면 감정 직접 서술 ("당신은 두려움을 느꼈습니다") | 플레이어 자율성 침해 |
| 플레이어의 반응 예측 ("당신은 당연히 분노하겠지만") | 플레이어 자율성 침해 |
| 플레이어 대신 결정 서술 ("당신은 도망치기로 했습니다") | 플레이어 자율성 침해 |
| 수치 공개 ("적의 HP가 15 남았습니다") | 메타 정보 노출 |
| 판정값 공개 ("주사위에서 17이 나왔습니다") | 메타 정보 노출 |
| 외부 저자 개입 ("이 장면은 중요합니다") | 세계관 몰입 파괴 |
| 엔진 내부 상태 노출 ("Shadow Engine이 확률을 조정했습니다") | 메타 정보 노출 |
| 이전 세션 기억 임의 참조 (Memory Engine 제공 외) | 일관성 위반 가능 |

## 7.8 결과 생성 규칙

의미 있는 플레이어 행동은 하나의 결과로 종료되지 않는다.

직접 결과를 확정한 후, Director Engine은 그 행동이 세계에 미치는 추가 영향을 생성한다. 의미 있는 행동은 다음 중 두 가지 이상을 포함해야 한다.

| 항목 | 설명 |
|------|------|
| **직접 결과** | 행동의 즉각적 효과 |
| **세계 변화** | 환경·상태·접근 가능성의 변화 |
| **NPC 반응** | 현장 NPC의 행동·태도 변화 |
| **새 단서** | 발견 가능한 새 정보의 등장 |
| **새 위험** | 플레이어가 직면하는 새 위협 |
| **새 기회** | 열리는 접근 경로나 선택지 |
| **새 문제** | 처리해야 할 새 장애물 |
| **자원 변화** | 장비·자원·조건의 변화 |
| **환경 변화** | 장소의 물리적·감각적 변화 |
| **이상 현상 반응** | 활성 SCP 또는 이상 개체의 행동 변화 |

직접 결과만 서술하고 응답을 종료하는 것은 세계의 비활성 상태를 나타낸다. Director Engine은 행동 결과와 함께 반드시 하나 이상의 추가 영향을 생성한다.

나쁜 패턴:
> "상자가 부서졌습니다. 무엇을 하시겠습니까?"

좋은 패턴:
> "상자가 부서지면서 금속 파편이 튀었습니다. 굉음이 복도를 울립니다. 오른쪽 끝 방에서 불빛이 흔들리는 것이 보입니다."

## 7.9 결과 연쇄

행동의 결과는 고립되지 않는다. 하나의 행동은 세계를 통해 자연스럽게 전파된다.

```
플레이어가 문을 연다
→ 소리가 복도에 울린다
→ 인접 NPC가 소리를 듣는다
→ 보안 시스템이 이동을 기록한다
→ 격리 상태가 변한다
→ 이상 현상이 반응한다
→ 이후 장면이 영향을 받는다
```

Director Engine은 행동의 직접 결과뿐 아니라 그 결과가 세계의 다른 요소와 어떻게 연결되는지 추적한다.

규칙:
- 플레이어가 알 수 있는 범위의 연쇄만 서술에 포함한다.
- 숨겨진 연쇄(NPC가 비밀리에 반응하는 것 등)는 Shadow Engine 처리로 위임하고 서술에 노출하지 않는다.
- 연쇄는 현재 세계 상태와 시나리오 논리를 따라야 한다. 임의 이벤트를 생성하지 않는다.
- 연쇄의 길이는 서술 길이 기준(§7.10)을 준수한다.

## 7.10 응답 길이 제한

Director Engine 응답의 길이는 다음 기준을 따른다.

| 응답 유형 | 권장 길이 | 포함 대상 |
|-----------|-----------|-----------|
| 일반 응답 | 80~150 한국어 글자 또는 이에 준하는 짧은 한국어 | 탐색, 조사, 대화, 이동, 일반 행동 |
| 이벤트 응답 | 150~300 한국어 글자 | 전투 해소, 주요 NPC 반응, 장면 전환, 이상 현상 발현 |
| 주요 장면 응답 | 300~500 한국어 글자 | 새 phase 시작, 중대 이상 현상, 복합 결과 |
| 결말 | 유연 적용 | 엔딩 분기 서술 전체 |

짧고 즉각적인 서술이 긴 묘사보다 선호된다. 정보를 분산해야 할 경우 이어지는 플레이어 행동을 통해 추가로 드러낸다.

§7.4의 Adaptive Detail Mode(`[요청: 중요한 내용만]`)가 활성화된 경우, 해당 규칙이 이 기준보다 우선 적용된다. §7.5의 페이싱 단계에 따라 Climax 구간은 기준보다 짧게, Rising Action 구간은 기준 범위 안에서 자유롭게 조정한다.

## 7.11 장면 모멘텀

각 장면은 항상 진행 중인 요소를 하나 이상 포함해야 한다.

다음 중 하나 이상이 서술 안에서 움직이고 있어야 한다.

| 항목 | 예시 |
|------|------|
| **NPC 목표** | Reyes가 바리케이드를 강화하고 있다. Chen이 의식을 되찾으려 애쓰고 있다. |
| **이상 현상 행동** | 개체가 새로운 패턴의 진동을 방출하고 있다. 격리함의 빛이 달라졌다. |
| **환경 조건** | 복도 조명이 서서히 불안정해지고 있다. 문 아래로 액체가 새어 나온다. |
| **카운트다운** | 명시적 또는 암묵적 시간 제한이 흐르고 있다. |
| **플레이어 목표** | 조사한 단서가 새로운 목적지를 가리키고 있다. |
| **격리 상태** | 격리 조건이 안정적이거나 점점 불안정해지고 있다. |

세계는 플레이어를 기다리지 않는다. 장면이 정적으로 느껴지면 Director Engine은 위 항목 중 하나가 진행 중임을 서술로 드러낸다.

## 7.12 Resolution 투명성

플레이어가 판정 결과를 이해할 수 있도록, Director는 판정 추론을 간략히 드러낸다.

권장 형식:

```
판정
  난이도: [trivial / easy / standard / hard / extreme / impossible]
  유리 요소: + [특성 또는 상황]
  불리 요소: - [조건 또는 제약]
  결과: [critical_success / success / partial_success / failure / critical_failure]
```

규칙:

- 주사위 값, DC 수치, 내부 보정값은 절대 노출하지 않는다. (§7.7 금지 패턴 유지)
- 유리·불리 요인은 서술 가능한 요인(특성, 도구, 상황)만 표시한다. 각 1~3개로 제한한다.
- 판정 블록은 서술 텍스트와 구분하기 위해 별도 블록으로 표시한다.
- 판정이 없는 자동 성공·실패는 이 블록을 생성하지 않는다.

---

# 8. 데이터 구조 정의

## 8.1 SceneState 스키마

```yaml
scene_state:
  id: string                         # scn_{캠페인_약어}_{순번}
  session_id: string
  location_id: string                # 현재 장면의 장소 ID
  active_entities:                   # 현재 장면에 존재하는 주요 개체
    - entity_id: string
      entity_type: player | npc
      is_visible_to_player: bool
  pacing_state: rising_action | climax | falling_action | resolution
  tone: epic | tense | mysterious | casual | grim
  tension_level: int                 # 0 (평온) ~ 10 (극한 위기)
  scene_flags:                       # 세계관 모듈용 추가 플래그
    key: value
  opened_at_epoch: int               # 장면 시작 시각 (세계 내 epoch_seconds)
```

## 8.2 SessionState 스키마

```yaml
session_state:
  id: string                         # ses_{캠페인_약어}_{세션번호}
  campaign_id: string
  session_number: int
  current_scene: SceneState
  session_pacing: rising_action | climax | falling_action | resolution
  pacing_cycle_count: int            # 이번 세션에서 완성된 페이싱 사이클 수
  meaningful_choice_count: int       # 이번 세션에서 제공된 의미 있는 선택 수 (QA 기준: ≥3)
  world_change_count: int            # 플레이어 행동으로 발생한 세계 변화 수 (QA 기준: ≥1)
  npc_interaction_count: int         # 이번 세션의 실질적 NPC 상호작용 수 (QA 기준: ≥1)
  turn_count: int                    # 이번 세션의 총 턴 수
  started_at_real: string            # 실제 세계 시각 (ISO 8601)
  started_at_world: string           # 세계 내 시각
```

## 8.3 EngineCallRecord 스키마

```yaml
engine_call_record:
  called_engine: string              # NPC | Mission | Resolution | Save | Memory | World | Shadow | QA
  call_type: query | event
  trigger_action_id: string
  call_timestamp_world: string
  response_status: success | pending | error
```

---

# 9. 플레이어 자율성 보장 규칙

Director Engine은 CoreSpec §3.1(원칙 1)과 §12.1을 다음과 같이 적용한다.

## 9.1 행동 작성 금지

Director Engine이 생성하는 모든 텍스트에서 다음은 절대 허용되지 않는다.

- 플레이어가 선언하지 않은 행동을 마치 선언한 것처럼 서술
- "당신은 ~~을 하기로 결심했습니다"와 같이 플레이어의 의지를 서술에 포함
- 선택지를 제시할 때 특정 선택을 더 나은 것으로 암시하는 표현

## 9.2 선택 제시 방식

Director Engine이 상황을 서술할 때, 선택지는 세계의 상황을 묘사하는 방식으로만 드러난다.

**올바른 예:**
> "경비원 두 명이 통로를 막고 서 있습니다. 그들 너머로 계단이 보입니다. 오른쪽에는 창문이 있고, 왼쪽에는 닫힌 문이 있습니다."

**금지 예:**
> "A. 정면 돌파 / B. 창문으로 도주 / C. 왼쪽 문 열기 중 선택하세요."

단, 세계관 모듈이 특정 형식의 선택지 제시를 명시한 경우는 예외로 허용한다.

## 9.3 불가능한 행동 처리

플레이어가 현재 불가능한 행동을 선언한 경우 거절하지 않는다. 시도했을 때의 결과(실패)를 서술한다.

**예:**
- 요청: "하늘을 날겠습니다."
- 잘못된 응답: "그것은 불가능합니다."
- 올바른 응답: 시도 후 실패하는 과정을 서술.

세계관 모듈이 해당 능력을 정의한 경우 능력 조건을 확인하고 처리한다.

---

# 10. 검증 규칙

QA Engine은 Director Engine의 출력에 대해 다음 항목을 검증한다.

| 규칙 ID | 검증 항목 | 위반 시 처리 |
|---------|-----------|-------------|
| `SV-DIR-001` | narrative_text에 플레이어가 선언하지 않은 행동이 서술되었는가 | Fatal — 즉시 출력 차단, 해당 서술 반환 |
| `SV-DIR-002` | narrative_text에 수치(HP, 판정값, DC, 확률)가 노출되었는가 | Error — 해당 수치 플래그 후 재생성 요청 |
| `SV-DIR-003` | narrative_text가 Memory Engine 제공 외의 이전 세션 정보를 참조했는가 | Warning — 해당 참조 플래그, GM 확인 요청 |
| `SV-DIR-004` | 세션 종료 시점에 `pacing_cycle_count`가 0인가 | Warning — GM에게 사이클 미완성 고지 |
| `SV-DIR-005` | 세션 종료 시점에 `meaningful_choice_count`가 3 미만인가 | Warning — 품질 기준 미달 고지 |
| `SV-DIR-006` | NPC의 반응이 NPC Engine을 거치지 않고 Director Engine이 직접 생성되었는가 | Error — NPC Engine 호출 누락 보고 |
| `SV-DIR-007` | Mission Engine 호출 없이 임무 완료·실패가 서술에 포함되었는가 | Error — Mission Engine 호출 누락 보고 |
| `SV-DIR-008` | narrative_text에 엔진 이름, 내부 플래그, 모듈 구현 세부 정보가 포함되었는가 | Fatal — 즉시 출력 차단 |
| `SV-DIR-009` | 세션 종료 시 Save Engine 호출 없이 세션이 종료되었는가 | Error — 저장 누락 경고, 즉시 저장 요청 |
| `SV-DIR-010` | 불확실한 행동이 Resolution Engine 없이 성공으로 서술되었는가 | Error — Resolution 요청 후 재생성 |
| `SV-DIR-011` | 새 정보가 관련 Memory 컨텍스트와 연결되지 않고 고립되었는가 | Warning — Context Linking 재검토 |
| `SV-DIR-012` | `[요청: 중요한 내용만]` 요청에도 장황한 서술을 출력했는가 | Warning — 압축 모드로 재생성 |
| `SV-DIR-013` | 예상 밖 행동을 plausibility 평가 없이 거절했는가 | Warning — Resolution Engine 평가 요청 |
| `SV-DIR-014` | 의미 있는 행동이 직접 결과 하나만 생성하고 종료되었는가 | Warning — §7.8 결과 생성 규칙 미적용 |
| `SV-DIR-015` | 일반 응답, 이벤트 응답, 주요 장면 응답이 §7.10의 live-play 길이 기준을 반복적으로 초과했는가 | Warning — §7.10 응답 길이 기준 초과 |
| `SV-DIR-016` | 장면에서 진행 중인 모멘텀 요소가 없었는가 | Warning — §7.11 Scene Momentum 미적용 |
| `SV-DIR-017` | Resolution 판정 결과의 추론이 플레이어에게 드러나지 않았는가 | Warning — §7.12 Resolution 투명성 미적용 |
| `SV-DIR-018` | 행동의 결과 연쇄가 세계로 전파되지 않았는가 | Warning — §7.9 Consequence Chaining 미적용 |

---

**END OF DirectorEngine v1.1.1**
