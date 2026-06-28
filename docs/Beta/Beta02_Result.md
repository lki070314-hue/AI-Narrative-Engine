# Beta02 Result

**Document path:** `docs/Beta/Beta02_Result.md`
**Version:** v1.0.0
**Status:** Draft
**Play date:** 2026-06-28
**Player count:** 2
**Players:** Raven-1 (Ian Carter) / Oracle-2 (Emilia Lowell)
**Playtime:** approximately 60–90 minutes
**Ending:** Successful containment — all agents survived
**Overall satisfaction:** 8.75 / 10
**References:** `docs/Beta/Beta02_Preparation.md`, `docs/Beta/Beta02_TestPlan.md`, `docs/Beta/Beta02_Checklist.md`, `docs/Beta/Beta01_Result.md`, `engines/Director/PacingEngine.md`, `engines/Director/ConsequenceEngine.md`, `engines/Director/SceneFlowEngine.md`, `engines/Director/OutputEngine.md`

---

## 1. Summary

Beta02 live playtest completed with no P0 or P1 failures across pacing, consequence, output, and inventory targets. Both players reported satisfaction above 8.5 and stated they would play again.

All seven Beta01 P1 issues were addressed and verified through live play. Pacing, consequence chaining, NPC liveliness, output economy, inventory integrity, and surprise handling all performed as intended.

The remaining gap is SCP/anomaly presence: the anomaly influenced the scene physically but was less memorable as a character-level presence than the NPCs. This is the primary target for Beta03.

---

## 2. Playtest Overview

**Scenario:** Zero-Echo-01  
**Location:** Site-██ Containment Wing C  
**Target:** SCP-6612 "에코" — acoustic resonance entity  
**Mission objective:** Rescue trapped researcher and restore containment

**Session ending:**

Oracle-2 systematically removed all EM sources from the containment cell — throwing devices, powering down tablets, and destroying remaining equipment by gunfire. Raven-1 sustained the anomaly's acoustic response by singing, functioning as an improvised attractor while Oracle-2 extracted his sidearm and neutralized the remaining EM devices. NPC Park Ji-hoon reacted actively throughout the crisis, contributing warnings, written instructions, and physical assistance once freed. Oracle-2 then reactivated the containment field via MC-4. SCP-6612 returned to dormancy.

**Overall result:** Successful Beta02 playtest. All primary verification targets passed.

---

## 3. Survey Summary

| Category | Player 1 (Raven-1) | Player 2 (Oracle-2) |
|---|---|---|
| Overall satisfaction | 9 / 10 | 8.5 / 10 |
| Pacing | Appropriate | Appropriate |
| Action consequences | Appropriate | Appropriate |
| Event amount | Appropriate | Appropriate |
| NPC liveliness | Strong | Strong |
| Output length | Appropriate | Appropriate |
| Anomaly presence | Weak | Appropriate |
| Replay willingness | Yes | Yes |

**Average satisfaction:** 8.75 / 10

**Highlight moments cited by players:**
- Raven-1 singing at an anomalous entity and being physically ejected
- SCP-6612 echoing "나는야 퉁퉁이~~~" back in multiple overlapping voices
- NPC Park Ji-hoon communicating through written notebook messages while pinned
- Park's deadpan written response: "뭐하는 겁니까"
- Inventory integrity catch: Oracle-2 attempting to eat popcorn, which was not in the declared inventory

---

## 4. What Worked

### Pacing

Pacing shifts fired correctly when low-impact actions accumulated. The scene never locked in a static loop. Players reported faster tempo than Beta01 without feeling rushed. The Director introduced incident pressure, anomaly reactions, and environmental changes without breaking scenario logic.

### Consequence Chaining

Player actions produced multiple visible effects throughout the session. Raven-1 shouting triggered SCP-6612 voice echoes, increased acoustic pressure, and radio blackout simultaneously. Oracle-2 powering down the researcher's tablet produced Park's release from the wall, a field-strength reduction, and a cessation of the session's running echo. Failure actions (Raven-1 entering the cell with all electronics) produced cascading escalation rather than dead ends.

### NPC Reactions

Park Ji-hoon's notebook communication, escalating gestures, and written commentary were the most memorable elements of the session. NPC behavior was cited by both players as a primary source of fun. The NPC Engine produced proactive behavior: Park warned without being prompted, reacted to player mistakes with appropriate alarm, and assisted once freed. Choi Minjun's partial disclosure (withholding information until asked) added tension without breaking player agency.

### Output Length

Players did not report fatigue from long responses. Normal responses stayed short and consequence-focused. Event and major scene responses were longer when warranted. The output pattern — result, consequence, pressure, next situation — was maintained consistently.

### Inventory Integrity

Undeclared items were correctly denied. When Oracle-2 declared eating popcorn, the denial was applied cleanly. No unlisted equipment was granted automatically. The inventory rule preserved character sheet meaning and produced a noted moment of player recognition.

### Surprise Handling

Raven-1's singing and trolling behavior was outside any planned scenario path. The Director integrated it as acoustic input for SCP-6612 without breaking the anomaly's established behavior rules. The anomaly's mechanical response to the sound (echo, pressure increase, eventual ejection) gave the unexpected behavior both consequence and comedy. Novel player actions produced coherent world responses rather than either flat refusals or unearned success.

---

## 5. What Failed or Needs Improvement

### SCP/Anomaly Presence — Primary Remaining Gap

SCP-6612 was mechanically present and physically consequential, but was less memorable as an active presence than Park Ji-hoon. One player rated anomaly presence as weak; one rated it as appropriate.

