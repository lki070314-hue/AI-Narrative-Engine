# Memory Engine Specification

## Status
Draft v0.1

## Alpha Document Version

For Alpha Test 00 documentation validation, `memory_archive.metadata.schema_version` uses `"1.0.0"` and is aligned with Save Engine `save_file.metadata.document_version`. This note does not change runtime behavior.

---

# 1. Purpose

이 문서는 AI Narrative Engine의 **Memory Engine**에 대한 상세 설계 및 규격을 정의한다.
Memory Engine은 장기 캠페인의 모든 중요 정보를 저장, 분류, 압축하고 검색하여 AI 시스템의 컨텍스트 창(Context Window) 한계를 최적화하면서 일관된 세계관과 인과관계를 유지하는 역할을 담당한다.

이 명세는 세계관 독립적으로 설계되었으며, 모듈 레이어에서 주입되는 세계관 설정 및 게임 상태에 따라 구동된다.

---

# 2. Architecture & Interface

Memory Engine은 현재 세션 진행 로그와 캐릭터 및 월드 상태를 전달받아 기억을 티어별로 분류 및 갱신하고, 특정 씬이나 시점에 필요한 기억을 검색 및 필터링하여 제공한다.

## 2.1 인터페이스 계약

### 2.1.1 입력 (Inputs)
Memory Engine은 실행 시 다음과 같은 데이터 객체를 전달받는다.

| 입력 변수명 | 타입 | 필수 여부 | 설명 |
|---|---|---|---|
| `session_log` | List[LogEntry] | Y | 현재 세션 내에서 발생한 자연어 대화, 서술 및 판정 결과 로그 |
| `current_context` | ContextObject | Y | 현재 장면의 위치 ID, 참여 NPC ID 목록, 활성 미션 ID 목록 등 |
| `memory_archive` | MemoryArchive | Y | 이전까지 영구 저장된 게임의 전체 장기 기억 데이터 |
| `active_module` | ModuleContext | Y | 현재 활성화된 세계관 모듈 규칙 및 템플릿 |

### 2.1.2 출력 (Outputs)
Memory Engine은 처리를 마친 후 다음 데이터를 생성하여 Director Engine 및 Save Engine에 전달한다.

| 출력 변수명 | 타입 | 설명 |
|---|---|---|
| `retrieved_context` | Object | 현재 장면에 직접 관련이 있어 프롬프트 컨텍스트에 즉시 주입될 기억 목록 |
| `updated_memory_archive` | MemoryArchive | 신규 기억 추가, Tier 3 만료 및 Tier 2 압축 요약이 반영된 갱신된 아카이브 객체 |
| `archive_events` | List[Event] | 원본 기억(압축 전 상세 로그)을 Save Engine에 영구 보존하도록 발행하는 아카이브 이벤트 |

---

# 3. Memory Core Data Structure

장기 캠페인의 기억은 AI 컨텍스트 창의 부하를 최소화하기 위해 3개의 티어로 엄격히 분류되어 YAML 형식의 구조화된 데이터로 관리된다.

## 3.1 Memory Archive Schema

