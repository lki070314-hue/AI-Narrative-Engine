# Beta03 Test Plan

**Document path:** `docs/Beta/Beta03_TestPlan.md`  
**Version:** v1.0.0  
**Status:** Draft  
**Last updated:** 2026-06-29  
**References:** `docs/Beta/Beta03_Preparation.md`, `docs/Beta/Beta03_Scenario.md`, `docs/Beta/Beta02_Result.md`, `docs/Release/Known_Issues.md`, `engines/Director/PacingEngine.md`, `engines/Director/ConsequenceEngine.md`, `engines/Director/SceneFlowEngine.md`, `engines/Director/OutputEngine.md`, `engines/Director/AnomalyEngine.md`

---

## 1. Test Purpose

Beta03 verifies whether the engine scales from validated 2-player live sessions to a 4-player live session.

Primary question: can the Director preserve pacing, agency, consequence density, anomaly presence, and output economy when four players submit independent intents in the same round?

Beta03 is isolated from all prior beta and campaign material. It must not reuse Beta00 locations, the Beta01 scenario, the Beta02 scenario, Season 2 campaign content, main campaign NPCs, main campaign SCPs, main campaign clues, or main campaign factions. It must not spoil any planned campaign content.

---

## 2. Isolation Rules

- All player characters are temporary Beta03-only test characters.
- All NPCs are Beta03-only.
- The anomaly/threat is unique to Beta03 and must never be reused in the main campaign.
- No Beta03 character, event, clue, location, or anomaly becomes canon after the test.
- Any accidental overlap with planned campaign content is a test contamination issue and must be logged.

---

## 3. Player Setup

| Slot | Character |
|---|---|
| P1 | Chernov Van |
| P2 | Noel Rowan |
| P3 | Kaney Chiakey |
| P4 | Wei Feirun |

These names identify temporary test characters only. They are not campaign continuity.

### 3.1 Turn and Order Rule

- Process inputs in submission order.
- If two submissions are simultaneous or order cannot be confirmed, use P1 -> P2 -> P3 -> P4 as fallback.
- Log every processed action with submission time, processing order, and whether fallback was used.
- Explicit coordinated actions may be resolved together only when the players clearly coordinate.

---

## 4. Pre-Test Checklist

Before play:

- [ ] Confirm all four players are present or represented.
- [ ] Confirm all player characters are temporary Beta03-only characters.
- [ ] Confirm no Beta00, Beta01, Beta02, Season 2, or main campaign content is loaded into the scenario.
- [ ] Confirm all NPCs, locations, clues, factions, and anomaly behavior are Beta03-only.
- [ ] Confirm no planned campaign content is visible in GM notes.
- [ ] Confirm the input collection tool records submission order.
- [ ] Confirm scenario: `docs/Beta/Beta03_Scenario.md`.
- [ ] Confirm GM-only hidden information is not visible to players.
- [ ] Load DirectorEngine and all Director support docs.
- [ ] Confirm SCP Foundation module context.
- [ ] Confirm output length targets.
- [ ] Confirm Resolution transparency format.
- [ ] Confirm inventory integrity rule.
- [ ] Confirm anomaly state tracker: Dormant, Aware, Active, Critical.
- [ ] Confirm KI-001 anomaly presence monitoring questions.
- [ ] Prepare result log using `docs/Beta/Beta03_Result_Template.md`.

---

## 5. Live Observation Checklist

### 5.1 Isolation and Spoiler Safety

| Check | Pass | Fail |
|---|---|---|
| No prior beta scenario content reused | Content is unique to Beta03 | Beta00, Beta01, or Beta02 material appears |
| No campaign content reused | No main campaign or Season 2 references | Campaign NPC, SCP, clue, faction, or location appears |
| Temporary status preserved | All content remains test-only | Any Beta03 element is treated as canon |
| No planned content spoiled | Players see only Beta03 material | Planned campaign content appears |

### 5.2 Turn and Order Handling

