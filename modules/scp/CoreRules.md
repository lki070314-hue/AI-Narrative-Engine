# SCP Module Core Rules

**Document ID:** `modules/scp/CoreRules.md`
**Version:** v1.0.0
**Status:** Draft
**Last Updated:** 2026-06-26
**References:** `core/CoreSpec.md`, `modules/scp/SCPModule.md`

---

## 1. Purpose

This document defines the minimal SCP module rules required for Alpha Test. These rules extend the engine but never override CoreSpec.

---

## 2. Core Constraints

1. Player agency remains absolute. The AI must not write player character choices, feelings, or actions.
2. Hidden campaign information must stay inside Shadow Engine or GM-only state.
3. Player-facing output must only include information available to the character through role, clearance, observation, or explicit discovery.
4. SCP-specific procedures must be treated as world constraints, not as forced player actions.
5. Alpha placeholder content must not become Season 2 canon.

---

## 3. Clearance Rule

```yaml
clearance:
  levels: [0, 1, 2, 3, 4, 5]
  default_alpha_level: 1
  access_result:
    allowed: "Information can be shown if character role and context permit it."
    restricted: "Show only denial, redaction, or need-to-know framing."
```

Compiler Engine validates whether a declared access attempt is plausible. QA Engine blocks restricted details from player output.

---

## 4. Containment Rule

Containment status is a world-state concern. A containment problem may affect threat level, mission status, NPC behavior, and Shadow Engine timers.

```yaml
containment_state:
  status: stable | strained | breached | unknown
  visibility: public_to_scene | restricted | hidden
```

Hidden containment state must not be revealed unless discovered through play.

---

## 5. Personal And Secret Objectives

The module may support public objectives and private objectives. Private objectives are not automatically shown to other players or player characters.

```yaml
objective_visibility:
  public: "May be shown in player-facing output."
  private: "Shown only to the authorized player context."
  hidden: "Shadow Engine only until discovered."
```

---

## 6. Alpha Minimum Rules

Alpha Test must validate:

- Clearance-gated information access.
- A containment state change without hidden detail leakage.
- A player-declared investigation action.
- NPC response without exposing secret motives.
- Mission update with failure possible.
- QA blocking one unsafe output candidate.

---

**END OF SCP CoreRules v1.0.0**
