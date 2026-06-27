# Beta02 Preparation

**Document path:** `docs/Beta/Beta02_Preparation.md`  
**Version:** v0.1.0  
**Status:** Draft  
**Last updated:** 2026-06-28

---

## 1. Beta02 Goal

Test whether the engine can create a fun, fast, dynamic 1-2 player experience.

Beta02 should verify engine behavior, not start from a scenario rewrite. The main target is stronger Director-side pacing, consequence density, scene movement, output economy, and inventory integrity.

---

## 2. What Beta02 Must Test

- Small actions create multiple consequences.
- Investigation does not loop.
- SCP/anomaly presence is felt early.
- Events occur before players become tired.
- Responses stay short.
- Resolution is understandable.
- Inventory is respected.
- Scenes move even when players hesitate.

---

## 3. Required Improvements From Beta01

- Increase consequence density per meaningful action.
- Add pacing shifts after repeated low-impact actions.
- Strengthen incident pressure and anomaly presence.
- Reduce routine response length.
- Interrupt repeated investigation loops.
- Keep clues useful without flooding players.
- Make NPCs and scene elements act proactively.
- Treat only declared equipment as guaranteed.
- Use Resolution for uncertain access to role-appropriate equipment.

---

## 4. Required Director Behavior

- Track whether recent actions advanced the situation.
- Introduce logical pressure before the scene becomes static.
- Give each meaningful action a direct result and additional consequences when appropriate.
- Move NPCs, environments, threats, and objectives without waiting for perfect player prompts.
- Preserve player agency while making the world active.
- Avoid revealing hidden truth directly.
- Keep narration concise and focused on changed state.

---

## 5. Required Pacing Behavior

- After 2 meaningful low-impact actions, trigger a pacing shift unless one has just occurred.
- Use incident pressure, NPC movement, anomaly reaction, environmental change, danger, time pressure, forced tradeoff, or scene transition.
- Break repeated investigation loops with pressure, consequence, or changed circumstances.
- Make SCP/anomaly presence felt in each scenario phase.
- Do not use random events that break scenario logic.

---

## 6. Required Consequence Behavior

- A meaningful action should usually create a direct result and at least 2 additional consequences.
- Consequences may be visible, hidden, delayed, beneficial, harmful, or mixed.
- Consequences should include logical NPC, world, anomaly, clue, danger, opportunity, resource, location, faction, or security effects when appropriate.
- Hidden consequences should use Shadow Engine or state handling instead of narration.
- Failure should move play forward with cost or pressure instead of dead-ending.

---

## 7. Required Output Length Behavior

- Normal response: 80-150 Korean characters, or similarly short Korean text.
- Event response: 150-300 Korean characters.
- Major scene response: 300-500 Korean characters.
- Ending: flexible.
- Routine actions should not receive long atmospheric paragraphs.
- Output should usually include result, consequence, current pressure, and clear next situation.
- Resolution transparency should be compact when needed.

---

## 8. Required Inventory Behavior

- Only declared equipment is guaranteed.
- Character role, job, or authority may justify access attempts, not automatic possession.
- If a player uses an unlisted item, the Director must not assume possession.
- Missing item handling should offer alternatives: search, request from NPC, access supply, improvise with listed gear, or attempt another method.
- If reasonable for the role but not listed, use Resolution to determine whether it is accessible nearby.
- Missing items must not create unavoidable dead ends.

---

## 9. Success Criteria

- Players report faster tempo than Beta01.
- Players feel danger, pressure, or anomaly presence early.
- Repeated investigation does not dominate play.
- Small actions create multiple noticeable consequences.
- Responses are short enough to avoid fatigue.
- Resolution outcomes are understandable without exposing hidden numbers.
- Inventory limits feel fair and meaningful.
- Scenes change even when players hesitate.
- The session remains playable with 1 or 2 players.

---

## 10. Failure Criteria

- Players repeat investigation for several turns without pressure or scene movement.
- SCP/anomaly content feels absent or cosmetic.
- Most actions produce only one direct result.
- Responses frequently become long atmospheric paragraphs.
- The Director grants unlisted items automatically.
- Missing equipment creates a dead end.
- Resolution outcomes feel arbitrary or opaque.
- NPCs only answer questions and never act proactively.
- Scenes remain static until players guess the intended prompt.

---

## 11. Supporting Documents

- `engines/Director/PacingEngine.md`
- `engines/Director/ConsequenceEngine.md`
- `engines/Director/SceneFlowEngine.md`
- `engines/Director/OutputEngine.md`
- `docs/Beta/Beta01_Result.md`
- `docs/Beta/Beta01_LivePatch_Notes.md`

---

**END OF Beta02_Preparation v0.1.0**
