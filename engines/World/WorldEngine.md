# World Engine

## Status
Draft v0.1

---

# 1. 개요 (Overview)

## 1.1 목적 (Purpose)
World Engine은 AI Narrative Engine의 핵심 구성 요소로, 플레이어가 탐험하는 세계의 상태(World State), 시간의 흐름(Time Progression), 지리와 지역 정보(Locations), 환경 변화(Environmental Events) 및 세력의 움직임(Factions)을 관리하고 자율적으로 진행시키는 역할을 수행한다. 

## 1.2 역할 및 책임 범위 (Scope of Responsibility)
World Engine의 주요 책임은 다음과 같다:
1. **세계 상태 유지 및 제공:** 세션 전체에서 유지되는 일관된 세계 상태 데이터를 관리한다.
2. **시간 경과 처리:** 플레이어의 행동(이동, 탐색, 전투, 휴식 등)과 연동하여 세계 시간을 갱신한다.
3. **지역 및 공간 상태 관리:** 지리적 연결 정보와 각 지역의 동적 상태(위협도, 점령 세력, 자원 등)를 갱신한다.
4. **환경 시뮬레이션:** 날씨, 계절, 자연 재해 등 플레이어의 제어를 벗어난 전역적/지역적 환경 변화를 처리한다.
5. **세계 변화 추적 및 반영:** 플레이어의 행동 결과와 NPC/세력의 자율 행동이 세계 상태에 미치는 영향을 계산하고 누적한다.
6. **세계 상태 스냅샷 제공:** Save Engine과 Memory Engine이 상태를 직렬화하고 아카이브할 수 있도록 규격화된 스냅샷을 생성한다.

## 1.3 다른 엔진과의 상호작용 (Architecture & Interactions)
```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│ Compiler Engine │ ───>  │ Director Engine │ ───>  │  World Engine   │
└─────────────────┘       └─────────────────┘       └─────────────────┘
                                                             │
 ┌───────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────┐
 │                                                           │                                                          │
 ▼                                                           ▼                                                          ▼
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   NPC Engine    │       │ Mission Engine  │       │  Memory Engine  │       │   Save Engine   │       │    QA Engine    │
└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```
- **Director Engine:** World Engine이 제공하는 시간, 지역 상태, 환경 변화 결과를 기반으로 플레이어에게 제공할 장면 묘사(NAR)를 구성한다.
- **Save Engine:** World Engine이 직렬화한 세계 상태 스냅샷을 저장 파일에 영구 기록하며, 로드 시 이를 다시 World Engine에 주입한다.
- **Memory Engine:** 세계의 역사적 변화와 장기적 사건을 요약하고 컨텍스트로 보존할 수 있도록 World Engine의 상태 변화 로그를 전달받는다.
- **NPC Engine:** 세계의 시간 흐름과 환경 상태, 소속 세력의 자원 상태를 World Engine으로부터 조회하여 NPC의 목표와 행동 방침을 갱신한다.
- **QA Engine:** World Engine이 갱신한 세계 상태가 이전 세션의 규칙 및 인과관계와 모순되지 않는지 일관성을 검증한다.

---

# 2. 세계 상태(World State) 데이터 구조 정의

세계 상태는 세계관 독립적인 범용 데이터 구조를 가지며, YAML 또는 JSON 형식으로 직렬화할 수 있어야 한다. 

