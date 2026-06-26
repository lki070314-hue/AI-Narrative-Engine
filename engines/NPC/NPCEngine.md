# NPC Engine Specification

## Status
Draft v0.1

---

# 1. Purpose

이 문서는 AI Narrative Engine의 **NPC Engine**에 대한 상세 설계 및 규격을 정의한다.
NPC Engine은 게임 내 모든 비플레이어 캐릭터(Non-Player Character)의 생성, 성격, 행동 결정, 대화 생성, 관계 변화 및 비밀 관리 등을 담당하는 핵심 엔진이다.

이 명세는 세계관 독립적으로 설계되었으며, 모듈 레이어에서 주입되는 세계관 설정에 따라 구동된다.

---

# 2. Architecture & Interface

NPC Engine은 플레이어 행동 분석 결과와 월드 상태를 입력받아 NPC의 인지, 심리 상태 갱신, 대화 및 행동 반응을 생성한다.

## 2.1 인터페이스 계약

### 2.1.1 입력 (Inputs)
NPC Engine은 실행 시 다음과 같은 데이터 객체를 전달받는다.

| 입력 변수명 | 타입 | 필수 여부 | 설명 |
|---|---|---|---|
| `resolved_action` | Action Object | Y | Compiler Engine에서 검증 및 해석이 완료된 플레이어의 행동 |
| `world_state` | WorldState | Y | 시간 흐름 및 환경 변화가 반영된 현재 세계 상태 |
| `npc_state` | NPCState | Y | 해당 씬에 참여 중이거나 전역 관리 중인 NPC의 이전 상태 |
| `active_module` | ModuleContext | Y | 현재 활성화된 세계관 모듈 규칙 (아키타입, 어조 가이드 등) |

### 2.1.2 출력 (Outputs)
NPC Engine은 처리를 마친 후 다음 데이터를 생성하여 Director Engine 및 Save Engine에 전달한다.

| 출력 변수명 | 타입 | 설명 |
|---|---|---|
| `npc_response` | Object | NPC의 외적 반응 (대사 블록, 신체적 행동 묘사) |
| `updated_npc_state` | NPCState | 감정 변화, 기억 추가, 관계(호감도) 변화가 반영된 NPC 상태 객체 |
| `npc_events` | List[Event] | NPC의 행동으로 인해 세계 상태에 미치는 영향 (예: NPC의 공격, 장소 이동 등) |

---

# 3. NPC Core Data Structure

NPC의 모든 상태는 YAML 형식으로 구조화하여 관리한다. 캐릭터의 중요도(`role`)에 따라 데이터 구조의 상세도를 차등 적용한다.

## 3.1 NPC State Schema

```yaml
npc:
  # 1. 기본 식별 정보
  id: string                   # 고유 식별자 (예: npc_guard_01, npc_merchant_mary)
  name: string                 # 플레이어에게 노출되는 이름
  role: major | minor | background # NPC 중요 등급
  archetype: string            # 세계관 모듈이 정의한 직업/역할 유형
  
  # 2. 성격 및 행동 특성
  behavioral_traits:           # 성격적 특성 목록
    - trait_id: string         # 특성 식별자 (예: suspicious, greedy)
      intensity: int           # 강도 (1 ~ 5)
  moral_alignment: string      # 도덕적 성향 (예: lawful_evil, chaotic_good 등)
  
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
        
  # 4. 관계망 (Relationship Network)
  disposition:
    toward_player: int         # 플레이어에 대한 호감도 (-100 ~ +100, 기본값 0)
    toward_factions:           # 세력별 호감도
      faction_id: int          # key: 세력 ID, value: 호감도 (-100 ~ +100)
    toward_npcs:               # 타 NPC와의 개별 관계
      npc_id: string           # key: 타 NPC ID, value: 관계 유형 및 수치
      
  # 5. 지식 및 비밀 정보 (Knowledge Base)
  knowledge:
    public:                    # 질문 시 즉각 공유하는 대중적 정보
      - fact_id: string
        content: string
    private:                   # 호감도 조건 충족 시 공유하는 비밀 정보
      - fact_id: string
        content: string
        required_disposition: int # 요구 호감도 수치 (기본값 40)
    secret:                    # 강압, 특수 상황에서만 추출 가능한 일급 비밀
      - fact_id: string
        content: string
        unlock_condition: string # 획득 조건 설명
        
  # 6. 현재 동적 상태
  current_state:
    life_status: alive | dead | unconscious
    health_status: healthy | injured | critical
    emotional_state: string    # 현재 감정 상태 (예: calm, angry, terrified)
    location_id: string        # 현재 위치 식별자
    
  # 7. 단기 상호작용 기억 (Session Memory)
  recent_interactions:       # 최근 플레이어와의 상호작용 요약 (최대 5개 보존)
    - session_id: int
      timestamp: string
      interaction_type: speech | trade | combat | favor | betrayal
      summary: string
      lie_detected: boolean    # 플레이어가 거짓말을 하고 NPC가 눈치챘는지 여부
```

