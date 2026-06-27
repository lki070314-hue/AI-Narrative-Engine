# Beta01 Test Plan

**Document ID:** `docs/Beta/Beta01_TestPlan.md`
**Version:** v1.1.0
**Status:** Draft
**Last Updated:** 2026-06-27
**References:** `docs/Beta/Beta01_Scenario.md`, `docs/Beta/Beta00_Feedback.md`

**Changelog v1.1.0:** Added Ending D trigger to expected results; added PPE availability note; updated server room bypass DC; added Ending E trigger to failure cases.

---

## 1. Test Purpose

Beta01 is the first structured playtest following the post-Beta00 engine improvements. Its purpose is to verify that the complete engine stack — with Resolution Engine, updated Director Engine (Context Linking, Adaptive Detail Mode, Surprise Handling), NPC Engine, and Memory Engine — functions correctly in an investigation scenario with real player input.

Beta00 identified the following critical issues. Beta01 must verify that all of them are resolved:

| Beta00 Issue | Beta01 Verification Target |
|---|---|
| Director implied success before uncertainty was evaluated | Resolution Engine must be invoked for all non-trivial actions |
| Scenes felt static, Director mirrored player input | Director response strategy provides interaction surfaces and leads |
| Discoveries felt disconnected from prior events | Context Linking must fire at key connection points |
| Output length mismatched player need and scene pacing | Adaptive Detail Mode must respond to `[요청: 중요한 내용만]` |
| Creative player actions were rejected or mishandled | Surprise Handling must evaluate plausibility before any rejection |

---

## 2. Player Count Handling

### 2.1 Primary Run — 1 Player

The scenario is designed to be completable by a single player without any modification. All clue chains, NPC interactions, and resolution decisions are accessible to one player. Run the primary test with one player first.

### 2.2 Secondary Run — 2 Players (Optional)

If a second player is available, run a separate 2-player session and observe the cooperation mechanics. The following cooperation points should be verified:

| Cooperation Point | Expected Behavior |
|---|---|
| Monitoring Room + Research Lab simultaneous investigation | Both players can act independently in their chosen location per turn |
| One player revives Chen, one investigates lab | Actions resolve separately via Resolution Engine; results available to both |
| Two-person approach to Dr. Reyes | NPC Engine accounts for both players' contributions to Reyes' disposition |
| Final resolution split-tasking | Each player's action resolves independently before combined outcome |

**Important:** No cooperation mechanic should be mandatory. If only one player is present, every cooperation point must degrade gracefully to a solo action.

---

## 3. Test Procedure

### Step 1 — Pre-Session Preparation

- [ ] Load all engine specs: Resolution, Director, NPC, Memory, Mission, World, QA
- [ ] Load SCP module context
- [ ] Load `Beta01_Scenario.md` as scenario reference
- [ ] Confirm all Key NPCs and Locations are initialized
- [ ] Confirm Hidden Truth is loaded in GM context only (not player-visible)
- [ ] Confirm Dr. Reyes' starting disposition is -20, floor at -50
- [ ] Confirm Guard Chen's initial state is `incapacitated` (recovery: automatic upon object deactivation)
- [ ] Confirm PPE is available at loc_ECHO_02 (Entrance/Corridor supply cart) — no roll required
- [ ] Confirm exposure tracking initialized: lab action counter = 0 per player, check fires at count = 3

### Step 2 — Character Creation

Guide player(s) through character creation using Creator Engine with SCP module.

- For investigation-type scenarios, relevant skills include: Investigation, Persuasion, Medicine (for Chen), Technical (for Server Room bypass)
- Players do not need specific skills to reach any ending — character builds affect difficulty, not accessibility

### Step 3 — Session Execution

Run the scenario following the Scene Flow in `Beta01_Scenario.md`. Track all checkpoints listed in Section 6 of this document during play.

Planned duration: 90–150 minutes. If significantly shorter, note which scenes were compressed or skipped.

### Step 4 — Post-Session

- Immediately complete `Beta01_Feedback_Template.md` while impressions are fresh
- Complete `Beta01_Checklist.md` final verification section
- Note any unanticipated player actions and how they were handled
- Note any engine failures, mishandled situations, or consistency violations

---

## 4. Expected Results

### 4.1 Resolution Engine

