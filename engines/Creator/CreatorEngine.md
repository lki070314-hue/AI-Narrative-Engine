# Creator Engine Specification

**문서 식별자:** `engines/Creator/CreatorEngine.md`
**버전:** v1.0.0
**상태:** Draft
**최종 수정:** 2026-06-26
**참조:** `core/CoreSpec.md` §5.1, §7, §14

---

## 목차

1. [목적](#1-목적)
2. [책임 범위](#2-책임-범위)
3. [아키텍처 및 인터페이스](#3-아키텍처-및-인터페이스)
4. [생성 단계 시스템](#4-생성-단계-시스템)
5. [데이터 구조 정의](#5-데이터-구조-정의)
6. [플레이어 자율성 보장 규칙](#6-플레이어-자율성-보장-규칙)
7. [세계관 독립성 규칙](#7-세계관-독립성-규칙)
8. [검증 규칙](#8-검증-규칙)

---

# 1. 목적

Creator Engine은 캠페인 시작 시 플레이어 캐릭터 시트와 세계 초기 구조를 생성하는 엔진이다.

이 엔진의 역할은 **플레이 가능한 출발점을 구성하는 것**에 한정된다. 생성된 결과물은 다른 엔진들이 캠페인을 운영하는 데 필요한 최소한의 구조적 토대를 제공한다. Creator Engine은 캠페인의 진행 방향을 결정하지 않으며, 플레이어의 선택을 대신하지 않는다.

---

# 2. 책임 범위

## 2.1 Creator Engine이 하는 것

| 항목 | 설명 |
|------|------|
| **플레이어 캐릭터 시트 생성** | 세계관 모듈의 템플릿을 기반으로 플레이어의 입력을 구조화한다. |
| **세계 시드 생성** | 캠페인 시작에 필요한 초기 세계 구조(장소, 세력, 갈등 시드)를 생성한다. |
| **시작 컨텍스트 생성** | Director Engine이 첫 장면을 즉시 시작할 수 있는 상황 요약을 제공한다. |
| **명확화 요청** | 필수 입력이 누락되거나 모순될 경우 플레이어 또는 GM에게 구체적 보완을 요청한다. |

## 2.2 Creator Engine이 하지 않는 것

| 금지 항목 | 이유 |
|-----------|------|
| **NPC 생성** | NPC 인스턴스 생성은 NPC Engine의 전담 영역이다. |
| **플레이어 선택 대리** | 어떤 생성 단계에서도 플레이어가 결정하지 않은 항목을 AI가 임의로 채우지 않는다. |
| **캠페인 결말 예정** | 미래의 사건, 임무 결과, 스토리 전개를 미리 결정하지 않는다. |
| **세계 운영** | WorldSeed를 생성한 이후 세계 상태 관리는 World Engine에 완전히 위임한다. |
| **세계관 모듈 미정의 요소 생성** | 활성화된 모듈이 정의하지 않은 규칙, 세력, 능력을 창작하지 않는다. |

---

# 3. 아키텍처 및 인터페이스

## 3.1 다른 엔진과의 관계

```
[플레이어 / GM]
      │  창조 입력 (player_intent, creation_params)
      ▼
┌─────────────────┐
│  Creator Engine │  ← world_module (모듈 레이어)
└─────────────────┘
      │
      ├── character_sheet ──────────────────────────► [Save Engine]
      │                                                    │
      ├── world_seed ──────► [World Engine] (상태 인계)    │
      │                                                    │
      └── starting_context ──► [Director Engine] (첫 장면) │
                                                           │
                                               [Memory Engine] (캠페인 아카이브)
```

Creator Engine은 캠페인 초기화 단계에서 **한 번** 실행된다. 실행이 완료되면 엔진은 유휴 상태가 되며, 이후 캐릭터 재생성이나 신규 참가자 캐릭터 추가 요청이 있을 때에만 다시 호출된다.

## 3.2 인터페이스 계약

### 3.2.1 입력 (Inputs)

| 변수명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `world_module` | ModuleContext | Y | 활성화된 세계관 모듈. 아키타입, 스탯, 스킬, 장소, 세력 템플릿을 포함한다. |
| `creation_params` | CreationParams | Y | 캠페인 규모, 난이도, 시작 조건 등 생성 파라미터. |
| `player_intent` | String | Y | 플레이어가 표현한 캐릭터 개념. 자연어로 기술된다. |
| `creation_scope` | Enum | N | 요청 범위. `full`(기본값) \| `character_only` \| `world_only`. |

### 3.2.2 출력 (Outputs)

| 변수명 | 타입 | 조건 | 설명 |
|--------|------|------|------|
| `character_sheet` | CharacterSheet | creation_scope가 `full` 또는 `character_only`일 때 | CoreSpec §7.1.1 정의 구조를 따르는 완성된 캐릭터 시트. |
| `world_seed` | WorldSeed | creation_scope가 `full` 또는 `world_only`일 때 | 캠페인 출발점의 세계 초기 구조. World Engine에 전달된다. |
| `starting_context` | StartingContext | creation_scope가 `full`일 때 | Director Engine이 첫 장면을 시작하기 위한 상황 요약. |
| `clarification_request` | String \| null | 필수 입력이 누락 또는 모순될 때 | 최소한의 구체적 보완 질문. |

---

# 4. 생성 단계 시스템

Creator Engine의 생성 프로세스는 두 개의 병렬 트랙으로 진행된다: **세계 구조 트랙**과 **캐릭터 트랙**. 두 트랙은 최종 단계에서 시작 컨텍스트로 통합된다.

```
Phase 0: 세계관 모듈 바인딩
    │
    ├── [세계 구조 트랙] ──────────────────────────────────────┐
    │   Phase 1: 세계 시드 생성                                 │
    │   (장소, 세력, 갈등 시드, 전역 이벤트 시드)               │
    │                                                          │
    └── [캐릭터 트랙] ─────────────────────────────────────────┤
        Phase 2: 캐릭터 개념 확인                               │
        Phase 3: 아키타입 선택 (플레이어 결정)                  │
        Phase 4: 능력치 배분 (플레이어 결정)                    │
        Phase 5: 스킬 선택 (플레이어 결정)                      │
        Phase 6: 배경 정의 (플레이어 결정)                      │
        Phase 7: 초기 장비 선택 (플레이어 결정)                 │
        Phase 8: 캐릭터 확정                                    │
                                                               │
Phase 9: 시작 컨텍스트 통합 ◄──────────────────────────────────┘
```

## 4.1 Phase 0: 세계관 모듈 바인딩

Creator Engine은 가장 먼저 `world_module`을 로드하고 유효성을 확인한다.

- `module.yaml`에서 엔진 버전 호환성(`engine_version`)을 확인한다.
- 모듈이 제공하는 아키타입 목록, 스탯 명칭, 스킬 목록, 장소 템플릿, 세력 목록을 메모리에 올린다.
- 모듈이 제공하지 않는 요소는 `modules/generic/`의 기본값을 사용한다.
- 모듈이 없으면 `generic` 모듈만으로 생성을 진행하고, GM에게 고지한다.

## 4.2 Phase 1: 세계 시드 생성

`creation_params`의 `campaign_scale`과 모듈의 `content/` 데이터를 읽어 WorldSeed를 구성한다.

**장소 초기화:**
- 모듈의 `locations.yaml`에서 시작 지역과 인접 지역을 선발한다.
- 캠페인 규모(`small` / `medium` / `large`)에 따라 포함 장소 수를 조정한다.
- 시작 장소(`is_starting_area: true`)는 반드시 하나 이상 지정한다.

**세력 초기화:**
- 모듈의 `factions.yaml`에서 캠페인 규모에 적합한 세력을 포함한다.
- 각 세력의 초기 영향력과 플레이어 우호도는 모듈 정의를 따른다.
- 세력 간 관계는 모듈이 정의한 기본 관계에서 시작한다.

**갈등 시드 생성:**
- 세력 간 목표 충돌을 분석하여 최소 2개 이상의 갈등 시드를 생성한다.
- 갈등 시드는 결말을 예정하지 않으며, 전개 가능성의 씨앗만을 기술한다.
- 플레이어가 이 갈등에 어떻게 개입할지는 기술하지 않는다.

**전역 이벤트 시드 생성:**
- 캠페인 초기에 진행 중인 배경 사건을 1~3개 생성한다.
- 각 이벤트는 트리거 조건과 예상 카운트다운을 명시한다.
- Shadow Engine이 관리할 숨겨진 타이머 후보를 포함할 수 있다.

## 4.3 Phase 2: 캐릭터 개념 확인

`player_intent`를 분석한다. 다음 두 경우를 처리한다.

**입력이 명확한 경우:** 모듈이 지원하는 아키타입과 비교한다. 정확히 일치하지 않아도 가장 가까운 아키타입을 제시하고 플레이어가 선택하도록 한다.

**입력이 모호하거나 누락된 경우:** 즉시 `clarification_request`를 생성한다. 요청은 1~3개의 구체적 질문으로 한정한다. 임의로 개념을 보완하지 않는다.

## 4.4 Phase 3: 아키타입 선택

모듈의 `archetypes.yaml`에서 플레이어 개념에 부합하는 아키타입 목록을 제시한다.

- 제시 형식: 아키타입 이름, 한 줄 설명, 핵심 스탯, 시작 스킬 예시.
- 선택은 반드시 플레이어가 한다. Creator Engine은 추천할 수 있으나 결정하지 않는다.
- 모듈이 제공하지 않는 아키타입은 생성하지 않는다.

## 4.5 Phase 4: 능력치 배분

선택된 아키타입의 기본 능력치 값과 배분 가능한 포인트를 제시한다.

- 총 배분 포인트 및 각 능력치의 최소/최대 허용값은 모듈의 `stats.yaml`을 따른다.
- 모듈이 별도로 정의하지 않은 경우 `generic` 모듈의 6속성 체계를 사용한다.
- 배분은 플레이어가 직접 수행한다. 추천 배분값을 제시할 수 있으나 자동 적용하지 않는다.
- 배분 결과가 모듈의 허용 범위를 벗어나면 즉시 오류를 알리고 재배분을 요청한다.

## 4.6 Phase 5: 스킬 선택

모듈의 `skills.yaml`에서 아키타입이 접근 가능한 스킬 목록을 제시한다.

- 아키타입마다 선택 가능한 스킬 수와 숙련도 초기값은 모듈이 정의한다.
- 플레이어가 선택하지 않은 스킬은 숙련도 0으로 기록된다.
- 선택은 플레이어가 한다.

## 4.7 Phase 6: 배경 정의

플레이어에게 세 가지 배경 요소의 입력을 요청한다.

| 항목 | 설명 | 처리 |
|------|------|------|
| `origin` | 캐릭터의 출신 및 과거 | 플레이어 자유 기술 또는 모듈 제공 목록에서 선택 |
| `motivation` | 캠페인을 시작하는 이유 | 플레이어 자유 기술 |
| `bonds` | 세계와 연결된 관계 (1~3개) | 플레이어 자유 기술. 세계 시드의 장소 또는 세력과 연결될 수 있다. |

`background.secrets`는 GM 전용이다. 플레이어가 작성한 내용을 그대로 보존하며 Creator Engine이 내용을 수정하지 않는다.

## 4.8 Phase 7: 초기 장비 선택

모듈의 아키타입 정의에서 제공하는 시작 장비 패키지를 제시한다.

- 패키지가 여럿인 경우 플레이어가 선택한다.
- 모듈이 개별 아이템 선택을 허용하는 경우 그 절차를 따른다.
- 장비 패키지 외 추가 장비는 생성하지 않는다.

## 4.9 Phase 8: 캐릭터 확정

수집된 모든 선택값을 CoreSpec §7.1.1의 캐릭터 시트 구조에 따라 컴파일한다.

- 파생 수치(health_max, defense 등)는 모듈의 계산식으로 자동 산출한다.
- 식별자는 CoreSpec §14.4의 규칙에 따라 부여한다: `char_{캠페인_약어}_{순번}`.
- 완성된 시트를 플레이어에게 제시하고 최종 확인을 받는다.
- 플레이어가 수정을 요청하면 해당 Phase로 되돌아간다.

## 4.10 Phase 9: 시작 컨텍스트 통합

WorldSeed와 character_sheet를 결합하여 StartingContext를 생성한다.

- 캐릭터의 `origin`과 `bonds`를 세계 시드의 장소 및 세력과 연결한다.
- Director Engine이 즉시 첫 장면을 시작할 수 있는 상황 요약을 작성한다.
- 플레이어의 첫 행동이 무엇인지는 기술하지 않는다.
- 시작 장면은 열린 상태로 남긴다.

---

# 5. 데이터 구조 정의

## 5.1 CreationParams 스키마

```yaml
creation_params:
  campaign_id: string                # 캠페인 고유 식별자
  campaign_scale: small | medium | large   # 캠페인 규모
  difficulty: easy | normal | hard   # 전반적 난이도
  genre_tags: list[string]           # 장르 태그 (world_module이 정의한 목록 내에서)
  session_target: int | null         # 목표 세션 수 (null이면 개방형)
  language: string                   # 서술 언어 (기본값: 세계관 모듈 language 값)
```

## 5.2 WorldSeed 스키마

WorldSeed는 World Engine이 초기 상태를 구성하는 데 사용하는 구조적 데이터다. WorldSeed 자체는 WorldState가 아니며, World Engine이 이를 수신하여 최초 WorldState를 초기화한다.

```yaml
world_seed:
  metadata:
    campaign_id: string
    world_module: string             # 활성화된 모듈 식별자
    created_at: string               # ISO 8601
    engine_version: string
  
  world_name: string                 # 세계의 명칭
  world_description: string          # 세계 개요 (1~3문장)
  
  locations:
    - id: string                     # loc_{캠페인_약어}_{순번}
      name: string
      description: string
      connected_to: list[string]     # 연결된 location ID 목록
      is_starting_area: bool
      tags: list[string]             # 예: ["urban", "fortified", "ancient"]
  
  factions:
    - id: string                     # fac_{캠페인_약어}_{순번}
      name: string
      description: string
      initial_disposition_to_player: int   # -100 ~ +100, 기본값: 0
      initial_influence: int               # 0 ~ 100
      territory: list[string]             # 지배 장소 ID 목록
      primary_goal: string                 # 세력의 현재 주요 목표
      relations:                           # 다른 세력과의 초기 관계
        - faction_id: string
          disposition: int               # -100 ~ +100
  
  conflict_seeds:
    - id: string                     # conf_{캠페인_약어}_{순번}
      description: string            # 갈등 개요 (결말 없이 기술)
      parties_involved: list[string] # faction ID 목록
      intensity: low | medium | high
      type: political | military | social | economic | supernatural | unknown
  
  global_event_seeds:
    - id: string                     # evt_{캠페인_약어}_{순번}
      name: string
      description: string
      trigger_condition: string
      estimated_countdown_days: int | null   # 세계 내 일 단위, null이면 비정형
      visibility: visible | hidden           # hidden이면 Shadow Engine 관할
  
  timeline_anchor:
    starting_epoch_seconds: int
    starting_formatted: string       # 예: "Year 412, Day 80, 09:00"
    starting_season: spring | summer | autumn | winter
    starting_cycle: day | twilight | night
```

## 5.3 StartingContext 스키마

```yaml
starting_context:
  campaign_id: string
  character_id: string               # 연결된 캐릭터 시트 ID
  starting_location_id: string       # world_seed의 location ID
  
  scene_summary: string              # Director Engine에 전달하는 첫 장면 상황 요약 (3~8문장)
  immediate_situation: string        # 캐릭터가 지금 이 순간 처한 상황 (중립적 서술)
  
  active_hooks:                      # 캐릭터 배경에서 파생된 즉각적 연결고리
    - id: string
      description: string
      related_entity_id: string | null   # faction, location ID (nullable)
      urgency: immediate | near_term | background
  
  open_questions:                    # 캠페인 초기 답이 열린 상황들 (결말 없이 기술)
    - string
```

---

# 6. 플레이어 자율성 보장 규칙

이 섹션의 규칙은 CoreSpec §3.1(원칙 1: 플레이어 자율성 최우선)을 Creator Engine에 구체적으로 적용한다.

## 6.1 선택의 주체

캐릭터 생성의 모든 Phase에서 최종 선택권은 플레이어에게 있다. Creator Engine이 취할 수 있는 행동은 다음으로 제한된다.

| 허용 | 금지 |
|------|------|
| 선택 가능한 옵션 목록 제시 | 특정 옵션을 자동으로 선택 |
| 선택의 게임 내 의미 설명 | 선택의 결과가 더 낫다고 유도 |
| 모듈 제약에 의한 비가용 옵션 명시 | 미입력 항목을 임의의 기본값으로 채움 |
| 일관성 오류가 있을 때 지적 | 일관성을 이유로 플레이어 선택 번복 |

## 6.2 미결정 항목 처리

플레이어가 특정 항목을 결정하지 않은 경우:
- 해당 항목은 `null` 또는 빈 값으로 유지한다.
- Creator Engine은 반드시 명시적으로 해당 항목의 입력을 요청한다.
- 입력 없이 다음 Phase로 진행하지 않는다.

단, 플레이어가 명시적으로 "나중에 결정하겠다"고 선언한 항목은 임시 미확정 상태로 Phase를 넘길 수 있다. 이 경우 character_sheet에 `pending: true` 플래그를 부여하고 Save Engine에 미완성 상태임을 알린다.

## 6.3 적합성 충돌 처리

플레이어의 의도가 활성화된 세계관 모듈과 충돌하는 경우:

1. 충돌이 가능한 가장 가까운 유효한 형태로 조정할 수 있는지 먼저 탐색한다.
2. 조정이 가능하면 플레이어에게 조정안을 제안하고 승인을 받는다.
3. 조정이 불가능하면 충돌 이유를 명확히 설명하고 대안을 제시한다.
4. 어떤 경우에도 플레이어의 의도를 무언의 거절로 처리하지 않는다.

---

# 7. 세계관 독립성 규칙

Creator Engine은 CoreSpec §16.2의 세계관 독립성 원칙을 다음과 같이 준수한다.

## 7.1 모듈 경계 준수

- 활성화된 세계관 모듈이 정의하지 않은 아키타입, 스탯 명칭, 스킬, 세력, 장소는 생성하지 않는다.
- 세계관 모듈이 제공하지 않는 규칙은 `modules/generic/`의 기본 규칙을 적용한다.
- generic 규칙도 적용 불가능한 상황이면 GM에게 명시적으로 고지한다.

## 7.2 세계관 가정 금지

WorldSeed 생성 시 활성화된 모듈의 `content/` 데이터 외 요소는 추가하지 않는다. 예시:

- **금지:** 모듈이 정의하지 않은 특정 종족의 마을을 자의적으로 생성
- **금지:** 모듈이 정의하지 않은 마법 시스템이 있다고 전제하여 능력치를 구성
- **허용:** 모듈의 `factions.yaml`에 정의된 세력만으로 갈등 시드를 구성

## 7.3 장르 중립 생성

동일한 Creator Engine이 판타지, SF, 공포, 현대 세계관에 모두 적용 가능해야 한다. WorldSeed 스키마와 CharacterSheet 스키마의 구조는 세계관에 관계없이 동일하다. 세계관에 따른 차이는 모듈이 채워 넣는 값에 의해서만 발생한다.

---

# 8. 검증 규칙

QA Engine은 Creator Engine의 출력에 대해 다음 항목을 검증한다.

| 규칙 ID | 검증 항목 | 위반 시 처리 |
|---------|-----------|-------------|
| `SV-CRE-001` | character_sheet의 모든 필수 필드가 채워져 있는가 (`pending: true` 항목 제외) | Error — 생성 완료 거부, 미완성 항목 목록 반환 |
| `SV-CRE-002` | character_sheet의 능력치 값이 모듈 허용 범위 내에 있는가 | Error — 범위 위반 항목 명시 후 재입력 요청 |
| `SV-CRE-003` | world_seed에 `is_starting_area: true`인 location이 최소 1개 이상 존재하는가 | Error — 시작 지역 지정 요청 |
| `SV-CRE-004` | world_seed의 faction relations가 상호 참조 무결성을 갖추고 있는가 (존재하지 않는 faction_id를 참조하지 않는가) | Warning — 참조 오류 세력 목록 반환, 계속 진행 허용 |
| `SV-CRE-005` | starting_context의 starting_location_id가 world_seed의 location ID 목록 내에 있는가 | Error — 시작 위치 불일치 보고 |
| `SV-CRE-006` | world_seed의 conflict_seeds가 결말 또는 캠페인 전개를 예정하는 서술을 포함하지 않는가 | Warning — 해당 서술 플래그 후 GM 확인 요청 |
| `SV-CRE-007` | character_sheet에 NPC 데이터 구조(`npc` 타입 식별자)가 포함되어 있지 않는가 | Fatal — 즉시 거부, NPC Engine 위임 안내 |
| `SV-CRE-008` | 생성 과정에서 플레이어가 결정하지 않은 선택이 AI에 의해 채워졌는가 | Fatal — 즉시 거부, 해당 항목 목록 반환 |

---

**END OF CreatorEngine v1.0.0**
