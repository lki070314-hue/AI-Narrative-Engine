# Validation Rule

## Status
Draft v0.1

---

# Purpose

이 문서는 AI Narrative Engine의 모든 문서와 게임 상태에 대한 검증 규칙을 정의한다.

검증은 QA Engine이 수행하며, 이 문서에 정의된 규칙이 QA Engine의 기준이 된다.

---

# Validation Targets

검증 대상은 두 가지로 구분된다.

| 대상 | 설명 |
|------|------|
| Document Validation | 엔진, 모듈, 프롬프트 문서의 구조적 유효성 |
| State Validation | 런타임 게임 상태의 논리적 일관성 |

---

# Document Validation Rules

## DV-001: Required Header
모든 문서는 다음 헤더를 첫 번째 섹션으로 포함해야 한다.

```markdown
# {Document Title}

## Status
{Draft vX.X | Active | Deprecated}
```

위반 시: 문서 무효 처리.

---

## DV-002: End Marker
모든 문서는 마지막 줄에 다음 마커로 끝나야 한다.

```
END
```

위반 시: 문서 불완전 처리.

---

## DV-003: No World Coupling
`modules/<world>/` 경로 외부에 위치한 문서에는 특정 세계관 고유명사가 포함되어서는 안 된다.

검증 방법: 문서 내 고유명사 목록을 `modules/generic/forbidden_nouns.md`와 대조한다.

위반 시: 문서 반려.

---

## DV-004: Layer Consistency
`engines/` 문서는 특정 모듈을 직접 참조해서는 안 된다.

허용: "Module이 제공하는 컨텍스트를 사용한다."
금지: "modules/scp/Anomaly.md를 참조한다."

위반 시: 문서 반려.

---

## DV-005: Status Field Validity
Status 필드의 값은 다음 중 하나여야 한다.

- `Draft vX.X` (개발 중)
- `Active` (운영 중)
- `Deprecated` (사용 중단)

위반 시: 경고 발행.

---

## DV-006: Internal Link Validity
문서 내 다른 문서를 참조하는 경우, 참조 대상 파일이 실제로 존재해야 한다.

참조 형식: `[문서명](상대경로)`

위반 시: 경고 발행.

---

# State Validation Rules

## SV-001: Player Agency Integrity
AI 출력 내에 플레이어 캐릭터의 행동 서술이 포함되어 있으면 안 된다.

검증 방법: OutputSpec.md의 NAR 규칙과 대조.

위반 시: 출력 차단, ERR 블록 반환.

---

## SV-002: Meta Information Leak
AI 출력 내에 메타 정보(내부 수치, 숨겨진 상태, 타 플레이어 정보)가 포함되어 있으면 안 된다.

위반 시: 출력 차단, ERR 블록 반환.

---

## SV-003: Timeline Consistency
게임 내 사건의 시간적 순서는 이전 세션과 모순되어서는 안 된다.

검증 방법: Memory Engine의 타임라인 로그와 대조.

위반 시: 경고 발행, Memory Engine에 불일치 기록.

---

## SV-004: NPC Behavioral Consistency
NPC의 행동은 해당 NPC의 캐릭터 정의와 일관성을 유지해야 한다.

검증 방법: NPC Engine의 캐릭터 프로파일과 대조.

위반 시: 경고 발행.

---

## SV-005: World State Integrity
세계 상태 변경은 Mission Engine 또는 World Engine을 통해서만 이루어져야 한다.

직접적인 상태 수정 선언은 허용되지 않는다.

위반 시: 상태 변경 차단.

---

## SV-006: Session Continuity
각 세션의 시작 상태는 이전 세션의 종료 상태와 일치해야 한다.

검증 방법: Save Engine의 체크포인트와 대조.

위반 시: 세션 시작 차단, Save Engine에 오류 기록.

---

# Validation Severity Levels

| 레벨 | 코드 | 동작 |
|------|------|------|
| 치명 | `CRIT` | 처리 즉시 중단 |
| 오류 | `ERR` | 해당 작업 차단, 오류 반환 |
| 경고 | `WARN` | 처리 계속, 로그 기록 |
| 정보 | `INFO` | 로그 기록만 |

---

# Validation Report Format

QA Engine이 생성하는 검증 보고서 형식:

```
VALIDATION REPORT
=================
Target:    {파일 경로 또는 상태 ID}
Timestamp: {ISO 8601}
Result:    {PASS | FAIL | WARN}

Findings:
- [{레벨}] {규칙 ID}: {설명}
- [{레벨}] {규칙 ID}: {설명}

Summary: {통과한 규칙 수} / {전체 규칙 수} passed
```

---

END
