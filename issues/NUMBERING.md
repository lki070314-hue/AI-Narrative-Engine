# Issue Numbering Rules

## Format

```
<NNNN>_<ShortTitle>.md
```

- `NNNN` — four-digit zero-padded integer (e.g., `0001`, `0042`, `0100`)
- `ShortTitle` — PascalCase or underscore-separated, no spaces, max ~40 chars
- Numbers are **global and sequential** — never reuse a number, even if an issue is closed

### Examples

```
0001_CoreSpec.md
0002_DirectorEngine_PacingRules.md
0015_MemoryEngine_ContextLimit.md
0100_GenericCombat_Initiative.md
```

---

## Number Ranges

| Range | Purpose |
|-------|---------|
| `0001–0099` | Core specification and architecture issues |
| `0100–0199` | Engine-layer issues (`engines/`) |
| `0200–0299` | Generic module issues (`modules/generic/`) |
| `0300–0399` | World-specific module issues (`modules/<world>/`) |
| `0400–0499` | Template and example issues (`templates/`, `examples/`) |
| `0500–0599` | Test and QA issues (`tests/`) |
| `0600–0699` | Documentation issues (`docs/`) |
| `0900–0999` | Meta / process / tooling issues |
| `1000+` | Overflow (when a range is exhausted) |

---

## Rules

1. **Never reuse a number.** Closed issues keep their number permanently.
2. **Assign the next available number within the appropriate range.** Check existing files to find the highest number in that range.
3. **If a range is full**, use the `1000+` overflow range and note the original range in the issue body.
4. **One issue per file.** Do not combine multiple unrelated issues in one file.
5. **Title must match the file name.** The `# [NNNN] <Short Title>` heading should correspond to `NNNN_ShortTitle.md`.

---

## How to Find the Next Number

To find the next available number in a range, list all files in `issues/` and find the highest number in the target range:

```
issues/
  0001_CoreSpec.md          ← next core issue: 0002
  0101_DirectorPacing.md    ← next engine issue: 0102
```

If no files exist in a range yet, start at the range minimum (e.g., `0100` for engine issues).

---

## Current Issue Log

Update this table when adding a new issue file.

| Number | Title | Type | Status |
|--------|-------|------|--------|
| 0001 | CoreSpec | — | Open |
| 0002 | Creator Engine 명세 작성 | New Spec | Resolved |
| 0003 | Director Engine 명세 작성 | New Spec | Resolved |
| 0004 | World Engine 명세 작성 | New Spec | Resolved |
| 0005 | NPC Engine 명세 작성 | New Spec | Resolved |
| 0006 | Mission Engine 명세 작성 | New Spec | Resolved |
| 0007 | Shadow Engine 명세 작성 | New Spec | Resolved |
| 0300 | SCP 모듈 기본 구조 작성 (SCP-0001) | New Module | Resolved |
| 0301 | SCP TRPG 2기 캠페인 준비 문서 (SCP-0002) | Campaign Content | Resolved |
| 0302 | SCP TRPG Director 시스템 프롬프트 작성 (SCP-0003) | Prompt | Resolved |
| 0303 | SCP TRPG Shadow Director 시스템 프롬프트 작성 (SCP-0004) | Prompt | Resolved |
