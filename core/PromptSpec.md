# Prompt Specification

## Status
Draft v0.1

---

# Purpose

이 문서는 AI Narrative Engine에서 사용되는 모든 프롬프트의 구조와 규칙을 정의한다.

모든 프롬프트는 이 사양을 따라야 하며, 이 사양에 위배되는 프롬프트는 유효하지 않다.

---

# Prompt Layer Model

프롬프트는 4개의 계층으로 구성된다. 하위 계층은 상위 계층을 재정의할 수 없다.

```
Layer 1 (최상위): Master System Prompt
Layer 2:          Engine Prompt
Layer 3:          Module Prompt
Layer 4 (최하위): Session Prompt
```

| Layer | 위치 | 목적 |
|-------|------|------|
| Master | `prompts/system/` | AI 전체 동작 규칙 정의 |
| Engine | `engines/<Name>/` | 엔진별 처리 규칙 정의 |
| Module | `modules/<world>/` | 세계관별 컨텍스트 주입 |
| Session | 런타임 생성 | 세션 상태 및 현재 씬 주입 |

---

# Prompt Structure

모든 프롬프트 문서는 다음 섹션을 순서대로 포함해야 한다.

```
## ROLE
## CONTEXT
## RULES
## OUTPUT FORMAT
## CONSTRAINTS
```

### ROLE
- AI가 수행할 역할을 단일 문장으로 정의한다.
- 역할은 구체적이어야 하며 "당신은 X이다" 형식을 사용한다.

### CONTEXT
- 현재 작업에 필요한 배경 정보를 제공한다.
- 세계관에 종속된 정보는 Module Layer에서만 제공한다.

### RULES
- AI가 반드시 따라야 할 규칙을 번호 목록으로 나열한다.
- 각 규칙은 독립적이고 명확하게 기술한다.
- 금지 규칙은 "~하지 않는다" 형식을 사용한다.

### OUTPUT FORMAT
- AI가 출력해야 할 형식을 명시한다.
- OutputSpec.md에 정의된 형식만 사용 가능하다.

### CONSTRAINTS
- 절대 위반할 수 없는 제약 조건을 나열한다.
- Core Philosophy에서 파생된 제약을 포함해야 한다.

---

# Mandatory Constraints

모든 프롬프트에 명시적으로 포함하거나, Master Prompt에서 상속받아야 하는 제약:

1. AI는 플레이어의 행동을 대신 작성하지 않는다.
2. AI는 메타 정보(숨겨진 수치, 내부 상태, 다른 플레이어 정보)를 노출하지 않는다.
3. AI는 세계의 내부 일관성을 깨는 출력을 생성하지 않는다.
4. AI는 이전 세션의 정보를 Memory Engine 없이 참조하지 않는다.

---

# Prompt Injection Rules

Engine Prompt 또는 Module Prompt를 세션에 주입할 때의 규칙:

- 주입 순서: Master → Engine → Module → Session
- 동일 계층의 프롬프트가 여러 개인 경우, 파일명 알파벳 순으로 주입한다.
- 계층 간 충돌 시 상위 계층이 우선한다.
- Session Prompt는 런타임에만 생성되며 파일로 저장하지 않는다.

---

# Forbidden Patterns

프롬프트에 포함해서는 안 되는 패턴:

| 패턴 | 이유 |
|------|------|
| 플레이어 캐릭터의 감정 서술 지시 | 플레이어 행동 강제 |
| 특정 선택지 유도 | 플레이어 자율성 침해 |
| 내부 확률 수치 노출 지시 | 메타 정보 누설 |
| 특정 세계관 고유명사 (Module 외부) | 세계관 결합 |
| 이전 캠페인 내용 직접 참조 | Memory Engine 우회 |

---

END
