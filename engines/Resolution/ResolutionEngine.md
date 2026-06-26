# Resolution Engine Specification

**문서 식별자:** `engines/Resolution/ResolutionEngine.md`
**버전:** v1.0.0
**상태:** Draft
**최종 수정:** 2026-06-26
**참조:** `core/CoreSpec.md` §8, §12 / `engines/Compiler/CompilerEngine.md` / `engines/Director/DirectorEngine.md`

---

## 1. 목적

Resolution Engine은 플레이어와 NPC의 불확실한 행동을 "시도(attempt)"로 평가하고, 난이도와 결과를 결정하는 범용 판정 엔진이다.

Director Engine은 플레이어 행동의 성공을 자동으로 가정하지 않는다. Compiler Engine이 행동 의도를 구조화하면, Resolution Engine은 그 행동이 얼마나 어려운지 평가하고 결과를 확정한다. Director Engine은 확정된 결과만 서술한다.

---

## 2. 핵심 원칙

1. 모든 플레이어 행동은 먼저 `attempt`로 취급한다.
2. 성공이 자명한 일상 행동만 자동 성공으로 처리할 수 있다.
3. 실패 가능성, 비용, 위험, 반대 세력, 시간 압박, 숨겨진 정보가 있으면 반드시 Resolution Engine을 거친다.
4. Director Engine은 판정 전 성공, 실패, 발견, 설득, 침투, 피해, 획득을 확정하지 않는다.
5. 결과는 세계관 모듈의 규칙과 현재 상태에 맞아야 한다.
6. 불가능해 보이는 행동도 즉시 거부하지 않고, 먼저 plausibility를 평가한다.

---

## 3. 표준 처리 흐름

```text
Player Action
→ Difficulty Evaluation
→ Resolution
→ Outcome
→ World Update
```

| 단계 | 담당 | 설명 |
|------|------|------|
| Player Action | Compiler | 플레이어 입력을 `resolved_action` 또는 `attempt_request`로 구조화한다. |
| Difficulty Evaluation | Resolution | 목표, 위험, 능력, 도구, 환경, 반대 세력을 기반으로 난이도를 평가한다. |
| Resolution | Resolution | 자동 성공, 자동 실패, 판정 필요, 부분 성공 중 하나로 처리한다. |
| Outcome | Resolution / NPC / Mission | 결과, 비용, 발견, 피해, 관계 변화, 임무 진행 여부를 확정한다. |
| World Update | World / Memory / Save | 확정된 결과만 WorldEffect, Memory event, Save trigger로 전달한다. |

---

## 4. 입력

```yaml
attempt_request:
  id: string
  actor_id: string
  source_action_id: string
  action_type: combat | stealth | persuasion | investigation | theft | hacking | social_interaction | movement | item | other
  declared_intent: string
  target_ids: list[string]
  method: string | null
  stakes:
    risk_level: none | low | medium | high | severe
    irreversible: bool
    time_pressure: bool
    hidden_information_involved: bool
  actor_capabilities:
    relevant_traits: list[string]
    relevant_skills: list[string]
    tools_available: list[string]
    conditions: list[string]
  scene_context:
    location_id: string
    visible_factors: list[string]
    opposing_entities: list[string]
    environmental_modifiers: list[string]
  active_module: ModuleContext
```

---

## 5. 출력

```yaml
resolution_result:
  id: string
  attempt_id: string
  action_type: combat | stealth | persuasion | investigation | theft | hacking | social_interaction | movement | item | other
  difficulty:
    rating: trivial | easy | standard | hard | extreme | impossible
    reason: string
    public_hint: string | null
  resolution:
    method: automatic_success | automatic_failure | check_required | opposed_check | gm_required
    check_type: string | null
    target_threshold: int | null
    opposed_by: string | null
  outcome:
    status: critical_success | success | partial_success | failure | critical_failure | blocked
    summary: string
    costs: list[string]
    complications: list[string]
    discovered_facts: list[string]
  world_effects: list[WorldEffect]
  npc_reaction_requests: list[NPCReactionRequest]
  mission_update_requests: list[MissionUpdateRequest]
  memory_events: list[MemoryEvent]
  requires_director_clarification: string | null
```

숫자 난이도, 판정값, 내부 보정값은 플레이어에게 직접 노출하지 않는다.

---

## 6. 난이도 평가 규칙

Resolution Engine은 다음 순서로 난이도를 평가한다.

1. **의도 명확성:** 플레이어가 무엇을 달성하려는지 확인한다.
2. **대상 상태:** 대상이 존재하고 접근 가능한지 확인한다.
3. **행동 유형:** 전투, 은신, 설득, 조사, 절도, 해킹, 사회 상호작용 등으로 분류한다.
4. **배경 조건:** 환경, 시간, 도구, 부상, 제약, 관찰자, 보안, 사회적 맥락을 반영한다.
5. **반대 세력:** NPC, 시스템, 환경, 조직 규칙 등 저항 주체가 있는지 확인한다.
6. **위험과 비용:** 실패 시 비용이 있는지 확인한다.
7. **세계관 규칙:** active_module이 정의한 능력, 기술, 장비, 물리 법칙을 적용한다.

