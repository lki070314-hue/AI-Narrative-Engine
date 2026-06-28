# GM Guide — AI Narrative Engine v1.0 Preview

**Document path:** `docs/Release/GM_Guide.md`
**Version:** v1.0.0
**Status:** Release
**Last updated:** 2026-06-28
**Audience:** Game Master (GM) / AI Director operator
**References:** `core/CoreSpec.md`, `engines/Director/DirectorEngine.md`, `engines/Director/PacingEngine.md`, `engines/Director/ConsequenceEngine.md`, `engines/Director/SceneFlowEngine.md`, `engines/Director/OutputEngine.md`, `engines/Director/AnomalyEngine.md`, `docs/Release/Known_Issues.md`

---

## 1. Overview

This guide explains how to run a session using the AI Narrative Engine as the Director/GM. It covers setup, live session operation, and post-session procedures.

The GM in this engine is the AI system (Claude, GPT, Gemini, or equivalent) running under the engine stack. A human operator may monitor the session, perform live patches, and record results.

If you are the human operator, your job is to:
- Set up the session correctly before play begins.
- Monitor engine behavior during play.
- Record results after each session.
- Apply patches if rules are misfiring.

---

## 2. How to Run a Session

### Before Each Session

1. Load all required engine documents into the AI context:
   - `core/CoreSpec.md` — read first, highest priority
   - `engines/Director/DirectorEngine.md`
   - `engines/Director/PacingEngine.md`
   - `engines/Director/ConsequenceEngine.md`
   - `engines/Director/SceneFlowEngine.md`
   - `engines/Director/OutputEngine.md`
   - `engines/Director/AnomalyEngine.md`
   - Active world module (e.g., `modules/scp/`)
   - Current scenario (GM-only; do not share with players)

2. Confirm all GM-only hidden information is loaded but not visible to players.

3. Initialize session tracking:
   - Pacing counter: set to 0
   - Investigation loop counter: set to 0
   - Anomaly behavior state: set to Dormant (or scenario-defined starting state)
   - Inventory validation: active — only declared equipment is guaranteed

4. Confirm player count and player profiles are ready.

### During Each Session

- Process player inputs in the exact order received.
- Each player's action resolves fully before the next is processed.
- If two players declare simultaneous action, treat as a coordinated Resolution check.
- Monitor the engine checks listed in Section 7 (Monitoring Checklist) each scene.

### After Each Session

- Complete the Session Record using `docs/Campaign/Session_Record_Template.md`.
- Note any rule failures or unexpected behavior.
- Decide whether a live patch is needed (see Section 12).

---

## 3. Session 0 Setup

Session 0 is a pre-campaign setup session. No scenario is run. The goal is to establish the campaign foundation.

**Session 0 agenda:**

1. Confirm player count (recommended: 2–4).
2. Create player characters using Creator Engine rules.
3. Establish and record all character equipment (declared inventory).
4. Agree on session language, tone, and content limits.
5. Review player expectations and comfort (see Section 13).
6. Run a brief test scene (5–10 minutes) to confirm the engine is working correctly.
7. Record Session 0 results in the campaign log.

---

## 4. Player Profile Setup

Each player character must have the following recorded before the first session:

| Field | Required |
|---|---|
| Character name | Yes |
| Call sign / role | Yes |
| Character level | Yes |
| Primary skill | Yes |
| Secondary skill | Yes |
| Declared equipment (full list) | Yes |
| Character strengths | Recommended |
| Character weaknesses | Recommended |
| Director notes (behavior tendencies) | Optional |

**Declared equipment is the only guaranteed inventory.** Any item not on the equipment list must be handled via Resolution Engine (role-based access attempt) or scene-based acquisition (searching, requesting, improvising).

Equipment lists are locked at the start of each session. Players may update their lists between sessions only.

---

## 5. Inventory Integrity Rule

This rule prevents character sheet meaning from eroding during play.

**Rule:** Only equipment declared on the character's equipment list is automatically available. Any undeclared item requires a Resolution Engine check or scene-based acquisition.

**When a player uses an undeclared item:**

