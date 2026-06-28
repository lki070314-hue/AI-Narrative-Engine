# Beta02 Test Plan

**Document path:** `docs/Beta/Beta02_TestPlan.md`
**Version:** v1.0.0
**Status:** Draft
**Last updated:** 2026-06-28
**References:** `docs/Beta/Beta02_Preparation.md`, `docs/Beta/Beta01_Result.md`, `engines/Director/PacingEngine.md`, `engines/Director/ConsequenceEngine.md`, `engines/Director/SceneFlowEngine.md`, `engines/Director/OutputEngine.md`

---

## 1. Test Purpose

Beta02 verifies whether the Director-side improvements built after Beta01 — pacing, consequence chaining, scene flow, and output length — produce a faster, more dynamic, and more engaging live-play experience.

Beta02 does not retest basic framework stability. Beta01 confirmed the engine stack runs without P0 failure. Beta02 focuses exclusively on the P1 issues that Beta01 failed.

| Beta01 Failure | Beta02 Verification Target |
|---|---|
| Pacing too slow; investigation loops | Pacing shift fires after 2 low-impact actions; loops broken |
| One action produced one result | Meaningful actions produce 2+ consequences |
| SCP/anomaly presence too weak | Anomaly felt in every scenario phase |
| Long responses caused fatigue | Normal responses within 80–150 Korean characters |
| Director too passive | Director acts proactively without waiting for player prompts |
| Resolution reasoning not visible | Resolution transparency block shown for uncertain checks |
| Inventory gaps | Only declared equipment is guaranteed |

---

## 2. Player Count and Setup

### 2.1 Primary Run — 1 Player

Run the primary test with one player. All checks apply equally in solo play.

### 2.2 Secondary Run — 2 Players (Recommended)

Run a 2-player session after solo play completes. Observe whether pacing shifts remain appropriate with more actions per unit of time and whether consequence chains from one player's action affect the other's options.

### 2.3 Turn Order — 2-Player Rule

- Process player inputs in the exact order received.
- Each player's action resolves completely before the next is processed.
- The second player's action uses the updated world state from the first.
- If players explicitly declare a simultaneous action, treat it as a coordinated Resolution Engine check.

### 2.4 Pre-Session Setup

Before starting play:

- [ ] Load engine specs: Director Engine (including §7.8–§7.12), Resolution Engine, NPC Engine, Mission Engine, World Engine, Memory Engine, QA Engine
- [ ] Load Director sub-engine specs: PacingEngine.md, ConsequenceEngine.md, SceneFlowEngine.md, OutputEngine.md
- [ ] Load active world module context
- [ ] Load scenario as GM reference only — hidden information must not be visible to players
- [ ] Confirm hidden information is GM-only
- [ ] Initialize pacing tracking: meaningful low-impact action counter = 0
- [ ] Initialize investigation loop counter = 0
- [ ] Confirm inventory validation is active: only declared equipment is guaranteed
- [ ] Confirm anomaly tracking is active for each scenario phase
- [ ] Player count confirmed: _____ (1 or 2)

---

## 3. Test Procedure

### Step 1 — Session Start

- Open with the scenario entry point.
- Confirm the Director does not reveal hidden information in the opening narration.
- Confirm the opening scene has a visible objective, at least one active element, and anomaly presence within the first 2 turns.

### Step 2 — Play Each Scene

Run each scene following the scenario. After each scene ends (or at a natural pause point), perform the per-scene pause-and-check described in Section 4 before continuing.

### Step 3 — Post-Session

- Complete `Beta02_Checklist.md` immediately after the session.
- Record all Section 4 check results with notes.
- Assess overall pass/fail using Section 6 criteria.
- File a brief report of remaining issues for Beta03 planning.

---

## 4. What to Test Every Scene

Pause after each scene and verify the following. Record results in the session log.

### 4.1 Pacing Trigger