## 2.1 전체 데이터 스키마 (YAML Specification)
```yaml
world_state:
  metadata:
    version: "1.0.0"                   # 데이터 규격 버전
    world_module: "string"             # 활성화된 세계관 모듈 식별자 (예: generic, scp 등)
    last_updated_session: int          # 마지막으로 상태가 업데이트된 세션 번호
  
  timeline:
    current_time:                      # 현재 게임 내 시각
      epoch_seconds: int               # 누적 초 (시간 연산용 절대 기준값)
      formatted: "string"              # 인간이 읽을 수 있는 형식 (예: "2026-06-26 15:00:00")
      cycle: "string"                  # 낮/밤 주기 상태 (day | twilight | night)
      season: "string"                 # 현재 계절 (spring | summer | autumn | winter)
    time_scale: float                  # 실시간 대비 게임 시간 배율 (기본값: 1.0)

  environment:
    global_weather: "string"           # 전역 날씨 (clear | overcast | rainy | snowy | storm)
    temperature_celsius: float         # 현재 전역/대표 기온
    active_disasters:                  # 진행 중인 재해/특수 환경 상태
      - id: "string"
        name: "string"
        severity: "string"             # minor | major | critical
        remaining_duration: int        # 남은 시간 (초)

  locations:
    - id: "string"                     # 지역 고유 식별자 (snake_case)
      name: "string"                   # 지역 명칭
      description: "string"            # 지역 묘사 기본 텍스트
      connected_to: list["string"]     # 연결된 다른 지역 ID 목록
      discovered: bool                 # 플레이어가 이 지역을 발견했는지 여부
      status:
        population_density: "string"   # 인구 밀도 (none | sparse | moderate | dense)
        threat_level: int              # 위협도 (0: 안전 ~ 10: 치명적)
        resource_abundance: int        # 자원량 (0: 황폐화 ~ 10: 풍족)
        controlling_faction: "string"  # 이 지역을 지배하는 세력 ID (nullable)
      active_events:                   # 이 지역에서 진행 중인 사건 목록
        - id: "string"
          name: "string"
          countdown: int               # 이벤트 해결/폭발까지 남은 시간 (초)
      current_occupants: list["string"] # 현재 이 지역에 있는 주요 개체(PC, NPC) ID 목록

  factions:
    - id: "string"                     # 세력 고유 식별자
      name: "string"                   # 세력 명칭
      disposition_to_player: int       # 플레이어 캐릭터에 대한 우호도 (-100 ~ +100)
      influence: int                   # 세계 전체에 미치는 영향력 수치 (0 ~ 100)
      resources:
        wealth: int                    # 자금/재정 상태 (0 ~ 10)
        manpower: int                  # 인력 규모 (0 ~ 10)
        military_strength: int         # 군사/전투력 (0 ~ 10)
      current_goal: "string"           # 세력의 최우선 현재 목표
      relations:                       # 다른 세력과의 관계
        faction_id_b: int              # 상대 세력에 대한 우호도 (-100 ~ +100)

  global_events:
    - id: "string"                     # 전역 이벤트 식별자
      name: "string"                   # 이벤트 이름
      trigger_condition: "string"      # 트리거 조건 설명
      status: "string"                 # pending | active | resolved
      countdown: int                   # 발생/완료까지 남은 세계 시간 (초, nullable)
```

---

# 3. 시간 흐름 시스템 설계

World Engine은 게임 내 시간의 연속성을 유지하기 위해 플레이어 행동 및 세션 경과에 따른 시간의 소모를 정밀하게 추적한다.

## 3.1 시간의 단위 (Time Units)
시간은 다음과 같은 표준 단위를 사용하여 내부적으로 연산된다:
- **라운드 (Round):** 전투 중 사용되는 기본 단위. 1라운드 = 6초.
- **분 (Minute):** 탐색 및 이동의 기본 단위. 1분 = 10라운드 = 60초.
- **시간 (Hour):** 심층 탐색, 대화, 단기 휴식의 기본 단위. 1시간 = 60분.
- **일 (Day):** 이동, 장기 휴식, 세력 행동 갱신 등의 기본 단위. 1일 = 24시간.

## 3.2 플레이어 행동에 따른 시간 소모 규칙 (Time Cost Matrix)
세계관 모듈에 별도의 설정이 없을 경우, World Engine은 아래의 기본 시간 소모 규칙을 준수한다.

