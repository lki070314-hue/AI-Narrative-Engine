# Beta03 Improvement Plan

**Document path:** `docs/Beta/Beta03_ImprovementPlan.md`
**Version:** v1.0.0
**Status:** Draft
**Prepared:** 2026-06-29
**Based on:** `docs/Beta/Beta03_Result.md`, `docs/Beta/Beta03_Feedback.md`
**References:** `core/CoreSpec.md`, `engines/Director/DirectorEngine.md`, `engines/Director/AnomalyEngine.md`, `engines/Director/OutputEngine.md`, `docs/Release/Known_Issues.md`

---

## Overview

Beta03 closed the three issues that drove Beta00–02 development (anomaly weakness, pacing, consequence density). This document classifies newly surfaced issues and recommends disposition.

Issues are classified P0–P3 using the engine QA severity model:
- **P0 — Fatal:** Blocks play or violates a core principle. Must fix before the next session.
- **P1 — Critical:** Degrades play quality significantly. Fix before the next beta.
- **P2 — Moderate:** Noticeable but not session-breaking. Fix in the next beta cycle.
- **P3 — Minor:** Low impact. Address in a future version or when convenient.

Each issue is assigned one of three dispositions:
- **Immediate Fix** — Fix before Beta04.
- **Next Beta** — Address in Beta04 design or session rules.
- **Future Version** — Backlog for engine v1.1 or later.

---

## Issue Register

---

### IMP-B03-001

**Severity:** P1  
**Title:** 4-player scaling test incomplete  
**Source:** B03-001 (Result §18)  
**Disposition:** Immediate Fix

**Description:**  
Beta03 was designed to validate 4-player live play. The session ran with 3 players. One spec character (Lucas Mercer) was not in the official Beta03 character list. Two spec characters (Chernov Van, Kaney Chiakey) did not participate. The primary scaling question — whether the engine remains stable, fair, and pacing-correct with four simultaneous player intents — was not answered.

**Impact:**  
The engine's readiness for 4-player campaign play is unconfirmed. All pass criteria that depend on "at least 3 of 4 players" reporting satisfaction are unevaluable. Output length economy, spotlight rotation fairness, and 4-action development timing under maximum load are unknown.

**Recommended Fix:**  
Run Beta04 with a confirmed 4-player roster drawn from the official character list. Add a mandatory pre-session character roster confirmation step: the Director must compare submitted character sheets against the session spec and require GM sign-off before accepting any deviation. This check should be part of the pre-run checklist in Beta04_Preparation.md.

**Target document:** `docs/Beta/Beta04_Preparation.md` (new), `docs/Beta/Beta04_TestPlan.md` (new)

---

### IMP-B03-002

**Severity:** P1  
**Title:** GM-as-player agency ambiguity — cross-character declarations  
**Source:** B03-002 (Result §18), Feedback §3  
**Disposition:** Immediate Fix

**Description:**  
When one player's declared action requires information about another player's character (their possessions, physical attributes, or reactions), and both characters are controlled by the same GM, the engine has no defined resolution path. In Beta03, Wei's action required Noel's underwear color — a property belonging to Noel's character, also controlled by the GM. The Director correctly blocked on player agency rules. The GM then re-submitted twice (placeholder, then random assignment), and the Director assigned the property under GM authority.

The root ambiguity: CoreSpec §12.1 says "the Director never writes what a player does or is." But when the GM is also the player, GM authority and player agency protection point at the same entity. The engine has no rule for who wins.