| Check | Pass | Fail |
|---|---|---|
| Did two meaningful low-impact actions occur without a pacing shift? | A pacing shift occurred, or no two-in-a-row sequence happened. | Two or more low-impact actions ran back-to-back with no world response. |
| Did the pacing shift create pressure, changed options, or a new decision? | Yes — players had something new to respond to. | Shift was only cosmetic or produced no player-facing change. |
| Did the Director wait passively while players investigated repeatedly? | No — the world moved. | Director returned only clue descriptions for 3+ turns. |
| Did a repeated investigation loop trigger an investigation loop breaker? | Yes — Director escalated, moved NPC, cut off option, or transitioned scene. | Loop continued with the same clue descriptions. |

### 4.2 Consequence Chaining

| Check | Pass | Fail |
|---|---|---|
| Did meaningful actions produce at least 2 distinct results? | Yes — direct result plus at least one secondary effect visible or tracked. | Action produced only the direct outcome. |
| Did at least one response include NPC reaction alongside direct result? | Yes. | NPC was present but did not react. |
| Did at least one response include anomaly/SCP reaction alongside direct result? | Yes, when anomaly is present in the scene. | Anomaly was nearby but showed no reaction. |
| Did results propagate into the world — sound, systems, environment? | Yes. | Each result was isolated with no downstream effect. |
| Did failure move play forward rather than dead-ending it? | Yes — failure produced cost, pressure, or changed circumstance. | Failure produced only "nothing happened." |

### 4.3 Scene Flow

| Check | Pass | Fail |
|---|---|---|
| Did the scene have a clear objective? | Yes. | Scene felt like a room with no purpose. |
| Did the scene have at least one active element? | Yes — NPC, anomaly, alarm, countdown, or environment in motion. | Scene was static — nothing moved. |
| Did the scene change after player success or failure? | Yes. | Scene reset to the same state. |
| Did over-investigation trigger escalation instead of repeated clue text? | Yes — Director escalated or transitioned. | Director described the same clues again. |
| Did the scene transition when its purpose was fulfilled? | Yes. | Players stayed in an exhausted scene without transition. |

### 4.4 Anomaly Presence

| Check | Pass | Fail |
|---|---|---|
| Was SCP/anomaly presence felt in this scene? | Yes — sensory abnormality, physical trace, distorted observation, NPC reaction, or direct effect. | Scene felt like a normal non-anomalous investigation. |
| Did anomaly presence appear in consequence chains? | Yes — anomaly reacted to player action at least once. | Anomaly presence was only scene dressing, never reactive. |

### 4.5 Output Length

| Check | Pass | Fail |
|---|---|---|
| Were normal responses within 80–150 Korean characters? | Yes — routine actions received short narration. | Routine actions received long atmospheric paragraphs. |
| Were event responses within 150–300 Korean characters? | Yes. | Event responses were the same length as routine responses. |
| Did responses include result, consequence, pressure, and next situation? | Yes. | Responses ended only with "What do you do?" |

### 4.6 Resolution Transparency

| Check | Pass | Fail |
|---|---|---|
| Was Resolution reasoning briefly shown for each uncertain check? | Yes — difficulty rating and key factors visible. | Check result stated with no reasoning. |
| Was dice value, DC, or internal modifier hidden? | Yes. | Numeric values were disclosed to the player. |

### 4.7 Inventory Rules

| Check | Pass | Fail |
|---|---|---|
| Were unlisted items treated as not automatically possessed? | Yes. | Director granted unlisted equipment without a check. |
| Were missing items handled with alternatives? | Yes — search, NPC request, supply access, improvise, or other method offered. | Missing item created a dead end. |
| Did role or authority justify a Resolution check, not automatic possession? | Yes. | Role automatically provided unlisted equipment. |

---

## 5. Pause-and-Check Method

After each scene ends, pause play and review all Section 4 checks before entering the next scene.

**Record for each scene:**
- Scene name or number
- Pacing shifts that occurred: type and trigger
- Consequence count per meaningful action (rough average)
- Whether anomaly presence was felt and how
- Whether the scene had an active element
- Any failed checks, with a brief note

**If a failed check is found:**
- Note it in the session log.
- Do not adjust play mid-session to conceal the failure.
- Continue to the next scene.
- Record all failures for post-session review.

