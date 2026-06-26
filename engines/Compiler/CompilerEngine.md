# Compiler Engine Specification

**Document ID:** `engines/Compiler/CompilerEngine.md`
**Version:** v1.0.0
**Status:** Draft
**Last Updated:** 2026-06-26
**References:** `core/CoreSpec.md` Section 5.2, `core/PromptSpec.md`, `core/OutputSpec.md`

---

## 1. Purpose

Compiler Engine parses player input, separates game actions from out-of-character requests, validates the requested action against current state and module rules, and returns a structured action object or a clarification request.

Compiler Engine does not narrate outcomes, decide hidden information, advance world state, or write player character actions not explicitly declared by the player.

---

## 2. Responsibilities

Compiler Engine must:

- Accept raw player input and current context.
- Classify input as action, dialogue, question, OOC command, or invalid input.
- Preserve player agency by only compiling stated intent.
- Validate feasibility against character state, scene context, world rules, and module constraints.
- Ask a specific clarification question when required.
- Emit a structured `Action` and `ValidationResult`.

Compiler Engine must not:

- Resolve rolls or determine success.
- Reveal hidden or meta information.
- Convert ambiguous input into irreversible action without confirmation.
- Apply world state changes directly.
- Produce final narrative text.

---

## 3. Inputs

```yaml
compiler_input:
  raw_input: string
  game_state: GameState
  scene_context: SceneState
  active_module: ModuleContext
  actor_id: string
```

---

## 4. Outputs

```yaml
compiler_output:
  action:
    id: string
    actor_id: string
    type: move | inspect | dialogue | attack | skill | item | wait | ooc | unknown
    targets: list[string]
    parameters: map[string: any]
    requires_roll: bool
    roll_type: string | null
    dc: int | null
    timestamp_world: string
  validation_result:
    status: valid | needs_clarification | invalid | ooc
    severity: none | warning | error
    reason: string | null
  clarification_request: string | null
```

---

## 5. Parsing Rules

1. If input contains one clear action, compile that action directly.
2. If input contains multiple compatible actions, compile them in declared order.
3. If input contains conflicting or irreversible intent, return `needs_clarification`.
4. If input asks rules, status, or save/load questions, classify as `ooc`.
5. If input attempts to access hidden data, classify as `ooc` and return only player-safe information.
6. If target, method, or intent is missing, ask one specific clarification question.

---

## 6. Validation Rules

| Rule ID | Check | Failure Handling |
|---------|-------|------------------|
| `SV-CMP-001` | Actor exists and can act. | Return `invalid`. |
| `SV-CMP-002` | Target exists in known scene context or is plausibly reachable. | Return `needs_clarification` or `invalid`. |
| `SV-CMP-003` | Action does not require player intent not stated in input. | Return `needs_clarification`. |
| `SV-CMP-004` | Action does not expose hidden or meta information. | Return `ooc` with safe response. |
| `SV-CMP-005` | Irreversible action is explicit. | Return `needs_clarification`. |
| `SV-CMP-006` | Module-specific constraints are respected. | Return `invalid` with non-meta reason. |

---

## 7. Alpha Minimum

Alpha Test requires Compiler Engine to support:

- `move`
- `inspect`
- `dialogue`
- `skill`
- `wait`
- `ooc`
- clarification for ambiguous target or irreversible action

---

**END OF CompilerEngine v1.0.0**
