# Beta03 Preparation

**Document path:** `docs/Beta/Beta03_Preparation.md`  
**Version:** v1.0.0  
**Status:** Draft  
**Last updated:** 2026-06-29  
**References:** `docs/Beta/Beta02_Result.md`, `docs/Release/Known_Issues.md`, `engines/Director/DirectorEngine.md`, `engines/Director/PacingEngine.md`, `engines/Director/ConsequenceEngine.md`, `engines/Director/SceneFlowEngine.md`, `engines/Director/OutputEngine.md`, `engines/Director/AnomalyEngine.md`

---

## 1. Beta03 Goal

Beta03 tests whether the AI Narrative Engine remains playable, fair, and dynamic with **4 live players**.

Beta01 and Beta02 validated live play primarily in 2-player sessions. Beta03 exists to stress-test multiplayer scaling: submission-order action processing, pacing with more simultaneous intent, consequence density under high input volume, output economy, anomaly presence, and waiting fatigue.

Beta03 does not revise core engine specifications. It prepares a focused live-play validation pass using the existing Director support documents.

---

## 2. Isolation and Canon Boundary

Beta03 is a non-canon engine validation fixture.

Hard boundaries:
- Do not reuse Beta00 locations.
- Do not reuse the Beta01 scenario.
- Do not reuse the Beta02 scenario.
- Do not use Season 2 campaign content.
- Do not use main campaign NPCs.
- Do not use main campaign SCPs or anomalies.
- Do not use main campaign clues.
- Do not use main campaign factions.
- Do not make any Beta03 character, NPC, anomaly, clue, location, or event canon after the test.

All Beta03 content must be temporary and disposable. The scenario exists only to validate 4-player engine behavior.

---

## 3. Player Configuration

| Slot | Character |
|---|---|
| P1 | Chernov Van |
| P2 | Noel Rowan |
| P3 | Kaney Chiakey |
| P4 | Wei Feirun |

These are temporary Beta03-only test characters. They must not be treated as main campaign characters, campaign NPCs, or future canon references.

### 3.1 Action Processing Order

For Beta03, player actions are processed in **submission order**, not fixed slot order.

Rules:
- Process submitted actions from earliest to latest.
- Each action resolves against the world state produced by previous submitted actions.
- If two submissions are simultaneous or the order cannot be confirmed, use fallback order: P1 -> P2 -> P3 -> P4.
- Explicitly declared coordinated actions may be grouped for a coordinated Resolution check, but the Director must still log participating players and submitted order.

---

## 4. What Beta03 Must Test

- 4-player turn/order handling.
- Pacing calibration for 4 players.
- Consequence density with many inputs.
- Prevention of player waiting fatigue.
- AnomalyEngine validation and KI-001 monitoring.
- SceneFlow stability with 4 simultaneous player intents.
- Output length control.
- Inventory integrity.
- Resolution transparency.
- Player agency for all 4 players.

---

## 5. Required Director Calibration for 4 Players

The Director must keep the world active without allowing one player to dominate.

Rules:
- Do not wait for every player to act before the world moves if the scene pressure demands movement.
- Do not let one player dominate the scene. If one player submits repeatedly while others are waiting, process only when doing so does not erase other players' opportunity to act.
- After 4 submitted player actions, force at least one world, anomaly, or NPC development unless one has just occurred.
- If 2 or more low-impact actions occur consecutively, trigger a pacing shift.
- For meaningful actions, produce direct result plus at least 2 consequences.
- Keep normal output short.
- Avoid writing player emotions, thoughts, or undeclared actions.
- Use Resolution for uncertain outcomes and compact transparency for player-facing reasoning.

---

## 6. Required Pacing Behavior

Beta03 uses the Beta02 pacing rules with a 4-player calibration layer.

Pacing shifts must occur when:
- 2 consecutive low-impact actions occur.
- 4 submitted player actions occur without any meaningful world/anomaly/NPC development.
- A scene has delivered clues but players are only restating investigation.
- A timed pressure event logically advances.
- The anomaly has not been felt in the current phase.
- An NPC with a goal would logically move, interrupt, hide, warn, or leave.

Valid pacing shifts:
- Anomaly state advance.
- NPC action.
- Environmental degradation.
- Security or containment pressure.
- Time countdown change.
- Clue becoming costly or inaccessible.
- Scene transition.
- Forced tradeoff between objectives.

Pacing shifts must preserve player agency. They change the situation; they do not choose player actions.

---

## 7. Required Consequence Behavior

Every meaningful action should produce:

1. Direct result.
2. At least 2 additional consequences.

Consequences may include:
- Anomaly reaction.
- NPC reaction.
- World or containment state change.
- Clue exposure.
- New danger.
- New opportunity.
- Resource change.
- Delayed or hidden consequence handled by Shadow/state tracking.

The Director should avoid narrating every hidden consequence. Hidden or delayed effects must be tracked without exposing secrets.

---

## 8. Required Anomaly Behavior