**Impact:**  
Any session where the GM plays a character will encounter this ambiguity. The current resolution path (block → re-submit → GM override → Director assigns) is improvised and may feel arbitrary. If the GM had been a separate person from the player controlling Noel, the correct answer (ask Noel's player) would have been unambiguous.

**Recommended Fix:**  
Add a rule to DirectorEngine specifying:

> *When a player's declared action requires determining a property of another player's character that has not been declared by that character's player, the Director requests the relevant declaration before proceeding. If both characters are controlled by the same GM, the GM may declare both properties in a single re-submission. The Director may never assign undeclared properties to any character without an explicit player/GM declaration — including through random selection — unless the GM explicitly authorizes random assignment.*

The random-assignment path used in Beta03 should be documented as an explicitly authorized GM mechanic, not a default Director behavior.

**Target document:** `engines/Director/DirectorEngine.md` — new subsection: Cross-Character Property Declaration

---

### IMP-B03-003

**Severity:** P1  
**Title:** Endgame execution without explicit final action declarations  
**Source:** B03-003 (Result §18), Feedback §3  
**Disposition:** Immediate Fix

**Description:**  
The Director executed the final coordination sequence in Beta03 based on inferred intent (P1's "넹~~!!!" and P3's "이정도면 다 된것 같은데") plus a GM directive ("이 행동을 마지막으로 엔딩까지 진행해줘"). Specific actions in the endgame — Lucas pressing the auxiliary panel, Noel pressing confirm — were never explicitly declared by the players. The Director synthesized these from ambient statements and ran the conclusion.

**Impact:**  
Players did not formally "win" the ending — the Director won it for them based on good intent inference. While the result was satisfying in this session, this pattern risks producing endings where player agency feels absent at the most important moment. A player who wanted to do something different in the final round had no opportunity to redirect.

**Recommended Fix:**  
Add an endgame confirmation protocol to DirectorEngine:

> *Before executing an endgame sequence under GM directive, the Director issues one explicit confirmation prompt: "다음 행동을 선언하면 격리 시퀀스를 실행합니다." (or equivalent). This prompt is brief and does not describe the endgame outcome. If players confirm or re-declare the same intent, the Director executes. If no response comes within the GM's declared scope, the Director may proceed under the GM directive.*

This adds one confirmation step without significantly interrupting the narrative flow.

**Target document:** `engines/Director/DirectorEngine.md` — new subsection: Endgame Confirmation Protocol

---

### IMP-B03-004

**Severity:** P2  
**Title:** C4 (cover beats break) not pre-observable — delivered by NPC  
**Source:** B03-004 (Result §18), Feedback §3  
**Disposition:** Next Beta

**Description:**  
Players had no in-world observable evidence that breaking reflective surfaces would worsen the anomaly before Wei shot the glass. The distinction between breaking and covering was delivered by Dr. Han after the damage was done. C4's hint location (storage note near blackout cloth) was never visited.

The AnomalyEngine requires at least 2 observable patterns before the solution requires them, and it requires the anomaly to teach through behavior rather than NPC explanation. C4 was an NPC-delivered lesson rather than an anomaly-observable one.

**Impact:**  
Wei's glass-shooting mistake felt retroactively unfair. The player had no observable basis for predicting the consequence. This weakens KI-001 compliance for C4 specifically: the anomaly did not demonstrate the cover-vs-break principle through its own behavior.

**Recommended Fix — Scenario level:**  
Add an early observable moment in the Access Corridor that demonstrates cover beats break without saying so. Example: one small section of corridor glass is covered with a maintenance cloth (not anomalous context). That section's reflective effect is absent or muted. An adjacent uncovered section shows the lag. The player can observe the difference before making any destructive choice.

This does not require engine document changes — only scenario design guidance.

**Target document:** `docs/Beta/Beta04_Scenario.md` (new) or a new section in `engines/Director/AnomalyEngine.md`: Observable Clue Prerequisite Rule

---

### IMP-B03-005

**Severity:** P2  
**Title:** Player health / injury state management inconsistent  
**Source:** B03-005 (Result §18)  
**Disposition:** Next Beta

**Description:**  
Wei was struck in the head twice with a blunt tool, had both hands cut by glass shards, and received medical treatment once. His cumulative injury state was tracked inconsistently — noted in some rounds ("머리 이중 타격 + 방탄복 없음 — 상태 주의"), absent from others. The progression from "stumbling" to "빈사 상태" (near-incapacitated) was not governed by a documented rule.

**Impact:**  
The meaning of "빈사 상태" was ambiguous enough that the player asked an OOC question about recovery. The Director had no clear rule for when repeated minor injuries accumulate into meaningful incapacitation. Recovery timing was improvised.

**Recommended Fix:**  
DirectorEngine or a future Health Engine subsection should define:
1. Injury severity tiers (minor, significant, incapacitating) with observable consequences.
2. Cumulative injury rule: how many minor injuries accumulate into a significant one.
3. Recovery conditions: rest, treatment, time, or player declaration.
4. Director prompt rule: when a character's injury state changes tier, the Director explicitly flags it to the player.

This does not require CoreSpec changes — it extends DirectorEngine's character state tracking scope.

**Target document:** `engines/Director/DirectorEngine.md` — new subsection: Injury State Tracking

---

### IMP-B03-006

**Severity:** P2  
**Title:** Resolution transparency block on trivial actions adds visual noise  
**Source:** B03-006 (Result §18), Beta02_Result §7  
**Disposition:** Next Beta

**Description:**  
Several trivially resolved actions in Beta03 received partial 판정 blocks. Examples: Wei collapsing comedically, Lucas suggesting a game, Wei "deciding to be a hot potato." These actions have no meaningful uncertainty and no real resolution question. Showing a 판정 block for them clutters the output and dilutes the signal value of the block for genuinely uncertain actions.

This issue was noted as a P2 observation in Beta02_Result §7 and was not addressed before Beta03.

**Impact:**  
Minor output noise. No player expressed fatigue, but the pattern adds friction to the "compact result/consequence/pressure" output goal.

**Recommended Fix:**  
Add a gate condition to DirectorEngine's Resolution transparency rule:

> *Show a 판정 block only when the action outcome is genuinely uncertain (i.e., the action could meaningfully fail or produce a worse result). Do not show 판정 blocks for: trivial actions with no realistic failure mode, purely social or comedic declarations where outcome is predetermined, or movement actions in non-threatening environments.*

**Target document:** `engines/Director/DirectorEngine.md` §7.12 or `engines/Director/OutputEngine.md`

---

### IMP-B03-007

**Severity:** P2  
**Title:** Waiting fatigue during lock-cycle downtime  
**Source:** Feedback §3, Round 9 observation  
**Disposition:** Next Beta

**Description:**  
In Round 9, when the Observation Room door was locked and the team had no clear action path, P3 suggested the 369 game — a signal of momentary disengagement. The Director handled it correctly (unlocked the door as a development), but the wait was felt.

**Impact:**  
Lock-cycle mechanics that freeze movement without providing alternative actions create idle moments. With 3+ players, idle moments compound: when no player has a clear action, all players idle simultaneously.

**Recommended Fix — Scenario level:**  
For lock-cycle mechanics, the scenario should include at least one alternative action available to each player while the lock is active. Example: a locked door does not prevent examining nearby surfaces, checking equipment, or interacting with the NPC. The Director should maintain an active-element inventory per scene that does not depend on a single locked progression gate.

For engine level, PacingEngine.md should note: *A scene lock (door, access gate, anomaly barrier) that prevents all players from advancing must be accompanied by at least one active element that remaining players can engage with.*

**Target document:** `engines/Director/PacingEngine.md`, `engines/Director/SceneFlowEngine.md`

---

### IMP-B03-008

**Severity:** P3  
**Title:** Post-session survey process informal  
**Source:** B03-008 (Result §18)  
**Disposition:** Next Beta
**Status:** PARTIALLY CLOSED — surveys received post-session from P1 and P3; P2 survey not received.

**Description:**  
No formal in-session survey prompt was issued. Surveys were submitted voluntarily after the session by 2 of 3 players. P2's survey was not received. While the data gap is narrower than initially documented, the collection method was informal and one player's data is missing.

**Impact:**  
The survey data received (P1: 10/10, P3: 7.5/10) was valuable and revealed the output length finding that would not have been detected from in-session observation alone. Average satisfaction confirmed at 8.75/10. KI-001 improvement is now player-confirmed.

**Recommended Fix:**  
For Beta04, issue the survey as a structured prompt immediately after the session closes, before the conversation ends. Ensure all players are prompted individually.

**Target document:** `docs/Beta/Beta04_Preparation.md` (new)

---

### IMP-B03-011

**Severity:** P2  
**Title:** Output content density below player expectation  
**Source:** B03-009 (Result §18), P3 survey  
**Disposition:** Next Beta

**Description:**  
P3's survey revealed a finding that inverts the compact-output assumption: output felt too short, not too long. P3 rated "AI responses too long?" at ★★ with the comment "길지 않고 오히려 짧았다고 생각" (not long; actually thought it was short). P3's biggest regret was "서술이 살짝 길었으면 좋겠음" (would have liked narration a bit longer/richer). Free comment: "좀 더 내용이 풍부했으면 좋았을 듯" (would have liked richer content).

P1 did not express this complaint (rated ★★★★★ = not too long, appropriate). This is a player-preference divergence, not a universal failure — but it indicates the OutputEngine's floor targets (80–150 chars normal) may be too minimal for some player groups or session styles.

There is also a possible conflation in P3's feedback between: (a) individual response length, and (b) overall scenario content breadth (only one NPC, one anomaly). The compact response length and the narrow scenario scope both contribute to the feeling of insufficient richness.

**Impact:**  
At least one player found the session narratively thin. The OutputEngine's current targets were designed to prevent fatigue in long sessions but may under-serve players who want immersive atmospheric narration. A floor that prevents bloat and a floor that prevents thinness are different constraints, and the current spec only addresses one.

**Recommended Fix:**  
Two complementary adjustments:

1. **OutputEngine — add minimum richness guidance:** The current spec defines upper targets (avoid fatigue) but not lower targets (ensure substance). Add a note: *"Normal responses that consist only of a single action result line with no world texture, NPC reaction, or environmental detail should be reviewed. A response can be brief without being bare. Aim for at least one environmental or consequence-level detail per normal response."*

2. **Scenario design — vary encounter breadth:** P3 noted "only one NPC appeared" and "only one anomaly." Short Beta scenarios should include at least one secondary character or secondary phenomenon to give the world a sense of depth beyond the primary puzzle.

**Target document:** `engines/Director/OutputEngine.md` — minimum response substance note; future scenario design guidelines

---

### IMP-B03-009

**Severity:** P3  
**Title:** Utility Annex not visited — danger scene bypass unconfirmed  
**Source:** B03-007 (Result §18)  
**Disposition:** Future Version

**Description:**  
The Utility Annex (danger scene with drone and standing water) was bypassed entirely. Players never approached it. The bypass was implicit — no player declared "we'll avoid the annex" — the team simply moved from the corridor to the Observation Room to B03 without exploring the branch.

**Impact:**  
The danger scene was not tested. The Utility Annex mechanic (covered/drained water disables drone reflection, coordinated inversion stalls it) could not be evaluated. The "at least 1 danger/combat scene can be avoided or resolved through player choice" pass criterion was met by default rather than by player decision.

**Recommended Fix — Beta04 scenario level:**  
Make the Utility Annex partially visible or more accessible from the Access Corridor, so players have a genuine choice moment. The current design allows players to accidentally bypass the scene without knowing it exists.

**Target document:** Future scenario design guidance — no engine document change required.

---

### IMP-B03-010

**Severity:** P3  
**Title:** Character roster confirmation process not formalized  
**Source:** B03-001 (Result §18)  
**Disposition:** Next Beta

**Description:**  
The prep process allowed a session to begin with a mismatched roster (3 players, 1 unofficial character) because there was no mandatory roster confirmation step that compared submitted sheets against the scenario spec. The Director flagged the conflict as a Known Risk but proceeded without formal resolution.

**Impact:**  
The beta test ran under conditions that partially invalidated its primary objective. Future betas may have similar roster ambiguity without a gate to catch it.

**Recommended Fix:**  
Add a mandatory roster gate to all Beta preparation documents:

> *Before play begins, the Director must: (1) list the officially specified characters for the session, (2) compare submitted character sheets against the list, (3) identify any character present in submissions but absent from the spec, (4) identify any character in the spec but absent from submissions, and (5) receive GM sign-off on any deviation. Play may not begin until the GM has confirmed the final roster in writing.*

**Target document:** `docs/Beta/Beta04_Preparation.md` (new), and the generic Beta prep template if one is created.

---

## Summary Table

| ID | Severity | Title | Disposition |
|---|---|---|---|
| IMP-B03-001 | P1 | 4-player scaling test incomplete | Immediate Fix |
| IMP-B03-002 | P1 | GM-as-player agency ambiguity | Immediate Fix |
| IMP-B03-003 | P1 | Endgame without explicit declarations | Immediate Fix |
| IMP-B03-004 | P2 | C4 not pre-observable (NPC delivery) | Next Beta |
| IMP-B03-005 | P2 | Injury state tracking inconsistent | Next Beta |
| IMP-B03-006 | P2 | Trivial 판정 blocks (visual noise) | Next Beta |
| IMP-B03-007 | P2 | Waiting fatigue during lock-cycle | Next Beta |
| IMP-B03-008 | P3 | Post-session survey process informal | Next Beta (partially closed) |
| IMP-B03-009 | P3 | Danger scene bypass unconfirmed | Future Version |
| IMP-B03-010 | P3 | Roster confirmation not formalized | Next Beta |
| IMP-B03-011 | P2 | Output content density below player expectation | Next Beta |

---

## Resolved Issues (Carried from Beta00–02)

The following P1 issues from prior betas are confirmed resolved by Beta03 evidence and require no further action:

| Issue | Source | Resolution Evidence |
|---|---|---|
| KI-001: Anomaly presence weaker than NPC | Beta02_Result P1 | Players found C1, C2, C5 independently; anomaly drove decisions in all phases; anomaly rated more memorable than NPC. |
| Pacing too slow / investigation loops | Beta01_Result P1 | 4-action trigger fired consistently; no investigation loop persisted beyond 2 rounds; no player expressed pacing fatigue. |
| Consequence density insufficient | Beta01_Result P1 | Average 2.5–3 consequences per meaningful action observed. Failures escalated rather than dead-ending. |
| Output length fatigue | Beta01_Result P1 | No fatigue signals in any round. Output stayed compact throughout. |
| Inventory integrity | Beta01_Result P2 | All equipment traced to declared character sheets. No automatic grants. |
| Resolution transparency | Beta01_Result P2 | 판정 blocks shown for all uncertain actions without exposing hidden numbers. |

---

## Recommended Pre-Beta04 Engine Document Changes

The following changes are recommended before Beta04 begins. **Do not modify CoreSpec.** All changes are to engine sub-documents.

| Document | Change | Priority |
|---|---|---|
| `engines/Director/DirectorEngine.md` | Add: Cross-Character Property Declaration subsection | P1 — before Beta04 |
| `engines/Director/DirectorEngine.md` | Add: Endgame Confirmation Protocol subsection | P1 — before Beta04 |
| `engines/Director/DirectorEngine.md` | Add: Injury State Tracking subsection | P2 — before Beta04 |
| `engines/Director/DirectorEngine.md` §7.12 | Clarify: Resolution block gate condition (trivial action suppression) | P2 — before Beta04 |
| `engines/Director/PacingEngine.md` | Add: Active element requirement during scene locks | P2 — before Beta04 |
| `engines/Director/AnomalyEngine.md` | Add: Observable Clue Prerequisite — C4 type clues must be demonstrable through anomaly behavior before NPC delivery | P2 — before Beta04 |
| `engines/Director/OutputEngine.md` | Add: Minimum response substance note — brief responses must still include at least one world/consequence detail | P2 — before Beta04 |

---

## Beta04 Readiness Recommendation

Beta04 should proceed only after:

1. IMP-B03-001: A confirmed 4-player roster with all characters from the official spec is assembled.
2. IMP-B03-002: DirectorEngine updated with Cross-Character Property Declaration rule.
3. IMP-B03-003: DirectorEngine updated with Endgame Confirmation Protocol.
4. IMP-B03-010: A roster confirmation gate is added to Beta04_Preparation.md.
5. A formal post-session survey is prepared and planned for delivery immediately after session end.

Items IMP-B03-004 through IMP-B03-007 should be incorporated in scenario and session design but are not blocking.

**Beta04 primary objective:** Complete the 4-player scaling validation that Beta03 could not provide.

---

**END OF Beta03_ImprovementPlan v1.0.0**
