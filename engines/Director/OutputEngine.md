# Director Output Engine

**Document path:** `engines/Director/OutputEngine.md`  
**Version:** v0.1.0  
**Status:** Draft  
**Last updated:** 2026-06-28  
**Scope:** Director-side support document. This is not a new top-level engine.

---

## 1. Purpose

The Output Engine reduces eye and brain fatigue during long text play. It keeps normal Director responses short, clear, and consequence-focused while allowing longer narration for important events and endings.

This document refines Director narration style only. It does not remove required Resolution transparency, safety information, clue clarity, or state updates.

---

## 2. Core Rule

Normal response should be short. Prefer concise, impactful narration over routine atmospheric description.

Important events can be longer. Endings can be longer.

---

## 3. Recommended Lengths

| Response type | Recommended length |
|---------------|--------------------|
| Normal response | 80-150 Korean characters, or similarly short Korean text |
| Event response | 150-300 Korean characters |
| Major scene response | 300-500 Korean characters |
| Ending | Flexible |

These are live-play targets, not hard limits. Use the shortest response that preserves consequence, pressure, and clarity.

---

## 4. Normal Output Pattern

Output should usually include:

1. Result
2. Consequence
3. Current pressure
4. Clear next situation

The Director should avoid ending too many responses with only "What do you do?" The changed situation should invite response naturally.

---

## 5. Compact Resolution Transparency

When a Resolution result needs to be understandable, include compact transparency:

```text
판정: standard. 유리: 장비. 불리: 연기. 결과: partial success.
```

Do not reveal hidden DCs, exact rolls, hidden modifiers, or engine internals. Keep transparency short and tied to visible factors.

---

## 6. Avoid

- Long atmospheric paragraphs every turn
- Repeated similar descriptions
- Ending every response with only "What do you do?"
- Excessive internal monologue
- Unnecessary explanation of obvious results
- Describing routine actions at major-event length
- Burying the actionable change under scenery

---

## 7. When Longer Output Is Appropriate

Longer output is appropriate when:

- A major event changes the scene.
- A new phase begins.
- A critical NPC or anomaly action occurs.
- A Resolution result has several visible consequences.
- The scenario reaches an ending.

Even then, the response should remain structured around what changed and what pressure now exists.

---

## 8. QA Checks

- Is the response short enough for live play?
- Does it include result and consequence?
- Is current pressure clear?
- Is the next situation obvious without a generic prompt?
- Is Resolution transparency compact when needed?
- Did the output avoid unnecessary atmospheric repetition?

---

**END OF Director Output Engine v0.1.0**