| Check | Pass | Fail |
|---|---|---|
| Actions processed in submission order | Known order is followed | Fixed slot order used despite known submission order |
| Fallback used only when justified | Fallback reason logged | Fallback used without ambiguity |
| Updated world state applied between actions | Later actions reflect earlier outcomes | Later actions ignore prior processed actions |
| Coordinated action handled cleanly | Participants and shared goal logged | Coordination assumed without player declaration |

### 5.3 4-Player Pacing

| Check | Pass | Fail |
|---|---|---|
| World moves after 4 submitted actions | Development occurs or recently occurred | 4 actions pass with no development |
| 2 low-impact actions trigger shift | Logical pacing shift appears | Loop continues |
| Urgent scenes do not wait for all players | Pressure advances logically | World freezes until all submit |
| No player dominates | Opportunities rotate naturally | One player monopolizes scene resolution |

### 5.4 Consequence Density

| Check | Pass | Fail |
|---|---|---|
| Meaningful action creates direct result plus 2 consequences | Consequences visible or tracked | Only direct result |
| Consequences affect other players' options | Later choices change | Consequences stay isolated |
| Failures move play forward | Cost, danger, clue, or tradeoff appears | Failure dead-ends |
| Hidden consequences remain hidden | Shadow/state tracking used | Hidden truth exposed |

### 5.5 Waiting Fatigue

| Check | Pass | Fail |
|---|---|---|
| Players receive regular actionable updates | All players can react | Long gaps with no involvement |
| Output remains compact | Routine outputs short | Reading backlog accumulates |
| Scene pressure invites group coordination | Players discuss priorities | Players idle while one track dominates |

### 5.6 AnomalyEngine and KI-001

| Check | Pass | Fail |
|---|---|---|
| Anomaly visible in every relevant phase | Observable behavior appears | Phase feels non-anomalous |
| At least 2 readable patterns appear before solution | Patterns shown twice | Solution requires unseen knowledge |
| Anomaly acts independently | State advances without prompt | Only reacts to player prompts |
| Anomaly teaches directly | Players infer from observation | NPC explains primary solution |
| Interaction window after major anomaly event | Players get response space | Continuous escalation overwhelms |

### 5.7 SceneFlow Stability

| Check | Pass | Fail |
|---|---|---|
| Each scene has objective and active element | Clear objective, moving part | Static room |
| 4 simultaneous intents remain coherent | Scene state updates cleanly | Intents collapse into confusion |
| Scene transitions when purpose fulfilled | Transition occurs | Exhausted scene repeats |
| Over-investigation escalates or transitions | Loop broken | Repeated clue text |

### 5.8 Output Length Control

| Check | Pass | Fail |
|---|---|---|
| Normal responses short | 80-150 Korean characters target | Routine paragraphs too long |
| Event responses proportional | 150-300 Korean characters target | Event buried or bloated |
| Major scene responses reserved | 300-500 only for major shifts | Every turn becomes major narration |

### 5.9 Inventory Integrity

| Check | Pass | Fail |
|---|---|---|
| Unlisted items not granted | Alternatives/check offered | Automatic possession |
| Role-based access uses Resolution | Attempt evaluated | Authority grants item freely |
| Missing item does not dead-end | Alternate route exists | Progress impossible |

### 5.10 Resolution Transparency

| Check | Pass | Fail |
|---|---|---|
| Uncertain actions go through Resolution | Attempt evaluated | Success assumed |
| Reasoning is visible and compact | Difficulty/factors/outcome shown | Outcome opaque |
| Hidden numbers remain hidden | No dice/DC/modifiers | Numbers exposed |

### 5.11 Player Agency

| Check | Pass | Fail |
|---|---|---|
| No undeclared player action written | Director narrates only world response | Director writes player action |
| No undeclared player emotion written | Observable facts only | Director assigns feelings |
| No player speech invented | Dialogue only from submitted text | Director adds PC dialogue |
| Choices remain meaningful | Pressure changes options | Outcome forced |

---

## 6. 4-Player Specific Metrics

Record:

| Metric | Target |
|---|---|
| Total submitted actions | At least 12 across session |
| Actions per player | At least 2 meaningful actions per player |
| Longest time without player-specific update | No severe waiting fatigue reported |
| 4-action development checkpoints | Development after each 4 submitted actions |
| Low-impact streaks | No unresolved streak longer than 2 |
| Consequence density | Meaningful actions average at least 3 total effects considered |
| Anomaly presence frequency | Anomaly appears in at least 1 of every 3 meaningful Director responses while relevant |
| Output fatigue | No more than 2 player complaints about length |
| Agency violations | 0 |

---

## 7. Failure Criteria

### P0 Failure

- Planned campaign content is exposed or spoiled.
- Hidden scenario truth exposed directly to players.
- Director writes player actions, speech, emotions, or decisions.
- Session cannot continue due to state contradiction.

### P1 Failure

- Beta00, Beta01, Beta02, Season 2, or main campaign material is reused.
- Any Beta03 character, NPC, anomaly, clue, location, faction, or event is treated as canon.
- Known submission order ignored in favor of fixed slot order.
- One player dominates while at least two players receive no meaningful opportunity.
- 4 submitted actions pass repeatedly without world/anomaly/NPC development.
- Anomaly remains weaker than NPC presence in the same pattern observed in Beta02.
- Uncertain outcomes are narrated as success without Resolution.
- Inventory is granted automatically in a way that changes the scenario.
- Resolution exposes dice values, DCs, hidden modifiers, or engine internals.

### P2 Failure

- Isolation check is incomplete but no reuse is confirmed.
- Output too long in several routine turns.
- Consequence chains frequently stop at direct result.
- Scene transition delayed after objective is exhausted.
- Waiting fatigue is noticeable but not session-breaking.
- KI-001 monitoring data incomplete.

---

## 8. Pass Criteria

Beta03 passes if all are true:

- No P0 failures.
- No unresolved P1 failures.
- No prior beta or campaign content is reused.
- No planned campaign content is spoiled.
- All Beta03 content is closed as non-canon after the session.
- Submission-order processing works and is logged.
- At least 3 of 4 players report acceptable pacing.
- At least 3 of 4 players report low or manageable waiting fatigue.
- Anomaly presence is rated acceptable or strong by at least 3 of 4 players.
- Each player performs at least 2 meaningful actions.
- At least 1 coordination challenge requires 2 or more players and resolves coherently.
- At least 1 danger/combat scene can be avoided or resolved through player choice.
- Inventory integrity and Resolution transparency pass.
- The final verdict identifies whether 4-player pacing requires engine revision.

---

## 9. Post-Session Survey Questions

Ask each player:

1. Overall satisfaction, 1-10?
2. Did you feel you had enough chances to act?
3. Did you wait too long between meaningful updates?
4. Did the processing order feel fair?
5. Did any player appear to dominate the session?
6. Did your actions produce visible consequences?
7. Did the anomaly feel like an active presence or just background?
8. Could you identify at least one anomaly behavior pattern without NPC explanation?
9. Were Director responses too long, too short, or appropriate?
10. Did Resolution outcomes feel understandable?
11. Did inventory limits feel fair?
12. Did the Director ever write your character's action, emotion, or speech without your declaration?
13. Would you play another 4-player session using this format?

---

## 10. KI-001 Anomaly Presence Monitoring

Record answers:

- Did players observe anomaly behavior before NPC explanation?
- Did the anomaly maintain state between player turns?
- Did players form hypotheses from direct observation?
- Did the anomaly change available options?
- Did the anomaly react to at least one player action per scene?
- Was the anomaly at least as memorable as the primary NPC?
- Did NPC guidance support, rather than replace, anomaly observation?

KI-001 improves if most players report direct anomaly engagement and can describe at least one pattern they inferred themselves.

---

## 11. Pacing Calibration Notes for Future Engine Revision

After the session, record:

- Whether the 2 low-impact action trigger remains correct for 4 players.
- Whether the 4 submitted action development trigger is too fast, too slow, or appropriate.
- Whether submission-order processing creates fairness issues.
- Whether group coordination should be formalized in Director or Resolution rules.
- Whether output length targets need a 4-player adjustment.
- Whether waiting fatigue requires a formal "spotlight rotation" rule.
- Whether AnomalyEngine frequency targets need adjustment for 4-player sessions.

---

**END OF Beta03_TestPlan v1.0.0**