| Expected Behavior | Pass Condition | Fail Condition |
|---|---|---|
| Investigation rolls are required to find Tier 2 and Tier 3 clues | Player must declare an action; roll result determines discovery | Clue is delivered without player action or roll |
| Persuading Dr. Reyes requires Resolution Engine processing | Outcome varies based on roll + disposition + evidence | Reyes immediately opens door after one message |
| Deactivating the object requires a resolution check | Check type and difficulty vary by method chosen | Object is deactivated without any uncertainty |
| Unexpected player approaches are evaluated, not refused | Resolution Engine receives the action and returns a result | Director refuses the action before passing it to Resolution |
| Ending D exposure check fires after 3rd unprotected lab action | After the 3rd Resolution action in the lab without PPE, an exposure check (item, standard) is triggered | Ending D is either impossible to reach or triggers arbitrarily without a defined threshold |
| Ending E triggers on Critical Failure or enclosure breach | Critical Failure on deactivation → Ending E; physical enclosure breach without deactivation → Ending E on Failure | Ending E condition is never reachable, or triggers outside defined conditions |

### 4.2 Director Engine

| Expected Behavior | Pass Condition | Fail Condition |
|---|---|---|
| Director does not confirm anomaly source before clue discovery | No mention of Reyes, her test, or the activation cause until players find the evidence | Director explains the cause unprompted |
| Each scene response includes interaction surfaces | After each Director output, players have at least 1–2 visible things to engage with | Director describes a location with nothing to interact with |
| Director does not narrate player emotions or decisions | No "you feel scared" or "you decide to investigate" | Any line assuming player state |
| Pacing changes are reflected in output length | Climax scenes are shorter and more immediate than exploration scenes | Scene lengths are uniform regardless of pacing |

### 4.3 NPC — Dr. Reyes

| Expected Behavior | Pass Condition | Fail Condition |
|---|---|---|
| Reyes does not open the door immediately | At least one Resolution + NPC Engine cycle required | She opens on the first player message |
| Reyes' responses reflect her current disposition | Her information level tracks the table in the scenario | She provides full information at disposition -20 |
| Reyes' behavior is internally consistent across the scene | No contradictions in what she admits across multiple turns | She denies something she already admitted |

### 4.4 Context Linking

| Expected Behavior | Pass Condition | Fail Condition |
|---|---|---|
| Access log → lab disturbance connection is made | Director references the access log when players examine the lab | Lab examined, log ignored despite being found |
| Chen's distress call → finding Chen connection | Director connects his alert timestamp to his unconscious state | These facts treated as unrelated |
| Notepad equation → Reyes' full notes connection | If players have both, Director acknowledges they form the same sequence | Treated as unrelated documents |

### 4.5 Adaptive Detail Mode

| Expected Behavior | Pass Condition | Fail Condition |
|---|---|---|
| `[요청: 중요한 내용만]` triggers compressed output | Response is ≤5 sentences, contains only critical result and immediate options | Full atmospheric output continues unchanged |
| Climax pacing triggers shorter output automatically | Director output length decreases without explicit player request | Long exploration-style output during climax |

### 4.6 Surprise Handling

At least one unexpected player action is expected. Common examples:

- Attempting to play audio/music at the object
- Trying to use station communications equipment to contact outside
- Searching areas not listed in the scenario
- Attempting to barricade the lab instead of deactivating the object

**Pass condition:** Resolution Engine receives the action, evaluates plausibility, and a result is returned. Play continues.
**Fail condition:** Director refuses the action with "that's not possible" without evaluating it.

---

## 5. Failure Cases

The following are unacceptable outcomes that indicate engine or specification failures:

| Failure Case | Severity | Probable Cause |
|---|---|---|
| Any Tier 2 or Tier 3 clue is delivered without a player investigation action | P1 — Severe | Director bypassing Resolution (SV-RES-001, SV-DIR-010) |
| Dr. Reyes cooperates with disposition at or below -20 | P1 — Severe | NPC Engine not governing Reyes' response |
| A player's unexpected action is refused without Resolution evaluation | P2 — Moderate | Surprise Handling not implemented (SV-DIR-013) |
| Session ends without any completed pacing cycle | P2 — Moderate | Director pacing management failure (SV-DIR-004) |
| Ending does not reflect player choices and gathered evidence | P1 — Severe | World Engine / Mission Engine / Director consistency failure |
| Player emotion or decision is narrated by Director | P1 — Severe | CoreSpec §3.1 / §12.1.1 violation |
| The hidden truth (Reyes' involvement) is mentioned before discovery | P0 — Fatal | Meta information leak (CoreSpec §3.2) |
| Context Linking fires but references information player has not yet found | P1 — Severe | Memory Engine / Director context boundary violation |
| Ending D triggers without a 3-action exposure threshold being reached | P2 — Moderate | Director using arbitrary trigger instead of defined threshold |
| Ending D never triggers even after 5+ unprotected lab actions | P2 — Moderate | Director not tracking exposure or not applying the defined threshold |
| Ending E is presented as the outcome of a non-critical-failure deactivation | P1 — Severe | Outcome inconsistent with defined Ending E trigger conditions |
| PPE at the supply cart requires a roll or is not mentioned in Scene 2 | P2 — Moderate | Director withholding Tier 1 resource from player without cause |

---

## 6. QA Checkpoints

### Pre-Session Checkpoint
- All engine specs loaded?
- Hidden Truth isolated to GM context?
- NPC initial states set correctly?

### During-Session Checkpoints

| Checkpoint | Trigger | Verification |
|---|---|---|
| Scene 3 Entry | Player enters Monitoring Room | Director describes Chen and screens without naming the cause |
| First Investigation Roll | Player declares "I investigate" or equivalent | Resolution Engine invoked, roll type and DC set |
| Reyes Contact (first message) | Player speaks to supply room door | NPC Engine governs response; disposition -20 behavior |
| Lab Entry | Player enters Research Lab | No mention of Reyes or her test; exposure tension begins |
| Context Link — Access Log | Player finds both the access log AND lab evidence | Director references the earlier clue within 1 turn |
| Reyes Cooperation Threshold | Disposition reaches 30+ | Reyes begins admitting partial information |
| Deactivation Attempt | Player declares intent to deactivate object | Resolution Engine invoked; outcome not pre-confirmed |
| Ending | Final resolution complete | Ending matches player's choices and discovered information |

### Post-Session Checkpoint

- At least 3 meaningful player choices occurred?
- At least 1 NPC interaction was substantive?
- At least 1 world change resulted from player action?
- Memory Engine would capture: key NPCs encountered, clues found, ending branch reached?
- QA Engine would find no fatal or P1 errors?

---

## 7. What to Observe During Play

### Player Experience

- **Agency:** Does the player feel their choices matter? Do they feel they are solving a puzzle rather than following a script?
- **Clue pacing:** Do clues arrive too fast (no investigation needed), too slow (player is stuck), or at a natural pace that rewards curiosity?
- **NPC authenticity:** Does Dr. Reyes feel like a person with her own fears and motivations, or does she feel like a puzzle lock?
- **Director neutrality:** Does the Director ever lead the player toward specific choices, or does it present the world neutrally?

### Engine Performance

- **Resolution Engine:** Is it invoked consistently? Do difficulty ratings feel appropriate to the situation?
- **Context Linking:** Does it fire at the right moments? Does it feel natural or mechanical?
- **Adaptive Detail:** Does scene output length shift appropriately with pacing?
- **Surprise Handling:** When the player tries something unexpected, does play continue naturally?

### Ending Coherence

- Does the ending the player reaches logically follow from their choices?
- If the player ended on Branch A (Full Containment), did they actually have the information required?
- If the player ended on Branch D or E (Failure), did it feel like a consequence of their choices rather than arbitrary?

---

## 8. Notes on 1-Player vs. 2-Player Differences

| Element | 1-Player | 2-Player |
|---|---|---|
| Chen revival | Must choose this over lab investigation | Can split tasks |
| Server room access | Sequential with other tasks | One player can attempt while other handles Reyes |
| Time pressure | Implicit, managed by Director pacing | Same — time pressure is narrative, not mechanical |
| Ending accessibility | All 5 endings reachable | Same endings, potentially with less difficulty on some |

**No rule in this scenario requires 2 players.** The 2-player test is additive, not required for completion.

---

**END OF Beta01_TestPlan v1.1.0**
