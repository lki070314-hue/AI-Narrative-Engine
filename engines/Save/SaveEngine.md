# Save Engine Specification

## Status
Draft v0.1

---

# 1. Purpose

이 문서는 AI Narrative Engine의 **Save Engine**에 대한 상세 설계 및 규격을 정의한다.
Save Engine은 게임 내 모든 상태 데이터의 직렬화(Serialization) 및 역직렬화(Deserialization)를 관리하며, 캠페인의 지속성, 체크포인트 관리, 스냅샷 생성 및 롤백 처리를 담당하는 핵심 엔진이다.

이 명세는 세계관 독립적으로 설계되었으며, 어떠한 인게임 설정이나 특정 장르에도 종속되지 않고 유기적으로 동작한다.

---

# 2. Architecture & Interface

Save Engine은 게임 내 모든 엔진의 상태 객체를 수집하여 단일화된 YAML 형식의 세이브 파일로 저장하고, 세이브 파일을 읽어 각 엔진의 초기 상태로 복원하는 입출력 인터페이스 계약을 가진다.

## 2.1 인터페이스 계약

### 2.1.1 입력 (Inputs)

Save Engine은 저장 또는 불러오기 동작 시 아래와 같은 데이터 객체를 입력받는다.

| 입력 변수명 | 타입 | 필수 여부 | 설명 |
|---|---|---|---|
| `save_trigger` | Event / String | Y | 저장을 유발한 트리거 유형 (예: `session_start`, `session_end`, `mission_transition`, `manual`) |
| `active_states` | Map[EngineName, StateObject] | Y (저장 시) | 각 엔진(World, NPC, Memory, Mission 등)의 실시간 상태 객체 맵 |
| `save_data_stream` | String / YAML | Y (불러오기 시) | 디스크나 영구 저장소로부터 읽어온 직렬화된 세이브 파일 데이터 |
| `active_module` | ModuleContext | Y | 현재 활성화된 세계관 모듈 정보 (버전 및 모듈 ID) |

### 2.1.2 출력 (Outputs)

Save Engine은 작업을 수행한 후 다음 데이터를 생성하여 시스템과 각 엔진에 분배한다.

| 출력 변수명 | 타입 | 설명 |
|---|---|---|
| `serialized_save` | String (YAML) | 검증이 완료되고 직렬화된 세이브 파일 텍스트 데이터 |
| `restored_states` | Map[EngineName, StateObject] | 역직렬화 및 검증을 완료하고 각 엔진으로 분배할 복원된 상태 객체 |
| `save_result_event` | Event | 저장/불러오기의 성공 여부, 검증 결과 및 오류 내용을 포함하는 이벤트 객체 |

---

# 3. Save File Schema

세이브 파일은 인간이 읽을 수 있고 AI가 직접 편집 및 파싱하기 쉬운 YAML 포맷을 준수한다. 파일의 전체 구조는 아래 명세에 맞춰 엄격히 관리되어야 한다.

## 3.1 Save File YAML Schema

```yaml
save_file:
  # 1. 메타데이터 (Metadata)
  metadata:
    version: "1.0.0"                # Save Engine의 명세 버전
    timestamp: "2026-06-26T15:10:36Z" # 저장 시각 (ISO 8601 UTC)
    session_count: 5                # 진행된 총 세션 수 (1부터 시작)
    world_module: "generic"         # 활성화된 세계관 모듈 ID
    checksum: "sha256_hash_value"   # 데이터 변조 및 손상 방지용 해시

  # 2. 플레이어 캐릭터 정보 (Characters)
  characters:
    - character_sheet:
        id: "pc_warrior_conan"
        name: "코난"
        archetype: "warrior"
        stats:
          physical: 14
          mental: 10
          social: 10
        inventory:
          - item_id: "item_sword_01"
            quantity: 1
            status: "equipped"
        conditions:
          - condition_id: "fatigued"
            intensity: 1

  # 3. 세계 상태 (World State)
  world_state:
    current_time:
      day: 12
      hour: 22
      minute: 45
    location_id: "loc_dungeon_01"
    weather: "stormy"
    active_conditions:
      - condition_id: "darkness"
        duration_remaining: 3 # 남은 턴 또는 시간

  # 4. 미션 상태 (Mission States)
  mission_states:
    - mission_id: "ms_rescue_princess"
      status: "active"              # active | completed | failed
      active_objectives:
        - objective_id: "obj_find_key"
          progress: 0
          status: "in_progress"
      completed_objectives: []
      failed_objectives: []
      started_session: 3
      resolved_session: null

  # 5. NPC 상태 (NPC States)
  npc_states:
    - id: "npc_merchant_mary"
      role: "major"                 # major | minor | background
      life_status: "alive"          # alive | dead | unconscious
      health_status: "healthy"      # healthy | injured | critical
      emotional_state: "suspicious"
      disposition:
        toward_player: 15
        toward_factions:
          faction_town: 80
      location_id: "loc_dungeon_01"
      recent_interactions:
        - session_id: 4
          summary: "플레이어가 메리에게 구조 제안을 함"

  # 6. 장기/단기 기억 아카이브 (Memory Archive)
  memory_archive:
    last_updated_session: 5
    tier1_core:
      world_events:
        - event_id: "evt_dungeon_collapse"
          title: "지하 감옥 붕괴 사건"
          summary: "세션 3에서 지하 감옥 서쪽 구역이 무너짐"
    tier2_important:
      npc_interactions:
        - npc_id: "npc_merchant_mary"
          summary: "플레이어가 감옥 탈출을 돕기로 약속함"
    tier3_temporary:
      recent_dialogues:
        - speaker_id: "npc_merchant_mary"
          text: "절 여기서 데리고 나가주세요!"

  # 7. 내러티브 로그 (Narrative Log)
  narrative_log:
    - session_id: 5
      entries:
        - timestamp: "2026-06-26T15:00:00Z"
          type: "NAR"
          content: "어두운 미로 속에서 비상 횃불이 붉게 일렁이고 있습니다."
        - timestamp: "2026-06-26T15:02:00Z"
          type: "DIA"
          content: "메리: \"탈출하려면 동쪽 문을 열 수 있는 열쇠가 필요해요.\""
```