| 플레이어 행동 분류 | 세부 행동 예시 | 기본 소모 시간 | 설명 |
|-------------------|--------------|--------------|----|
| **단기/즉각 행동** | 자물쇠 따기, 주변 관찰, 물건 줍기 | 1분 ~ 5분 | 비교적 즉각적인 신체 및 인지 활동 |
| **장면 대화** | NPC와의 심도 깊은 교섭, 정보 수집 | 10분 ~ 30분 | 대화 주제가 무거울수록 소모가 증가 |
| **정밀 조사** | 특정 방의 비밀문 찾기, 단서 분석 | 20분 ~ 1시간 | 물리적/정신적 집중을 요하는 작업 |
| **지역 내 탐색** | 던전의 한 구역 탐험, 숲 수색 | 1시간 ~ 2시간 | 광범위하고 체계적인 수색 활동 |
| **지역 간 이동** | 인접 도시로 걸어서 이동 | 거리 및 수단에 따름 | 도보: 시간당 약 4km, 마차: 8km, 기차: 40km |
| **전투 수행** | 몬스터 또는 적대 단체와의 교전 | 라운드 수 × 6초 | 전투 후 정리 및 재정비 시간(+10분) 별도 추가 |
| **단기 휴식** | 숨 고르기, 응급 처치, 장비 정비 | 1시간 | 피로 완화 및 일부 경미한 자원 회복 |
| **장기 휴식** | 수면, 식사, 캠핑 | 8시간 | 피로 완전 회복, 정신력/자원 충전 |

## 3.3 다운타임 및 비활성 상태의 시간 흐름 (Downtime & Offline Progression)
플레이어가 모험을 일시적으로 중단하거나(Downtime), 세션 간 공백기가 존재할 때 World Engine은 다음 프로세스를 통해 세계 시간을 강제로 진행시킨다:
1. **다운타임 선언:** 플레이어 또는 GM이 다운타임 기간(예: "한 달간 연구에 집중한다")을 설정한다.
2. **시간 즉시 점프:** `epoch_seconds`를 해당 기간만큼 증가시킨다.
3. **자율 이벤트 처리:** 점프한 시간 동안 축적된 NPC/세력의 행동 주기를 계산하고, 전역 이벤트의 카운트다운을 일괄 감산한다.
4. **환경 요약 갱신:** 플레이어에게 다운타임 동안 발생한 큰 환경 변화(계절 변경, 주요 기후 재해 등)를 요약하여 제공할 수 있도록 기록한다.

---

# 4. 지역/장소 상태 관리 프로토콜

세계 지도는 노드(Locations)와 엣지(Connections)로 구성된 토폴로지 그래프로 관리된다. World Engine은 각 지역의 동적 상태 변화와 플레이어의 인지 한계를 추적한다.

## 4.1 연결성 및 경로 연산 (Topology & Pathfinding)
- **이동 가능 여부:** 두 지역 `A`와 `B` 사이에 `connected_to` 관계가 성립되어 있어야 플레이어는 직접 이동할 수 있다.
- **경로 차단:** 지진, 붕괴, 세력의 봉쇄 등으로 인해 특정 연결(Edge)이 비활성화되면, World Engine은 경로 그래프에서 해당 엣지를 제거하고 대체 경로를 탐색해야 한다.

## 4.2 지역 동적 상태 변화 규칙 (Local Dynamics)
지역의 네 가지 핵심 변수는 매 시간/일 단위로 상호작용하며 갱신된다:
1. **위협도 (Threat Level):** 
   - 주변 적대 세력의 영향력이 강해지거나, 자원량이 0이 되면 위협도가 상승한다.
   - 플레이어가 위협 요소를 제거하거나 지배 세력이 방비를 강화하면 위협도가 감소한다.
   - 위협도가 8 이상인 지역에서는 야생 동물이나 조우할 수 있는 적의 위험도가 한 등급 상승한다.
2. **자원량 (Resource Abundance):**
   - 세력의 수확, 채굴, 재난 등으로 매일 감소한다.
   - 자연 회복(계절에 따름) 또는 세력의 투자가 있을 경우 서서히 증가한다.
