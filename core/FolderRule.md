# Folder Rule

## Status
Draft v0.1

---

# Purpose

이 문서는 AI Narrative Engine 프로젝트의 디렉토리 구조와 파일 배치 규칙을 정의한다.

모든 새 파일은 이 문서에 정의된 위치에만 배치되어야 한다.

---

# Directory Tree

```
AI-Narrative-Engine/
├── core/               ← 프로젝트 최상위 사양 (이 문서 포함)
├── engines/            ← 엔진별 사양 문서
│   ├── Compiler/
│   ├── Creator/
│   ├── Director/
│   ├── Memory/
│   ├── Mission/
│   ├── NPC/
│   ├── QA/
│   ├── Save/
│   ├── Shadow/
│   └── World/
├── modules/            ← 세계관별 구현
│   ├── generic/        ← 세계관 중립 공통 모듈
│   └── <world-name>/   ← 특정 세계관 모듈
├── prompts/            ← AI 프롬프트 문서
│   └── system/         ← 시스템 프롬프트
├── templates/          ← 재사용 가능한 게임 설정 템플릿
├── examples/           ← 세계관 중립 예시 캠페인
├── tests/              ← 검증 및 테스트 사양
├── docs/               ← 추가 문서 (사용자 가이드 등)
└── issues/             ← 이슈 추적
```

---

# Directory Responsibilities

## `core/`

- 최상위 사양 문서만 배치한다.
- 모든 다른 문서는 `core/`를 참조하지만, `core/`는 다른 디렉토리를 참조하지 않는다.
- 하위 디렉토리를 생성하지 않는다.

**포함 가능한 파일:**
- `CoreSpec.md`
- `*Spec.md`
- `*Rule.md`

---

## `engines/`

- 각 엔진은 독립된 하위 디렉토리를 가진다.
- 엔진 디렉토리 이름은 NamingRule.md의 Engine Name 목록과 일치해야 한다.
- 엔진 디렉토리 내에 추가 하위 디렉토리를 생성하지 않는다.

**포함 가능한 파일 (엔진 디렉토리 내):**
- `{EngineName}Engine.md` — 엔진 사양 (필수, 1개)
- 관련 보조 문서 (선택)

**금지:**
- 특정 세계관을 직접 참조하는 파일
- 다른 엔진 디렉토리를 직접 참조하는 파일

---

## `modules/`

- `generic/`은 세계관에 종속되지 않는 공통 게임 메커니즘을 포함한다.
- 세계관별 디렉토리(`<world-name>/`)는 해당 세계관에만 적용되는 내용을 포함한다.
- 새 세계관 추가 시 `modules/<world-name>/`을 생성한다.

**`generic/` 포함 가능한 파일:**
- 전투, 기술, 아이템 등 세계관 중립 메커니즘 문서

**`<world-name>/` 포함 가능한 파일:**
- 세계관 설정, 규칙, NPC 목록, 지역 정보 등
- 하위 디렉토리 허용: `characters/`, `locations/`, `factions/`, `items/`

---

## `prompts/`

- AI에게 직접 주입되는 프롬프트 문서만 배치한다.
- `system/`에는 Master System Prompt와 엔진 레벨 프롬프트를 배치한다.
- 세션 프롬프트는 런타임에 생성되며 이 디렉토리에 저장하지 않는다.

**`system/` 포함 가능한 파일:**
- `00_Master_SystemPrompt.md`
- `{NN}_{Name}_Prompt.md`

---

## `templates/`

- 캠페인 설정, 캐릭터 시트, 세션 계획 등의 재사용 가능한 빈 템플릿을 배치한다.
- 세계관에 종속된 내용을 포함하지 않는다.
- 하위 디렉토리를 생성하지 않는다.

**포함 가능한 파일:**
- `{Type}_Template.md`

---

## `examples/`

- 세계관 중립 예시만 배치한다.
- 특정 세계관 예시는 `modules/<world-name>/examples/`에 배치한다.
- 하위 디렉토리를 생성하지 않는다.

**포함 가능한 파일:**
- `Generic_{Description}.md`

---

## `tests/`

- 엔진, 모듈, 프롬프트의 검증 및 테스트 사양을 배치한다.
- 실제 실행 가능한 코드를 포함하지 않는다 (모든 개발은 Markdown).
- 하위 디렉토리를 생성하지 않는다.

**포함 가능한 파일:**
- `{Target}_{TestType}.md`

---

## `docs/`

- 사용자 가이드, 기여 가이드 등 보조 문서를 배치한다.
- 사양 문서는 `core/`에, 구현 문서는 해당 디렉토리에 배치한다.
- 하위 디렉토리 허용.

---

## `issues/`

- 이슈 추적 문서만 배치한다.
- 하위 디렉토리를 생성하지 않는다.

**포함 가능한 파일:**
- `{NNNN}_{ShortTitle}.md`

---

# Placement Decision Tree

새 파일을 추가할 때 다음 순서로 위치를 결정한다.

```
1. 최상위 사양인가?
   → YES: core/
   
2. 특정 엔진의 구현 문서인가?
   → YES: engines/<EngineName>/
   
3. 특정 세계관에 종속되는가?
   → YES: modules/<world-name>/
   → NO (범용 메커니즘): modules/generic/
   
4. AI에게 직접 주입되는 프롬프트인가?
   → YES: prompts/system/
   
5. 빈 재사용 템플릿인가?
   → YES: templates/
   
6. 세계관 중립 예시인가?
   → YES: examples/
   
7. 테스트/검증 사양인가?
   → YES: tests/
   
8. 이슈인가?
   → YES: issues/
   
9. 그 외: docs/
```

---

# Forbidden Placements

| 파일 유형 | 금지 위치 | 올바른 위치 |
|-----------|-----------|------------|
| 세계관 고유 내용 | `core/`, `engines/`, `templates/` | `modules/<world>/` |
| 엔진 사양 | `modules/`, `prompts/` | `engines/<Name>/` |
| 최상위 사양 | `engines/`, `modules/` | `core/` |
| 시스템 프롬프트 | `core/`, `engines/` | `prompts/system/` |
| 이슈 문서 | 모든 다른 디렉토리 | `issues/` |

---

# New World Module Setup

새 세계관 모듈을 추가할 때 생성해야 하는 최소 구조:

```
modules/<world-name>/
├── WorldOverview.md      ← 세계관 개요 (필수)
├── CoreRules.md          ← 세계관 전용 규칙 (필수)
└── README.md             ← 모듈 인덱스 (필수)
```

---

END
