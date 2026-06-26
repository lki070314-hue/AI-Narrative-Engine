# NPC Engine Specification

**문서 식별자:** `engines/NPC/NPCEngine.md`
**버전:** v1.0.0
**상태:** Draft
**최종 수정:** 2026-06-26
**참조:** `core/CoreSpec.md` §5.6, §11.4, §12.2.4, §13.2

---

## 목차

1. [목적](#1-목적)
2. [책임 범위](#2-책임-범위)
3. [아키텍처 및 인터페이스](#3-아키텍처-및-인터페이스)
4. [NPC 데이터 구조](#4-npc-데이터-구조)
5. [NPC 생성 프로토콜](#5-npc-생성-프로토콜)
6. [의사결정 시스템](#6-의사결정-시스템)
7. [대화 생성 프로토콜](#7-대화-생성-프로토콜)
8. [관계망 및 호감도 시스템](#8-관계망-및-호감도-시스템)
9. [지식 및 비밀 관리](#9-지식-및-비밀-관리)
10. [NPC 상태 추적](#10-npc-상태-추적)
11. [자율 행동 프로토콜](#11-자율-행동-프로토콜)
12. [검증 규칙](#12-검증-규칙)

---

# 1. 목적

NPC Engine은 캠페인에 등장하는 모든 비플레이어 캐릭터(Non-Player Character)의 생성, 행동 결정, 대화 생성, 관계 변화, 상태 추적을 담당하는 엔진이다.

NPC는 플레이어를 위한 도구가 아니다. 각 NPC는 자신의 목표와 이익을 추구하며, 그것이 플레이어와 충돌할 수 있다. NPC Engine은 이 자율성을 일관되게 구현하여 세계에 설득력을 부여한다.

---

# 2. 책임 범위

## 2.1 NPC Engine이 하는 것

| 항목 | 설명 |
|------|------|
| **NPC 인스턴스 생성** | 세계관 모듈 템플릿과 Director Engine 요청을 기반으로 NPC를 생성한다. |
| **반응 생성** | 플레이어 행동에 대한 NPC의 대사, 신체 행동, 감정 반응을 결정한다. |
| **의사결정** | 성격 특성, 목표, 이익을 기반으로 NPC의 행동 방침을 결정한다. |
| **호감도 관리** | 플레이어와의 상호작용 결과에 따라 호감도 수치를 갱신한다. |
| **지식 접근 제어** | NPC가 보유한 정보의 공개 여부를 등급별로 엄격히 제어한다. |
| **상태 추적** | 생명, 건강, 감정 상태를 실시간으로 갱신하고 보존한다. |
| **자율 행동 처리** | 시간 경과 시 각 NPC의 목표에 따른 자율 행동 결과를 계산한다. |
| **WorldEffect 발행** | NPC 이동, 사망, 세력 기여 등 세계 변화를 World Engine에 전달한다. |

## 2.2 NPC Engine이 하지 않는 것

| 금지 항목 | 이유 |
|-----------|------|
| **플레이어 캐릭터 행동·대사 작성** | 플레이어 자율성 최우선 원칙(CoreSpec §3.1) 위반이다. |
| **메타 정보 노출** | NPC가 알 수 없는 수치, 숨겨진 사실, 타 장소 사건을 대사에 포함하지 않는다. |
| **드라마를 위한 캐릭터 배신** | NPC의 목표·성격과 모순된 행동을 서사적 효과를 위해 강제하지 않는다. |
| **임무 완료·실패 확정** | 임무 상태 판정은 Mission Engine에 위임한다. |
| **세계 상태 직접 수정** | WorldEffect 이벤트를 발행할 뿐이며 WorldState를 직접 변경하지 않는다. |
| **서술 텍스트 생성** | NPC 반응을 최종 내러티브로 변환하는 것은 Director Engine의 역할이다. |

---

# 3. 아키텍처 및 인터페이스

## 3.1 다른 엔진과의 관계

```
[세계관 모듈 content/npcs.yaml]
          │ 사전 정의 NPC 초기화
          ▼
   [NPC Engine] ◄──── NPCEngineQuery ◄──── [Director Engine]
          │                                       ▲
          │  npc_response                         │ npc_response
          │  updated_npc_state                    │ (통합 후 서술)
          │  npc_world_effects ──────────────► [World Engine]
          │                                  (WorldEffect 발행)
          │  mission_events ─────────────────► [Mission Engine]
          │                                  (NPC 사망·완료 알림)
          │  updated_npc_states ─────────────► [Save Engine]
          │
          ▼
   [Memory Engine] ←── 세션 종료 시 상호작용 기록 전달
```

## 3.2 인터페이스 계약

### 3.2.1 입력 (Inputs)

| 변수명 | 타입 | 필수 | 설명 |
|--------|------|------|------|
| `npc_engine_query` | NPCEngineQuery | Y | Director Engine이 보내는 처리 요청. 타입에 따라 반응·대화·자율 행동·생성을 처리한다. |
| `npc_states` | List[NPCState] | Y | 현재 세션에서 관리 중인 모든 NPC의 상태. Save Engine에서 복원되거나 이번 세션에 생성된 상태다. |
| `world_state` | WorldState | Y | World Engine이 관리하는 현재 세계 상태. NPC의 위치·세력 상태 확인에 사용한다. |
| `time_advance_notification` | TimeAdvanceNotification \| null | N | World Engine이 시간 경과를 알릴 때 전달. 자율 행동 계산을 트리거한다. |
| `active_module` | ModuleContext | Y | 활성화된 세계관 모듈. 아키타입 정의, 어조 가이드, NPC 템플릿을 포함한다. |

### 3.2.2 NPCEngineQuery 스키마

```yaml
npc_engine_query:
  type: reaction | dialogue | create | autonomous_action
  npc_id: string | null          # create 타입이면 null (신규 생성)
  trigger_action: ResolvedAction | null   # 반응의 원인 행동. 자율 행동이면 null
  world_state: WorldState
  scene_context: SceneState | null        # 장면 문맥. 자율 행동이면 null
  creation_params:               # type: create일 때만 사용
    role: major | minor | background
    archetype: string            # 세계관 모듈이 정의한 아키타입 ID
    location_id: string
    faction_id: string | null
    context_hint: string         # 이 NPC가 등장하는 상황 설명
```

### 3.2.3 출력 (Outputs)

| 변수명 | 타입 | 조건 | 설명 |
|--------|------|------|------|
| `npc_response` | NPCResponse | reaction·dialogue 타입 | NPC 대사 블록, 신체 행동 묘사, 감정 플래그. |
| `updated_npc_state` | NPCState | 모든 타입 | 호감도·감정·기억·생명 상태 등이 반영된 갱신된 NPC 상태. |
| `npc_world_effects` | List[WorldEffect] | 세계 변화 발생 시 | World Engine에 전달할 NPC 행동 유발 변화 목록. |
| `mission_events` | List[MissionEvent] | NPC 사망·임무 연관 행동 시 | Mission Engine에 전달할 이벤트. |
| `new_npc_state` | NPCState | create 타입 | 새로 생성된 NPC의 초기 상태. |

---

# 4. NPC 데이터 구조

## 4.1 NPCState 스키마

```yaml
npc:
  # 1. 기본 식별 정보
  id: string                         # npc_{캠페인_약어}_{순번}
  name: string                       # 플레이어에게 노출되는 이름
  role: major | minor | background
  archetype: string                  # 세계관 모듈 정의 직업·역할 유형
  faction_id: string | null          # 소속 세력 ID (없으면 null)
  created_session: int               # 최초 생성 세션 번호

  # 2. 성격 및 행동 특성
  behavioral_traits:
    - trait_id: string               # 예: suspicious, greedy, cowardly, loyal
      intensity: int                 # 1 (매우 약함) ~ 5 (극도로 강함)
  moral_alignment: string            # 세계관 모듈이 정의한 도덕 성향

  # 3. 동기 및 목표
  goals:
    primary:
      id: string
      description: string
      status: active | completed | failed
    secondary:
      - id: string
        description: string
        status: active | completed | failed

  # 4. 관계망
  disposition:
    toward_player: int               # -100 ~ +100, 초기값: 세력 기반 기본값
    trust_permanent_debuff: bool     # 거짓말 적발로 인한 영구 신뢰 제한 여부
    toward_factions:
      - faction_id: string
        value: int                   # -100 ~ +100
    toward_npcs:
      - npc_id: string
        value: int                   # -100 ~ +100
        relationship_type: string    # 예: ally, rival, subordinate, mentor

  # 5. 지식 및 비밀
  knowledge:
    public:
      - fact_id: string
        content: string
    private:
      - fact_id: string
        content: string
        required_disposition: int    # 공개 최소 호감도 (기본값: 40)
    secret:
      - fact_id: string
        content: string
        unlock_condition: string

  # 6. 현재 동적 상태
  current_state:
    life_status: alive | unconscious | dead
    health_status: healthy | injured | critical
    emotional_state: string          # 예: calm, suspicious, angry, terrified, grieving
    location_id: string

  # 7. 단기 상호작용 기억
  recent_interactions:               # 최대 5개 보존 (major는 세션 무제한)
    - session_id: int
      timestamp: string
      interaction_type: speech | trade | combat | favor | betrayal | witness
      summary: string
      lie_detected: bool
```

## 4.2 NPC 역할 등급 분류

| 등급 | 정의 | 스키마 상세도 | 기억 보존 | 특이사항 |
|------|------|--------------|-----------|----------|
| **Major** | 스토리 핵심 인물, 퀘스트 제공자, 주요 적대자 | 전체 스키마 | 캠페인 전 기간 영구 보존 | Memory Engine Tier 1 대상 후보 |
| **Minor** | 상인, 단기 정보원, 경비 대장 등 | 간략 스키마 (지식 최소화, 관계는 플레이어 중심만) | 최근 5세션 후 요약 압축 | 조건 충족 시 Major로 승격 가능 |
| **Background** | 행인, 군중, 일반 적 | 최소 스키마 (id, name, life_status, location_id만) | 세션 종료 시 소멸 | 세계관 모듈 템플릿으로 즉시 생성 |

---

# 5. NPC 생성 프로토콜

Creator Engine은 NPC를 생성하지 않는다. NPC 인스턴스 생성은 NPC Engine의 전담 영역이다.

## 5.1 사전 정의 NPC 초기화 (세션 최초 시작 시)

캠페인 첫 세션 시작 시 NPC Engine은 다음 순서로 사전 정의 NPC를 초기화한다.

```
1. 세계관 모듈의 content/npcs.yaml 로드
2. 각 NPC 항목을 NPCState 스키마에 맵핑
3. faction_id가 있는 NPC의 disposition.toward_player 초기값을
   WorldState의 해당 faction.disposition_to_player 값으로 설정
4. 각 NPC의 current_state.location_id를 WorldState locations에 등록
   (World Engine에 entity_position WorldEffect 발행)
5. 식별자 부여: npc_{캠페인_약어}_{순번}
6. 초기화된 NPCState 목록을 Save Engine에 전달
```

## 5.2 동적 NPC 생성 (Director Engine 요청 시)

Director Engine이 `type: create` 쿼리를 전달하면 NPC Engine은 다음 절차로 NPC를 생성한다.

```
1. creation_params.archetype으로 세계관 모듈의 archetypes.yaml 조회
2. 아키타입 기본값(성격 특성, 기본 스탯, 지식 템플릿)을 로드
3. role에 따라 스키마 상세도 결정 (§4.2 참조)
4. creation_params.faction_id가 있으면 해당 세력의 disposition을
   disposition.toward_player 초기값으로 설정
5. context_hint를 기반으로 goals.primary 설정
   (minor/background는 단순 목표 1개만)
6. 식별자 부여 후 World Engine에 entity_position WorldEffect 발행
7. new_npc_state 반환
```

**Background NPC 즉석 생성:** Director Engine이 즉각적인 배경 NPC를 요청하면 세계관 모듈의 background 템플릿 목록에서 상황에 맞는 템플릿을 선택하고 즉시 반환한다. 이 NPC는 세션 종료 시 자동 소멸한다.

## 5.3 NPC 승격 (등급 변경)

다음 조건 중 하나가 충족되면 Director Engine이 승격을 요청할 수 있다.

| 조건 | 승격 방향 |
|------|-----------|
| Minor NPC와의 상호작용이 3세션 이상 지속 | Minor → Major |
| Background NPC가 주요 사건의 핵심 증인이 됨 | Background → Minor |
| Major NPC가 모든 목표를 완료하고 스토리에서 물러남 | Major → Minor (단, 기억은 보존) |

승격 시 누락된 스키마 필드를 채우고 식별자는 유지한다.

---

# 6. 의사결정 시스템

## 6.1 성격 특성 메커니즘

`behavioral_traits`의 각 특성은 NPC가 결정을 내릴 때 가중치로 작용한다.

- intensity 1~3: 성격을 색채하는 수준. 기본 논리적 판단을 대체하지 않는다.
- intensity 4~5: 해당 특성이 NPC의 행동 방식을 지배한다. 다른 고려보다 우선한다.

**intensity 5 예시:**

| 특성 | intensity 5 효과 |
|------|-----------------|
| `greedy` | 금전적 이득이 보이면 도덕적 판단을 무시하고 우선 획득을 시도한다 |
| `cowardly` | 위협 상황에서 즉각 복종하거나 도주를 선택한다. 저항하지 않는다 |
| `loyal` | 소속 세력이나 지정 대상의 명령을 다른 모든 이익보다 우선한다 |
| `suspicious` | 모든 제안을 먼저 의심하고 검증 시도 후 응답한다 |

## 6.2 의사결정 알고리즘

플레이어 행동(`resolved_action`)이 입력되면 NPC Engine은 다음 순서로 의사결정을 수행한다.

```
1. 상황 인식
   └── 플레이어의 행동이 자신의 goals, faction 이익에
       득이 되는가, 실이 되는가 판별

2. 핵심 이익 충돌 검사
   └── 플레이어 행동이 NPC의 생존·주요 목표·핵심 가치와 충돌하면
       disposition 수치와 무관하게 저항 또는 거절을 선택
   └── "disposition이 +90이어도 자신을 해치는 행동에 협조하지 않는다"

3. 성격 필터
   └── behavioral_traits를 순회하며 intensity ≥ 4인 특성의 행동 패턴 우선 적용
   └── 충돌하는 특성이 있으면 intensity가 더 높은 것을 우선

4. 감정 상태 갱신
   └── 현재 상황과 직전 emotional_state를 기반으로 새 감정 상태 결정
   └── angry/terrified로 전환되면 합리적 판단 포기 → 공격 또는 도주 선택

5. 반응 생성
   └── 최종 결정된 행동·감정을 npc_response로 출력
```

---

# 7. 대화 생성 프로토콜

## 7.1 대화 변조 규칙

NPC의 말투는 다음 세 변수의 합산으로 결정된다.

```
[아키타입 기본 말투 (세계관 모듈 정의)]
        + disposition → 친밀함 / 격식 / 적대감 수준
        + behavioral_traits → 어조 특수 단서
        + health_status → 신체 제약
        = 최종 대사 출력
```

### disposition에 따른 어조

| disposition 범위 | 어조 특성 |
|-----------------|-----------|
| +40 이상 | 협조적, 따뜻함. 먼저 도우려는 의향 표시. |
| -19 ~ +39 | 비즈니스적, 중립. 불필요한 감정 묘사 없음. |
| -20 이하 | 냉소적, 경고조. 문장이 짧아짐. 직접적 위협 가능. |

### health_status에 따른 제약

| 상태 | 대사 변화 |
|------|-----------|
| `injured` | 숨을 헐떡임. 문장 사이 신음 묘사. |
| `critical` | 단어 단위로 끊김. 비선형 구조. 정보 전달 극도로 어려워짐. |
| `unconscious` | 대사 생성 불가. |
| `dead` | 대사 생성 불가. |

## 7.2 출력 포맷

NPC 대사는 `[DIA]` 블록 형식으로 출력한다.

```markdown
[DIA]
캐릭터명: *행동·표정 묘사* "대사 텍스트"
[/DIA]
```

**대사 생성 절대 금지 사항:**

- 플레이어 캐릭터의 대사·독백·감정을 대신 작성하는 것
- NPC가 알 수 없는 정보(메타 정보, 타 장소 사건, 다른 NPC의 비밀)를 대사에 포함하는 것
- NPC가 자신의 `secret` 지식을 잠금 해제 조건 없이 자발적으로 언급하는 것

---

# 8. 관계망 및 호감도 시스템

## 8.1 호감도 변경 공식

플레이어 행동 결과에 따라 `disposition.toward_player`가 갱신된다.

| 행동 유형 | 기본 변동폭 | 조건 |
|-----------|-------------|------|
| NPC의 primary goal 달성 조력 | +20 ~ +40 | NPC 생명·핵심 가치 연관 시 최대폭 |
| 소소한 도움 (아이템 전달, 단순 부탁) | +5 ~ +15 | greedy·selfish 특성 보유 시 반감 |
| NPC 이익·세력에 반하는 행동 | -10 ~ -30 | 고의성 입증 시 변동폭 두 배 |
| 거짓말 적발 (`lie_detected: true`) | **즉시 -40** | **`trust_permanent_debuff: true` 영구 적용** |
| 직접 공격·적대 세력 가담 | -50 ~ -100 | 즉시 적대 상태 전환 |

**거짓말 영구 디버프:** `trust_permanent_debuff: true`가 설정된 NPC는 이후 disposition 상승 최대치가 +20으로 제한된다. 거짓말한 사실 자체는 기억에서 삭제되지 않는다.

**disposition 경계 행동:**

| 수치 범위 | NPC 행동 경향 |
|-----------|--------------|
| +80 이상 | 생명을 위협받아도 플레이어를 돕는다 |
| +40 ~ +79 | 협력적. private 정보를 자발적으로 공유한다 |
| +10 ~ +39 | 거래적. 대가 없이 추가 도움 제공하지 않는다 |
| -9 ~ +9 | 완전 중립. 요청에만 반응한다 |
| -10 ~ -39 | 소극적 적대. 방해·비협조 행동 가능 |
| -40 ~ -79 | 적대적. 기회 시 해를 끼치려 한다 |
| -80 이하 | 깊은 원한. 적극적으로 제거를 시도한다 |

## 8.2 관계 전파

Major NPC와의 호감도 변화는 관계망을 통해 전파된다.

**NPC 간 전파:**
- NPC A와 B가 동맹(value ≥ 40)일 때 A의 호감도가 Δ만큼 변화하면 B도 Δ × 0.5만큼 변화한다.
- NPC A와 B가 적대(value ≤ -40)일 때 플레이어가 A를 도우면 B의 호감도는 Δ × -0.3만큼 변화한다.

**세력 전파:**
- World Engine이 세력 `controlling_faction` 변경을 보고하면, NPC Engine은 해당 세력 소속 NPC 전체의 `disposition.toward_player` 초기값을 새 지배 세력의 값으로 보정한다.
- 이미 개인 상호작용으로 크게 변한 NPC(변동폭 ±30 이상)는 보정에서 제외한다.

---

# 9. 지식 및 비밀 관리

## 9.1 지식 등급 구조

```
┌──────────────────────────────────────────────────┐
│                  PUBLIC KNOWLEDGE                │
│          질문 시 조건 없이 즉시 공개             │
├──────────────────────────────────────────────────┤
│                  PRIVATE KNOWLEDGE               │
│    disposition ≥ 40 이거나 신뢰 증명 시 공개     │
├──────────────────────────────────────────────────┤
│                  SECRET KNOWLEDGE                │
│  자발적 공개 불가. 특수 조건 충족 시에만 획득    │
└──────────────────────────────────────────────────┘
```

## 9.2 Secret 잠금 해제 조건

NPC는 `secret` 정보를 자발적으로 공개하지 않는다. 플레이어는 다음 방법으로만 획득할 수 있다.

| 방법 | 처리 | 부작용 |
|------|------|--------|
| **협박 판정** | 사회 스킬 판정. 성공 시 공개 | 즉시 disposition -30 ~ -60. 관계 회복 어려움 |
| **회유·거래** | NPC가 요구하는 상응 대가 제공 | 대가 이행 실패 시 disposition 폭락 |
| **물증 제시** | 해당 비밀과 연관된 결정적 증거 제시 | NPC가 부인하는 대신 입장을 전환할 수 있음 |
| **정신 지배·특수 능력** | 세계관 모듈이 정의한 특수 능력 사용 | 능력 조건 충족 시 공개. 인게임 결과는 별도 |

---

# 10. NPC 상태 추적

## 10.1 상태 정의

**생명 상태 (life_status):**

| 상태 | 설명 |
|------|------|
| `alive` | 정상 활동 가능 |
| `unconscious` | 기절. 대화·행동 불가. 주변 사건 인지 불능 |
| `dead` | 사망. 영구적 상태. 복원 불가 (세계관 모듈이 부활 메커니즘을 정의하지 않는 한) |

**건강 상태 (health_status):**

| 상태 | 설명 | 판정 영향 |
|------|------|-----------|
| `healthy` | 전투·정신력 저하 없음 | 없음 |
| `injured` | 부상 상태 | 능력 판정 -2 보정 |
| `critical` | 자력 행동 불능에 가까움 | 모든 판정 -4 보정. 정보 획득 극도로 어려움 |

**감정 상태 (emotional_state):**
- 대화 도중 실시간으로 변경된다.
- `angry` 또는 `terrified` 전환 시 합리적 판단 포기 → 공격 또는 도주를 우선 선택한다.
- 감정 상태는 단기 기억에 해당하며 세션 간 지속되지 않는다 (단, Major NPC의 `grieving`, `traumatized` 등 지속 감정은 예외).

## 10.2 사망 처리 프로토콜

NPC가 `dead` 상태로 전환되면 다음 절차를 즉시 수행한다.

```
1. life_status: dead 확정
2. World Engine에 entity_position WorldEffect 발행
   (해당 NPC를 current_occupants에서 제거)
3. Mission Engine에 npc_death 이벤트 발행
   (해당 NPC와 연관된 임무 상태 점검 요청)
4. Memory Engine에 사망 사실 기록 전달
   (Tier 1 세계 사건 후보로 마킹)
5. 이후 모든 NPC Engine 쿼리에서 해당 NPC를 비활성 처리
   (대화·행동 생성 불가)
```

사망한 NPC의 NPCState는 삭제하지 않는다. Save Engine에 `life_status: dead` 상태로 영구 보존한다. 세계는 해당 NPC의 부재에 반응한다(CoreSpec §7.4 준용).

---

# 11. 자율 행동 프로토콜

World Engine이 시간 경과를 보고하면 NPC Engine은 경과 시간 동안 각 NPC가 자율적으로 수행했을 행동을 계산한다.

## 11.1 TimeAdvanceNotification 스키마

```yaml
time_advance_notification:
  elapsed_seconds: int           # 경과 시간 (초)
  reason: session_start | downtime | scene_skip
  world_state: WorldState
```

## 11.2 자율 행동 계산 프로토콜

Major NPC에 대해서만 전체 계산을 수행한다. Minor NPC는 단순 상태 갱신만 처리한다. Background NPC는 처리하지 않는다.

```
경과 일수 = elapsed_seconds / 86400 (올림)

각 Major NPC에 대해:
  1. goals.primary.status: active 인지 확인
  2. 목표 달성을 위해 경과 시간 동안 취할 수 있는 행동 판별
     예: "목표: 상인 길드 장악" → 경과 3일 → 영향력 확대 활동
  3. 자원(world_state faction 데이터), 위치, 세력 관계 기반으로 결과 계산
  4. 결과를 WorldEffect 목록으로 생성
     예: NPC 이동 (entity_position), 세력 기여 (faction.resources 변화)
  5. npc_world_effects에 추가
```

## 11.3 자율 행동 제약

자율 행동 계산에서 다음은 허용되지 않는다.

| 제약 | 이유 |
|------|------|
| 플레이어가 해당 지역에 있을 때 중대한 행동 자동 확정 | 플레이어가 목격·개입할 기회를 보장해야 한다 |
| 캠페인 결말에 영향을 미치는 비가역적 행동 | Director Engine이 중재해야 하는 서사적 사건이다 |
| 플레이어 캐릭터에게 직접적 영향을 미치는 행동 | Director Engine을 통해야 한다 |

플레이어가 해당 장소에 있는 경우, 자율 행동 결과를 자동 확정하지 않고 Director Engine에 `autonomous_action` 쿼리로 전달하여 장면에 통합한다.

---

# 12. 검증 규칙

QA Engine은 NPC Engine의 출력에 대해 다음 항목을 검증한다.

| 규칙 ID | 검증 항목 | 위반 시 처리 |
|---------|-----------|-------------|
| `SV-NPC-001` | NPC의 대사·행동이 `behavioral_traits`와 정반대 반응을 보이는가 (예: cowardly: 5인 NPC가 영웅적 저항) | Warning — 트레이트 일관성 플래그, Director Engine에 검토 요청 |
| `SV-NPC-002` | `secret` 정보가 unlock_condition 없이 플레이어 대화에 노출되었는가 | Fatal — 즉시 출력 차단, 해당 대사 반환 |
| `SV-NPC-003` | `npc_response`에 플레이어 캐릭터의 행동·대사·감정이 포함되었는가 | Fatal — 즉시 출력 차단 |
| `SV-NPC-004` | `dead` 상태의 NPC에 대한 대화·행동 출력이 생성되었는가 | Error — 해당 NPC 비활성 처리 후 Director Engine에 재요청 |
| `SV-NPC-005` | NPC 사망 시 World Engine·Mission Engine에 이벤트 발행이 이루어졌는가 | Error — 즉시 발행 요청 |
| `SV-NPC-006` | `trust_permanent_debuff: true`인 NPC의 호감도가 +20을 초과하여 상승했는가 | Error — 호감도 +20으로 클램프 |
| `SV-NPC-007` | Background NPC의 NPCState에 세션 소멸 대상이 아닌 full 스키마 필드가 채워졌는가 | Warning — 메모리 비효율 경고 |
| `SV-NPC-008` | 플레이어가 존재하는 지역의 NPC 자율 행동이 자동 확정되었는가 | Error — Director Engine에 재위임 요청 |
| `SV-NPC-009` | NPC가 알 수 없는 정보(타 장소 사건, 다른 NPC의 secret)가 대사에 포함되었는가 | Error — 해당 대사 플래그 후 재생성 요청 |

---

**END OF NPCEngine v1.0.0**
