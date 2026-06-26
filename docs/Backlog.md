# AI Narrative Engine — Project Backlog

> 최종 수정: 2026-06-26
> 상태 범례: `Backlog` / `In Progress` / `Done`

---

## 목차

- [CORE — 핵심 규격 및 아키텍처](#core--핵심-규격-및-아키텍처)
- [ENG-CREATOR — Creator Engine](#eng-creator--creator-engine)
- [ENG-COMPILER — Compiler Engine](#eng-compiler--compiler-engine)
- [ENG-DIRECTOR — Director Engine](#eng-director--director-engine)
- [ENG-WORLD — World Engine](#eng-world--world-engine)
- [ENG-MEMORY — Memory Engine](#eng-memory--memory-engine)
- [ENG-NPC — NPC Engine](#eng-npc--npc-engine)
- [ENG-MISSION — Mission Engine](#eng-mission--mission-engine)
- [ENG-SAVE — Save Engine](#eng-save--save-engine)
- [ENG-SHADOW — Shadow Engine](#eng-shadow--shadow-engine)
- [ENG-QA — QA Engine](#eng-qa--qa-engine)
- [MOD-GENERIC — Generic Module](#mod-generic--generic-module)
- [MOD-SCP — SCP Module](#mod-scp--scp-module)
- [PROMPT — 시스템 프롬프트](#prompt--시스템-프롬프트)
- [TMPL — 템플릿](#tmpl--템플릿)
- [EXAMPLE — 예시 캠페인](#example--예시-캠페인)
- [TEST — 테스트 및 검증](#test--테스트-및-검증)

---

## CORE — 핵심 규격 및 아키텍처

| 번호 | 제목 | 상태 |
|------|------|------|
| #0001 | CoreSpec v0.1 초안 완성 | In Progress |
| #0002 | Engine 인터페이스 표준 정의 (각 Engine이 노출해야 하는 입출력 계약) | Backlog |
| #0003 | Engine 간 통신 프로토콜 정의 | Backlog |
| #0004 | Module ↔ Engine 연동 프로토콜 정의 | Backlog |
| #0005 | 전역 데이터 포맷 표준 정의 (상태 객체, 이벤트 포맷 등) | Backlog |
| #0006 | 버전 관리 및 하위 호환성 정책 수립 | Backlog |
| #0007 | CoreSpec v1.0 정식 릴리즈 | Backlog |

---

## ENG-CREATOR — Creator Engine

캐릭터, 세계관, 설정 요소를 생성하는 엔진.

| 번호 | 제목 | 상태 |
|------|------|------|
| #0008 | Creator Engine 기본 설계 문서 작성 | Backlog |
| #0009 | 캐릭터 생성 프로토콜 정의 (단계별 절차, 필수 필드) | Backlog |
| #0010 | 캐릭터 기본 스탯 시스템 설계 (세계관 독립적 추상 레이어) | Backlog |
| #0011 | 직업/클래스 시스템 추상 설계 | Backlog |
| #0012 | 배경 설정(Backstory) 생성 프로토콜 | Backlog |
| #0013 | 캐릭터 시트 데이터 구조 정의 | Backlog |
| #0014 | 세계관 생성 프로토콜 (World Seed 개념 정의) | Backlog |
| #0015 | 장소/지역 생성 프로토콜 | Backlog |
| #0016 | 세계관 내 세력/조직 생성 프로토콜 | Backlog |
| #0017 | Creator Engine 출력 포맷 표준화 | Backlog |

---

## ENG-COMPILER — Compiler Engine

플레이어 입력 및 규칙 문서를 파싱·검증하는 엔진.

| 번호 | 제목 | 상태 |
|------|------|------|
| #0018 | Compiler Engine 기본 설계 문서 작성 | Backlog |
| #0019 | 플레이어 입력 파싱 규칙 정의 (행동 선언 문법) | Backlog |
| #0020 | 규칙 문서 파싱 프로토콜 (Module 규칙을 Engine이 읽는 방법) | Backlog |
| #0021 | 규칙 충돌 감지 및 해소 우선순위 정의 | Backlog |
| #0022 | 입력 유효성 검사 체계 (불가능한 행동 처리) | Backlog |
| #0023 | 모호한 입력 처리 프로토콜 (AI 명확화 질문 기준) | Backlog |
| #0024 | Compiler 오류 코드 및 메시지 표준 정의 | Backlog |

---

## ENG-DIRECTOR — Director Engine

장면 연출, 내러티브 페이싱, 분위기를 관리하는 엔진.

| 번호 | 제목 | 상태 |
|------|------|------|
| #0025 | Director Engine 기본 설계 문서 작성 | Backlog |
| #0026 | 장면 전환 프로토콜 (트리거 조건, 전환 유형 분류) | Backlog |
| #0027 | 내러티브 페이싱 규칙 (긴장-이완 사이클 설계) | Backlog |
| #0028 | 분위기/톤 제어 시스템 (공포, 긴장, 일상 등 상태 정의) | Backlog |
| #0029 | 플레이어 선택지 제시 형식 정의 | Backlog |
| #0030 | 클라이맥스 연출 프로토콜 | Backlog |
| #0031 | 에필로그 및 세션 마무리 프로토콜 | Backlog |
| #0032 | AI 서술 금지 목록 정의 (플레이어 행동 강제 서술 방지) | Backlog |

---

## ENG-WORLD — World Engine

세계 상태, 시간, 환경, 지역을 관리하는 엔진.

| 번호 | 제목 | 상태 |
|------|------|------|
| #0033 | World Engine 기본 설계 문서 작성 | Done |
| #0034 | 세계 상태(World State) 데이터 구조 정의 | Done |
| #0035 | 시간 흐름 시스템 설계 (인게임 시간 추적) | Done |
| #0036 | 지역/장소 상태 관리 프로토콜 | Done |
| #0037 | 환경 이벤트 시스템 (날씨, 재난, 계절 등) | Done |
| #0038 | 세계 변화 추적 시스템 (플레이어 행동에 의한 세계 변화 반영) | Done |
| #0039 | 세계 상태 스냅샷 포맷 정의 | Done |

---

## ENG-MEMORY — Memory Engine

단기·장기 기억, 세션 간 연속성을 관리하는 엔진.

| 번호 | 제목 | 상태 |
|------|------|------|
| #0040 | Memory Engine 기본 설계 문서 작성 | Backlog |
| #0041 | 단기 기억 관리 프로토콜 (현재 세션 내 컨텍스트) | Backlog |
| #0042 | 장기 기억 관리 프로토콜 (세션 간 지속 기억) | Backlog |
| #0043 | 사건 로그(Event Log) 포맷 정의 | Backlog |
| #0044 | 기억 중요도 우선순위 산정 시스템 | Backlog |
| #0045 | 컨텍스트 압축 알고리즘 정의 (토큰 제한 대응) | Backlog |
| #0046 | 세션 간 연속성 보장 프로토콜 | Backlog |
| #0047 | 기억 참조 요청 인터페이스 정의 (다른 Engine이 기억을 조회하는 방법) | Backlog |

---

## ENG-NPC — NPC Engine

NPC의 생성, 행동, 대화, 관계를 관리하는 엔진.

| 번호 | 제목 | 상태 |
|------|------|------|
| #0048 | NPC Engine 기본 설계 문서 작성 | Done |
| #0049 | NPC 기본 데이터 구조 정의 | Done |
| #0050 | NPC 성격/행동 패턴 시스템 설계 | Done |
| #0051 | NPC 대화 생성 프로토콜 (성격 기반 어조 일관성) | Done |
| #0052 | NPC 관계 네트워크 시스템 (NPC 간 관계, NPC-플레이어 관계) | Done |
| #0053 | NPC 상태 변화 추적 (생사, 부상, 감정 상태) | Done |
| #0054 | 주요 NPC(Named NPC) vs 단역 NPC 분류 기준 및 처리 차등화 | Done |
| #0055 | NPC 동기(Motivation) 및 비밀 정보 관리 | Done |

---

## ENG-MISSION — Mission Engine

퀘스트, 목표, 보상, 분기를 관리하는 엔진.

| 번호 | 제목 | 상태 |
|------|------|------|
| #0056 | Mission Engine 기본 설계 문서 작성 | Backlog |
| #0057 | 퀘스트 데이터 구조 정의 (메인/서브 퀘스트 공통 포맷) | Backlog |
| #0058 | 목표(Objective) 추적 시스템 설계 | Backlog |
| #0059 | 성공/실패 조건 정의 체계 | Backlog |
| #0060 | 미션 분기 시스템 (선택에 따른 경로 분기) | Backlog |
| #0061 | 사이드 퀘스트 생성 및 관리 프로토콜 | Backlog |
| #0062 | 보상 시스템 설계 (추상 레이어, Module에서 구체화) | Backlog |
| #0063 | 퀘스트 실패 시 내러티브 처리 프로토콜 | Backlog |

---

## ENG-SAVE — Save Engine

게임 상태 저장, 복원, 체크포인트를 관리하는 엔진.

| 번호 | 제목 | 상태 |
|------|------|------|
| #0064 | Save Engine 기본 설계 문서 작성 | Done |
| #0065 | 게임 상태 스냅샷 포맷 정의 (전체 상태 직렬화 구조) | Done |
| #0066 | 세션 저장 프로토콜 (세션 종료 시 자동 저장 절차) | Done |
| #0067 | 세션 불러오기 프로토콜 (상태 복원 절차) | Done |
| #0068 | 체크포인트 시스템 설계 (중간 저장 지점 정의) | Done |
| #0069 | 저장 데이터 유효성 검사 프로토콜 | Done |
| #0070 | 저장 충돌(버전 불일치) 처리 프로토콜 | Done |

---

## ENG-SHADOW — Shadow Engine

숨겨진 정보, 음모, 백스테이지 이벤트를 관리하는 엔진.

| 번호 | 제목 | 상태 |
|------|------|------|
| #0071 | Shadow Engine 기본 설계 문서 작성 | Backlog |
| #0072 | 숨겨진 정보(Hidden Info) 관리 프로토콜 | Backlog |
| #0073 | 메타 정보 격리 시스템 (AI가 플레이어에게 노출하면 안 되는 정보 관리) | Backlog |
| #0074 | 음모/배후 설정(Behind-the-Scenes Plot) 관리 | Backlog |
| #0075 | 조건부 정보 공개 트리거 시스템 | Backlog |
| #0076 | 정보 공개 판단 기준 정의 (언제 숨길지, 언제 드러낼지) | Backlog |

---

## ENG-QA — QA Engine

세계관 일관성, 규칙 준수, 내러티브 무결성을 검사하는 엔진.

| 번호 | 제목 | 상태 |
|------|------|------|
| #0077 | QA Engine 기본 설계 문서 작성 | Backlog |
| #0078 | 세계관 일관성 검사 프로토콜 (설정 모순 감지) | Backlog |
| #0079 | 캐릭터 행동 일관성 검사 (성격·능력 범위 이탈 감지) | Backlog |
| #0080 | 시간선 충돌 감지 시스템 | Backlog |
| #0081 | Core Philosophy 위반 감지 체계 (플레이어 행동 강제 서술 등) | Backlog |
| #0082 | 자동 오류 보고 포맷 정의 | Backlog |
| #0083 | QA 실패 시 처리 흐름 정의 (경고, 롤백, 재생성) | Backlog |

---

## MOD-GENERIC — Generic Module

세계관에 종속되지 않는 범용 게임 메커니즘.

| 번호 | 제목 | 상태 |
|------|------|------|
| #0084 | Generic Module 설계 원칙 문서 작성 | Backlog |
| #0085 | 주사위 판정 시스템 설계 (추상 판정 레이어 — 특정 다이스 시스템 미지정) | Backlog |
| #0086 | 스킬 체크 메커니즘 정의 | Backlog |
| #0087 | 기본 전투 시스템 프로토콜 (순서, 행동, 결과 처리) | Backlog |
| #0088 | HP/내구도 추상 시스템 설계 | Backlog |
| #0089 | 상태이상(Status Effect) 시스템 정의 | Backlog |
| #0090 | 아이템/인벤토리 시스템 설계 | Backlog |
| #0091 | 경험치 및 성장 시스템 추상 설계 | Backlog |
| #0092 | 진영/평판 시스템 설계 (세력 호감도 추적) | Backlog |
| #0093 | 거래/경제 시스템 추상 설계 | Backlog |
| #0094 | 이동/탐색 시스템 설계 | Backlog |
| #0095 | 휴식/회복 시스템 설계 | Backlog |
| #0096 | 조사/정보 수집 시스템 설계 | Backlog |

---

## MOD-SCP — SCP Module

SCP 재단 세계관 전용 구현.  
Generic Module 위에 적층(overlay)되며, Generic 규칙을 SCP 설정으로 구체화한다.

| 번호 | 제목 | 상태 |
|------|------|------|
| #0097 | SCP Module 기본 설계 문서 작성 (Generic과의 관계, 오버라이드 원칙) | Backlog |
| #0098 | SCP 재단 세계관 설정 기준 문서 작성 | Backlog |
| #0099 | SCP 객체 데이터 구조 정의 (번호, 등급, 설명, 격리 절차, 부록) | Backlog |
| #0100 | 격리 등급 시스템 정의 (Safe / Euclid / Keter / Thaumiel 등) | Backlog |
| #0101 | 격리 절차 프로토콜 설계 | Backlog |
| #0102 | 격리 실패 시나리오 처리 시스템 | Backlog |
| #0103 | 위험도 산정 메커니즘 (개인/집단/세계 위협 등급) | Backlog |
| #0104 | SCP 특수 능력/이상현상 처리 시스템 | Backlog |
| #0105 | 재단 조직 구조 정의 (O5, 부서, 사이트) | Backlog |
| #0106 | 기동부대(MTF) 시스템 설계 (편제, 전문화, 운용 규칙) | Backlog |
| #0107 | D급 인원 시스템 설계 (조달, 소모, 권리 제한) | Backlog |
| #0108 | 재단 내부 직업 시스템 정의 (연구원, 경비원, 현장 요원, 관리직) | Backlog |
| #0109 | 이상현상 발견 및 격리 보고 프로세스 정의 | Backlog |
| #0110 | GOI (Groups of Interest) 시스템 설계 (뱀의 손, MC&D, UIU 등) | Backlog |
| #0111 | 재단 내부 파벌/정치 시스템 | Backlog |
| #0112 | 기억소거(Amnestic) 프로토콜 정의 | Backlog |
| #0113 | 재단 시설(Site/Area) 관리 시스템 | Backlog |
| #0114 | SCP 전투 시스템 (Generic 전투에 이상현상 변수 추가) | Backlog |
| #0115 | SCP 세계관 내 경험치/성장 시스템 (Generic 오버라이드) | Backlog |
| #0116 | 격리 로그 및 실험 보고서 포맷 정의 | Backlog |

---

## PROMPT — 시스템 프롬프트

AI가 사용하는 시스템 프롬프트 설계.

| 번호 | 제목 | 상태 |
|------|------|------|
| #0117 | Master System Prompt 초안 작성 | Backlog |
| #0118 | Engine별 서브 프롬프트 아키텍처 설계 (프롬프트 계층 구조) | Backlog |
| #0119 | 세계관 초기화 프롬프트 포맷 정의 | Backlog |
| #0120 | 플레이어 온보딩 프롬프트 작성 | Backlog |
| #0121 | AI 행동 제약 규칙 명문화 (Core Philosophy의 프롬프트 변환) | Backlog |
| #0122 | SCP Module 전용 시스템 프롬프트 작성 | Backlog |
| #0123 | 세션 재개 프롬프트 작성 (이전 상태 요약 주입 포맷) | Backlog |

---

## TMPL — 템플릿

반복 사용을 위한 표준 양식.

| 번호 | 제목 | 상태 |
|------|------|------|
| #0124 | 캠페인 설정 템플릿 (세계관, 규모, 플레이어 정보) | Backlog |
| #0125 | 캐릭터 시트 템플릿 (Generic) | Backlog |
| #0126 | 캐릭터 시트 템플릿 (SCP Module 전용) | Backlog |
| #0127 | 세션 로그 템플릿 | Backlog |
| #0128 | NPC 프로필 템플릿 | Backlog |
| #0129 | 퀘스트/미션 기록 템플릿 | Backlog |
| #0130 | 세계관 요약(World Summary) 템플릿 | Backlog |
| #0131 | SCP 객체 문서 템플릿 (표준 항목 양식) | Backlog |

---

## EXAMPLE — 예시 캠페인

실제 사용 사례 및 참고 구현체.

| 번호 | 제목 | 상태 |
|------|------|------|
| #0132 | 단일 세션 예시 캠페인 (Generic, 튜토리얼용) | Backlog |
| #0133 | SCP 격리 실패 예시 시나리오 | Backlog |
| #0134 | 장기 캠페인 예시 (5세션 이상, Memory Engine 활용 시연) | Backlog |
| #0135 | 캐릭터 생성 전 과정 예시 (Creator Engine 시연) | Backlog |
| #0136 | NPC와의 복잡한 상호작용 예시 (NPC Engine 시연) | Backlog |

---

## TEST — 테스트 및 검증

각 Engine 및 Module의 동작을 검증하는 테스트 명세.

| 번호 | 제목 | 상태 |
|------|------|------|
| #0137 | 테스트 명세 작성 원칙 문서 | Backlog |
| #0138 | Creator Engine — 캐릭터 생성 테스트 시나리오 | Backlog |
| #0139 | Creator Engine — 세계관 생성 테스트 시나리오 | Backlog |
| #0140 | Memory Engine — 세션 간 연속성 테스트 | Backlog |
| #0141 | Memory Engine — 컨텍스트 압축 정확도 테스트 | Backlog |
| #0142 | QA Engine — 세계관 모순 감지 테스트 | Backlog |
| #0143 | QA Engine — Core Philosophy 위반 감지 테스트 | Backlog |
| #0144 | Save Engine — 저장·복원 왕복 테스트 | Backlog |
| #0145 | NPC Engine — 성격 일관성 테스트 | Backlog |
| #0146 | MOD-SCP — 격리 시나리오 전 과정 테스트 | Backlog |
| #0147 | MOD-SCP — 격리 실패 분기 처리 테스트 | Backlog |
| #0148 | MOD-GENERIC — 전투 시스템 엣지 케이스 테스트 | Backlog |

---

## 집계

| Epic | 이슈 수 |
|------|---------|
| CORE | 7 |
| ENG-CREATOR | 10 |
| ENG-COMPILER | 7 |
| ENG-DIRECTOR | 8 |
| ENG-WORLD | 7 |
| ENG-MEMORY | 8 |
| ENG-NPC | 8 |
| ENG-MISSION | 8 |
| ENG-SAVE | 7 |
| ENG-SHADOW | 6 |
| ENG-QA | 7 |
| MOD-GENERIC | 13 |
| MOD-SCP | 20 |
| PROMPT | 7 |
| TMPL | 8 |
| EXAMPLE | 5 |
| TEST | 12 |
| **합계** | **148** |
