# SCP Foundation TRPG Module

**문서 식별자:** `modules/scp/SCPModule.md`
**버전:** v1.0.0
**모듈 ID:** `scp-foundation`
**상태:** Draft
**최종 수정:** 2026-06-26
**참조:** `core/CoreSpec.md` §6, `modules/generic/`

---

## 목차

1. [모듈 개요](#1-모듈-개요)
2. [디렉터리 구조](#2-디렉터리-구조)
3. [엔진 바인딩](#3-엔진-바인딩)
4. [세계관 핵심 원칙](#4-세계관-핵심-원칙)
5. [능력치 체계 재정의](#5-능력치-체계-재정의)
6. [파생 수치 체계](#6-파생-수치-체계)
7. [모듈 파일 목록](#7-모듈-파일-목록)

---

# 1. 모듈 개요

## 1.1 module.yaml

```yaml
module:
  id: scp-foundation
  name: SCP Foundation TRPG
  version: 1.0.0
  genre:
    - horror
    - sci-fi
    - bureaucratic-thriller
    - mystery
  engine_version: 1.0.0
  language: ko
  description: "SCP 재단풍 세계관에서 작동하는 TRPG 모듈. 퇴사 시스템을 핵심 승리 조건으로 사용한다."
  authors:
    - AI Narrative Engine Project
  dependencies:
    - id: generic
      version: ">=1.0.0"
```

## 1.2 모듈 핵심 테마

**퇴사 (Retirement):** SCP 재단은 직원이 자유 의지로 떠날 수 있는 조직이 아니다. 플레이어들은 재단의 통제에서 벗어나기 위한 퇴사 포인트를 축적하며 캠페인을 진행한다. 퇴사의 의미는 단순한 탈출이 아니다. 퇴직, 기억소거, 전향, 흡수, 소멸 — 모두가 퇴사의 한 형태다.

**관료주의와 공포의 공존:** 재단은 인류 최대의 관료 조직이다. 양식 제출, 클리어런스 확인, 절차 준수가 일상이다. 그 절차들 사이에서 설명할 수 없는 공포가 조용히 증식한다.

**비밀 유지:** 각 플레이어는 공개 목표(개인 미션)와 비공개 목표(비밀 미션)를 동시에 추구한다. 협력과 배신이 동시에 가능한 구조다.

---

# 2. 디렉터리 구조

```
modules/scp/
├── SCPModule.md              ← 이 파일. 모듈 총괄 명세
├── SCP_ToneGuide.md          ← 서술 어조 및 분위기 가이드
├── SCP_CampaignStructure.md  ← 챕터제 캠페인 구조
├── SCP_RetirementSystem.md   ← 퇴사 포인트 시스템
├── SCP_PlayerRoles.md        ← 플레이어 직책 (5종)
├── SCP_MissionSystem.md      ← 임무 시스템 (개인·비밀·추리)
├── SCP_SecretRule.md         ← 비밀 정보 관리 및 배신 규칙
├── SCP_ChapterTemplate.md    ← 챕터 제작 템플릿
├── character/
│   ├── archetypes.yaml       ← 직책별 아키타입 정의 [예정]
│   ├── stats.yaml            ← SCP 세계관 속성 매핑 [예정]
│   └── skills.yaml           ← 스킬 목록 [예정]
├── mechanics/
│   ├── dice.yaml             ← d20 기반 판정 시스템 [예정]
│   ├── sanity.yaml           ← 정신 안정도 시스템 [예정]
│   └── clearance.yaml        ← 클리어런스 레벨 시스템 [예정]
├── content/
│   ├── factions.yaml         ← 재단 내부 세력 정의 [예정]
│   ├── locations.yaml        ← 주요 시설 정의 [예정]
│   └── npcs.yaml             ← 기본 NPC 목록 [예정]
└── prompts/
    └── tone.md               ← SCP_ToneGuide.md와 연계 [예정]
```

---

# 3. 엔진 바인딩

각 엔진이 SCP 모듈에서 어떻게 작동하는지 정의한다.

| 엔진 | SCP 모듈에서의 역할 | 주요 확장 |
|------|-------------------|-----------|
| **Creator** | 플레이어 직책 생성, 재단 세계 초기화 | 클리어런스 레벨 기반 시작 위치 분리 |
| **Director** | 챕터 서술, 관료적 절차 묘사, SCP 현상 묘사 | SCP_ToneGuide 어조 강제 적용 |
| **World** | 시설 상태, 격리 위반 여부, 재단 세력 관계 추적 | 격리 등급(SCP Containment Status) 추가 필드 |
| **NPC** | 재단 직원, 지휘관, 위원회 위원, SCP 개체 반응 | SCP 개체 NPC 특수 처리 규칙 적용 |
| **Mission** | 격리 임무, 개인 미션, 비밀 미션, 추리 조사 | SCP_MissionSystem 규격 적용 |
| **Memory** | 기억소거 이벤트 처리, 세션 간 기억 유실 기록 | 아메스틱 적용 시 특정 기억 선별 삭제 |
| **Shadow** | 숨겨진 격리 타이머, SCP 개체 자율 행동, 비밀 미션 추적 | NPC 음모 = SCP 개체 자율 탈출 시도 |
| **Save** | 챕터 단위 체크포인트, 퇴사 포인트 저장 | 챕터 전환 시 자동 저장 |
| **QA** | 클리어런스 레벨 위반 접근, 격리 상태 일관성 검증 | SCP 관련 QA 규칙 추가 |
| **Compiler** | 플레이어 행동을 재단 절차 컨텍스트로 해석 | 직책 권한에 따른 유효성 검증 |

---

# 4. 세계관 핵심 원칙

## 4.1 재단의 3대 원칙 (세계관 공리)

```
Secure. Contain. Protect.
보호합니다. 억제합니다. 기록합니다.
```

이 세 원칙은 재단의 행동 근거이다. 재단이 잔혹한 결정을 내릴 때도 이 원칙 안에서 정당화한다. AI는 재단의 행동을 이 논리로 서술한다.

## 4.2 세계관 규칙 (world_rules 요약)

| 규칙 | 내용 |
|------|------|
| **클리어런스 우선** | 모든 정보 접근은 클리어런스 레벨로 제한된다. 레벨 미달 접근은 규정 위반이다. |
| **격리 절차 우선** | SCP 개체와의 비인가 접촉은 즉각 보고 의무가 발생한다. |
| **기억소거 가능성** | 재단은 필요 시 목격자에게 아메스틱(기억소거제)을 투여할 수 있다. |
| **D계급 소모성** | D계급 직원은 매월 처분 대상이 될 수 있다. 예외는 실적으로만 만든다. |
| **정보 분리 원칙** | 같은 정보를 여러 부서가 동시에 알 수 없다. 알아야 하는 자만 안다(Need to Know). |
| **창작 SCP 통합 가능** | 이 모듈은 공식 SCP 위키 개체 외에 캠페인 맞춤 창작 SCP를 추가할 수 있다. |

## 4.3 시간 척도

| 단위 | 재단 내 표현 |
|------|------------|
| 1시간 | 1 operational hour |
| 1일 | 1 standard containment cycle |
| 1주 | 1 standard review period |
| 1달 | 1 D-class rotation cycle |

---

# 5. 능력치 체계 재정의

Generic 모듈의 `primary_1`~`primary_6`을 SCP 세계관 속성으로 재매핑한다.

| Generic ID | SCP 속성 | 약어 | 설명 |
|------------|---------|------|------|
| `primary_1` | 체력 (Physique) | PHY | 신체 강도, 지구력, 직접 전투력 |
| `primary_2` | 두뇌 (Intellect) | INT | 분석 능력, 기억력, SCP 관련 지식 |
| `primary_3` | 의지 (Willpower) | WIL | 정신력, 공포 저항, SAN 파생 |
| `primary_4` | 기민함 (Agility) | AGI | 반응 속도, 은밀 행동, 회피 |
| `primary_5` | 재단지식 (Foundation Knowledge) | FDK | 재단 절차 숙지도, 내부 인맥, 규정 활용 |
| `primary_6` | 사회성 (Social) | SOC | 설득, 기만, 협상, 정보 수집 |

**직책별 권장 배분:**

| 직책 | 높은 속성 | 낮은 속성 |
|------|-----------|-----------|
| D계급 | PHY, AGI | FDK, SOC |
| 연구원 | INT, FDK | PHY, AGI |
| 보안팀 | PHY, AGI | INT, SOC |
| 기동특무부대 | PHY, AGI, WIL | SOC, FDK |
| 행정직 | FDK, SOC, INT | PHY, AGI |

---

# 6. 파생 수치 체계

| 파생 수치 | 계산식 | Generic 매핑 |
|-----------|--------|-------------|
| 체력 최대 (HP) | PHY × 2 + 5 | `derived.health_max` |
| 정신 안정도 최대 (SAN) | WIL × 3 + 5 | `derived.resource_max` |
| 방어 (DEF) | AGI 수정치 + 직책 기본값 | `derived.defense` |
| 이동 (MOV) | AGI 수정치 + 4 | `derived.movement` |

**SAN (정신 안정도):**
- 범위: 0 ~ SAN_max (최대 65, WIL 20 기준)
- SCP 개체와의 접촉, 이상 현상 목격, 동료 사망 등에서 감소
- 0 도달 시: 정신 붕괴 상태 (Broken State) — 캐릭터 판정 -4, 행동 이상 발생
- 회복: 안전 구역 휴식, 상담, 투약 (세션당 최대 1d6+WIL 수정치 회복)

**클리어런스 레벨 (Clearance Level):**
- 직책에 따른 기본값 (§5 참조)
- 게임 내 성취로 임시·영구 상승 가능
- 정보 접근, NPC 태도, 시설 이동에 직접 영향

---

# 7. 모듈 파일 목록

| 파일 | 역할 | 상태 |
|------|------|------|
| `SCPModule.md` | 모듈 총괄 메타데이터, 엔진 바인딩, 세계관 공리 | v1.0.0 |
| `SCP_ToneGuide.md` | Director Engine 서술 어조 가이드 | v1.0.0 |
| `SCP_CampaignStructure.md` | 챕터제 캠페인 골격, 전환 조건 | v1.0.0 |
| `SCP_RetirementSystem.md` | 퇴사 포인트 획득·손실, 6가지 엔딩 분기 | v1.0.0 |
| `SCP_PlayerRoles.md` | 5개 직책 상세 정의 및 클리어런스 시스템 | v1.0.0 |
| `SCP_MissionSystem.md` | 개인·비밀·추리 임무 시스템 규격 | v1.0.0 |
| `SCP_SecretRule.md` | 비밀 정보 관리, 배신 메커니즘 | v1.0.0 |
| `SCP_ChapterTemplate.md` | 챕터 제작 표준 양식 | v1.0.0 |

---

**END OF SCPModule v1.0.0**
