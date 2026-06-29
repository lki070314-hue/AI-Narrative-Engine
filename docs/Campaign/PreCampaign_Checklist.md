# 본게임 시작 전 체크리스트

**문서 식별자:** `docs/Campaign/PreCampaign_Checklist.md`
**버전:** v1.0.0
**상태:** Release
**작성일:** 2026-06-29
**참조:** `docs/Campaign/Session0_Setup.md`, `modules/scp/campaigns/Season2/PlayerStatus.md`, `modules/scp/campaigns/Season2/Season2_StartPackage.md`, `docs/Beta/Beta03_ImprovementPlan.md`

---

## 이 문서의 목적

베타 테스트 완료 후 본게임(2기 챕터 2) 시작 전에 완료해야 할 항목을 정리한다.
**BLOCKING** 항목이 하나라도 미완료이면 세션 1을 시작할 수 없다.

---

## 1. BLOCKING — 세션 1 시작 불가 항목

| # | 항목 | 담당 | 완료 |
|---|---|---|---|
| 1 | `PlayerStatus.md §8` 능력치 표 완성 (4명 전원) | GM | ☐ |
| 2 | 챕터 2 시나리오 선택 완료 (`Chapter2_Candidates.md`) | GM | ☐ |
| 3 | 4명 전원 참여 확인 (체르노프·노엘·카네·위) | GM | ☐ |

### 1.1 능력치 표 — 현재 상태

`PlayerStatus.md §8`의 모든 능력치가 `—` (미입력)이다.
이 상태로는 Director Engine이 HP/SAN 추적 및 판정 처리를 할 수 없다.

입력 필요 항목:
- 각 캐릭터 직책 및 보안 등급
- PHY / INT / WIL / AGI / FDK / SOC 수치
- HP 최대값 계산 (= PHY × 2 + 5)
- SAN 최대값 계산 (= WIL × 3 + 5)
- 특기 및 장비 목록

직책별 기본값은 `modules/scp/mechanics/SCP_PlayerRoles.md` 참조.

---

## 2. 세션 0 완료 항목

`docs/Campaign/Session0_Setup.md` 기준.

| 항목 | 담당 | 완료 |
|---|---|---|
| 캠페인 정보 기입 | GM | ☐ |
| 어조 합의 완료 | 전원 | ☐ |
| 플레이어 참여 확인 | GM | ☐ |
| 능력치 표 완성 | GM | ☐ |
| 장비 목록 확정 (각 캐릭터) | 각 플레이어 | ☐ |
| 플레이 스타일 설문 완료 | 각 플레이어 | ☐ |
| 안전 신호 합의 | 전원 | ☐ |
| 회피 주제 기록 | 각 플레이어 → GM | ☐ |
| 피드백 방식 합의 | 전원 | ☐ |
| 챕터 2 시나리오 선택 | GM | ☐ |
| 비밀 미션 전달 | GM → 각 플레이어 | ☐ |
| 엔진 설정 확인 | GM | ☐ |

---

## 3. GM 전용 — 시나리오·Shadow 설정

| 항목 | 참조 | 완료 |
|---|---|---|
| Chapter2_Candidates.md에서 시나리오 1개 선택 | `Season2/Chapter2_Candidates.md` | ☐ |
| 봉투 발송 주체 해석 확정 (A/B/C) | `Season2_ShadowSecrets.md §3.1` | ☐ |
| Shadow Engine 타이머 3개 등록 | `Season2_ShadowSecrets.md §6` | ☐ |
| NPC 음모 트래킹 활성화 | `Season2_ShadowSecrets.md §7` | ☐ |
| 연구원 3명 중 비인가 접촉자 1명 결정 | GM 결정 | ☐ |
| 각 캐릭터 비밀 미션 설계 및 전달 방법 결정 | `Season2_ShadowSecrets.md §3.2` | ☐ |

---

## 4. 베타 테스트 후 권장 엔진 수정사항

Beta03에서 발견된 이슈 중 본게임 전에 엔진 문서에 반영을 권장하는 항목이다.
수정 없이 시작은 가능하나, 본게임에서 동일 문제가 재발할 가능성이 있다.

| # | 대상 문서 | 수정 내용 | 우선순위 |
|---|---|---|---|
| 1 | `engines/Director/DirectorEngine.md` | 타 캐릭터 속성 선언 규칙 추가 (GM 부여 vs. 플레이어 선언 분리) | P1 |
| 2 | `engines/Director/DirectorEngine.md` | 엔딩게임 확인 프로토콜 추가 (최종 행동 전 명시적 확인 요청) | P1 |
| 3 | `engines/OutputEngine.md` | 출력 최소 풍부도 기준 추가 (현재 상한만 있고 하한 없음) | P2 |

근거: `docs/Beta/Beta03_ImprovementPlan.md` IMP-B03-002, IMP-B03-003, IMP-B03-011

---

## 5. 엔진 로드 확인

세션 1 시작 직전 확인.

| 문서 | 확인 |
|---|---|
| `core/CoreSpec.md` | ☐ |
| `engines/Director/DirectorEngine.md` | ☐ |
| `engines/Director/AnomalyEngine.md` | ☐ |
| `modules/scp/` 모듈 전체 | ☐ |
| `modules/scp/campaigns/Season2/Season2_PublicState.md` | ☐ |
| `modules/scp/campaigns/Season2/PlayerStatus.md` (§8 완성본) | ☐ |
| `docs/Campaign/Session_Record_Template.md` | ☐ |

---

## 모든 항목 완료 → 세션 1 시작 가능

---

**END OF PreCampaign_Checklist v1.0.0**