```yaml
memory_archive:
  # 1. 메타데이터
  metadata:
    schema_version: "1.0.0"         # Alpha Test 00 document schema version
    last_updated_session: int
    total_sessions: int
    compression_count: int

  # 2. Tier 1: 핵심 기억 (영구 보존, 절대 압축 불가)
  tier1_core:
    characters:
      - id: string               # 플레이어 캐릭터 또는 주요 인물 ID
        background_summary: string
        core_relationships:
          - target_id: string
            relationship_type: string # 예: sworn_enemy, mentor, spouse
            anchor_event: string     # 이 관계를 확립한 핵심 사건
        major_oaths:             # 중요 서약 또는 계약
          - oath_id: string
            description: string
            timestamp: string
    world_events:                # 세계의 거대한 영구적 변화 사건
      - event_id: string
        title: string
        summary: string
        timestamp: string        # 게임 내 시각/세션 번호
        consequences: list[string] # 이 사건으로 발생한 영구적인 여파
    user_marked_facts:           # 플레이어가 명시적으로 중요하게 남기기를 요구한 기록
      - fact_id: string
        content: string
        marked_session: int

  # 3. Tier 2: 중요 기억 (세션 횟수 기반 단계적 압축 보존)
  tier2_important:
    npc_interactions:            # NPC와의 주요 상호작용 및 관계 원인 요약
      - npc_id: string
        last_interaction_session: int
        summary: string          # 예: "플레이어가 마리를 도둑들로부터 구해줌"
        unresolved_tensions: list[string]
    visited_locations:           # 방문한 장소 및 거기서 얻은 고정 정보
      - location_id: string
        first_visited_session: int
        discoveries: list[string] # 예: "비밀 지하실 열쇠 구멍 발견"
    missions_history:            # 완료 및 실패한 임무 이력
      - mission_id: string
        status: completed | failed
        outcome_summary: string   # 결과 요약 및 여파
        resolved_session: int
    items_history:               # 전설적 아이템이나 중요 도구의 획득 및 상실 이력
      - item_id: string
        current_status: string    # 예: owned, lost, destroyed
        history_log: list[string]

  # 4. Tier 3: 임시 기억 (세션 내 유효, 세션 종료 시 휘발 및 요약 이전)
  tier3_temporary:
    scene_descriptions:          # 현재 세션 내 방문 장면의 상세 묘사
      - scene_id: string
        description: string
        timestamp: string
    recent_dialogues:            # 턴 단위 대사 텍스트
      - speaker_id: string
        text: string
        timestamp: string
    dice_results:                # 판정 결과 로그
      - action_id: string
        stat_used: string
        target_difficulty: int
        roll_outcome: success | failure | critical
```

---

# 4. Context Compression System

AI Narrative Engine은 장기 캠페인의 한계를 극복하기 위해 메모리 컨텍스트를 동적으로 압축한다. 이 압축 과정은 Memory Engine의 중추적인 동작 원리이다.

## 4.1 압축 원칙
1. **결과 중심 보존:** 세부 과정(예: "어떻게 협상하였고 무슨 감정적 언쟁이 오갔는지")은 탈락시키고, 확정된 결과(예: "호감도가 상승하여 비밀번호를 얻었다")만을 요약하여 저장한다.
2. **세션 기반 단계적 압축:** 
   - **세션 종료 시:** Tier 3 임시 기억은 전부 요약되어 Tier 2의 `npc_interactions` 또는 `visited_locations` 등의 항목으로 결합된다.
   - **N세션(기본값 5세션) 이상 경과 시:** 오래된 Tier 2 기억들은 여러 개의 단문 요약을 하나의 긴 흐름 요약으로 재압축 및 결합하여 용량을 대폭 축소한다.
3. **영구 보존(Save Engine 연동):** 압축하여 삭제될 모든 Tier 3 원본 로그와 세부 텍스트는 삭제 전 Save Engine에 이벤트로 전달하여 원본 아카이브 파일에 별도로 보관한다.
4. **Tier 1 보존:** Tier 1 핵심 기억은 어떤 경우에도 압축 대상이 되지 않으며 원본 텍스트 구조를 100% 유지한다.

## 4.2 압축 알고리즘 흐름
1. 한 세션이 종료될 때, Memory Engine은 해당 세션의 `tier3_temporary` 데이터를 로드한다.
2. 각 캐릭터의 대화 로그와 판정 결과를 파싱하여, NPC 상태 변화 원인과 퀘스트 상태 변화 결과를 한 문장 형태(Outcome-based Fact)로 추출한다.
3. 추출된 요약본을 `tier2_important`에 삽입한다.
4. 기존 `tier2_important`에 존재하는 데이터 중, 현재 세션 기준으로 5세션 이상 경과한 기억들을 검색한다.
5. 관련이 깊은 기억 단위(예: 동일 인물, 동일 장소 관련)로 그룹핑한 뒤, 의미론적 요약(Semantic Summary)을 수행하여 여러 요약 항목을 하나의 마일스톤 요약으로 병합한다.
6. 압축 전 원본 로그는 `archive_events`를 통해 발행한다.