1. State that the item is not on the declared equipment list.
2. Offer one or more alternatives:
   - Search the current scene for the item
   - Request it from an NPC or support unit
   - Access a supply point if one exists in the scene
   - Improvise with a listed item that could serve the same purpose
   - Attempt a role-based access check via Resolution Engine

3. Do not create a dead end. Missing equipment must not permanently block progress.

**Exception:** Character role or institutional authority may justify a Resolution check for access to role-appropriate equipment that exists in the world but is not on the declared list. This is a check, not automatic possession.

---

## 6. Turn Order

**Two or more players:**

- Process inputs in the exact order received.
- Player 1's action resolves fully (world state updated) before Player 2's action is processed.
- Player 2's action uses the updated world state from Player 1's resolution.
- Do not collapse two-player actions into a single resolution unless players explicitly declare a coordinated action.

**Simultaneous declaration:**

If players explicitly declare they are acting at the same moment, treat as a coordinated Resolution check. Both players' declared intents are visible to both players.

---

## 7. Director Sub-Engine Reference

### PacingEngine.md — Pacing Rule

**Core rule:** After 2 meaningful low-impact actions in a row, trigger a pacing shift.

**Low-impact action:** An action that gathers, confirms, repeats, waits, or inspects without changing danger, position, resources, NPC state, clue access, or objective state.

**Pacing shift types:** incident pressure, NPC movement, anomaly reaction, environmental change, new danger, time pressure, forced tradeoff, scene transition, off-screen action becoming visible, equipment or containment instability.

**Investigation loop breaker:** If players investigate the same location without new progress, the Director must: escalate the anomaly, move an NPC, change the environment, reveal partial danger, cut off a safe option, introduce a consequence, or transition the scene.

**What the Director must not do:** Pacing shifts must not decide player actions, skip Resolution checks, reveal hidden truth, or create unavoidable failure.

---

### ConsequenceEngine.md — Consequence Chaining Rule

**Core rule:** A meaningful player action should produce a direct result plus at least 2 additional consequences.

**Additional consequences may include:** NPC reaction, world state change, anomaly/SCP reaction, clue exposure, new danger, new opportunity, resource change, location change, faction response, or delayed consequence.

**Pattern to follow:**
1. Direct result
2. One visible consequence
3. Current pressure or changed situation

**What to avoid:** Stating only the direct outcome ("The box broke. What do you do?") without any secondary effect.

---

### SceneFlowEngine.md — Scene Structure Rule

**Each active scene must contain:**
- Scene objective (what the scene is about)
- Tension source
- At least one active element (NPC, anomaly, alarm, countdown, victim, shifting environment)
- Possible interruption
- Reward or clue
- Escalation path
- Exit or transition condition

**Scene flow rules:**
- If players stall, the active element moves.
- If players over-investigate, the scene escalates.
- If the scene has delivered its purpose, transition — do not repeat descriptions.

---

### OutputEngine.md — Output Length Rule

| Response type | Target length |
|---|---|
| Normal response | 80–150 Korean characters |
| Event response | 150–300 Korean characters |
| Major scene response | 300–500 Korean characters |
| Ending | Flexible |

**Output pattern for most responses:**
1. Result
2. Consequence
3. Current pressure
4. Clear next situation

**Avoid:** Long atmospheric paragraphs for routine actions. Ending every response with only "What do you do?"

---

### AnomalyEngine.md — Anomaly Presence Rule

**Core rule:** The anomaly must be felt as an active, independent presence in every relevant scenario phase.

**Anomaly behavior states:**

| State | Director behavior |
|---|---|
| Dormant | 1–2 passive environmental effects; at least one observable pattern; no immediate danger |
| Aware | Intensified environmental effects; new observable behavior; begins reacting to proximate player actions |
| Active | Anomaly takes at least one action per 2–3 player turns; creates new danger or closes/opens options |
| Critical | Maximum activity; players must resolve the anomaly; resolution requires applying already-observed patterns |

**Presence frequency:** Reference the anomaly in at least 1 out of every 3 meaningful Director responses when the anomaly is relevant to the scene.

**Observable behavior rule:** The anomaly must exhibit at least 2 consistent, readable patterns that players can detect without NPC assistance. Players should be able to form a hypothesis about the anomaly through direct observation.

