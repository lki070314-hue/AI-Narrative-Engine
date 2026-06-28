# AI Narrative Engine — Known Issues

**Document path:** `docs/Release/Known_Issues.md`
**Version:** v1.0.0
**Status:** Active
**Last updated:** 2026-06-28
**References:** `docs/Beta/Beta02_Result.md`, `docs/Release/v1.0_Preview_Release_Notes.md`, `engines/Director/AnomalyEngine.md`

---

## About This Document

This document tracks known issues in the AI Narrative Engine as of v1.0 Preview.

Issues are classified by severity:
- **P0 — Fatal:** Blocks play. Must be fixed before any session.
- **P1 — Severe:** Significantly reduces session quality. Should be addressed before or during play.
- **P2 — Moderate:** Minor impact. Document and address in future patches.

---

## Active Issues

### KI-001

**Severity:** P1

**Title:** Anomaly/SCP presence may remain weaker than NPC presence during live play

**Source:** Beta02 live playtest — 2026-06-28

**Description:**

In Beta02, SCP-6612 was physically consequential (players had to remove EM sources and manage acoustic pressure) but was not as memorable or interactively distinct as the NPC (Dr. Park Ji-hoon). Players primarily learned about and engaged with the anomaly through NPC-provided instructions (Park's notebook messages) rather than through direct observation of the anomaly's own behavior.

One player rated anomaly presence as weak. One player rated it as appropriate. Average anomaly presence satisfaction was below the overall session average.

The root cause: the anomaly functioned as an obstacle that NPCs described, rather than as an interactive entity whose behavior players could observe, predict, and respond to independently.

**Risk during main campaign:**

- Sessions may feel like investigations about the anomaly rather than investigations with the anomaly as a direct participant.
- NPCs may become the primary source of engagement, leaving the anomaly as scenery.
- Players may not feel the anomaly has a distinct "character" separating it from generic environmental hazards.

**Mitigation:**

- `engines/Director/AnomalyEngine.md` has been added to govern anomaly behavior as an independent, escalating presence. Apply this document during all sessions where an SCP or anomaly is present.
- Design scenarios where the anomaly's behavior is directly observable from the start (Dormant state), before NPC contact. Players should be able to form a hypothesis about the anomaly through observation alone.
- Ensure the anomaly reacts to at least one player action per scene independently of any NPC.
- Use AnomalyEngine.md §10 Interaction Frequency Rules: anomaly referenced in at least 1 out of every 3 meaningful Director responses.
- Use AnomalyEngine.md §5 Behavior States: begin at Dormant, escalate to Aware before Active. Do not jump to Critical without prior player exposure to the anomaly's patterns.

**Planned handling:**

Monitor anomaly presence across the first 2–3 main campaign sessions. After each session, record whether players engaged with the anomaly directly or primarily through NPC mediation. If NPC mediation continues to dominate, apply AnomalyEngine observable behavior rules more aggressively in the next scenario design.

**Target resolution:** v1.1 — after 2–3 main campaign sessions with AnomalyEngine applied

---

## Resolved Issues (Beta01 → Beta02)

| Former ID | Description | Resolved in |
|---|---|---|
| — | Pacing too slow; investigation loops | Beta02 |
| — | One action → one consequence | Beta02 |
| — | Output length causing fatigue | Beta02 |
| — | Director passive; world felt inert | Beta02 |
| — | Resolution outcomes opaque | Beta02 |
| — | Inventory integrity failures | Beta02 |

---

## Issue Log

| ID | Date reported | Severity | Status | Source |
|---|---|---|---|---|
| KI-001 | 2026-06-28 | P1 | Open | Beta02 Result |

---

**END OF Known_Issues v1.0.0**