3. **인구 밀도 (Population Density):**
   - 위협도가 지속적으로 높으면 인구가 점차 유출된다(dense -> moderate -> sparse).
   - 반대로 안전이 유지되고 자원이 풍부하면 인구가 유입된다.
4. **지배 세력 (Controlling Faction):**
   - 세력 간 영향력 전투의 결과로 변경될 수 있다.
   - 지배 세력이 바뀔 경우 해당 지역의 치안 상태 및 플레이어에 대한 태도(NPC 우호도)는 지배 세력의 disposition 값을 추종한다.

## 4.3 가시성 및 안개 처리 (Fog of War & Unknown Regions)
- **미발견 지역 (`discovered: false`):** 플레이어가 방문하지 않은 지역의 상태는 플레이어 시트나 세션 요약에 절대로 구체적인 수치로 드러나지 않는다.
- **자율 업데이트:** 플레이어가 보지 않는 상황에서도 미발견 지역의 사건(Countdown)은 백그라운드에서 동일하게 소모되며, 임계점에 다다르면 결과가 반영된다. (예: 플레이어가 방문하기 전에 이미 요새가 함락됨)

---

# 5. 환경 이벤트 시스템

날씨와 기후는 세계의 살아있는 느낌을 강조하고, 플레이어의 행동 방향성을 결정하는 주요 제약 사항이다.

## 5.1 주기적 및 확률적 환경 변화 (Weather Generation)
매일 오전 06:00시(게임 내 시각)에 World Engine은 다음 단계를 거쳐 당일의 날씨를 결정한다:
1. **기본 확률 계산:** 현재 계절(Season)에 해당하는 기본 날씨 분포 확률 테이블을 참조한다.
   - *봄/가을:* clear (60%) | overcast (25%) | rainy (15%)
   - *여름:* clear (40%) | overcast (30%) | rainy (20%) | storm (10%)
   - *겨울:* clear (30%) | overcast (35%) | snowy (25%) | storm (10%)
2. **지속성 가중치 반영:** 어제의 날씨가 비/눈/폭풍이었을 경우, 다음 날에도 해당 날씨가 지속될 확률에 +20% 가중치를 더한다.
3. **이상 기후 판정:** 100면체 주사위를 굴려 99-100이 나올 경우, `active_disasters`에 특수 환경 재해(가뭄, 한파, 태풍 등)를 추가한다.

## 5.2 환경 변화가 플레이어 행동에 미치는 영향 (Environmental Penalties)

| 날씨 상태 | 이동 속도 페널티 | 판정(스탯/스킬) 영향 | 시각/청각적 제약 |
|----------|-----------------|---------------------|----------------|
| **Clear** (맑음) | 없음 | 없음 | 최대 가시거리 확보 |
| **Overcast** (흐림) | 없음 | 없음 | 가시거리 미세 감소, 그늘 제공 |
| **Rainy** (비) | -20% (진흙탕 형성) | 불 다루기/추적 판정 난이도 +2 | 빗소리로 인해 청각 감지 판정 난이도 +1 |
| **Snowy** (눈) | -40% (폭설 시) | 추위 저항(체력) 판정 매 시간 발생 | 시야 차단, 흔적이 눈에 덮임 |
| **Storm** (폭풍/뇌우) | -60% (이동 위험) | 모든 원거리 공격 판정 난이도 +4 | 가시거리 5m 이내로 단축, 통신 두절 |

---

# 6. 세계 변화 추적 시스템

세계는 고정된 배경이 아니며, 플레이어의 직접적인 행동과 세력 간의 충돌에 따라 끊임없이 변화한다.