난이도는 결과를 강제하기 위한 장치가 아니라, 현재 세계가 그 시도에 어떻게 반응하는지 판단하기 위한 기준이다.

---

## 7. 행동 유형별 처리

| 유형 | 평가 기준 | 대표 결과 |
|------|-----------|-----------|
| `combat` | 거리, 무기, 방어, 기습, 엄폐, 상태 이상, 다수 교전 | 피해, 제압, 위치 변화, 반격, 소모 |
| `stealth` | 은폐물, 소음, 조명, 감시자 주의, 이동 속도 | 은신 유지, 들킴, 의심 증가, 제한적 이동 |
| `persuasion` | 관계, 신뢰, 이해관계, 증거, 말투, 상대 목표 | 동의, 조건부 동의, 거절, 의심, 협상 조건 |
| `investigation` | 단서 접근성, 도구, 시간, 전문성, 위험 | 사실 발견, 부분 단서, 오해 가능성, 시간 소모 |
| `theft` | 접근 권한, 보안, 소유자 주의, 물건 크기, 탈출 경로 | 획득, 발각, 흔적 남김, 대체 단서 발견 |
| `hacking` | 접근 권한, 시스템 보안, 도구, 시간, 추적 위험 | 접근 성공, 부분 접근, 잠금, 추적, 데이터 손상 |
| `social_interaction` | 사회적 지위, 맥락, 관계, 공개성, 집단 압력 | 호감 변화, 정보 획득, 갈등 완화, 체면 손상 |

세계관 모듈이 더 구체적인 규칙을 제공하면 해당 규칙이 우선한다.

---

## 8. 자동 성공과 자동 실패

자동 성공은 다음 조건을 모두 만족할 때만 허용된다.

- 실패 가능성이 의미 있는 결과를 만들지 않는다.
- 현재 상태에서 캐릭터가 명백히 수행할 수 있다.
- 숨겨진 정보, 반대 세력, 위험, 시간 압박이 없다.
- 결과가 세계 상태를 크게 바꾸지 않는다.

자동 실패는 다음 조건 중 하나를 만족할 때만 허용된다.

- 세계관 규칙상 완전히 불가능하다.
- 필수 대상 또는 수단이 존재하지 않는다.
- 시도가 물리적, 사회적, 논리적으로 성립하지 않는다.

자동 실패도 서술 가능한 결과다. 단순히 "불가능합니다"로 끝내지 않고, 왜 실패가 보이는지와 어떤 다른 접근 여지가 있는지 Director가 서술할 수 있도록 `public_hint`를 제공한다.

---

## 9. 예상 밖 행동 처리

플레이어가 문서에 없는 방식으로 행동해도 실패로 간주하지 않는다.

처리 순서:

1. 선언된 의도를 보존한다.
2. 가장 가까운 행동 유형을 찾는다.
3. 현재 세계에서 가능한 정도를 평가한다.
4. 필요한 경우 `gm_required` 또는 `requires_director_clarification`을 반환한다.
5. 가능한 경우 비용, 지연, 부분 성공, 새 위험을 포함해 자연스럽게 계속 진행한다.

예상 밖 행동은 새 임무, 새 관계 변화, 새 단서 발견으로 이어질 수 있다. 단, 숨겨진 정보와 세계관 규칙은 유지한다.

---

## 10. 다른 엔진과의 관계

| 엔진 | 관계 |
|------|------|
| Compiler | 플레이어 입력을 구조화하고 `attempt_request`의 원천이 된다. |
| Director | 결과를 서술하지만, Resolution 전 성공을 확정하지 않는다. |
| World | 확정된 `world_effects`만 수신해 세계 상태를 갱신한다. |
| NPC | NPC 반응, 저항, 대화 결과가 필요할 때 호출된다. |
| Mission | 결과가 임무 목표와 관련되면 진행, 완료, 실패 여부를 평가한다. |
| Shadow | 숨겨진 타이머, 비공개 보정, 비가시 사건은 플레이어에게 노출하지 않는다. |
| Memory | 확정 결과와 발견된 사실만 저장한다. |
| QA | 자동 성공 남용, 메타 정보 노출, 세계 규칙 위반을 검증한다. |

---

## 11. 검증 규칙

| 규칙 ID | 검증 항목 | 위반 시 처리 |
|---------|-----------|-------------|
| `SV-RES-001` | 위험 또는 불확실성이 있는 행동이 Resolution 없이 성공 처리되었는가 | Error — 결과 무효, Resolution 요청 |
| `SV-RES-002` | 난이도 평가가 세계관 규칙 또는 현재 상태와 충돌하는가 | Error — 재평가 |
| `SV-RES-003` | 플레이어에게 판정값, DC, 내부 보정이 노출되었는가 | Error — 출력 재생성 |
| `SV-RES-004` | 예상 밖 행동을 검토 없이 거절했는가 | Warning — plausibility 평가 요청 |
| `SV-RES-005` | 결과가 WorldEffect 없이 세계 상태를 바꾸었는가 | Error — World update 생성 |

---

**END OF ResolutionEngine v1.0.0**