Root cause: The anomaly functioned as an environmental hazard (acoustic pressure, EM interference, voice echoing) rather than as an agent with legible behavior the players could engage, predict, or react to as a distinct character. Park's notebook instructions told players how to defeat the anomaly rather than the players discovering this through direct interaction with the anomaly's own behavior.

The NPC became the player's primary source of information and interaction, and the anomaly became the obstacle those instructions described. The anomaly was reactive rather than expressive.

### Future Scenarios — Anomaly as Central Decision Driver

Future Beta03 scenarios should design the SCP/anomaly to be a direct driver of player decisions, not only a physical constraint. The anomaly should change what options are available, not merely what is safe. Players should need to read the anomaly's behavior directly rather than receiving translated instructions from an NPC.

---

## 6. Engine Evaluation

| Engine | Result | Notes |
|---|---|---|
| Pacing Engine | **PASS** | Shifts fired correctly at low-impact thresholds. No loop locked. |
| Consequence Engine | **PASS** | Meaningful actions produced 2+ visible effects consistently. Failure chained forward. |
| Scene Flow Engine | **PASS** | Each scene had an active element. Transitions occurred when objectives were met. |
| Output Engine | **PASS** | Normal responses stayed short. No fatigue reported. Event responses scaled appropriately. |
| Resolution Engine | **PASS** | Transparency blocks shown for uncertain checks. No dice values or DCs disclosed. Outcomes felt understandable. |
| Inventory Integrity Rule | **PASS** | Undeclared items denied cleanly. No automatic grants. Alternatives were available. |
| Surprise Handling | **PASS** | Novel player behavior (singing) integrated coherently into established anomaly mechanics. |
| Anomaly Presence | **PARTIAL PASS** | Physically present in every phase. Not sufficiently interactive or expressive as an independent agent. |

---

## 7. Issue Classification

### P0

None.

### P1

- **Anomaly/SCP presence weaker than desired.** SCP-6612 was consequential but not memorable as an independent presence. NPC interaction outweighed anomaly interaction as the primary player experience. This must be addressed in Beta03 scenario design and, if necessary, in a new Anomaly Presence Rule.

### P2

None confirmed. Minor observation only: Resolution transparency blocks followed the correct format, but some turns with trivial actions included a block where it added no meaningful information. This is not a failure, but future sessions may consider omitting transparency blocks for genuinely trivial actions.

---

## 8. Beta01 vs Beta02 Comparison

| Area | Beta01 | Beta02 |
|---|---|---|
| Pacing | Fail — too slow, investigation loops | Pass — appropriate tempo, no locks |
| Consequence chaining | Fail — one action, one result | Pass — consistent 2+ effects per action |
| NPC liveliness | Partial — NPCs answered but rarely acted | Pass — NPCs warned, moved, reacted proactively |
| Output length | Fail — long responses caused fatigue | Pass — players did not report fatigue |
| Replay willingness | One yes, one no | Both yes |
| Anomaly presence | Fail — absent or cosmetic | Partial Pass — present, not expressive |

---

## 9. Key Lesson

**Beta02 confirms that consequence chaining and active NPC response significantly improve player enjoyment.**

The core pacing and consequence problems that ended Beta01 at 6.5/10 satisfaction were resolved. The engine changes since Beta01 produced a measurable improvement in reported experience (8.75/10 average) and replay intent (0/2 → 2/2).

**The next bottleneck is not pacing, but making the anomaly itself as interactive and memorable as the NPCs.**

When NPCs become the primary source of engagement and the anomaly becomes the subject those NPCs describe, the anomaly loses its distinct identity as a game element. Beta03 should ensure that players engage with the anomaly directly — reading it, responding to it, and feeling that it has its own behavior — rather than primarily receiving instructions about it from NPCs.

---

## 10. Beta03 Recommendations

### Required

- **Focus on anomaly-centered gameplay.** Design a scenario where the anomaly directly drives decisions — not as a hazard that NPCs explain, but as a presence players must observe, interpret, and respond to themselves.
- **Make SCP behavior affect available options.** The anomaly should open or close player choices, not only raise danger levels.
- **Add stronger anomaly escalation rules.** Expand PacingEngine.md or SceneFlowEngine.md to require explicit anomaly-driven escalation at defined thresholds. Alternatively, consider a new Anomaly Presence Rule document that governs when and how the anomaly must become the center of play.

### Recommended

- **Test 3–4 player multiplayer if possible.** Beta01 and Beta02 both used 2 players. Higher player count will stress-test pacing shift timing, action sequencing, and consequence scoping.
- **Keep current pacing, consequence, and output rules.** These are performing correctly and should not be changed based on Beta02 results.
- **Preserve inventory integrity.** No changes needed.

### Optional

- Investigate whether Resolution transparency blocks on trivial actions should be suppressed or abbreviated to reduce visual noise.

---

## 11. QA Pass

**Formatting:** Headings consistent with Beta01_Result.md style. No broken list structure. Table alignment verified.

**Headings:** Sections 1–11 present and correctly ordered. No duplicate headers.

**Terminology:** "Consequence chaining," "pacing shift," "anomaly presence," "inventory integrity" used consistently with Beta02_Preparation.md and Beta02_TestPlan.md.

**References:** All referenced files (`Beta02_Preparation.md`, `Beta02_TestPlan.md`, `Beta02_Checklist.md`, `Beta01_Result.md`, four Director sub-engines) exist and are correctly named.

**Contradiction check:** No contradiction with Beta01_Result.md. Beta01 P1 issues are correctly marked as resolved where evidence supports this. Anomaly presence is correctly carried forward as the remaining gap.

**Hidden truth exposure:** No hidden scenario information (SCP-6612 exact classification, containment protocols beyond session scope) is disclosed beyond what the live session narrated to players.

---

**END OF Beta02_Result v1.0.0**
