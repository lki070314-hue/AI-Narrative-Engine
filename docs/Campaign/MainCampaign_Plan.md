# Main Campaign Plan

**Document path:** `docs/Campaign/MainCampaign_Plan.md`
**Version:** v0.1.0
**Status:** Draft
**Last updated:** 2026-06-28
**References:** `docs/Release/GM_Guide.md`, `docs/Release/Player_Guide.md`, `docs/Release/Known_Issues.md`, `core/CoreSpec.md`, `engines/Director/AnomalyEngine.md`

---

## 1. Campaign Concept

*(Placeholder — fill in before Session 0)*

| Field | Value |
|---|---|
| Campaign name | TBD |
| World module | TBD (e.g., modules/scp/) |
| Campaign premise | TBD |
| Tone | TBD (horror / action / investigation / mixed) |
| Session language | TBD |
| Estimated length | TBD (number of sessions) |

---

## 2. Player Count Recommendation

**Recommended:** 2–4 players.

- **2 players:** Validated in Beta01 and Beta02. Tight coordination and distinct character roles produce strong interplay. Turn order is straightforward.
- **3–4 players:** Not yet validated through live play. Pacing shift frequency may need adjustment as action volume per unit time increases. Monitor carefully in early sessions.

For first campaigns, 2 players is the most tested configuration.

---

## 3. Recommended Session Length

| Session type | Recommended length |
|---|---|
| Session 0 (setup) | 30–60 minutes |
| Main sessions | 60–120 minutes |
| Climax sessions | up to 150 minutes |

Sessions shorter than 60 minutes may not complete a full pacing cycle (Rising → Climax → Falling → Resolution). If a session ends before Climax, end at a natural Rising Action pause point.

---

## 4. Session 0 Checklist

Complete all items before Session 1.

**Campaign setup:**
- [ ] Campaign name and premise defined
- [ ] World module selected and loaded
- [ ] Tone and content limits agreed upon with all players
- [ ] Pause/safety signal established
- [ ] Feedback channel established

**Character setup (per player):**
- [ ] Character name and call sign recorded
- [ ] Character level confirmed
- [ ] Primary skill defined
- [ ] Secondary skill defined
- [ ] Full declared equipment list written and confirmed
- [ ] Character strengths and weaknesses noted
- [ ] Director notes recorded (behavioral tendencies)

**Engine setup:**
- [ ] All required engine documents confirmed loadable
- [ ] AnomalyEngine.md confirmed loaded
- [ ] World module confirmed loaded
- [ ] Test scene run and basic functionality confirmed
- [ ] Session Record Template confirmed available

**First scenario:**
- [ ] Session 1 scenario selected or prepared
- [ ] GM-only hidden information confirmed as GM-only
- [ ] Anomaly observable behavior patterns defined (at least 2)
- [ ] Anomaly starting state defined (Dormant recommended)

---

## 5. Session 1 Preparation Checklist

Complete before each new session (starting with Session 1).

- [ ] Load all engine documents
- [ ] Load current scenario (GM-only)
- [ ] Confirm hidden information boundaries
- [ ] Initialize pacing counter to 0
- [ ] Initialize investigation loop counter to 0
- [ ] Confirm anomaly starting state
- [ ] Confirm inventory validation is active
- [ ] Review previous session record for open clues and NPC state changes
- [ ] Confirm player characters and equipment lists are current
- [ ] Confirm any patches from the previous session are applied

---

## 6. Recurring Session Structure

Each main session follows this general structure. Adapt as the scenario requires.

| Phase | Purpose |
|---|---|
| **Opening** | Resume from previous session state. Brief recap of where characters are and what is unresolved. No new hidden information revealed in the recap. |
| **Rising Action** | Players investigate, interact with NPCs, and gather information. Anomaly presence begins at Dormant/Aware. Pacing shifts fire as needed. |
| **Climax** | Direct confrontation with the primary threat, decision point, or scenario goal. Anomaly at Active or Critical. Output is short and immediate. |
| **Falling Action** | Resolution of the immediate crisis. Consequences of the climax become visible. NPCs react. |
| **Resolution** | Session winds down. Remaining loose ends noted. Next session hooks established. |

A single session may not complete all phases. If the session ends at Rising Action, close at a natural break point.

---

## 7. Post-Session Record Format

After each session, complete `docs/Campaign/Session_Record_Template.md`.

**Minimum required:** summary, major choices, NPC changes, anomaly changes, issues found, next session hooks.

File naming convention: `Session_Record_S{number}_{YYYY-MM-DD}.md` (example: `Session_Record_S01_2026-07-05.md`).

Store completed records in `docs/Campaign/Records/`.

---

## 8. Live Patch Policy

**When to patch:**
- A confirmed P1 rule failure occurred during play.
- The same issue appeared in two consecutive sessions.
- An engine rule produced clearly incorrect results.
- A new scenario element has no rule coverage.

**When not to patch:**
- A rule worked but produced an outcome the GM didn't like.
- Players complained about a single incident that may have been within normal variance.
- The issue is cosmetic or non-blocking.

**Patch procedure:**
1. Record the failure in the Session Record.
2. Write a brief patch note (what changed, why, source rule).
3. Apply the patch at the start of the next session.
4. Add the patch note to the campaign log or a dedicated patch file.

**Patch scope:** Patches to Director sub-engine behavior are permitted. Patches that modify CoreSpec require a separate review. Do not modify CoreSpec during a live campaign without explicit decision.

---

## 9. Campaign Safety and Comfort

The following must be established before Session 0 and revisited if needed.

- **Content limits:** Document specific topics, themes, or intensity levels that are off-limits for all players.
- **Pause signal:** A clear, agreed-upon signal that halts the session immediately without explanation. All players can use it.
- **Check-in:** A brief optional check-in at the start of each session: "Is everyone ready to continue?"
- **Post-session debrief:** 5–10 minutes after each session for players to say anything out of character about the experience.

These procedures apply to all campaigns regardless of tone. They are not obstacles to play — they are what make long-term campaigns possible.

---

**END OF MainCampaign_Plan v0.1.0**
