# QA Engine Specification

**Document ID:** `engines/QA/QAEngine.md`
**Version:** v1.0.0
**Status:** Draft
**Last Updated:** 2026-06-26
**References:** `core/CoreSpec.md` Section 5.11, Section 15

---

## 1. Purpose

QA Engine validates engine outputs, module state, prompt compliance, and player-facing responses before they are accepted. It protects player agency, hidden information, world consistency, and output format.

QA Engine does not create narrative content, decide gameplay outcomes, or replace engine decisions. It reports violations and recommends safe handling.

---

## 2. Responsibilities

QA Engine must:

- Validate outputs against CoreSpec, PromptSpec, and OutputSpec.
- Detect player agency violations.
- Detect hidden or meta information leakage.
- Check state references for missing IDs and invalid transitions.
- Classify errors by severity.
- Produce concise repair guidance for the responsible engine.

QA Engine must not:

- Reveal hidden validation details to the player.
- Rewrite final narrative as a Director.
- Change saved state directly.
- Invent missing world content.

---

## 3. Inputs

```yaml
qa_input:
  source_engine: Creator | Compiler | Director | Resolution | World | Memory | NPC | Mission | Save | Shadow
  candidate_output: any
  game_state: GameState
  scene_context: SceneState | null
  active_module: ModuleContext
  validation_scope:
    - output_format
    - player_agency
    - hidden_information
    - state_consistency
    - module_rules
    - resolution_flow
```

---

## 4. Outputs

```yaml
qa_result:
  status: pass | warning | fail | fatal
  findings:
    - id: string
      severity: P0 | P1 | P2 | P3
      category: output_format | player_agency | hidden_information | state_consistency | module_rules
      description: string
      suggested_fix: string
  allow_player_output: bool
```

---

## 5. Severity

| Severity | Meaning | Handling |
|----------|---------|----------|
| `P0` | Save/state corruption or fatal hidden information leak. | Stop output and require repair. |
| `P1` | Player agency violation, major consistency break, or forbidden disclosure. | Block output and request regeneration. |
| `P2` | Format or continuity issue that can be repaired. | Warn and repair before output. |
| `P3` | Minor style or documentation issue. | Log only. |

---

## 6. Core Validation Rules

| Rule ID | Check | Failure Handling |
|---------|-------|------------------|
| `SV-QA-001` | Player character actions are not authored by AI. | `P1`, block output. |
| `SV-QA-002` | Hidden, secret, or meta information is not exposed. | `P0` or `P1`, block output. |
| `SV-QA-003` | Output block format follows OutputSpec. | `P2`, repair required. |
| `SV-QA-004` | Referenced IDs exist in state or are explicitly new generated IDs. | `P1`, repair required. |
| `SV-QA-005` | Engine output stays within that engine's responsibility. | `P2`, reroute to responsible engine. |
| `SV-QA-006` | Module-specific rules do not override CoreSpec. | `P1`, block output. |
| `SV-QA-007` | Test output does not invent campaign canon. | `P1`, block output. |
| `SV-QA-008` | Uncertain player action was resolved before Director narration. | `P1`, route to Resolution Engine. |
| `SV-QA-009` | Resolution result includes required outcome, costs, complications, and world effects when applicable. | `P2`, repair required. |

---

## 7. Alpha Minimum

Alpha Test requires QA Engine to validate:

- Compiler output structure
- Resolution attempt handling
- Director output format
- SCP module safety constraints
- hidden information separation
- save/load state consistency
- no authored player action

---

**END OF QAEngine v1.0.0**
