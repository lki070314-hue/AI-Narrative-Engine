# Beta01 Playtest Checklist

**Document ID:** `docs/Beta/Beta01_Checklist.md`
**Version:** v1.2.0
**Status:** Draft
**Last Updated:** 2026-06-28
**References:** `docs/Beta/Beta01_Scenario.md`, `docs/Beta/Beta01_TestPlan.md`

**Changelog v1.1.0:** Added PPE availability check; added Ending D trigger verification; added Ending E trigger verification; added Chen recovery note; added Scene 2 resolution trigger checks; added safety interlock clue check.

**Changelog v1.1.1:** Added live-play pacing checks for player action order, simultaneous actions, dynamic event density, proactive NPC behavior, and Director proactivity.

**Changelog v1.1.2:** Added Incident Pressure Event, Investigation Loop Breaker, anomaly presence, inventory integrity, and declared equipment checks.

**Changelog v1.2.0:** Added Section 8e — Consequence Generation and Scene Quality. Source: Beta01 post-session gameplay feedback.

---

## Instructions

Check each box as the condition is verified during or immediately after the playtest session. Mark with `[x]` for confirmed pass, `[!]` for confirmed fail, and `[?]` for unable to verify. Add brief notes where needed.

---

## Section 1 — Pre-Session Setup

- [ ] Engine specs loaded: Resolution Engine
- [ ] Engine specs loaded: Director Engine
- [ ] Engine specs loaded: NPC Engine
- [ ] Engine specs loaded: Memory Engine
- [ ] Engine specs loaded: Mission Engine
- [ ] Engine specs loaded: World Engine
- [ ] Engine specs loaded: QA Engine
- [ ] SCP module context loaded
- [ ] Beta01_Scenario.md (v1.1.2) loaded as reference
- [ ] Hidden Truth confirmed as GM-only (not visible to players)
- [ ] Dr. Reyes initial disposition confirmed: -20 (floor: -50)
- [ ] Guard Chen initial state confirmed: incapacitated; recovery: automatic upon object deactivation
- [ ] PPE confirmed available at loc_ECHO_02 (Entrance/Corridor, supply cart) without a roll
- [ ] Exposure tracking initialized: action counter = 0, check fires at count = 3 (unprotected only)
- [ ] Live pacing tracking initialized: meaningful actions since last event, minor event window, major event window
- [ ] Investigation loop tracking initialized: repeated investigation count
- [ ] Inventory validation initialized: character-sheet equipment only is guaranteed
- [ ] Player count confirmed: _____ (1 or 2)

---

## Section 2 — Scenario Start

- [ ] Opening scene described without naming the cause of the incident
- [ ] Station exterior included sensory details (sound, light, environment)
- [ ] At least 2 visible elements in the opening scene that players can interact with
- [ ] Players made at least one meaningful choice in Scene 1 or 2 before entering the monitoring room
- [ ] PPE (ear protection) at the supply cart was described or available without requiring a roll
- [ ] If player specifically searched the supply cart, it was treated as trivial (no roll needed)

---

## Section 3 — Incident Trigger Discovery

*(Players encounter the effects of the incident — Chen, the active object, the disrupted lab)*

- [ ] Guard Chen was presented as unconscious, not dead
- [ ] Director did not explain why Chen is unconscious before the investigation roll
- [ ] Research lab disturbance was described without naming Dr. Reyes as the cause
- [ ] The object enclosure was described as active but its nature was not over-explained

---

## Section 4 — Player Investigation

*(Each of the following should be triggered by a player action, not delivered automatically)*

