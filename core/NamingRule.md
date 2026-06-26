# Naming Rule

## Status
Draft v0.1

---

# Purpose

이 문서는 AI Narrative Engine 프로젝트의 모든 파일, 디렉토리, 식별자의 명명 규칙을 정의한다.

명명 규칙은 문서의 목적, 계층, 유형을 이름에서 즉시 식별할 수 있도록 설계되었다.

---

# File Naming Rules

## 기본 원칙

- 모든 파일명은 영어를 사용한다.
- 파일명에 공백을 사용하지 않는다. 단어 구분은 언더스코어(`_`) 또는 PascalCase를 사용한다.
- 파일 확장자는 반드시 `.md`를 사용한다.

---

## Spec 문서 (사양서)

형식: `{Name}Spec.md`

```
CoreSpec.md
PromptSpec.md
OutputSpec.md
```

규칙:
- 이름은 단일 PascalCase 단어 또는 복합어를 사용한다.
- `Spec` 접미사는 필수이다.

---

## Rule 문서 (규칙서)

형식: `{Name}Rule.md`

```
ValidationRule.md
NamingRule.md
FolderRule.md
```

규칙:
- 이름은 단일 PascalCase 단어 또는 복합어를 사용한다.
- `Rule` 접미사는 필수이다.

---

## Engine 문서

형식: `{EngineName}Engine.md`

```
DirectorEngine.md
MemoryEngine.md
NPCEngine.md
```

규칙:
- `Engine` 접미사는 필수이다.
- Engine 이름은 CLAUDE.md의 엔진 목록과 일치해야 한다.

---

## Module 문서

형식: `{Domain}_{Description}.md`

```
Combat_BasicRules.md
Skill_CheckSystem.md
Item_EquipmentList.md
```

규칙:
- 도메인은 PascalCase로 작성한다.
- 설명은 PascalCase로 작성한다.
- 도메인과 설명은 언더스코어로 구분한다.

---

## Prompt 문서

형식: `{NN}_{PurposeName}.md`

```
00_Master_SystemPrompt.md
01_Director_Prompt.md
02_NPC_Prompt.md
```

규칙:
- `NN`은 두 자리 숫자이다 (00, 01, 02, ...).
- 숫자는 로드 순서를 나타낸다.
- 00은 Master System Prompt 전용이다.
- 목적명은 PascalCase로 작성한다.

---

## Template 문서

형식: `{Type}_Template.md`

```
Character_Template.md
World_Template.md
Session_Template.md
```

규칙:
- `Template` 접미사는 필수이다.
- 유형명은 PascalCase 단수형을 사용한다.

---

## Example 문서

형식: `{WorldTag}_{Description}.md`

```
Generic_CombatExample.md
Generic_SessionExample.md
```

규칙:
- 세계관 중립 예시는 `Generic` 태그를 사용한다.
- 세계관별 예시는 `modules/<world>/examples/`에 위치한다.

---

## Issue 문서

형식: `{NNNN}_{ShortTitle}.md`

```
0001_CoreSpec.md
0042_MemoryEngineLoop.md
```

규칙:
- `NNNN`은 네 자리 숫자이다 (0001부터 시작, 순차 증가).
- 제목은 PascalCase 또는 CamelCase로 작성한다.
- 공백 없이 단어를 연결한다.

---

## Test 문서

형식: `{Target}_{TestType}.md`

```
Director_OutputTest.md
Memory_ConsistencyTest.md
```

규칙:
- 대상은 엔진 또는 모듈 이름을 사용한다.
- 테스트 유형은 PascalCase로 작성한다.

---

# Directory Naming Rules

- 디렉토리명은 PascalCase를 사용한다. (단, 최상위 디렉토리는 소문자 예외 허용)
- 세계관 디렉토리명은 소문자를 사용한다. (예: `scp`, `generic`)
- 디렉토리명에 공백, 특수문자를 사용하지 않는다.

| 디렉토리 유형 | 형식 | 예시 |
|--------------|------|------|
| 최상위 | 소문자 | `core`, `engines`, `modules` |
| Engine | PascalCase | `Director`, `Memory`, `NPC` |
| World Module | 소문자 | `generic`, `scp` |
| Prompt 하위 | 소문자 | `system`, `session` |

---

# Identifier Naming Rules

문서 내에서 사용되는 식별자의 명명 규칙.

### Rule ID
형식: `{CategoryPrefix}-{NNN}`

```
DV-001   (Document Validation)
SV-003   (State Validation)
```

| 접두사 | 의미 |
|--------|------|
| `DV` | Document Validation |
| `SV` | State Validation |
| `CR` | Creation Rule |
| `PR` | Prompt Rule |
| `OR` | Output Rule |

### Output Type ID
OutputSpec.md에 정의된 3자리 대문자 코드.

```
NAR, DIA, PRM, SYS, QRY, ERR
```

### Engine Name
CLAUDE.md에 정의된 PascalCase 단어.

```
Creator, Compiler, Director, Resolution, World, Memory, NPC, Mission, Save, Shadow, QA
```

---

END