## 6.1 플레이어 행동 결과의 세계 반영 (World Effects)
- **직접적인 물리 영향:** 플레이어가 교량을 파괴하면 해당 연결 정보(`connected_to`)는 즉시 끊긴다.
- **평판 및 세력 구도 변화:** 플레이어가 특정 퀘스트를 완수하거나 특정 진영의 요인을 처치하면, 연관된 세력의 `influence` 수치와 `disposition_to_player` 수치가 실시간 계산식에 의해 변동된다.
  - *예시 식:* `disposition_to_player = disposition_to_player + (완료한 미션 중요도 * 10)`

## 6.2 세력 및 NPC 자율 행동의 처리
매 세션이 시작하거나 게임 내 시간이 1일 이상 경과했을 때, World Engine은 플레이어가 부재한 지역에서의 NPC/세력 간 대립 결과를 다음과 같이 계산한다:
1. **목표 검증:** 각 세력의 `current_goal`을 확인한다.
2. **영향력 주사위 대결:** 목표 지역의 방어측 영향력(Influence) + 자원량 vs 공격측 영향력 + 자원량으로 주사위 판정을 수행한다.
3. **결과 업데이트:** 공격측이 승리할 경우 해당 지역의 `controlling_faction`이 갱신되며, 패배한 측의 자원량이 감소한다.

## 6.3 단기 변화 vs 영구 변화 구분 규칙
- **단기 변화 (Temporary Changes):** 폭우로 인한 도로 침수, 몬스터의 일시적 출몰 등. 이 변화는 `countdown` 속성을 가지며 시간이 지나면 자동으로 복구된다.
- **영구 변화 (Permanent Changes):** 요새의 함락, 주요 NPC의 사망, 자원의 완전 고갈 등. 이 변화는 복구 타이머가 없으며, 다른 사건(재건 미션 등)이 발동하기 전까지 지속된다.

---

# 7. 세계 상태 스냅샷 포맷 정의

World Engine은 세션의 상태 보존 및 복원을 위해 현재의 전체 상태를 정밀하게 표현하되, 메모리/네트워크 효율성이 극대화된 경량 스냅샷 형식으로 저장할 수 있어야 한다.

## 7.1 스냅샷 데이터 구조 (JSON Schema Reference)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "WorldStateSnapshot",
  "type": "object",
  "required": ["snapshot_id", "timestamp", "engine_version", "timeline", "state_hash"],
  "properties": {
    "snapshot_id": {
      "type": "string",
      "description": "스냅샷 고유 UUID"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "스냅샷 생성 시점의 실제 기록 시간"
    },
    "engine_version": {
      "type": "string",
      "description": "호환되는 World Engine 최소 버전"
    },
    "timeline": {
      "type": "object",
      "required": ["epoch_seconds", "session_count"],
      "properties": {
        "epoch_seconds": { "type": "integer" },
        "session_count": { "type": "integer" }
      }
    },
    "delta_log": {
      "type": "array",
      "description": "이전 세션 스냅샷 대비 변경된 데이터 사항 목록 (차분 저장용)",
      "items": {
        "type": "object",
        "required": ["path", "op", "value"],
        "properties": {
          "path": { "type": "string" },
          "op": { "type": "string", "enum": ["add", "replace", "remove"] },
          "value": {}
        }
      }
    },
    "compressed_state": {
      "type": "string",
      "description": "압축된 전체 월드 상태 데이터 (Base64 인코딩)"
    },
    "state_hash": {
      "type": "string",
      "description": "데이터 위변조 방지 및 무결성 확인용 SHA-256 해시값"
    }
  }
}
```

## 7.2 버전 호환성 및 마이그레이션 규칙
- **하위 호환성:** 스냅샷의 `engine_version` 앞 두 자리(Major.Minor)가 현재 엔진 버전과 일치하는 경우 추가 변환 없이 로드를 허용한다.
- **자동 마이그레이션:** 패치 변경(Patch level)인 경우 이전 버전 데이터를 자동으로 새 스키마 필드에 복사하고, 누락된 기본값을 채워 로드를 시도한다. 만약 실패할 경우 `ERR` 블록을 반환하며 세션 복원을 중단한다.

---

END