- [ ] Finding Tier 2 clue (access log, Chen's badge, notepad equation) required a player investigation declaration
- [ ] Resolution Engine was invoked for each investigation action
- [ ] Chen's comm badge timestamp was found either during condition examination (no extra roll) or via separate search (investigation, easy) — not delivered automatically without any player action
- [ ] Safety interlock being disabled was discovered via enclosure examination, not narrated without investigation
- [ ] At least one investigation result was a Partial Success (information obtained with complication or cost)
- [ ] Tier 3 clue (Reyes' full notes) was NOT delivered without player effort
- [ ] Server room was presented as optional — player was not directed to go there
- [ ] Players were not told "you should check the supply room" — they found it through investigation

---

## Section 5 — NPC Response — Guard Chen

*(Only if players attempted to revive Chen)*

- [ ] Chen revived via a declared player action with Resolution Engine processing
- [ ] Chen's information was delivered according to his knowledge tier (not Reyes' information)
- [ ] Chen's disposition (+40 when revived) was reflected in his willingness to communicate
- [ ] Chen did not know the full truth about Reyes' involvement (he was already down)
- [ ] If the object was deactivated, Chen's recovery was narrated as a natural consequence (no player medical action required for Ending A)

---

## Section 6 — NPC Response — Dr. Reyes

- [ ] Reyes did not open the door on the first player message
- [ ] NPC Engine governed all of Reyes' responses (Director did not independently decide her reactions)
- [ ] Reyes' information level matched her disposition at each point of contact:
  - [ ] Disposition -20 to 0: refused to open door or gave minimal response
  - [ ] Disposition 0–30: admitted being in the lab, claimed not to know what happened
  - [ ] Disposition 30–60: admitted to the test and possible trigger (optional if reached)
  - [ ] Disposition 60+: provided full cooperation including deactivation method (optional if reached)
- [ ] Reyes' behavior was internally consistent across multiple turns
- [ ] Reyes did not spontaneously volunteer incriminating information

---

## Section 7 — Resolution Engine Use

- [ ] Resolution Engine was invoked for at least 3 distinct actions during the session
- [ ] At least one action resulted in Partial Success (not binary pass/fail)
- [ ] At least one action resulted in Failure with a narrative consequence
- [ ] No uncertain action was narrated as an automatic success by Director without Resolution Engine
- [ ] Dice values, DC numbers, and internal modifiers were not disclosed to the player
- [ ] Difficulty ratings felt appropriate to the circumstances (not arbitrary)

---

## Section 8 — Failed Attempts

- [ ] At least one player action failed or partially failed during investigation
- [ ] The failure produced a narrative consequence (not just "nothing happens")
- [ ] Failure did not end the investigation — players had alternate paths
- [ ] Director did not soften or reverse a failure for dramatic reasons

---

## Section 8b — Exposure and Ending D/E Tracking

*(Verify if Ending D or E was approached or reached)*

- [ ] If player spent 3+ turns in the lab without PPE: exposure check was triggered via Resolution Engine
- [ ] Ending D trigger was NOT announced to the player (no countdown, no warning about turns remaining)
- [ ] Ending D was NOT triggered before the 3-action threshold was reached
- [ ] If Ending E occurred: it was the result of Critical Failure on deactivation OR physical enclosure breach
- [ ] Ending E was NOT triggered by a non-critical-failure deactivation attempt

---

## Section 8c ??Live Pacing and Turn Order

- [ ] Player action order followed exact input order in multiplayer play
- [ ] Each player action resolved completely before the next player action was processed
- [ ] Later player actions used the updated world state after earlier results
- [ ] Simultaneous action handled correctly as a coordinated Resolution Engine action
- [ ] Minor event triggered within 2-3 meaningful actions unless an event had just occurred
- [ ] Major event triggered within 5-7 meaningful actions when scenario state supported one
- [ ] Incident Pressure Event occurred after repeated investigation
- [ ] Investigation loop was interrupted before pacing stalled
- [ ] SCP/anomaly presence was felt in each scenario phase
- [ ] Repeated investigation did not stall pacing
- [ ] NPC acted proactively at least once (interrupt, warn, move, withhold, reveal partial clue, or trigger complication)
- [ ] Director did not stay passive across multiple consecutive responses
- [ ] World state changed without direct player request
- [ ] Dynamic events remained logical consequences of current world state
- [ ] Dynamic events did not reveal hidden truth early or bypass clue requirements

**Event pacing felt:** Too frequent / Appropriate / Too rare

**Incident pressure felt:** Too mild / Appropriate / Too harsh

---

## Section 8d — Inventory Integrity

- [ ] No unlisted item was treated as automatically possessed
- [ ] Missing item prompted alternatives
- [ ] Role-based equipment access was handled through Resolution, not automatic success
- [ ] Character role, job, or authority did not override declared equipment
- [ ] Missing equipment did not create a dead end
- [ ] Scene substitutes, NPC requests, supply points, improvisation, or different methods were offered when appropriate

**Missing item example, if any:** _______________________________________________

---

## Section 8e — Consequence Generation and Scene Quality

*(Verify Director behavior after meaningful actions)*

**Consequence Generation (§7.8)**
- [ ] Meaningful actions generated at least 2 distinct outcomes (not just the direct result)
- [ ] At least one response included a world change alongside the direct result
- [ ] At least one response included an NPC reaction alongside the direct result
- [ ] At least one response included an anomaly/SCP reaction alongside the direct result
- [ ] Director did not end a response after stating only the direct action result

**Consequence Chaining (§7.9)**
- [ ] At least one action's result was visibly propagated to another world element (sound → NPC, system log, environment)
- [ ] No meaningful action result was completely isolated from the broader world state

**Response Length (§7.10)**
- [ ] Normal responses stayed within 80–150 words
- [ ] Large event responses stayed within 200 words
- [ ] Ending narration was unrestricted and complete

**Scene Momentum (§7.11)**
- [ ] Every scene contained at least one actively progressing element
- [ ] No scene remained fully static for more than 2 consecutive Director responses
- [ ] Progressing elements included (check all that appeared):
  - [ ] NPC objective in motion
  - [ ] Anomaly behavior changing
  - [ ] Environmental condition deteriorating or shifting
  - [ ] Countdown or time pressure active
  - [ ] Player objective advancing or under threat
  - [ ] Containment status visibly tracked

**Resolution Transparency (§7.12)**
- [ ] Each Resolution check result was accompanied by a brief reasoning block
- [ ] Reasoning block showed difficulty rating and at least one positive or negative factor
- [ ] No dice value, DC number, or internal modifier was disclosed to any player

**Overall assessment of consequence generation:**
Too thin / Appropriate / Too complex

**Notes:** _______________________________________________

---

## Section 9 — Surprise Handling

*(This section applies if the player attempted at least one action not listed in the scenario)*

- [ ] At least one unexpected player action occurred
- [ ] The action was passed to Resolution Engine for plausibility evaluation
- [ ] Director did not refuse the action without Resolution Engine involvement
- [ ] The result of the unexpected action was narratively integrated (success, failure, or complication)
- [ ] Play continued naturally after the unexpected action

**Note the unexpected action(s) here:** _______________________________________________

---

## Section 10 — Context Linking

*(Mark only the links that both pieces of information were discovered)*

- [ ] Access log → lab disturbance: Director connected the two facts within 1 turn after both were known
- [ ] Chen's distress call timestamp → Chen's current state: connection made in narration
- [ ] Notepad equation → Reyes' full notes: recognized as parts of the same sequence
- [ ] No Context Link referenced information the player had NOT yet found

---

## Section 11 — Adaptive Detail Mode

*(Mark if the player used `[요청: 중요한 내용만]`)*

- [ ] Player used the compressed output request: Yes / No
  - If Yes: [ ] Output was ≤5 sentences containing only critical result and immediate options
  - If Yes: [ ] Atmospheric description was appropriately reduced
- [ ] During climax scenes (resolution decision), Director output was shorter and more immediate than exploration scenes without being prompted

---

## Section 12 — Clue Discovery Balance

- [ ] Player discovered at least 2 Tier 2 clues through active investigation
- [ ] Tier 3 clue was obtained through either: (a) a hard investigation roll in the lab, or (b) successful cooperation with Reyes
- [ ] No clue was delivered passively without player action
- [ ] The player had enough information to make a meaningful resolution decision
- [ ] The player was not overwhelmed with information at once — clues arrived across multiple scenes

---

## Section 13 — Deduction Phase

- [ ] Before the resolution decision, player had formed a hypothesis about what happened
- [ ] That hypothesis was supported by clues actually discovered during the session
- [ ] Director did not confirm or deny the hypothesis before the player acted on it
- [ ] The resolution decision reflected the player's understanding of the situation

---

## Section 14 — Ending

- [ ] One of the five ending branches was reached
- [ ] The ending matched the player's choices and the clues they gathered
- [ ] Director produced a brief aftermath narration describing the world state after the resolution
- [ ] Aftermath included: object state, both NPC states, shape of the players' report, one world consequence
- [ ] No elements of the ending were contradicted by earlier established facts
- [ ] The ending was reached through a complete pacing cycle (Rising → Climax → Falling → Resolution)

**Ending branch reached:** _____ (A / B / C / D / E)

**If Ending A:** Chen recovery narrated as natural (no player medical action required)? Yes / No / N/A  
**If Ending C:** Reyes' exit decision narrated? Yes / No / N/A. Chen's status noted? Yes / No / N/A  
**If Ending D:** Exposure threshold was reached before check fired? Yes / No  
**If Ending E:** Triggered by Critical Failure or enclosure breach? Critical Failure / Enclosure Breach / Other

---

## Section 15 — Post-Test QA

### Engine Performance
- [ ] QA Engine would find no P0 or P1 violations in this session
- [ ] No hidden truth was disclosed before the player discovered the relevant clue
- [ ] No player emotion or internal state was narrated by Director
- [ ] No player decision was written by Director without player declaration

### Session Quality Standards (CoreSpec §15.1)
- [ ] At least 1 complete pacing cycle occurred
- [ ] At least 3 meaningful player choices were offered
- [ ] At least 1 world change resulted from player action
- [ ] At least 1 world change occurred without direct player request
- [ ] Minor event density matched the 2-3 meaningful action target
- [ ] Major event density matched the 5-7 meaningful action target where applicable
- [ ] Incident Pressure Event occurred when investigation repeated
- [ ] SCP/anomaly presence appeared in every scenario phase
- [ ] At least 1 substantive NPC interaction occurred (Reyes or Chen)
- [ ] At least 1 NPC proactive behavior occurred
- [ ] Inventory limits were respected for all item-based actions
- [ ] Meaningful actions generated two or more consequences
- [ ] No action result was isolated from the broader world state
- [ ] Normal responses did not exceed 150 words
- [ ] Every scene contained at least one progressing element
- [ ] Resolution check reasoning was briefly shown without exposing dice or DC values
- [ ] Memory Engine would have logged: key NPCs, discovered clues, ending branch

### 1–2 Player Consistency
- [ ] No rule or mechanic required exactly 2 players
- [ ] If 1 player: all paths to all endings were accessible
- [ ] If 2 players: cooperation points functioned correctly; neither player was idle

---

## Section 16 — Overall Assessment

**Pass criteria:** No P0 failures. No P1 failures. At least 80% of checkboxes marked as pass.

- [ ] **PASS** — Proceed to Feedback collection and issue review
- [ ] **CONDITIONAL PASS** — Minor issues found; document and address before next test
- [ ] **FAIL** — P0 or P1 failure identified; halt and investigate before re-running

**Notes:**

_______________________________________________

_______________________________________________

_______________________________________________

---

**END OF Beta01_Checklist v1.1.2**
