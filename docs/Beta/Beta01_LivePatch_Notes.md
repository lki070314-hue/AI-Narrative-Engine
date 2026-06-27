# Beta01 Live Patch Notes

**Document ID:** `docs/Beta/Beta01_LivePatch_Notes.md`
**Version:** v1.2.0
**Status:** Draft
**Last Updated:** 2026-06-28
**References:** `docs/Beta/Beta01_Scenario.md`, `docs/Beta/Beta01_TestPlan.md`, `docs/Beta/Beta01_Checklist.md`, `engines/Director/DirectorEngine.md`

---

## Issue Found During Live Play

Beta01 live play exposed a pacing problem:

- Events happened too slowly.
- The world felt too static.
- The Director tended to wait for player actions instead of proactively advancing the situation.
- In multiplayer play, input order was being used as turn order without an explicit rule.

Additional live play exposed follow-up issues:

- Investigation loops became too slow.
- SCP/anomaly presence was too weak during some phases.
- Dynamic events were too mild and did not always force response.
- Actions using nonexistent or unlisted items were sometimes treated as valid.

## Cause

Beta01 had strong scene structure, clue gates, and Resolution Engine triggers, but it did not give the Director enough live-play guidance for proactive world movement between player actions. It also did not define how to process multiple player declarations when no initiative or speed system is active.

## Patch Summary

- Use input order as the default multiplayer action order.
- Resolve each player action completely before processing the next one.
- Introduce logical dynamic events after several meaningful player actions.
- Use event density targets to keep pressure active.
- Let NPCs act proactively within their motivations and disposition.
- Avoid passive Director responses that only end with "What do you do?"
- Add Incident Pressure Events after repeated investigation actions.
- Add an Investigation Loop Breaker.
- Require anomaly presence in every scenario phase.
- Enforce Inventory Integrity and Declared Equipment rules.

## Turn Order Rule

There is no initiative or speed system by default.

In multiplayer play, process player actions in the exact order they are received. Resolve each player action completely before processing the next one. If a later player's action is affected by an earlier result, use the updated world state.

If players explicitly declare a simultaneous action, resolve it as a coordinated action through the Resolution Engine. Do not reorder player actions unless an unavoidable in-world event requires it.

## Dynamic Event Rule

The world must not remain static.

After every 2-4 meaningful player actions, the Director should trigger a dynamic world event unless an event has just occurred. Events must be logical consequences of the current world state. Do not trigger random events that break scenario logic, clue balance, or ending reachability.

Dynamic events may include:

- NPC enters or leaves
- Radio transmission
- Alarm sound
- Lights flicker
- New clue becomes available
- Equipment failure
- Unexpected anomaly behavior
- Door locks or unlocks
- Environmental change
- New objective appears
- Off-screen NPC action
- Containment status change

Do not wait for players to ask for events. The world moves independently.

## Event Density Rule

Recommended pacing:

| Event Type | Frequency | Purpose |
|---|---|---|
| Minor Event | Every 2-3 meaningful player actions | Create pressure or new information |
| Major Event | Every 5-7 meaningful player actions | Change available choices |
| Critical Event | Once per scenario phase or when escalation conditions are met | Alter scenario direction or ending pressure |

Minor events should create pressure or new information. Major events should change available choices. Critical events should alter the scenario direction or ending pressure.

## Incident Pressure Events

Dynamic events must not be only ambient descriptions.

After 2-3 repeated investigation actions, the Director must introduce an Incident Pressure Event. The event must force the players to respond and must not be purely decorative.

Incident Pressure Events include:

- Direct anomaly manifestation
- Indirect anomaly evidence
- Containment instability
- NPC abnormal behavior
- Victim condition worsening
- Security system failure
- Physical danger
- Time pressure
- Forced choice
- Clue meaning reversal
- New threat entering the scene

Incident Pressure Events must follow scenario logic. They must not reveal hidden truth early, bypass clue requirements, or force a predetermined ending.

## Investigation Loop Breaker

