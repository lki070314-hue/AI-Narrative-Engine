# Director Engine Specification

**문서 식별자:** `engines/Director/DirectorEngine.md`
**버전:** v1.0.0
**상태:** Draft
**최종 수정:** 2026-06-26
**참조:** `core/CoreSpec.md` §4.2, §5.3, §10, §12, §13

---

## 목차

1. [목적](#1-목적)
2. [책임 범위](#2-책임-범위)
3. [아키텍처 및 인터페이스](#3-아키텍처-및-인터페이스)
4. [세션 처리 루프](#4-세션-처리-루프)
5. [플레이어 선언 처리](#5-플레이어-선언-처리)
6. [엔진 호출 프로토콜](#6-엔진-호출-프로토콜)
7. [서술 생성 규칙](#7-서술-생성-규칙)
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

## 2.2 Director Engine이 하지 않는 것

| 금지 항목 | 이유 |
|-----------|------|
| **플레이어 행동 작성** | 플레이어가 선언하지 않은 행동을 서술에 포함하지 않는다. |
| **NPC 행동 독자 결정** | NPC의 대사, 반응, 행동은 NPC Engine에 위임한다. |
| **판정 결과 임의 결정** | 불확실한 결과는 판정 메커니즘에 따른다. 결과를 서사적으로 조정하지 않는다. |
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
3. resolved_action의 `type`과 현재 scene_state를 기반으로 호출할 엔진을 결정한다.
4. 필요한 엔진을 병렬 또는 순차로 호출한다.
5. 모든 결과를 취합하여 narrative_text를 생성한다.

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

## 6.2 World Engine 연동

Director Engine은 World Engine에 직접 쿼리하지 않는다. World Engine은 세션 시작 시 자율 진행 결과를 Director Engine에 제공하며, 이후 Director Engine은 `world_effects`를 World Engine에 이벤트로 전달한다.

**이벤트 전달 시점:**
- resolved_action에 포함된 `world_effects`가 존재하는 경우
- NPC Engine의 결과가 세계 변화를 포함하는 경우

World Engine의 응답을 기다리지 않는다. World Engine의 업데이트는 다음 세계 상태 조회 시 반영된다.

## 6.3 Mission Engine 호출

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

## 6.4 Save Engine 호출

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

## 6.5 Memory Engine 연동

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

## 6.6 Shadow Engine 연동

Director Engine은 Shadow Engine에 직접 쿼리하지 않는다. Shadow Engine은 각 턴 처리 단계에서 자율적으로 처리하고 Director Engine에 비가시 처리 완료 신호만 전달한다. Director Engine은 Shadow Engine의 처리 결과를 서술에 노출하지 않는다.

---

# 7. 서술 생성 규칙

## 7.1 서술 원칙

**시점:** CoreSpec §10.1.1에 따라 기본 2인칭 현재시제. 세계관 모듈이 다른 시점을 지정하면 그에 따른다.

**감각 묘사:** 시각에 국한하지 않는다. 청각, 후각, 촉각을 상황에 따라 활용한다.

**정보 밀도:** 한 서술 블록에서 중요한 정보는 2~3개를 넘기지 않는다. 세부 정보는 탐색 행동의 결과로 드러난다.

**단서 배치:** 위험이나 기회를 암시하는 단서는 서술에 자연스럽게 포함된다. "여기에 단서가 있습니다"라고 직접 알리지 않는다.

## 7.2 페이싱 관리

Director Engine은 SessionState의 `session_pacing`을 추적하며 서술 강도를 조절한다.

| 페이싱 단계 | 서술 특성 | 길이 |
|-------------|-----------|------|
| **Rising Action** | 긴장감 구축, 위협 암시, 정보 단서 배치 | 중간. 감각 묘사 풍부 |
| **Climax** | 즉각적, 역동적, 결과 직접 묘사 | 짧고 빠름. 행당 1~2문장 |
| **Falling Action** | 결과 처리, 피해 확인, 여운 | 중간. 감정적 공간 허용 |
| **Resolution** | 안정화, 보상, 다음 장 암시 | 보통 길이. 정보 정리 |

하나의 세션 안에 최소 1개의 완성된 페이싱 사이클이 있어야 한다. Director Engine은 세션 내 `pacing_cycle_count`를 추적하며, 사이클이 0인 채 세션이 종료될 위험이 있을 때 자연스러운 절정 상황을 유도할 수 있다. 단, 이 유도는 세계 논리 안에서만 이루어진다.

## 7.3 장면 전환

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

## 7.4 서술 금지 패턴

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
  called_engine: string              # NPC | Mission | Save | Memory | World | Shadow | QA
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

---

**END OF DirectorEngine v1.0.0**
