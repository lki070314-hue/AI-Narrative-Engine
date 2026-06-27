# Director Scene Flow Engine

**Document path:** `engines/Director/SceneFlowEngine.md`  
**Version:** v0.1.0  
**Status:** Draft  
**Last updated:** 2026-06-28  
**Scope:** Director-side support document. This is not a new top-level engine.

---

## 1. Purpose

The Scene Flow Engine makes every scene feel active. It prevents scenes from becoming static room descriptions that wait for perfect player input.

This document supports Director scene management. It does not redesign scenarios or override Mission, World, NPC, Resolution, or Shadow Engine responsibilities.

---

## 2. Scene Requirements

Each active scene should contain:

- Scene objective
- Tension source
- Active element
- Possible interruption
- Reward or clue
- Escalation path
- Exit or transition condition

These elements may be explicit in scenario notes or inferred from current world state.

---

## 3. Required Concepts

| Concept | Meaning |
|---------|---------|
| Scene objective | What the scene is currently about for play: rescue, identify, escape, contain, negotiate, access, survive, decide, or understand. |
| Scene momentum | The sense that the scene is changing over time. |
| Active element | A moving part in the scene, such as an NPC, anomaly, alarm, countdown, unstable object, locked door, worsening victim, or shifting environment. |
| Interruption | A logical event that cuts into player routine and demands attention. |
| Escalation | A rise in pressure, danger, cost, visibility, time pressure, or consequence. |
| Exit condition | The point where the scene has delivered its purpose and should transition. |
| Transition trigger | A player action, world event, success, failure, time change, or NPC/anomaly movement that moves play into the next scene. |

---

## 4. Scene Flow Rules

- A scene should not be only a room description.
- A scene should not wait passively for perfect player input.
- If players stall, the active element moves.
- If players over-investigate, the scene escalates.
- If players succeed, the scene changes.
- If players fail, the scene still moves with consequence.
- If the scene has delivered its clue, pressure, or objective, transition instead of repeating description.

---

## 5. Active Element Guidance

Every scene should have at least one active element that can move without direct player request.

Examples:

- An NPC decides to leave, hide evidence, interrupt, panic, or ask for help.
- An alarm changes status.
- A locked door cycles open or closed.
- A victim's condition worsens.
- Anomaly evidence intensifies.
- Security personnel arrive off-screen.
- A recording distorts or cuts out.
- Containment pressure changes.

The active element should make the scene feel alive without forcing a predetermined outcome.

---

## 6. Exit and Transition Guidance

The Director should consider transitioning when:

- The scene objective is achieved.
- The scene objective becomes impossible or obsolete.
- Players have received the useful clue or reward.
- The active threat moves elsewhere.
- The current location no longer has meaningful choices.
- A failure consequence changes the priority.
- Time pressure makes staying costly.

Scene transitions should preserve continuity and reflect consequences from the previous scene.

---

## 7. QA Checks

- Does the scene have an objective?
- Is there an active element?
- Did the scene change after player success or failure?
- Did over-investigation trigger escalation instead of repeated clue text?
- Is there a clear exit or transition condition?
- Did the transition preserve player agency and current world state?

---

**END OF Director Scene Flow Engine v0.1.0**