Beta03 directly targets KI-001: anomaly presence weaker than NPC presence.

The anomaly must be unique to Beta03 and must never be reused in the main campaign.

The anomaly must:
- Be visible as an active presence in every relevant scenario phase.
- Show at least 2 observable behavior patterns before players must apply them.
- React to at least 1 player action per scene.
- Advance independently at least once per phase.
- Influence available options directly, not only through NPC explanation.
- Provide at least 1 interaction window after a major anomaly event.

NPCs may provide partial context, but players must be able to understand the anomaly through direct observation.

---

## 9. Required Output Behavior

Use OutputEngine live-play targets:

| Response type | Target |
|---|---|
| Normal response | 80-150 Korean characters or similarly short Korean text |
| Event response | 150-300 Korean characters |
| Major scene response | 300-500 Korean characters |
| Ending | Flexible |

With 4 players, response economy is critical. The Director should prefer compact result/consequence/pressure updates and avoid long atmospheric paragraphs for routine actions.

---

## 10. Required Inventory Behavior

- Only declared equipment is guaranteed.
- Role or authority may justify a Resolution check, not automatic possession.
- Unlisted items must not be granted automatically.
- Missing item handling should offer fair alternatives: search, request, access supply, improvise, or try another method.
- Missing equipment must not create an unavoidable dead end.

---

## 11. Success Criteria

Beta03 succeeds if:
- No planned campaign content is used or spoiled.
- All characters, NPCs, anomaly behavior, clues, factions, locations, and events remain Beta03-only and non-canon.
- All 4 players receive meaningful opportunity to affect the session.
- Submission-order action processing is maintained and logged.
- No player reports severe waiting fatigue.
- At least one world/anomaly/NPC development occurs after each set of 4 submitted actions.
- 2 consecutive low-impact actions trigger a pacing shift.
- Meaningful actions usually produce direct result plus 2 consequences.
- The anomaly is rated at least as memorable as the primary NPC by most players.
- KI-001 shows measurable improvement versus Beta02.
- Normal output remains short enough for live play.
- Inventory integrity and Resolution transparency remain intact.
- No player agency violation occurs.

---

## 12. Failure Criteria

Beta03 fails if any of the following occur:
- Any Beta00, Beta01, Beta02, Season 2, or main campaign content is reused.
- Any planned campaign content is spoiled.
- Any Beta03 character, NPC, anomaly, clue, location, or event is carried into canon.
- Action order defaults to fixed P1 -> P2 -> P3 -> P4 when submission order is known.
- One player dominates the session while others wait without meaningful opportunity.
- The Director waits for all 4 players in an urgent scene where the world should logically move.
- 4 submitted actions pass with no world, anomaly, or NPC development.
- 2 or more low-impact actions repeat without a pacing shift.
- Most meaningful actions produce only one result.
- The anomaly is primarily explained by an NPC instead of directly observed.
- The anomaly feels absent or cosmetic in any scenario phase.
- Routine outputs become long enough to cause reading fatigue.
- Unlisted inventory is granted automatically.
- Resolution exposes dice values, DCs, hidden modifiers, or internal engine state.
- The Director writes undeclared player actions, thoughts, emotions, or speech.

---

## 13. Pre-Run Checklist

- [ ] Load CoreSpec and DirectorEngine.
- [ ] Load PacingEngine, ConsequenceEngine, SceneFlowEngine, OutputEngine, and AnomalyEngine.
- [ ] Load Beta03 scenario as GM-only information.
- [ ] Confirm Beta03 scenario is isolated from Beta00, Beta01, Beta02, Season 2, and main campaign content.
- [ ] Confirm all player characters are temporary Beta03-only test characters.
- [ ] Confirm all NPCs are Beta03-only.
- [ ] Confirm the anomaly is Beta03-only and will never be reused in main campaign continuity.
- [ ] Confirm SCP Foundation module context.
- [ ] Confirm player slots P1-P4.
- [ ] Confirm submission-order input collection method.
- [ ] Initialize action-order log.
- [ ] Initialize low-impact action counter.
- [ ] Initialize 4-action development counter.
- [ ] Initialize anomaly state tracker.
- [ ] Initialize consequence chain log.
- [ ] Initialize output length watch.
- [ ] Initialize inventory validation.
- [ ] Confirm hidden information is not player-visible.

---

## 14. What to Record During Play

- Any accidental overlap with prior beta or campaign content.
- Submission time/order for every player action.
- Whether fallback order was used and why.
- Pacing shifts and their triggers.
- 4-action development checkpoints.
- Consequence counts per meaningful action.
- Anomaly behavior states and observable patterns.
- NPC proactive actions.
- Scene transitions and causes.
- Output length concerns.
- Inventory incidents.
- Resolution transparency blocks.
- Waiting fatigue comments.
- Player agency risks or violations.

After the test, record that Beta03 characters, NPCs, anomaly, locations, clues, and events are closed as non-canon test artifacts.

---

**END OF Beta03_Preparation v1.0.0**