---

## 6. Pass / Fail Criteria

### Session-Level Pass

All of the following must be true:

- No P0 or P1 failures.
- At least one complete pacing cycle (Rising → Climax → Falling → Resolution) occurred.
- At least 3 meaningful player choices offered.
- At least 1 world change resulted from player action.
- At least 1 world change occurred without direct player prompt (Director acted proactively).
- Repeated investigation triggered a pacing shift at least once.
- At least one meaningful action produced 2+ visible consequences.
- SCP/anomaly presence felt in every scenario phase.
- Normal response length within limits at least 80% of the time.
- No unlisted item granted automatically.
- Director acted proactively at least twice.
- At least 1 substantive NPC interaction.
- At least 1 NPC proactive behavior (not just answering a question).

### Session-Level Fail

Any of the following means a fail:

- A player repeated investigation 3+ times without a pacing shift or scene change.
- Most meaningful actions produced only one result.
- A scenario phase felt entirely non-anomalous.
- Responses frequently consisted of long atmospheric paragraphs for routine actions.
- The Director granted unlisted inventory automatically.
- Missing equipment created a dead end with no alternatives.
- Resolution outcomes felt arbitrary or opaque throughout.
- The Director only responded to prompts and never acted proactively.
- Scenes remained static until players guessed the intended prompt.

---

## 7. What to Record During Play

Record the following throughout the session for post-session analysis:

- **Pacing shifts:** When each occurred, what triggered it, what type it was.
- **Consequence counts:** Per meaningful action, how many distinct effects were produced.
- **Anomaly presence moments:** When and how anomaly/SCP presence appeared.
- **Scene transitions:** When and why each scene changed.
- **Output length violations:** Any response that felt too long for the action type.
- **Inventory incidents:** When unlisted items were used and how it was handled.
- **Investigation loop incidents:** Any repeated investigation sequence and how it was resolved.
- **Player reactions:** Player comments on tempo, tension, fatigue, or confusion.
- **Unexpected player actions:** Any action outside scenario planning and how it resolved.
- **Proactive Director moments:** When the Director moved the world without a player prompt.

---

## 8. Expected Results

| Area | Expected Result |
|---|---|
| Pacing | Players report faster tempo than Beta01 |
| Consequence | Players notice their actions change the world in multiple ways |
| Anomaly | Players feel danger or anomaly presence early and throughout |
| Output length | Players do not report reading fatigue |
| Resolution | Players understand why checks succeeded or failed |
| Inventory | Players feel inventory limits are fair with clear alternatives |
| Director | Players feel the world is alive and not waiting for them |

---

## 9. Failure Cases

The following outcomes indicate engine or behavior failures:

| Failure | Severity | Source Rule |
|---|---|---|
| Investigation repeats 3+ times without pacing shift | P1 | PacingEngine.md §4, §6 |
| Meaningful action produces only 1 result | P2 | ConsequenceEngine.md §2, DirectorEngine §7.8 |
| Anomaly absent from a scenario phase | P2 | Beta02_Preparation §5 |
| Normal response exceeds 300 Korean characters | P2 | OutputEngine.md §3, DirectorEngine §7.10 |
| Resolution check has no reasoning block | P2 | OutputEngine.md §5, DirectorEngine §7.12 |
| Dice value, DC, or modifier disclosed | P1 | CoreSpec §12.1.3, DirectorEngine §7.12 |
| Unlisted item granted automatically | P1 | DirectorEngine §7.5.2 |
| Missing item creates dead end | P2 | DirectorEngine §7.5.2 |
| Director only reacts, never acts proactively | P2 | DirectorEngine §7.5.1 |
| Scene remains static for 3+ consecutive turns | P2 | SceneFlowEngine.md §4 |
| Hidden truth revealed before player discovery | P0 | CoreSpec §3.2 |
| Player emotion or decision narrated by Director | P1 | CoreSpec §12.1.1, DirectorEngine §7.7 |

---

**END OF Beta02_TestPlan v1.0.0**
