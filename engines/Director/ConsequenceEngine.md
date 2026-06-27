# Director Consequence Engine

**Document path:** `engines/Director/ConsequenceEngine.md`  
**Version:** v0.1.0  
**Status:** Draft  
**Last updated:** 2026-06-28  
**Scope:** Director-side support document. This is not a new top-level engine.

---

## 1. Purpose

The Consequence Engine prevents player actions from producing only one isolated result. It helps the Director turn meaningful actions into visible, logical changes in the scene and world.

This document refines Director narration and engine-call judgment. It does not replace Resolution Engine outcomes or expose hidden information.

---

## 2. Core Rule

A meaningful action should usually create:

1. Direct result
2. At least 2 additional consequences

The additional consequences may be immediate, delayed, visible, hidden, beneficial, harmful, or mixed.

---

## 3. Required Concepts

| Concept | Meaning |
|---------|---------|
| Direct result | The immediate outcome of the declared action. |
| Secondary consequence | A connected effect caused by the direct result. |
| Delayed consequence | A consequence that is stored for later instead of shown immediately. |
| Consequence chain | The logical spread from one action into world state, NPC behavior, danger, clues, resources, or future options. |
| Hidden consequence | A consequence tracked by Shadow Engine or scenario state without revealing it to players. |
| World update | A visible or stored change to location, access, containment, alarm, objective, resource, or environmental state. |
| NPC reaction | An NPC behavior, emotion, movement, mistake, warning, refusal, or intervention caused by the action. |
| Anomaly reaction | A direct or indirect SCP/anomaly response to player behavior, sound, damage, attention, equipment, or proximity. |

---

## 4. Consequence Types

Additional consequences may include:

- NPC reaction
- World state change
- Anomaly/SCP reaction
- Clue exposure
- New danger
- New opportunity
- Resource change
- Location change
- Faction or security response
- Delayed consequence

Do not use every type every time. Choose the consequences that follow logically from current world state.

---

## 5. Example

Player action: "I shoot the crate."

Bad result:

- The crate breaks.

Good result:

- The crate breaks.
- The noise triggers a local alarm.
- A nearby NPC reacts.
- The anomaly responds to the sound.
- A hidden object rolls out.
- Future stealth becomes harder.

The Director does not need to narrate every hidden or delayed consequence immediately. Hidden consequences should be tracked through the appropriate engine or state.

---

## 6. Rules

- Do not isolate actions.
- Do not stop at the direct outcome when the action would logically affect the scene.
- Chain results through current world state.
- Avoid revealing hidden truth directly.
- Use Shadow Engine for hidden consequences when needed.
- Preserve player agency.
- Keep consequences proportional to action scale and current tension.
- Let success create new options, not only rewards.
- Let failure move play forward with cost, pressure, or altered circumstances.

---

## 7. Output Pattern

Most meaningful action responses should contain:

1. Direct result
2. One visible consequence
3. Current pressure or next changed situation

Additional consequences may remain hidden or delayed when revealing them would break mystery, clue balance, or suspense.

---

## 8. QA Checks

- Did the action produce more than one effect?
- Are at least two consequences considered, even if not all are narrated?
- Did the consequences follow logically?
- Did the Director avoid revealing hidden truth directly?
- Did hidden consequences go to Shadow/state handling instead of narration?
- Did the result preserve player agency?

---

**END OF Director Consequence Engine v0.1.0**