## 3.2 NPC 역할 등급 분류 및 차등 처리 (ENG-0054)

NPC는 중요도에 따라 세 등급으로 분류하며, AI 컨텍스트 최적화와 기억 관리를 차별화한다.

| 분류 | 정의 | 상태 구조 상세도 | 기억 지속성 (Memory) | 비고 |
|---|---|---|---|---|
| **Major (주요 NPC)** | 스토리 중심 인물, 퀘스트 제공자, 주요 적대자 | 완전한 스키마 준수 (100% 정보 보존) | 장기 캠페인 전체 영구 유지 | 세션을 넘나드는 정밀한 대화와 음모 구성 |
| **Minor (주요 조연)** | 마을 상인, 단기 정보원, 경비 대장 등 | 생략형 스키마 (지식 최소화, 관계는 플레이어 중심만) | 최근 5세션 동안만 메모리 유지 후 요약 압축 | 필요시 Major 등급으로 승격 가능 |
| **Background (단역/배경)** | 길거리 행인, 일반 몬스터, 군중 | 최소 스키마 (ID, 이름, 현재 상태만 유지) | 세션 종료 시 소멸 (휘발성) | 템플릿 기반으로 동적 생성 및 소거 |

---

# 4. Personality & Decision-Making System (ENG-0050)

NPC는 정해진 성격 특성(`behavioral_traits`)과 동기(`goals`)에 기초하여 기계적으로 반응하지 않고 인간다운 판단을 내리도록 설계한다.

## 4.1 성격 특성 (Behavioral Traits) 메커니즘
성격 특성은 NPC가 결정을 내릴 때의 가중치로 작용한다.

- **성격 특성 강도(Intensity):** 1(매우 약함)에서 5(극도로 강함)로 설정한다.
  - 강도가 4 이상인 특성은 NPC의 기본 행동 양식을 지배한다. (예: `greedy: 5`인 NPC는 돈을 보면 이성을 잃고 도덕적 정렬을 위반하는 행동을 우선 선택한다.)
- **도덕적 성향(Moral Alignment):** 세계관 모듈에 맞춰 설정하되, 일반적인 질서/혼돈, 선/악 축을 기본으로 삼는다. NPC는 도덕적 성향에 반하는 플레이어의 행동을 목격할 시, 호감도(`disposition`)가 감소한다.

## 4.2 의사결정 알고리즘
플레이어의 행동(`resolved_action`)이 입력되면 NPC Engine은 다음 순서로 의사결정을 수행한다.

1. **상황 인식:** 플레이어의 행동이 자신의 목표(`goals`)나 세력(`factions`)에 득이 되는지 실이 되는지 판별한다.
2. **이익 충돌 계산:** 플레이어의 행동이 NPC의 핵심 이익(생존, 부, 신념)과 충돌하는 경우, 호감도(`disposition`)가 아무리 높더라도 **이익을 우선**하여 저항 또는 거절 반응을 선택한다.
3. **성격 필터링:** `behavioral_traits`에 따른 행동 방식을 결정한다.
   - 예: `suspicious` 강도가 높은 NPC는 플레이어의 제안을 일단 의심하고 검증하려 든다.
   - 예: `cowardly` 강도가 높은 NPC는 위협을 당하면 즉시 굴복하고 정보를 제공한다.
