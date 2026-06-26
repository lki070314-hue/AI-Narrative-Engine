# SCP Module World Overview

**Document ID:** `modules/scp/WorldOverview.md`
**Version:** v1.0.0
**Status:** Draft
**Last Updated:** 2026-06-26
**References:** `core/CoreSpec.md`, `modules/scp/SCPModule.md`

---

## 1. Purpose

This document defines the player-safe overview for the SCP Foundation module. It gives engines enough context to run Alpha Test without exposing hidden campaign facts or creating Season 2 canon.

---

## 2. Module Premise

The campaign operates inside a secretive containment organization that investigates, secures, studies, and manages anomalous phenomena. The default tone is procedural horror: routine forms, controlled access, chain of command, and quiet escalation around unexplained threats.

The module supports player roles such as researchers, security personnel, field operatives, administrative staff, and expendable test personnel. Exact campaign assignment, site, mission, and anomaly details must come from explicit session setup or approved module files.

---

## 3. Player-Safe Knowledge

Players may know:

- The organization uses clearance levels and compartmentalized information.
- Anomalous objects and entities exist.
- Standard procedure, containment, and reporting matter.
- Unauthorized access has consequences.
- Personal goals may conflict with institutional orders.

Players must not receive:

- Hidden object behavior not discovered in play.
- Secret mission objectives.
- Undisclosed NPC motives.
- Shadow Engine timelines or countdowns.
- Campaign-specific secrets.

---

## 4. Alpha Test Scope

Alpha Test may use placeholder content:

```yaml
alpha_world:
  module_id: scp-foundation
  site_id: site_alpha_placeholder
  anomaly_id: anomaly_placeholder
  campaign_canon: false
  hidden_secrets_allowed_in_player_output: false
```

Placeholder content is disposable test material and does not become campaign canon.

---

## 5. Engine Notes

- Director Engine should emphasize controlled procedure, sensory unease, and institutional pressure.
- Compiler Engine should validate clearance, access, and declared intent.
- Shadow Engine may track secrets, but Alpha player output must not reveal them.
- QA Engine must block accidental hidden information leakage.

---

**END OF SCP WorldOverview v1.0.0**