**Interaction window:** Allow at least 1 player turn of relative quiet between major anomaly events.

**What the anomaly must not do:** Override player agency, force predetermined outcomes, or reach Critical state before players have seen its Dormant and Aware state patterns.

---

## 8. Handling Unexpected Player Behavior

Players will act outside the planned scenario. This is normal and welcome.

**Steps when a player action is unexpected:**

1. Preserve the player's declared intent — do not refuse because it is unexpected.
2. Find the closest action type (combat, stealth, persuasion, investigation, social interaction, etc.).
3. Evaluate plausibility in the current world state via Resolution Engine.
4. If intent is unclear, ask a specific question — not "What do you do?" but "Which direction are you moving?" or "Are you targeting the door or the guard?"
5. Use partial success, new danger, delayed consequence, or NPC reaction to integrate the unexpected action into the world.

**Unexpected actions are opportunities.** They can become new clues, new NPCs, emergent missions, or memorable session moments. Beta02 confirmed this: Raven-1 singing to attract an anomaly was unexpected and became the session highlight.

---

## 9. Resolution Transparency

When a Resolution check is made, show the reasoning block to players:

```
판정
  행동    : [action description]
  난이도  : [trivial / easy / standard / hard / extreme / impossible]
  유리    : + [favorable factor]
  불리    : - [unfavorable factor]
  결과    : [critical_success / success / partial_success / failure / critical_failure]
```

**Rules:**
- Never expose dice values, DC numbers, or internal modifiers.
- Favorable and unfavorable factors must be observable (skills, equipment, conditions) — 1–3 each.
- Trivial actions (no meaningful failure possibility) do not require a transparency block.

---

## 10. Recording Session Results

After each session, complete `docs/Campaign/Session_Record_Template.md`.

**Minimum required fields:**
- Session number and date
- Players and characters
- Session summary (3–5 sentences)
- Major player choices
- NPC state changes
- Anomaly/SCP state changes
- Unresolved clues
- Issues found during play
- Next session hooks

Record honestly. Do not omit rule failures. The session record is the primary tool for improving play over time.

---

## 11. Monitoring During Live Play

Check these after each scene:

| Check | Pass | Fail |
|---|---|---|
| Did two low-impact actions trigger a pacing shift? | Shift occurred, or no two-in-a-row | Two+ low-impact actions with no world response |
| Did meaningful actions produce 2+ visible effects? | Yes | Only direct outcome narrated |
| Did the scene have an active element? | Yes | Scene was static |
| Was the anomaly referenced in at least 1 in 3 responses? | Yes | Anomaly absent from phase |
| Did responses stay within output length targets? | Yes | Long paragraphs for routine actions |
| Were undeclared items denied with alternatives offered? | Yes | Item granted automatically |
| Was Resolution reasoning shown without numbers? | Yes | No transparency block, or numbers exposed |

---

## 12. When to Patch Rules After a Session

Apply a live patch (update to engine rules or procedures) when:

- A rule failure of severity P1 or P0 is confirmed during the session.
- Players report the same issue in two consecutive sessions.
- Engine behavior contradicts a rule that was supposed to be active.
- A new scenario element has no clear rule coverage.

**Live patch procedure:**
1. Record the failure in the Session Record.
2. Identify the source rule.
3. Write a brief patch note describing what changed and why.
4. Apply the patch at the start of the next session (not mid-session).
5. Document the patch in `docs/Beta/Beta02_LivePatch_Notes.md` or the equivalent campaign log.

Do not patch mid-session to conceal failures. Record the failure and continue.

---

## 13. Campaign Safety and Comfort

Before Session 0, establish:

- **Content limits:** Confirm what content is comfortable for all players (horror intensity, violence detail, specific themes to avoid).
- **Pause signal:** Agree on a word or signal that pauses the session immediately if a player needs a break.
- **Tone:** Confirm whether the campaign is primarily dramatic, horror, action, or mixed.
- **Feedback channel:** Confirm how players will provide post-session feedback.

These are not optional. Long-term campaigns require trust. Establishing safety procedures before play is part of operating this engine correctly.

---

**END OF GM_Guide v1.0.0**
