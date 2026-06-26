# SCP Foundation TRPG — 임무 시스템

**문서 식별자:** `modules/scp/SCP_MissionSystem.md`
**버전:** v1.0.0
**최종 수정:** 2026-06-26
**적용 대상:** Mission Engine (SCP 모듈 확장), Director Engine

---

## 목차

1. [임무 시스템 개요](#1-임무-시스템-개요)
2. [임무 분류 체계](#2-임무-분류-체계)
3. [개인 미션 시스템](#3-개인-미션-시스템)
4. [비밀 미션 시스템](#4-비밀-미션-시스템)
5. [추리 선택지 시스템](#5-추리-선택지-시스템)
6. [임무 생성 가이드](#6-임무-생성-가이드)
7. [Mission Engine 연계 스키마](#7-mission-engine-연계-스키마)

---

# 1. 임무 시스템 개요

## 1.1 SCP 모듈의 임무 구조

SCP 모듈의 임무는 세 층위로 구성된다.

```
[챕터 임무]            ← 챕터 전체의 공개 목표
    ├── [개인 미션]    ← 플레이어 각자의 공개 개인 목표
    └── [비밀 미션]    ← 플레이어 각자의 비공개 목표
         └── [추리 선택지] ← 조사 임무에 포함되는 추론 시스템
```

챕터 임무는 모든 플레이어가 공유하는 목표다. 개인 미션은 플레이어별로 다르지만 다른 플레이어도 알고 있다. 비밀 미션은 GM과 해당 플레이어만 안다.

## 1.2 Mission Engine과의 관계

SCP 모듈의 임무는 엔진 레이어의 Mission Engine 위에서 작동한다. 다음 확장이 적용된다:

- `mission.type`에 `personal`과 `secret` 타입 추가 사용
- `retirement_point_event` 필드로 RP 갱신 연계
- 비밀 미션은 `hidden: true` 처리 (Mission Engine §7.2 적용)

---

# 2. 임무 분류 체계

| 임무 유형 | 공개 여부 | 대상 | RP 영향 |
|----------|---------|------|---------|
| **챕터 임무** | 전체 공개 | 파티 전체 | 챕터 클리어 +5 |
| **개인 미션** | 파티 내 공개 | 개인 | +3 ~ +8 |
| **비밀 미션** | GM + 본인만 | 개인 | +10 ~ +20 |
| **추리 임무** | 공개 (결과 비공개) | 조사 참여자 | 추리 성공 +5 ~ +12 |

---

# 3. 개인 미션 시스템

## 3.1 정의

개인 미션은 각 플레이어 캐릭터의 배경 또는 직책에서 파생된 개인 목표다. 다른 플레이어에게 공개되어 있어 협력·방해가 가능하다.

## 3.2 개인 미션 예시

| 직책 | 개인 미션 예시 |
|------|--------------|
| D계급 | "이번 챕터에서 실험 대상 지정을 피한다" / "재단 문서 하나를 훔쳐 읽는다" |
| 연구원 | "SCP의 격리 약점을 발견하여 기록한다" / "상관 몰래 추가 샘플을 채취한다" |
| 보안팀 | "감시 CCTV 1개를 오프라인으로 전환한다" / "동료 D계급의 처분 명령을 하루 지연시킨다" |
| MTF | "임무 보고서에 실제와 다른 내용을 기재한다" / "외부 접촉을 재단 몰래 유지한다" |
| 행정직 | "특정 NPC의 인사 파일을 수정한다" / "사이트 예산에서 사용처 불명 항목을 만든다" |

## 3.3 개인 미션 생성 규칙

GM이 챕터 시작 전 각 플레이어에게 부여한다.

**생성 원칙:**
- 해당 직책의 특성과 연결되어야 한다
- 달성 가능하지만 쉽지 않아야 한다 (챕터 내 자연스럽게 기회 발생)
- 다른 플레이어와 직접 충돌하지 않는 것을 권장 (비밀 미션과 구분)
- 완료 시 세계에 작은 변화를 남긴다

## 3.4 개인 미션 MissionState

```yaml
# Mission Engine type: personal 사용
mission:
  id: "mis_SCP_per_001"
  type: personal
  title: "CCTV 사각지대 생성"
  description: "구역 B-7의 카메라 1대를 오프라인으로 전환한다. 2챕터 내 유지."
  status: active
  objectives:
    - id: "obj_001_a"
      description: "카메라 위치 확인"
      required: true
      hidden: false
      completion_condition: "FDK 판정 DC 10 성공 또는 시설 도면 획득"
    - id: "obj_001_b"
      description: "오프라인 전환 후 24시간 유지"
      required: true
      hidden: false
      completion_condition: "보안 시스템 조작 성공 후 감지 없이 24시간 경과"
  rewards:
    experience: 10
  consequences:
    on_complete:
      - effect_type: faction
        target_id: "faction_security_division"
        operation: update
        changes:
          - field: disposition_to_player
            delta: -5                  # 보안부의 플레이어 신뢰도 소폭 하락
  source: module
  origin_description: "보안팀 플레이어가 다른 플레이어를 돕기 위해 감시망을 조작하려 한다"
```

---

# 4. 비밀 미션 시스템

## 4.1 정의

비밀 미션은 GM과 해당 플레이어만 아는 개인 목표다. 비밀 미션의 **존재**는 다른 플레이어도 알 수 있다 ("누군가 비밀 목표를 가지고 있다"). 하지만 **내용**은 비밀이다.

비밀 미션은 캠페인에 배신, 경쟁, 숨겨진 협력의 동력을 제공한다.

## 4.2 비밀 미션 부여 원칙

| 원칙 | 설명 |
|------|------|
| **세계 논리 기반** | 비밀 미션은 "재단이 이 플레이어에게 비밀리에 원하는 것" 또는 "플레이어 본인의 숨겨진 동기"에서 나온다 |
| **완료 가능성** | 챕터 내에서 달성 가능해야 한다. 지나치게 어려운 비밀 미션은 게임을 망친다 |
| **충돌 가능성** | 다른 플레이어의 개인 미션 또는 비밀 미션과 충돌할 수 있다. 이것이 의도된 긴장이다 |
| **RP 고보상** | 비밀 미션 완료는 일반 임무보다 높은 RP를 보상한다 (+10 ~ +20) |

## 4.3 비밀 미션 유형

| 유형 | 설명 | RP 보상 |
|------|------|---------|
| **내부 고발** | 재단 외부 세력에 정보 유출 | +15 |
| **동료 감시** | 특정 플레이어의 행동을 재단에 보고 | +10 (보고한 쪽), 상대방 RP -8 |
| **개체 접촉** | 특정 SCP와 비인가 교신 | +12 |
| **문서 조작** | 특정 기록을 위·변조 | +10 |
| **보호** | 특정 플레이어를 챕터 내내 생존시킨다 | +12 |
| **방해** | 특정 플레이어의 개인 미션을 완료 전에 저지 | +8 |
| **탈출 협력** | 특정 플레이어의 탈출 시도를 성공시킨다 | +15 |
| **재단 충성** | 챕터 내 모든 플레이어를 재단 규정 내에서 행동하게 만든다 | +8 (지급 후 RP 감소 -5) |

## 4.4 비밀 미션 공개 규칙

비밀 미션은 다음 조건에서 다른 플레이어에게 공개될 수 있다:

| 공개 조건 | 결과 |
|----------|------|
| 비밀 미션 달성 후 자발적 공개 | 공개한 플레이어 RP +2 추가 |
| 다른 플레이어의 추리/조사 성공 | 공개. 공개된 플레이어 RP 변화 없음 |
| 임무 실패 시 GM 공개 | 모든 플레이어에게 공개. 실패한 플레이어 RP -3 |
| 게임 세션 종료 시 | 원칙적으로 미공개 유지. GM 선택으로 공개 가능 |

## 4.5 비밀 미션 MissionState

```yaml
# Mission Engine type: personal + hidden: true 사용
mission:
  id: "mis_SCP_sec_003"
  type: personal
  title: "[비밀] 감시 보고"
  description: "플레이어 B의 규정 위반 행동 3건을 보안부에 보고한다."
  status: active
  objectives:
    - id: "obj_sec_003_a"
      description: "플레이어 B의 규정 위반 행동 목격 및 기록"
      required: true
      hidden: true    # 플레이어 B에게 비공개
      completion_condition: "규정 위반 행동 3건 목격 후 SOC 판정 DC 11 성공으로 은밀히 기록"
    - id: "obj_sec_003_b"
      description: "보안부에 보고 완료"
      required: true
      hidden: true
      completion_condition: "보안부 NPC 접촉 후 보고 성공"
  rewards:
    experience: 5
  consequences:
    on_complete:
      - retirement_point_event:
          event_type: rp_gain
          target_player_id: "player_A"
          delta: 10
          is_secret: true
      - retirement_point_event:
          event_type: rp_loss
          target_player_id: "player_B"
          delta: -8
          is_secret: false    # 플레이어 B는 감시당했다는 것을 결과로 알게 됨
  source: module
  origin_description: "재단 내부 감시망의 일환. 재단이 플레이어 A에게 비밀리에 임무를 부여."
```

---

# 5. 추리 선택지 시스템

## 5.1 정의

추리 선택지 시스템은 SCP 개체 조사 또는 사건 수사 임무에서 플레이어가 단서를 수집하고 결론을 도출하는 시스템이다. 옳은 결론은 안전한 해결을 가져오고, 잘못된 결론은 예상치 못한 결과를 만든다.

## 5.2 추리 임무 구성 요소

| 요소 | 설명 |
|------|------|
| **단서 풀 (Clue Pool)** | 조사 가능한 단서 목록. 3~7개 준비. 각 단서는 독립적이며 하나 이상의 결론을 지지함 |
| **추리 결론 선택지** | 수집된 단서를 기반으로 플레이어가 선택하는 2~4개의 가설 |
| **진실** | GM만 알고 있는 정답. 복수 정답이 가능 |
| **결론별 결과** | 각 선택에 따른 다른 세계 결과 |

## 5.3 단서 수집 규칙

단서는 플레이어가 능동적으로 조사해야 발견된다. 자동 제공되지 않는다.

| 조사 행동 | 판정 | 획득 단서 |
|----------|------|----------|
| 현장 조사 (육안 관찰) | AGI DC 10 또는 자동 성공 | 물리적 단서 (배치, 흔적, 상태) |
| 문서 분석 | INT DC 12 | 재단 내부 기록 단서 |
| NPC 인터뷰 | SOC DC 11 | 목격자 증언 단서 |
| SCP 직접 관찰 | WIL DC 13 (SAN -1d4) | SCP 행동 패턴 단서 |
| 재단 데이터베이스 조회 | FDK DC 12 + 클리어런스 확인 | 이전 사례 단서 |
| 동료 증언 청취 | SOC DC 8 | 타 플레이어 관찰 단서 |

## 5.4 추리 판정

단서를 3개 이상 수집하면 추리 판정을 선언할 수 있다.

```
추리 판정 절차:

1. 수집된 단서 목록 확인
2. 플레이어가 결론 선택지 중 하나를 선택
3. 판정 없이 즉시 결과 발생
   → 정답이면: 올바른 격리 프로토콜 적용 가능, RP +추리 보상
   → 오답이면: 잘못된 조치 실행 → 의도치 않은 결과 발생 (꼭 나쁜 것은 아님)
   → 단서 1~2개로 추리 시: 결과 발생 전 GM이 "정보 불충분" 경고 가능
```

**주의:** 추리 결과는 플레이어가 "맞았다" 또는 "틀렸다"는 것을 즉각 알지 못한다. 결과가 세계에 반영되면서 자연스럽게 알게 된다.

## 5.5 추리 선택지 예시

**사건:** 격리 중이던 SCP-[X]가 담당 연구원 3명의 사망 후 격리 챔버 안에 그대로 있는 상황.

**단서:**
1. 연구원 사망 원인 - 명백한 물리적 외상 없음
2. 챔버 내 온도가 2°C 상승
3. 3명 모두 동일한 미소를 띤 채 사망
4. 마지막 연구원의 일지 - "오늘은 좀 더 이야기하고 싶었다"
5. CCTV에서 SCP-[X]는 챔버에서 움직이지 않음

**추리 선택지:**
- A) SCP-[X]가 격리 위반 없이 정신 조종 능력을 사용했다
- B) SCP-[X]가 범인이 아니다. 다른 외부 요인이 있다
- C) 연구원들이 자발적으로 사망했다 (SCP의 영향 하에)
- D) 연구원들이 SCP-[X]에게 무언가를 했고 반응이 돌아왔다

**결과 분기:**
- A 선택: 정신 차폐 장비 요청이 승인됨. SCP는 현재 무해한 상태임
- B 선택: 외부 조사 시작. 실제로 SCP가 원인이었으므로 챕터 복잡도 증가
- C 선택: 부분적 정답. 하지만 SCP가 능동적이 아닌 수동적이라 판단 → 차폐 수준 낮게 설정 → 후속 위험
- D 선택: 정답 중 하나. 연구 노트 추가 확보 가능. 연구원이 SCP에 자신의 기억을 공유했음 발견

## 5.6 오답의 결과 원칙

추리 오답은 처벌이 아닌 **다른 이야기의 시작**이다. 오답으로 인한 결과는:
- 상황이 더 복잡해진다 (단, 불가역적 파국은 바로 일어나지 않음)
- 새로운 단서가 드러난다 (오답으로 다른 진실이 발견될 수 있음)
- 재단 내부 대응이 달라진다 (잘못된 격리 프로토콜 → 재단의 판단 오류로 기록)

---

# 6. 임무 생성 가이드

## 6.1 챕터 임무 설계 원칙

1. **재단 논리로 시작**: "재단이 이 챕터에서 원하는 것은 무엇인가?"에서 임무를 설계
2. **플레이어 목표와 분리**: 챕터 임무가 플레이어 개인 미션과 완전히 일치하면 긴장이 없다
3. **실패 결과 설계**: 임무 실패 시 세계가 어떻게 달라지는지 먼저 설계
4. **추리 요소 통합**: Investigation 유형 챕터는 반드시 단서 5개 이상을 준비

## 6.2 비밀 미션 배분 원칙

| 원칙 | 설명 |
|------|------|
| **파티당 비밀 미션 충돌 최대 1쌍** | 두 플레이어의 비밀 미션이 동시에 충돌하면 게임이 혼란스러워진다 |
| **D계급에게 보호형 비밀 미션 부여 지양** | D계급의 비밀 미션은 탈출·생존 지향이 자연스럽다 |
| **행정직에게 조작형 비밀 미션 권장** | 행정직의 비밀 미션은 문서·인사 조작이 강점을 살린다 |
| **미션 간 인과 설계** | A의 비밀 미션이 성공하면 B의 개인 미션이 어려워지는 식의 연결 |

---

# 7. Mission Engine 연계 스키마

## 7.1 SCP 모듈 임무 타입 확장

```yaml
# Mission Engine의 type 필드를 확장
mission_type_scp:
  - chapter       # 챕터 전체 임무 (Mission Engine type: main/side)
  - personal      # 개인 미션 (Mission Engine type: personal)
  - secret        # 비밀 미션 (Mission Engine type: personal + hidden objectives)
  - investigation # 추리 임무 (Mission Engine type: side + 추리 선택지 메커니즘)
```

## 7.2 추리 임무 전용 스키마 확장

```yaml
# MissionState 확장 (investigation 타입 전용)
investigation_data:
  clue_pool:
    - clue_id: string
      description: string
      discovery_method: observation | document | interview | direct_contact | database
      discovery_dc: int
      discovery_san_cost: int   # 직접 접촉 단서의 SAN 소모
      supports_conclusion: list[string]   # 이 단서가 지지하는 결론 ID

  conclusions:
    - conclusion_id: string
      description: string
      is_correct: bool          # GM 전용. 플레이어에게 비노출
      result_description: string
      world_effects: list[WorldEffect]
      rp_reward: int
      required_clues_minimum: int  # 이 결론 선택을 위한 최소 단서 수

  current_clues_discovered: list[string]
  conclusion_selected: string | null
  conclusion_revealed: bool
```

---

**END OF SCP_MissionSystem v1.0.0**