---

# 4. Saving & Loading Mechanics

Save Engine은 게임 내 흐름을 제어하기 위해 정밀한 직렬화 및 역직렬화 프로토콜을 수행한다.

## 4.1 세션 저장 프로토콜 (ENG-0066)

저장 프로세스는 자동 트리거 또는 수동 요청 시 다음 단계를 거쳐 순차적으로 실행된다.

1. **상태 수집 (State Collection):** 
   Save Engine은 World, NPC, Mission, Memory, Creator Engine에 최신 상태 객체(State Object) 조회를 요청하고 이를 취합한다.
2. **YAML 변환 (YAML Generation):** 
   취합된 데이터를 `Save File Schema`에 맞춰 YAML 구조로 맵핑한다.
3. **메타데이터 및 체크섬 계산 (Metadata & Checksum Calculation):**
   `timestamp`, `session_count` 등의 메타데이터를 추가하고, 데이터의 무손실과 무결성을 보존하기 위해 세이브 데이터의 해시값(SHA-256)을 계산하여 `checksum` 필드에 주입한다.
4. **저장 데이터 검증 (Pre-Save Validation):**
   본 명세서 6절에 정의된 '데이터 무결성 및 검증' 단계를 거쳐 데이터의 모순 여부를 분석한다.
5. **물리 저장 (Physical Write):**
   검증을 통과한 YAML 텍스트를 디스크에 지정된 명명 규칙(예: `Save_Session_005.yaml`)에 맞춰 저장한다.

## 4.2 세션 불러오기 프로토콜 (ENG-0067)

세이브 데이터를 로드하여 게임을 재개할 때는 다음 단계의 역직렬화 프로토콜이 수행된다.

1. **파일 로드 및 포맷 검증:** 
   지정된 세이브 슬롯의 YAML 파일을 로드하고 구문 오류를 검사한다.
2. **해시 검증 (Tampering / Corruption Check):**
   `checksum`을 제외한 영역의 SHA-256 해시를 재계산하여 기록된 `checksum` 값과 일치하는지 비교한다. 다를 경우 파일 손상으로 간주하고 로드를 차단한다.
3. **버전 및 모듈 호환성 검증:**
   세이브 파일의 `metadata.version`과 `metadata.world_module`이 현재 작동 중인 엔진 및 활성화된 세계관 모듈과 일치하거나 마이그레이션이 가능한지 검증한다.
4. **상태 분배 (State Distribution):**
   역직렬화가 완료된 각 세션 상태를 복원 대상 엔진에 할당한다:
   - `world_state` ➔ World Engine
   - `npc_states` ➔ NPC Engine
   - `mission_states` ➔ Mission Engine
   - `memory_archive` ➔ Memory Engine
5. **세션 재개 알림:**
   각 엔진이 상태 복원을 정상 완료하면 `System` 출력 유형(`[SYS]`)을 통해 세션이 정상 복구되었음을 플레이어에게 출력한다.

---

# 5. Checkpoint & Rollback System (ENG-0068)

세션 운영 중 치명적인 오류나 플레이어의 롤백 요청에 대처하기 위해 Save Engine은 다중 체크포인트 시스템을 관리한다.

## 5.1 체크포인트 생성 규칙

체크포인트는 아래와 같은 시점(저장 트리거)에 자동으로 생성되며, 롤백 포인트로 기능한다.

- **세션 시작 체크포인트:** 세션 로드가 끝난 직후, 플레이어 입력 전의 초기 상태.
- **주요 분기점 체크포인트:** 주요 미션이 완료되거나 실패한 직후, 혹은 대규모 월드 환경 변화(예: 격리 실패, 자연재해) 직후.
- **주기적 체크포인트:** 플레이어 행동 10턴 주기로 생성 (이전 체크포인트를 덮어씌움).