If players perform repeated investigation without meaningful progression, the Director must break the loop by:

- Escalating the anomaly
- Moving an NPC
- Changing the environment
- Revealing a partial danger
- Cutting off a safe option
- Introducing a consequence
- Forcing a choice between two objectives

The Director must not keep returning only clue descriptions.

## Anomaly Presence Rule

Because Beta01 uses the SCP module, the anomaly must be felt during play.

The anomaly does not need to fully appear immediately, but each scenario phase should include at least one of:

- Sensory abnormality
- Physical trace
- Distorted recording
- NPC reaction to anomaly
- Containment warning
- Impossible environmental change
- Direct anomaly effect

This prevents the session from feeling like a normal investigation.

## NPC Proactive Behavior Rule

NPCs should not only answer player questions.

NPCs may:

- Interrupt with urgent information
- Hide information
- Move to another location
- React emotionally
- Call for help
- Warn players
- Make mistakes
- Reveal partial clues
- Trigger new complications

NPC behavior must remain consistent with motivation and current disposition. NPC responses remain governed by the NPC Engine.

## Director Output Rule

Avoid ending too many responses with only:

> "What do you do?"

Director output should usually include:

- Result of player action
- World update
- NPC or environmental reaction
- New pressure, clue, or complication
- Then room for player response

## Inventory Integrity Rule

The Director must respect character sheets.

If a player attempts to use an item not listed in their character sheet:

- Do not assume they have it.
- Do not resolve the action as if the item exists.
- Inform the player that the item is not currently listed.
- Offer possible alternatives:
  - search the scene for a substitute
  - request it from an NPC
  - access a supply point
  - improvise with existing equipment
  - attempt a different method

If the item is reasonable for their role but not listed, the Director may allow a Resolution check to determine whether it is accessible nearby, but must not grant it automatically.

## Declared Equipment Rule

Only declared equipment is guaranteed.

Character role, job, or authority may justify access attempts, but not automatic possession. For example, a Mobile Task Force character with Level 3 authority may request or locate equipment, but only listed items are immediately available.

## Live Director Instruction Block

```text
Beta01 live patch:
- Do not let repeated investigation become the whole session. After 2-3 repeated investigation actions without meaningful progression, trigger an Incident Pressure Event.
- Incident Pressure Events must force response: anomaly manifestation, containment instability, abnormal NPC behavior, victim worsening, system failure, physical danger, time pressure, forced choice, clue meaning reversal, or new threat.
- The SCP/anomaly must be felt in every phase through sensory abnormality, physical trace, distorted recording, NPC reaction, containment warning, impossible environmental change, or direct effect.
- Do not keep returning only clue descriptions. Break loops by escalating the anomaly, moving an NPC, changing the environment, revealing partial danger, cutting off a safe option, introducing consequence, or forcing a choice between objectives.
- Respect character sheets. Only listed equipment is automatically available.
- If a player uses an unlisted item, say it is not currently listed and offer alternatives: search nearby, request from NPC, access supply point, improvise with listed gear, or try another method.
- Role or authority can justify a Resolution check to access equipment nearby, but never automatic possession.
```

## QA Items To Verify

- Player action order follows input order in multiplayer play.
- Simultaneous actions are handled as coordinated Resolution Engine actions.
- Minor events occur within 2-3 meaningful player actions unless an event just occurred.
- Major events occur within 5-7 meaningful player actions when scenario state supports them.
- NPCs act proactively at least once during the session.
- Director does not stay passive for multiple consecutive responses.
- World state changes without direct player request.
- Dynamic events do not reveal hidden truth early.
- Dynamic events do not bypass Tier 2 or Tier 3 clue requirements.
- Endings A-E remain reachable.
- Incident Pressure Event occurs after repeated investigation.
- Investigation loop is interrupted before pacing stalls.
- SCP/anomaly presence is felt in each phase.
- No unlisted item is treated as automatically possessed.
- Missing item prompts alternatives.
- Role-based equipment access is handled through Resolution, not automatic success.

