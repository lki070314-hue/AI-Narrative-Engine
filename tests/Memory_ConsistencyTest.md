# Memory Consistency Test Specification

## Status
Draft v0.1

---

# 1. Purpose

이 문서는 **Memory Engine**의 작동에 대한 일관성 검증 및 테스트 사양을 정의한다.
이 테스트는 Memory Engine이 캠페인 기억 분류 규칙, 컨텍스트 압축 알고리즘, 기억 검색 프로토콜을 올바르게 준수하며, 세계와 캐릭터의 상태 일관성을 유지하는지를 검증한다.

---

# 2. Test Scenario 1: Memory Tiering and Persistence

## 2.1 개요
세션 종료 시 Memory Engine이 정보를 올바른 티어(Tier)로 분류하고, Tier 1 핵심 기억이 훼손되지 않는지 검증한다.

## 2.2 입력 데이터 (Input)
- `session_log`:
  ```markdown
  플레이어는 대마법사 '엘리온'과 평화 동맹 계약을 맺었다. (핵심 서약)
  플레이어는 숲속의 고블린 3마리와 전투하여 승리하였다.
  플레이어가 명시적으로 표시함: "엘리온과의 동맹 계약은 나의 가장 소중한 기억이다."
  ```
- `current_context`: `npc_id: npc_elyon`, `location_id: loc_forest`
- `memory_archive`: 초기 빈 상태

## 2.3 기대 결과 (Expected Output)
- `updated_memory_archive.tier1_core.characters`에 엘리온과의 계약 및 관계가 기록되어야 함.
- `updated_memory_archive.tier1_core.user_marked_facts`에 엘리온과의 동맹이 중요 기록으로 등록되어야 함.
- 고블린과의 전투는 `tier2_important` 또는 `tier3_temporary`로 분류되어야 하며, `tier1_core`에 등록되지 않아야 함.

---

# 3. Test Scenario 2: Context Compression

## 3.1 개요
오래된 Tier 2 중요 기억이 설정된 세션 주기에 맞춰 의미론적으로 압축(Semantic Summary) 및 통합되며, 정보 왜곡이 발생하지 않는지 검증한다.

## 3.2 입력 데이터 (Input)
- `memory_archive`: (5세션 전에 기록된 3개의 개별적인 상호작용 기억)
  - "세션 1: npc_shopkeeper와 흥정하여 10골드 깎음."
  - "세션 2: npc_shopkeeper와 물건 거래를 하다가 가벼운 논쟁이 발생함."
  - "세션 3: npc_shopkeeper에게 분실된 지갑을 찾아주어 고맙다는 인사를 받음."
- `current_session`: 세션 6

## 3.3 기대 결과 (Expected Output)
- npc_shopkeeper 관련 개별적인 3개의 기억이 하나로 압축 및 결합되어 `npc_interactions`에 업데이트되어야 함.
- 결과 중심 압축 예: "과거 상점 주인과 몇 차례의 흥정과 갈등이 있었으나, 지갑을 찾아준 계기로 관계가 회복됨."
- 압축 전 원본 로그는 `archive_events`로 발행되어 보관 대상이 되어야 함.

---

# 4. Test Scenario 3: Memory Retrieval Protocol

## 4.1 개요
현재 씬의 컨텍스트(위치 ID, NPC ID)에 따라 가장 관련성이 높은 기억이 우선순위에 맞춰 추출되는지 검증한다.

## 4.2 입력 데이터 (Input)
- `current_context`: `location_id: loc_dungeon_01`, `npc_id: npc_shadow_mage`
- `memory_archive`:
  - Tier 1: "npc_shadow_mage는 플레이어의 친형이다."
  - Tier 2 (Location): "loc_dungeon_01의 3번 방에 독 함정이 존재함."
  - Tier 2 (NPC): "npc_shadow_mage와 3세션 전에 결투를 벌인 이력이 있음."
  - Tier 2 (Mission): "loc_dungeon_01의 보스 처치 미션 진행 중."

## 4.3 기대 결과 (Expected Output)
- `retrieved_context`에 다음 우선순위로 데이터가 배치되어야 함:
  1. `tier1_core_related`: npc_shadow_mage가 플레이어의 친형이라는 정보 (우선순위 1)
  2. `tier2_important_related`: 독 함정 정보 및 결투 이력 (우선순위 2)
  3. `tier2_important_related`: 보스 처치 미션 정보 (우선순위 3)

---

# 5. Validation Check Rules (QA Engine 연동)

- **SV-MEM-001 Validation Check:** 테스트 도중 Tier 1 기억이 임의로 요약되거나 제거되는 경우 즉시 오류를 반환해야 함.
- **SV-MEM-002 Validation Check:** 압축 요약본이 원본 의미와 정반대(예: "독 함정이 있다" -> "독 함정이 없다")로 생성될 경우 즉시 검증 실패 처리.
- **SV-MEM-003 Validation Check:** `retrieved_context` 내에 존재하지 않는 Entity ID가 참조될 경우 무결성 에러 발생 검증.

---

END
