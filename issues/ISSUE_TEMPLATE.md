# Issue Template

Use this template when creating a new issue. Copy the appropriate section below.

---

## How to Create an Issue

1. Create a new file: `issues/<NNNN>_<ShortTitle>.md`
2. Follow the numbering rules in `issues/NUMBERING.md`
3. Fill in all required fields
4. Set status to `Open`

---

## Template: Bug / Inconsistency

```markdown
# [NNNN] <Short Title>

- **Type:** Bug | Inconsistency
- **Status:** Open | In Progress | Resolved | Closed
- **Priority:** Critical | High | Medium | Low
- **Affects:** <engine name, module name, or document path>
- **Reported:** YYYY-MM-DD
- **Resolved:** —

## Description

<What is wrong? Be specific about the document and section.>

## Steps to Reproduce / Where It Occurs

- Document: `<path/to/file.md>`
- Section: `<section heading>`
- Line / context: <quote or describe>

## Expected Behavior

<What should the document say or specify?>

## Actual Behavior

<What does it currently say?>

## Proposed Fix

<Optional. Describe a concrete change or leave blank if unknown.>

## Notes

<Any additional context, related issues, or constraints.>
```

---

## Template: Feature Request / New Specification

```markdown
# [NNNN] <Short Title>

- **Type:** Feature Request | New Spec
- **Status:** Open | In Progress | Resolved | Closed
- **Priority:** Critical | High | Medium | Low
- **Affects:** <engine name, module name, or document path>
- **Reported:** YYYY-MM-DD
- **Resolved:** —

## Description

<What should be added or specified? State the goal, not the implementation.>

## Motivation

<Why is this needed? What problem does it solve?>

## Scope

- [ ] Requires new document
- [ ] Requires changes to existing document(s): `<path>`
- [ ] World-agnostic (goes in `modules/generic/`)
- [ ] World-specific (goes in `modules/<world>/`)
- [ ] Engine-level change (goes in `engines/<Engine>/`)

## Acceptance Criteria

- [ ] <Condition 1>
- [ ] <Condition 2>

## Notes

<Any additional context, dependencies, or constraints.>
```

---

## Template: Improvement / Refactor

```markdown
# [NNNN] <Short Title>

- **Type:** Improvement | Refactor
- **Status:** Open | In Progress | Resolved | Closed
- **Priority:** Critical | High | Medium | Low
- **Affects:** <engine name, module name, or document path>
- **Reported:** YYYY-MM-DD
- **Resolved:** —

## Description

<What should be improved? Be specific.>

## Current State

<Quote or describe the current document content.>

## Desired State

<Describe the improved version.>

## Rationale

<Why is this improvement worth making?>

## Notes

<Any additional context or constraints.>
```

---

## Status Definitions

| Status | Meaning |
|--------|---------|
| `Open` | Identified, not yet started |
| `In Progress` | Actively being worked on |
| `Resolved` | Fix applied to documents |
| `Closed` | Declined, duplicate, or no longer relevant |

## Priority Definitions

| Priority | Meaning |
|----------|---------|
| `Critical` | Blocks engine from functioning correctly |
| `High` | Significant gap or contradiction in specification |
| `Medium` | Improvement that would meaningfully help |
| `Low` | Minor wording, style, or optional enhancement |
