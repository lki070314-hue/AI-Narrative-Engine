# Beta00 Feedback

**Document ID:** `docs/Beta/Beta00_Feedback.md`
**Version:** v1.0.0
**Status:** Draft
**Last Updated:** 2026-06-26
**Source:** First external player playtest (Beta00)

---

## 1. Player Feedback

- Director responses often mirrored the player's input instead of advancing the playable scene.
- Requested information was answered too narrowly, leaving few visible things to interact with.
- Some player actions appeared to succeed by default without explicit difficulty or consequence handling.
- Previously established facts were not always brought back when relevant to a new discovery.
- Unexpected player ideas were treated as edge cases instead of normal play inputs.
- The player wanted a way to request shorter output for important information only.

---

## 2. Identified Engine Issues

| Issue | Impact | Affected Area |
|-------|--------|---------------|
| Missing formal resolution layer | Director may imply success before uncertainty is evaluated. | Framework action flow |
| Passive Director response strategy | Scenes can feel static and under-instrumented. | Director Engine |
| Weak context linking | Discoveries may feel disconnected from campaign memory. | Director + Memory |
| No adaptive detail rule | Output length can mismatch player need or scene pacing. | Director Engine |
| Weak surprise handling | Creative actions may be rejected or mishandled. | Compiler + Resolution + Director |

---

## 3. Improvement Plan

1. Add `Resolution Engine` as the standard framework layer for action attempts.
2. Require the flow: Player Action -> Difficulty Evaluation -> Resolution -> Outcome -> World Update.
3. Update Director rules so it narrates resolved outcomes only, never assumed success.
4. Add proactive response strategy: nearby interactive elements, natural memory recall, links to prior events, and optional leads.
5. Add Context Linking rules across previous NPCs, locations, discovered clues, and active missions.
6. Add Adaptive Detail Mode for `[요청: 중요한 내용만]` and pacing-based default length.
7. Add Surprise Handling rules that evaluate plausibility and continue play naturally.
8. Add QA checks for skipped resolution, passive scene output, missing context links, and inappropriate output length.

---

## 4. Implementation Priority

| Priority | Item | Rationale |
|----------|------|-----------|
| P0 | Prevent assumed success for uncertain actions | Protects core gameplay fairness. |
| P1 | Resolution Engine spec | Creates shared action outcome contract. |
| P1 | Director response strategy update | Improves playability immediately. |
| P1 | Surprise Handling rules | Keeps player creativity supported. |
| P2 | Context Linking rules | Improves long-term campaign coherence. |
| P2 | Adaptive Detail Mode | Improves usability and pacing. |
| P3 | Additional Beta tests | Needed after specs stabilize. |

---

## 5. Scope Guard

This feedback update changes framework behavior only. It does not modify setting lore, campaign canon, hidden secrets, or module-specific content.

---

**END OF Beta00 Feedback v1.0.0**