4. **최종 반응 생성:** 현재 감정 상태(`emotional_state`)를 결정하고, 이에 적합한 행동 및 감정 플래그를 `npc_response`로 출력한다.

---

# 5. Dialogue Generation Protocol (ENG-0051)

NPC의 대화는 성격, 호감도, 신체 상태에 따른 일관성을 지녀야 한다. AI는 반드시 아래 프로토콜을 준수하여 대화를 생성한다.

## 5.1 대화 변조 규칙 (Dialogue Modulators)

NPC의 말투(어조, 단어 선택, 문장 길이)는 다음 변수에 의해 동적으로 제어된다.

```
[Base NPC Archetype Speech Style] 
       + (disposition) ➔ 친밀함 / 격식 / 적대감 수준 결정
       + (behavioral_traits) ➔ 특정 어조 단서 (예: suspicious -> 말끝을 흐리거나 반문)
       + (health_status) ➔ 신체적 제약 반영 (예: injured -> 신음 소리, 짧은 문장)
       = 최종 Dialogue 출력
```

### 5.1.1 호감도(`disposition`)에 따른 어조
- **우호적 (+40 이상):** 협조적이고 따뜻한 단어 사용. 플레이어를 도우려는 의향을 적극 표시.
- **중립 (-19 ~ +39):** 상식적이고 비즈니스적인 태도. 불필요한 감정 묘사 없음.
- **적대적 (-20 이하):** 쌀쌀맞고 냉소적이거나 노골적으로 위협적인 말투. 문장이 짧아지거나 경고조의 표현 사용.

### 5.1.2 상태(`health_status`)에 따른 제약
- NPC가 `injured` 상태일 때: 대사 사이에 숨을 헐떡이거나 신음하는 묘사 추가.
- NPC가 `critical` 상태일 때: 대사가 단어 단위로 끊기며 극도로 비선형적인 대화 구조를 가짐.

## 5.2 출력 포맷 규칙
대사는 반드시 `core/OutputSpec.md`에 명세된 `[DIA]` 블록 양식을 사용한다.

```markdown
[DIA]
캐릭터명: *행동/표정 묘사* "대사"
[/DIA]
```

### 5.2.1 대화 생성 금지 사항 (Critical Constraints)
- **금지:** 플레이어 캐릭터의 대화나 독백을 대신 생성하는 것.
- **금지:** NPC가 알 수 없는 정보(메타 정보, 타 장소 사건)를 대사로 유출하는 것.

---

# 6. Relationship & Disposition Network (ENG-0052)

NPC 관계망은 세션 전체의 내러티브 깊이를 더하는 핵심 장치이다.

## 6.1 호감도 (Disposition) 변경 공식

플레이어의 행동 결과에 따라 호감도는 실시간으로 증감한다.

| 플레이어의 행동 유형 | 호감도 기본 변동폭 | 조건 및 예외 |
|---|---|---|
| NPC의 1차 목표(`primary goal`) 달성 조력 | +20 ~ +40 | NPC의 생명이나 가치관에 직결된 경우 최대폭 |
| NPC에게 소소한 도움 제공 (아이템 전달, 사소한 퀘스트) | +5 ~ +15 | NPC의 성향이 이기적(`greedy`, `selfish`)일 경우 반감 |
| NPC의 이익이나 세력에 반하는 행동 | -10 ~ -30 | 고의성이 입증될 경우 감소폭 배가 |
| **거짓말 적발 (`lie_detected: true`)** | **즉시 -40** | **영구적인 신뢰도 디버프 적용 (이후 호감도 상승 제한)** |
| 직접적인 공격 혹은 적대 세력 가담 | -50 ~ -100 | 즉시 적대 상태로 돌입 |

## 6.2 관계 전파 (Relationship Propagation)
주요 인물(`Major`)과의 호감도 변화는 그가 속한 세력 및 주변 인물에게 전파된다.

- NPC `A`와 `B`가 동맹 관계일 때, 플레이어가 `A`를 도우면 B의 호감도 역시 `A호감도 증가값 * 0.5` 만큼 증가한다.
- 플레이어가 특정 세력의 평판(`reputation`)을 크게 잃으면, 해당 세력에 속한 모든 NPC의 호감도(`disposition`) 기본값이 자동으로 하락 보정된다.