---

# 5. Memory Retrieval Protocol

상황 서술과 플레이어 입력을 원활히 처리하기 위해, Memory Engine은 컨텍스트가 요구될 때 즉각 관련 기억을 선별하여 제공하는 검색 프로토콜을 수행한다.

## 5.1 검색 가중치 및 우선순위
장면에 새로운 정보가 주입될 때, Memory Engine은 다음 네 단계의 계층 구조에 따라 기억을 탐색 및 정렬하여 `retrieved_context`를 구성한다.

```
┌────────────────────────────────────────────────────────┐
│                      [우선순위 1]                      │
│        현재 장면과 직접 연관된 Tier 1 핵심 기억        │
├────────────────────────────────────────────────────────┤
│                      [우선순위 2]                      │
│    현재 장소(location_id) 및 NPC(npc_id) 관련 Tier 2   │
├────────────────────────────────────────────────────────┤
│                      [우선순위 3]                      │
│         현재 활성화된 임무(mission_id) 관련 Tier 2     │
├────────────────────────────────────────────────────────┤
│                      [우선순위 4]                      │
│   시간 역순 정렬된 최근 Tier 3 임시 기억 (최대 10개)   │
└────────────────────────────────────────────────────────┘
```

1. **우선순위 1 (Tier 1 Core):** 플레이어 캐릭터와 관련된 원초적 정보, 세계 파괴적인 역사 등 항상 유지해야 할 정보.
2. **우선순위 2 (Tier 2 Contextual - Entity):** 씬에 존재하는 Entity(NPC, 장소)의 지난 상호작용 결과 및 특성.
3. **우선순위 3 (Tier 2 Contextual - Objective):** 플레이어가 지금 가고 있는 길의 목적과 관련된 단서 및 이력.
4. **우선순위 4 (Tier 3 Temporal):** 씬 바로 이전 턴에서 일어난 연속성을 보장하기 위한 원본 임시 로그 10턴 분량.

---

# 6. Relationship with Other Engines

Memory Engine은 독립적으로 동작하지만, 데이터 흐름상 다른 엔진들과 긴밀히 연동된다.

- **Director Engine:** 장면을 묘사하기 전에 Memory Engine에 `retrieved_context`를 요청하여 이를 바탕으로 모순 없는 장면을 서술한다.
- **Compiler Engine:** 플레이어의 행동 입력이 타당한지(예: 플레이어가 '기억하고 있는' NPC의 이름을 부르는지, 방문했던 장소의 정보를 활용하는지 등)를 판단하기 위해 메모리를 참조한다.
- **Save Engine:** 압축되기 전의 원본 메모리와 갱신된 `memory_archive`를 전송받아 하드디스크/저장소에 영구히 파일로 직렬화(Serialization)한다.
- **QA Engine:** 생성된 세션 내용이 메모리 상태와 충돌하지 않는지 정기적으로 교차 검증을 시도한다.

---

# 7. Validation Rules

QA Engine은 Memory Engine의 작업에 대해 다음 검증 규칙을 수행한다.

- **SV-MEM-001 (핵심 기억 불변성):** Tier 1 기억(`tier1_core`) 항목이 압축 로직에 의해 유실되거나, 플레이어의 명시적인 인게임 합의 없이 훼손/수정되지 않았는가? (위반 시 Fatal Error)
- **SV-MEM-002 (인과성 보존):** 압축된 Tier 2 요약문이 실제 발생한 핵심 결과 정보를 왜곡하지 않았는가? (예: "아이템을 잃어버렸다"가 압축 후 "아이템을 획득했다"로 왜곡되었는지 검사)
- **SV-MEM-003 (참조 무결성):** 기억 구조 내에 기록된 모든 Entity ID(npc_id, location_id, mission_id)가 실제 데이터베이스에 존재하는 올바른 참조인지 검증한다. (위반 시 Error)

---

END