---

## Post-Playtest Patch (v1.2.0)

Source: Beta01 live playtest session — post-session gameplay feedback.

These additions address Director and gameplay pacing problems identified during live play. They are not engine specification bugs. The following rules are appended to `DirectorEngine.md` §7 and §10 as v1.1.0.

### Issue: Single-consequence responses

Actions produced only one result. The world did not react beyond the direct effect.

**Rule added (DirectorEngine §7.8 — Consequence Generation):**

Every meaningful player action must generate two or more of the following:

- Immediate result
- World change
- NPC reaction
- New clue
- New danger
- New opportunity
- New problem
- Resource change
- Environmental change
- SCP/anomaly reaction

Director must not stop after resolving the direct action. The world must continue reacting.

### Issue: Consequence isolation

Actions did not propagate through the world. Each result felt disconnected from the broader scene.

**Rule added (DirectorEngine §7.9 — Consequence Chaining):**

One player action should naturally propagate through the world. A door opening generates sound → NPC hears it → system logs it → containment status changes → anomaly reacts. Director must not isolate actions. Visible chaining goes in narration. Hidden chaining goes to Shadow Engine.

### Issue: Response length caused fatigue

Long responses were tiring for players and diluted key information.

**Rule added (DirectorEngine §7.10 — Response Length Limits):**

| Response type | Max length |
|---|---|
| Normal response | 80–150 words |
| Large event | 200 words |
| Ending | No limit |

Short, impactful narration is preferred over long description.

### Issue: SCP atmosphere was insufficient

The scenario felt like a normal building investigation, not an anomalous environment.

**Reinforced (DirectorEngine §7.5.1, DirectorEngine §7.11):**

The anomaly must be felt in every phase. Each scene must always have at least one progressing element: NPC objective, anomaly behavior, environmental condition, countdown, player objective, or containment status. The world never waits.

### Issue: Inventory violations

Players successfully used items not on their character sheets without challenge.

**Already documented (DirectorEngine §7.5.2, LivePatch v1.1.0):**

No new rule addition required. Enforcement must be consistent in all future tests. This issue is tracked in Beta01_Checklist §8d.

### Issue: Resolution reasoning was opaque

Players sometimes did not understand why an action succeeded or failed.

**Rule added (DirectorEngine §7.12 — Resolution Transparency):**

Director should briefly expose the reasoning behind each Resolution check using this format:

```
판정
  난이도: [difficulty]
  유리 요소: + [factor]
  불리 요소: - [factor]
  결과: [outcome]
```

Dice values, DC numbers, and internal modifiers must never be exposed.

### Updated Live Director Instruction Block

```text
Beta01 live patch (v1.2.0 additions):
- Every meaningful action must produce 2+ outcomes: result, world change, NPC reaction,
  new clue, danger, opportunity, problem, resource change, environment change, or anomaly reaction.
  Do not stop after the direct result.
- Actions propagate. Opening a door → sound → NPC hears it → system logs it → anomaly reacts.
  Do not isolate actions from the world.
- Normal response: 80–150 words. Large event: 200 words max. Ending: no limit.
  Short and immediate is better than long and descriptive.
- Every scene must have something progressing: NPC objective, anomaly behavior, environment
  condition, countdown, player objective, or containment status. The world never waits.
- After each Resolution check, show reasoning briefly:
    판정 / 난이도: X / 유리 요소: + Y / 불리 요소: - Z / 결과: outcome
  Never expose dice values, DC, or internal modifiers.
```

### QA Items To Verify (v1.2.0 additions)

- Meaningful actions produced two or more distinct outcomes.
- Consequence chains were visible in narration where appropriate.
- Normal responses did not exceed 150 words.
- Each scene contained at least one progressing momentum element.
- Resolution check reasoning was briefly shown to the player.
- SCP/anomaly presence was felt in every scenario phase.
- No action result felt isolated from the broader world state.

---

**END OF Beta01_LivePatch_Notes v1.2.0**