---

# 7. Motivation & Secrets Management (ENG-0055)

NPC가 가진 정보는 게임 진행의 단서가 되며, NPC의 내재 동기에 의해 접근성이 엄격하게 차단된다.

## 7.1 비밀 등급 및 잠금 해제 조건

NPC가 보유한 지식은 3단계로 엄격히 관리된다.

```
┌────────────────────────────────────────────────────────┐
│                   PUBLIC KNOWLEDGE                     │
│                 질문 시 아무 조건 없이 공개           │
├────────────────────────────────────────────────────────┤
│                   PRIVATE KNOWLEDGE                    │
│      호감도(disposition) >= 40 이상일 때 자발적 공개    │
├────────────────────────────────────────────────────────┤
│                   SECRET KNOWLEDGE                     │
│   자발적 공개 불가. 강박(Intimidation), 정신 지배,     │
│   치명적 약점 노출, 혹은 생명 위협 단계에서만 획득 가능│
└────────────────────────────────────────────────────────┘
```

1. **Public (공공 정보):** 마을의 지리, 최근 널리 퍼진 소문 등. 대가나 호감도 없이 획득 가능.
2. **Private (사적 정보):** 개인사, 가족 문제, 타인에 대한 은밀한 평가 등. 호감도가 `40` 이상이거나 신뢰 관계 증명 시 획득 가능.
3. **Secret (비밀 정보):** 범죄 연루 사실, 음모의 배후, 약점 등. NPC는 이를 지키기 위해 거짓말을 하거나 입을 다문다. 플레이어는 다음 방법을 통해서만 비밀을 캐낼 수 있다.
   - **협박 및 회유 판정:** 주사위 판정 결과에 따름. 단, 협박 성공 시 호감도는 영구히 떡락함.
   - **거래:** 비밀에 상응하는 거액의 금전이나 강력한 대가 제공.
   - **물증 제시:** 플레이어가 해당 비밀과 관련된 결정적 물증을 확보하고 대면할 때.

---

# 8. NPC State Tracking (ENG-0053)

NPC의 물리적 및 심리적 상태 변화는 실시간으로 감시되고 보존되어야 한다.

## 8.1 상태 정의
- **생명 상태 (life_status):**
  - `alive`: 정상 활동 상태.
  - `unconscious`: 기절 상태. 대화 및 행동 불가. 주변 사건 인지 불능.
  - `dead`: 사망 상태. 영구적으로 게임 상태에서 배제됨. NPC Engine은 즉시 사망 이벤트를 월드 엔진에 보고하고, 관련 퀘스트 상태를 갱신하도록 Mission Engine에 이벤트를 발행한다.
- **신체 상태 (health_status):**
  - `healthy`: 전투력이나 정신력 저하 없음.
  - `injured`: 능력 판정 페널티 발생 (-2 보정), 피로 및 부상 묘사 적용.
  - `critical`: 자력 행동 불능에 가까움. 대화 시 정보 획득이 극도로 어려워짐.
- **감정 상태 (emotional_state):**
  - 플레이어와의 대화 도중 실시간으로 변경된다. (예: `calm` ➔ `suspicious` ➔ `angry`)
  - 감정이 `angry`나 `terrified`로 바뀌면, NPC는 합리적인 선택을 포기하고 공격적으로 변하거나 도망치려는 행동을 취한다.

---

# 9. Validation Rules

QA Engine은 NPC Engine의 작동과 출력에 대해 다음 규칙을 검증한다.

- **SV-NPC-001 (성격 일관성):** NPC의 대사나 행동 묘사가 보유한 `behavioral_traits`와 정반대되는 반응을 보이지 않는가? (예: `cowardly: 5`인 NPC가 갑자기 플레이어에게 칼을 뽑아 드는 경우 감지 시 경고)
- **SV-NPC-002 (지식 노출 방지):** `secret` 정보가 해제 조건 없이 플레이어 대화에서 노출되었는가? (위반 시 즉시 에러 및 출력 차단)
- **SV-NPC-003 (행동 강제 방지):** NPC의 대사나 지문을 통해 플레이어 캐릭터의 동작이나 반응을 묘사하지 않았는가?

---

END