## 5.2 롤백 프로토콜

플레이어가 과거의 행동 분기로 돌아가길 요청하거나, QA Engine이 치명적 일관성 오류를 감지하여 롤백을 지시하는 경우 작동한다.

1. **체크포인트 탐색:** 저장된 복수의 체크포인트 파일 중 롤백 기준에 부합하는 가장 최근의 안전한 체크포인트를 찾는다.
2. **상태 복원 검증:** 복원 대상 체크포인트 파일에 대해 무결성 검증을 전면 수행한다.
3. **소급 적용:** 현재 메모리에 올라와 있는 상태를 버리고, 선택한 체크포인트 상태로 대체한다.
4. **서사 조정 알림:** 롤백 직후, Director Engine에 롤백 이벤트 정보를 전달하여 플레이어에게 시간선이 이동했음을 합당하게 연출하도록 요청한다 (`[SYS] 시스템: 시간이 특정 시점으로 되돌아갔습니다. 이전의 체크포인트 상태를 적용합니다.`).

---

# 6. Data Integrity & Validation (ENG-0069)

세이브 데이터의 무결성 손실은 캠페인 전체의 파괴로 이어지므로, 저장 및 로드 시 QA Engine과 협업하여 삼중 검증을 실행한다.

## 6.1 검증 카테고리

### 6.1.1 참조 무결성 (Referential Integrity)
- 세이브 내에 존재하는 모든 엔티티 참조 ID(예: `npc_states`에 기록된 NPC ID, `world_state`의 `location_id`, `characters`의 `item_id`)가 활성 세계관 모듈 및 마스터 데이터베이스 내에 실제 정의된 값인지 검증한다.
- 누락되거나 존재하지 않는 참조 발견 시 `CRIT` 오류로 취급하여 저장을 중단한다.

### 6.1.2 상태 일관성 (State Consistency)
- 모순된 상태값이 공존하는지 체크한다.
  - 예: NPC의 생사 상태가 `dead`인데, 해당 NPC의 위치 정보가 활성화되어 있거나 미션 목표에서 그를 호위해야 하는 모순 감지.
  - 예: 캐릭터가 소유한 아이템이 인벤토리 목록에 있는데 동시에 분실 상태(`lost`)로 표기되어 있는 모순 감지.
- 경미한 모순은 `WARN` 처리 후 자동 보정(예: 기본값 대입)하고, 심각한 모순은 `ERR`을 발행하여 롤백을 제안한다.

### 6.1.3 버전 및 모듈 호환성 (Version Compatibility) (ENG-0070)
- 엔진 버전이 상이할 경우 마이그레이션 모듈을 실행하여 데이터를 보정한다.
- 데이터 필드가 유실되었을 경우 활성 모듈의 스키마 기본값(Default Value)을 채워 넣는다.
- 마이그레이션이 불가능한 수준의 메이저 버전 불일치 발생 시 즉시 중단하고 사용자에게 오류 알림을 보낸다.

---

# 7. Error & Conflict Resolution

저장 및 로딩 중 발생할 수 있는 충돌 및 물리 오류에 대한 대처 가이드라인을 정의한다.

## 7.1 파일 충돌 처리
- 동일 이름의 세이브 파일이 존재할 경우 기본적으로 덮어쓰지 않고, `{SaveName}_backup.yaml` 형태로 이전 세이브를 백업한 후 쓰기를 진행한다.
- 쓰기 작업 중 디스크 공간 부족, 쓰기 권한 오류 등으로 인해 비정상 종료가 발생할 경우, 손상된 파일은 무시하고 백업된 파일로부터 마지막 상태를 복원한다.

## 7.2 데이터 손상 복구
- 세이브 파일의 체크섬 검증에 실패한 경우, 즉시 해당 세이브 슬롯의 마지막 자동 저장 체크포인트(LKG - Last Known Good)를 로드하여 세션의 영구 손실을 방지한다.

---

# 8. Validation Rules

QA Engine은 Save Engine의 동작에 대해 다음 규칙을 검증한다.

- **SV-SAV-001 (참조 무결성 검증):** 직렬화된 세이브 파일에 포함된 모든 ID가 현재 세계관 모듈의 정의 데이터(마스터 스키마) 내에 포함되어 있는가? (위반 시 CRIT Error)
- **SV-SAV-002 (데이터 불일치 방지):** 상태값들이 상호 모순되는지 여부. (예: `life_status: dead` 상태 of NPC의 호감도 `disposition`가 갱신을 시도하는 모순 감지 시 Error)
- **SV-SAV-003 (버전 및 모듈 일관성):** 로드된 세이브 데이터의 `world_module`이 현재 실행 중인 엔진에 로드된 세계관 모듈과 일치하는가? (위반 시 CRIT Error)
- **SV-SAV-004 (체크섬 일치성):** 저장 파일의 데이터를 해싱한 결과가 파일 내 `checksum` 정보와 동일한가? (위반 시 CRIT Error)

---

END
