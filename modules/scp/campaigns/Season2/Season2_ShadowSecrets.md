# SCP TRPG 2기 — Shadow Engine 비공개 정보

**문서 식별자:** `modules/scp/campaigns/Season2/Season2_ShadowSecrets.md`
**버전:** v1.0.0
**최종 수정:** 2026-06-26
**공개 여부:** 🔒 GM 전용 — 절대 플레이어에게 공개하지 말 것
**Shadow Engine 등록 대상:** 전체 내용

---

## 목차

1. [Shadow Engine 등록 항목 요약](#1-shadow-engine-등록-항목-요약)
2. [챕터 1 진실 — 공식 기록과의 간극](#2-챕터-1-진실--공식-기록과의-간극)
3. [봉투의 진짜 의미](#3-봉투의-진짜-의미)
4. [캐릭터별 Shadow 트래킹](#4-캐릭터별-shadow-트래킹)
5. [재단의 숨겨진 계획](#5-재단의-숨겨진-계획)
6. [숨겨진 타이머 등록](#6-숨겨진-타이머-등록)
7. [NPC 음모 트래킹](#7-npc-음모-트래킹)

---

# 1. Shadow Engine 등록 항목 요약

```yaml
shadow_state:
  campaign_id: scp_season2
  session_id: s2_chapter2_start

  hidden_timers:
    - timer_id: htmr_d_class_rotation_extended
      label: "D계급 로테이션 연장 만료"
      status: active
      duration_seconds: 259200    # 72시간
      trigger_action:
        type: shadow_scene
        description: "D계급 처분 명령 재개 + D계급 플레이어(해당 시) 압박 증가"
      notification_threshold: 86400  # 24시간 전 암시 신호

    - timer_id: htmr_core_resonance_evaluation
      label: "SCP 코어 붕괴 후속 평가 마감"
      status: active
      duration_seconds: 432000    # 120시간 (5일)
      trigger_action:
        type: world_event_activate
        description: "O5 위원회 결정 — 격리 챔버 섹터 C 처리 방향 확정"
      notification_threshold: 172800  # 48시간 전 암시 신호
      revelation_condition: "플레이어 중 한 명이 코어 붕괴 관련 Level 3 문서에 접근"

    - timer_id: htmr_researcher_isolation_deadline
      label: "연구원 관찰 기간 만료 — 재단 처리 결정"
      status: active
      duration_seconds: 345600    # 96시간 (4일)
      trigger_action:
        type: npc_action
        description: "연구원 3명 처리 방향 결정. 플레이어 관여 없으면 아메스틱 처리 + 원직 복귀."
      notification_threshold: 86400  # 24시간 전 암시 (연구원 쪽지 전달 시도)
      revelation_condition: "플레이어가 격리 목적 조사 판정 성공 (FDK DC 15)"

  npc_agendas:
    - agenda_id: shd_agd_envelope_sender
      npc_id: unknown    # 아직 미정
      description: "봉투 발송 주체의 의도 추적"
      progress: 0
      status: active

    - agenda_id: shd_agd_researcher_isolation
      description: "연구원 3명 격리의 진짜 이유"
      progress: 30
      trigger_thresholds:
        - threshold: 50
          action_type: director_hint
          description: "연구원 1명이 의료팀 감시 틈새에서 짧은 쪽지를 전달 시도"
        - threshold: 80
          action_type: shadow_scene
          description: "연구원 격리 해제 또는 영구 이관 결정 발동"

  roll_buffer:
    session_total_rolls: 0
    running_luck_score: 0.0
    current_dc_adjustment: 0
```

---

# 2. 챕터 1 진실 — 공식 기록과의 간극

## 2.1 공식 보고서와 실제 상황의 차이

| 항목 | 공식 기록 | 실제 상황 (GM 전용) |
|------|---------|----------------|
| SCP 코어 붕괴 | "평가 중" | 붕괴가 인근 격리 개체와 미세한 공명 현상을 일으켰다. 측정 가능한 수준이지만 재단은 공개를 보류하고 있다 |
| 연구원 3명 생환 | "현장 인원의 적절한 대응" | 생환 자체는 사실이나, 3명 중 최소 1명이 짧은 시간 SCP와 비인가 접촉을 했다. 의료 격리는 건강 모니터링이 아니라 변화 관찰이다 |
| 격리 안정화 | "성공" | 기술적으로 성공이지만, 재단 내부에서 이 사건이 "관리된 실패"였는지 "예상 밖의 성공"이었는지 논쟁 중이다 |
| AMBER-4 이유 | "예방적 조치" | 코어 붕괴 후 사이트 내 다른 SCP들의 소규모 이상 반응이 복수 보고됐다. 연쇄 반응 가능성을 배제하지 못하는 상태 |

## 2.2 GM이 관리해야 하는 내러티브 간극

- 연구원 격리: 플레이어들이 면회를 시도하면 제한에 부딪힌다. 이유는 납득할 수 없다. 단서는 있다.
- AMBER-4 실제 이유: 조사하면 SCP들의 비정상적 조용함이 오히려 이상하다는 것을 알 수 있다 (소음·진동 감소)
- 코어 붕괴 공명: 격리 챔버 섹터 C 봉쇄는 이것 때문이다. Level 3 문서 접근 시 일부 확인 가능

---

# 3. 봉투의 진짜 의미

## 3.1 봉투 발송 주체

**현재 미확정.** 봉투가 누구로부터 왔는지는 GM이 챕터 2 선택 시나리오에 따라 결정한다. 아래는 가능한 세 가지 해석이며, GM은 하나를 선택한다.

| 해석 | 발송 주체 | 함의 |
|------|---------|------|
| A: 재단 내부 세력 | 재단 고위 인사 중 반O5 세력 | 플레이어들을 시험/포섭하려는 시도. 키워드는 약점 파악용 |
| B: SCP 관련 존재 | 챕터 1의 SCP 또는 그 잔향 | 봉투가 SCP 코어 붕괴의 부산물. 키워드는 그 사람이 가장 두려워하는 것 |
| C: 플레이어 중 한 명 | 미래의 자신 또는 타임루프 관련 SCP | 가장 복잡한 해석. 키워드는 스스로 선택한 것 |

**GM 선택 지침:** 챕터 2 시나리오 선택 후 이 항목을 확정한다. 선택한 시나리오의 테마와 일관성 있는 해석을 고른다.

## 3.2 키워드의 실제 기능

봉투 키워드는 각 캐릭터의 **2기 비밀 미션 씨앗**이다. 아직 비밀 미션은 부여되지 않았다. 챕터 2 시나리오 확정 후 키워드에서 각 캐릭터의 비밀 미션을 도출한다.

| 키워드 | 비밀 미션 도출 방향 (후보) |
|--------|--------------------------|
| **통제권** (체르노프) | A: 재단 내 특정 시스템의 접근 코드를 획득한다 / B: SCP 관련 결정을 재단 대신 자신이 내린다 / C: 다른 플레이어 한 명의 행동을 자신의 의지대로 유도한다 |
| **선택권** (노엘) | A: 재단이 강요하는 선택 상황에서 공식 경로 외 제3의 선택지를 만든다 / B: 이번 챕터에서 단 한 번, 재단의 명령을 거부한다 / C: 다른 플레이어의 비밀 미션 내용을 파악한다 |
| **기억** (카네) | A: 챕터 1에서 경험한 특정 기억을 문서로 남긴다 (재단 외부에) / B: 연구원 격리자 중 한 명의 기억을 확인한다 / C: 자신의 아메스틱 피해 여부를 확인한다 |
| **관계** (위 페이런) | A: 이번 챕터에서 재단 NPC 한 명과 신뢰 관계를 구축한다 / B: 다른 플레이어 한 명을 위해 자신의 RP를 희생할 수 있는 상황을 만든다 / C: 격리된 연구원 중 한 명과 접촉에 성공한다 |

**GM은 챕터 시작 전 각 플레이어에게 위 후보 중 하나를 비밀 미션으로 선택·부여한다.**

---

# 4. 캐릭터별 Shadow 트래킹

## 4.1 체르노프 반 (RP 30)

```yaml
retirement_monitoring:
  player: 체르노프_반
  current_rp: 30
  monitoring_level: 1
  next_threshold: 60    # 이 구간 도달 시 재단 요주의 마킹
  threshold_distance: 30

shadow_notes:
  - "RP 30은 평균 대비 높은 축. 재단이 주목하기 직전 단계."
  - "'통제권' 키워드 — 체르노프가 어떤 통제를 원하는지 관찰할 것"
  - "챕터 2에서 통제권 관련 선택지가 주어질 때 반응을 주목"

pacing_notes:
  - "체르노프가 먼저 행동을 취하는 성향이면 통제권 미션은 자연스럽게 연결됨"
  - "수동적이면 통제권을 '빼앗긴 것'으로 프레이밍하는 것이 적합"
```

## 4.2 노엘 로원 (RP 35)

```yaml
retirement_monitoring:
  player: 노엘_로원
  current_rp: 35
  monitoring_level: 1
  next_threshold: 60
  threshold_distance: 25    # 파티 내 최단 거리

shadow_notes:
  - "RP 35 — 파티 내 최고. 재단이 가장 주의 깊게 보는 인원."
  - "챕터 2에서 RP 10 이상 획득 시 감시 수준 2 전환 임박"
  - "'선택권' 키워드 — 노엘은 이미 많은 선택을 했다. 그 선택들의 결과가 2기에서 돌아올 수 있음"

pacing_notes:
  - "노엘 RP가 60 근접 시 Director에 atmosphere_cue 발행 준비"
  - "재단 NPC의 시선이 노엘에게 조금 더 집중되기 시작하는 암시 삽입 가능"
```

## 4.3 카네 치아키 (RP 25)

```yaml
retirement_monitoring:
  player: 카네_치아키
  current_rp: 25
  monitoring_level: 0
  next_threshold: 30
  threshold_distance: 5    # 가장 짧은 거리이나 아직 감시 수준 미도달

shadow_notes:
  - "RP 25이지만 감시 수준 0 — 재단의 시선 밖에 있다"
  - "이 상대적 자유가 '기억' 관련 비밀 미션에 유리한 포지션"
  - "SCP 접촉 이력이 있다면 기억 관련 이상 여부를 내부적으로 추적할 것"

shadow_flag:
  - "연구원 격리 이슈와 카네의 '기억' 키워드 연결 여부를 세션 중 관찰"
  - "카네가 격리된 연구원과 접촉을 시도하면 '기억' 비밀 미션 트리거 강화"
```

## 4.4 위 페이런 (RP 25)

```yaml
retirement_monitoring:
  player: 위_페이런
  current_rp: 25
  monitoring_level: 0
  next_threshold: 30
  threshold_distance: 5

shadow_notes:
  - "카네와 동점. 마찬가지로 재단 감시 미도달"
  - "'관계' 키워드 — 파티 내 유대, NPC와의 신뢰, 연구원과의 관계가 모두 가능성"
  - "연구원 3명 생환과 위 페이런의 행동 이력이 연결될 경우, 연구원 격리 이슈가 강한 동력이 됨"

shadow_flag:
  - "위 페이런이 연구원들의 상황에 관심을 보이면 '관계' 비밀 미션의 B 또는 C 옵션 활성화"
  - "다른 플레이어의 이익을 위해 자신을 희생하는 선택을 하는지 관찰"
```

---

# 5. 재단의 숨겨진 계획

## 5.1 브리핑 D-7의 실제 목적

브리핑 구역 D-7에서 이 4명을 부른 이유는 챕터 2 시나리오에 따라 달라진다. 공통 요소만 사전 확정한다:

| 요소 | 내용 |
|------|------|
| **호출 주체** | 사이트 내 특정 부서장급 인물 (신규 NPC 또는 챕터 1 연속 NPC) |
| **표면적 이유** | 챕터 1 사건 관련 보완 브리핑 또는 새로운 임무 부여 |
| **실제 이유** | 챕터 2 시나리오에 따라 GM이 확정 |
| **봉투와의 관계** | D-7 브리핑 담당자가 봉투 발송 주체와 연결될 수 있음 |

## 5.2 SCP 코어 붕괴 후속 처리

```
[GM 전용 — 공식 기록 미수록]

코어 붕괴로 발생한 공명 현상:
- 섹터 C 인근 SCP 3개체에서 미세한 상태 변화 감지
- 변화의 방향: 모두 '조용해지고 있음' — 이상하게 협조적인 상태
- 재단 해석: 두 가지 상반된 의견 존재
  A: 코어 붕괴가 인근 SCP를 약화시켰다 → 연구 기회
  B: SCP들이 무언가를 기다리고 있다 → 위험 신호
- 현재: O5 결정 대기 중 (5일 타이머 가동 중)
```

## 5.3 연구원 3명 격리의 진짜 이유

```
[GM 전용]

연구원 중 최소 1명(GM이 선택)이 SCP와의 접촉 중 짧은 시간
비인가 직접 접촉 상태가 발생했다.

현재까지 관찰된 변화:
- 신체적: 이상 없음
- 심리적: "기억이 조금 다른 것 같다"고 1명이 발언 (의무 기록)
- 행동: 3명 모두 격리에 매우 협조적 (이것 자체가 이상함)

재단의 결정:
- 공식: 건강 모니터링
- 비공식: 변화 관찰 후 필요 시 아메스틱 처리 또는 영구 이관

플레이어 접근 시 처리:
- 면회는 의료팀 동반 필수
- 연구원들이 쪽지를 전달하려 하면 Shadow NPC Agenda 50 트리거
```

---

# 6. 숨겨진 타이머 등록

Shadow Engine에 즉시 등록해야 하는 타이머 목록:

## 6.1 D계급 로테이션 연장 만료

```yaml
timer_id: htmr_d_class_rotation_extended
label: "D계급 처분 연장 만료"
owner_type: shadow_internal
duration_seconds: 259200    # 72시간
trigger_action:
  type: shadow_scene
  description: |
    D계급 플레이어(해당 시)에 대한 처분 명령 재개 압박.
    D계급 아닌 플레이어라도 '이번 달 처분 목록'이 재가동된다는
    분위기 암시를 삽입한다.
notification_threshold: 86400   # 24시간 전
revelation_condition: null      # 플레이어에게 공개하지 않음
hidden_timer: true
```

## 6.2 SCP 코어 공명 평가 마감

```yaml
timer_id: htmr_core_resonance_evaluation
label: "O5 코어 붕괴 후속 결정 마감"
owner_type: world_event
duration_seconds: 432000    # 120시간 = 5일
trigger_action:
  type: world_event_activate
  description: |
    O5 결정 발동. 선택에 따라:
    - 결정 A: 섹터 C 연구 재개 → 새로운 위험 요소 등장
    - 결정 B: 섹터 C 영구 봉쇄 → 격리된 SCP들의 상태 변화 없이 동결
notification_threshold: 172800   # 48시간 전
revelation_condition: "플레이어가 Level 3 코어 붕괴 문서에 접근 성공"
hidden_timer: true
```

## 6.3 연구원 격리 관찰 기간 만료

```yaml
timer_id: htmr_researcher_isolation_deadline
label: "연구원 관찰 기간 만료 — 재단 처리 결정"
owner_type: shadow_internal
duration_seconds: 345600    # 96시간 = 4일
trigger_action:
  type: npc_action
  description: |
    연구원 3명의 처리 방향 결정.
    - 플레이어가 접촉·구출 시도 중이면: 결정 보류 + 압박 증가
    - 플레이어가 관여 없으면: 아메스틱 처리 후 원직 복귀 (기억 일부 소실)
notification_threshold: 86400   # 24시간 전 암시 (연구원이 쪽지 전달 시도)
revelation_condition: "플레이어가 격리 목적 조사 판정 성공 (FDK DC 15)"
hidden_timer: true
```

---

# 7. NPC 음모 트래킹

## 7.1 봉투 발송 주체의 의도

```yaml
agenda_id: shd_agd_envelope_sender
agenda_description: |
  봉투를 보낸 존재가 이 4명을 관찰하고 있다.
  챕터 2에서 이들이 어떤 선택을 하는지 지켜보며
  다음 접촉 타이밍을 결정하고 있다.
progress: 0
trigger_thresholds:
  - threshold: 30
    action_type: director_hint
    description: |
      파티 중 한 명이 "이것이 우연이 아니다"는 느낌을 주는 작은 단서를 발견한다.
      (예: 봉투와 같은 필체의 메모, 자신만 볼 수 있는 작은 표시)
  - threshold: 60
    action_type: director_hint
    description: "봉투 주제 키워드와 현재 챕터 이벤트가 너무 정확히 일치한다는 것을 깨닫게 되는 장면"
  - threshold: 90
    action_type: mission_create
    description: "봉투 발송 주체를 추적하는 Emergent Mission 생성 제안"
status: active
```

## 7.2 재단 내부 논쟁 (A파 vs B파)

```yaml
agenda_id: shd_agd_foundation_internal_dispute
agenda_description: |
  O5 결정을 앞두고 재단 내부에서 두 의견이 대립 중.
  A파(연구 재개): 코어 붕괴 현상을 연구 기회로 본다.
  B파(봉쇄 강화): 코어 붕괴를 경고 신호로 본다.
  
  이 논쟁에 플레이어들이 휘말릴 수 있다.
  특히 연구원 직책 또는 행정직 플레이어가 있다면 각 파의 접촉 대상이 됨.
progress: 20
trigger_thresholds:
  - threshold: 40
    action_type: director_hint
    description: "서로 다른 입장의 NPC가 각각 플레이어에게 상반된 '비공식 조언'을 한다"
  - threshold: 70
    action_type: world_effect
    description: "두 파 중 하나가 O5 결정에 앞서 선제 행동을 취한다 — 세계 변화 발생"
status: active
```

---

**END OF Season2_ShadowSecrets v1.0.0**

> 이 문서의 모든 내용은 GM 전용입니다.
> 플레이어에게 노출 시 SV-SHD-003 위반입니다.
