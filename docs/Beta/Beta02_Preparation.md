# Beta02 Preparation

**Document path:** `docs/Beta/Beta02_Preparation.md`  
**Version:** v1.0.0  
**Status:** Release  
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
- `docs/Beta/Beta02_TestPlan.md`
- `docs/Beta/Beta02_Checklist.md`

---

## 12. QA Checklist for Beta02 Director Behavior

Before each playtest session, confirm the following are active:

**Pacing**
- [ ] Low-impact action counter initialized to 0.
- [ ] Pacing shift rule active: after 2 consecutive meaningful low-impact actions, Director introduces a pacing shift.
- [ ] Investigation loop breaker active.

**Consequence**
- [ ] Consequence generation rule active: meaningful actions produce direct result + at least 2 additional consequences.
- [ ] Shadow Engine available for delayed/hidden consequences.

**Scene Flow**
- [ ] Each scene has a defined objective, tension source, and active element before play begins.
- [ ] Scene transition conditions defined for each scene.

**Output Length**
- [ ] Output length rule active: normal 80–150 Korean characters, event 150–300, major scene 300–500.
- [ ] Resolution transparency block format active.

**Inventory**
- [ ] Only declared equipment is guaranteed.
- [ ] Alternatives protocol active: search, NPC request, supply access, improvise, or other method.

**Anomaly**
- [ ] SCP/anomaly presence expected in every scenario phase.
- [ ] Anomaly behavior tracked as active scene element.

---

## 13. Recommended Playtest Procedure

1. Load all engine specs and sub-engine support docs before starting.
2. Confirm hidden information is GM-only.
3. Initialize all tracking counters (pacing, investigation loop, inventory validation).
4. Run the scenario with 1 player first. Observe Director behavior throughout.
5. After each scene ends, pause and review pacing, consequence, scene flow, anomaly, output, and inventory checks before continuing.
6. Note any failed check without adjusting mid-play.
7. After session ends, complete `Beta02_Checklist.md`.
8. If time allows, run with 2 players in a separate session and compare pacing behavior under higher action volume.
9. Report pass/fail per area and list remaining P1–P2 risks.

---

## 14. What to Record During Play

Record the following throughout the session:

- **Pacing shifts:** When each occurred, what triggered it, and what type it was.
- **Consequence counts:** Per meaningful action, how many distinct effects were produced.
- **Anomaly presence moments:** When and how anomaly/SCP presence appeared.
- **Scene transitions:** When scenes changed and what caused the transition.
- **Output length violations:** Any response that felt too long for the action type.
- **Inventory incidents:** When unlisted items were used and how it was handled.
- **Investigation loops:** Any sequence where investigation repeated without shift or change.
- **Player reactions:** Player comments on tempo, tension, fatigue, or confusion.
- **Unexpected player actions:** Any action outside scenario planning and how it resolved.
- **Proactive Director moments:** When the Director moved the world without a player prompt.

---

**END OF Beta02_Preparation v1.0.0**
