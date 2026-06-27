# Director Pacing Engine

**Document path:** `engines/Director/PacingEngine.md`  
**Version:** v0.1.0  
**Status:** Draft  
**Last updated:** 2026-06-28  
**Scope:** Director-side support document. This is not a new top-level engine.

---

## 1. Purpose

The Pacing Engine prevents live play from becoming slow, static, or locked in repeated investigation. It helps the Director decide when the situation must move forward even if players continue asking, searching, or inspecting.

This document refines Director behavior only. It does not override CoreSpec, Resolution Engine, Shadow Engine, inventory limits, or player agency rules.

---

## 2. Core Rule

After 2 meaningful low-impact actions, pacing must shift unless a significant event, consequence, or scene transition has just occurred.

The world should move even if players only investigate. Player action is not the only valid trigger for change.

---

## 3. Required Concepts

| Concept | Meaning |
|---------|---------|
| Low-impact action | A player action that gathers, confirms, repeats, waits, asks, or inspects without changing danger, position, resources, NPC state, clue access, or objective state. |
| Meaningful action | An action that expresses intent and deserves a concrete result, even if it does not strongly advance the scene. |
| Pacing shift | A logical change that raises pressure, changes options, moves the scene, or forces prioritization. |
| Tension level | The current pressure of the scene, from calm to urgent. Tension should rise, release, and rise again over play. |
| Scene momentum | Evidence that the scene is changing through NPC motion, anomaly activity, environment changes, clues, danger, or objective pressure. |
| Investigation loop breaker | A pacing shift used when players repeat investigation without meaningful progression. |

---

## 4. Pacing Shift Triggers

The Director should check pacing after every meaningful player action.

Shift pacing when any of the following are true:

- Two meaningful low-impact actions occurred in a row.
- Players repeat investigation in the same place without new progress.
- The scene has produced clues but no pressure.
- Players hesitate and the active scene element would logically move.
- SCP/anomaly presence has not been felt in the current phase.
- The current scene has no visible countdown, danger, interruption, or changing condition.

---

## 5. Pacing Shift Types

A pacing shift may be:

- Incident pressure
- NPC movement
- Anomaly reaction
- Environmental change
- New danger
- Time pressure
- Forced tradeoff
- Scene transition
- Off-screen action becoming visible
- Equipment, access, or containment instability

Pacing shifts must follow established world state. Do not introduce random events that break scenario logic.

---

## 6. Investigation Loop Breaker

If players continue investigating without meaningful progression, the Director must break the loop by doing at least one of the following:

- Escalate the anomaly.
- Move an NPC.
- Change the environment.
- Reveal a partial danger.
- Cut off a safe option.
- Introduce a consequence.
- Force a choice between two objectives.
- Transition the scene when the current scene has delivered its useful information.

The Director must not keep returning only clue descriptions.

---

## 7. Agency Guardrails

Pacing support must not become forced plot.

The Director may advance pressure, but must not:

- Decide a player action for the player.
- Skip required Resolution checks.
- Reveal hidden truth directly.
- Nullify a successful player choice without cause.
- Create unavoidable failure only because pacing is low.

The best pacing shift changes the situation and leaves players with meaningful response options.

---

## 8. QA Checks

- Did the last two meaningful low-impact actions change the scene?
- If not, did the Director introduce a logical pacing shift?
- Did the shift create pressure, information, danger, or a new decision?
- Did the shift preserve player agency?
- Did the shift respect existing scenario logic and hidden information boundaries?

---

**END OF Director Pacing Engine v0.1.0**
