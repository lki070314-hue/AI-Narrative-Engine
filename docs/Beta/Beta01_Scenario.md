# Beta01 Playtest Scenario — The Signal From Station Echo

**Document ID:** `docs/Beta/Beta01_Scenario.md`
**Version:** v1.1.2
**Status:** Draft
**Last Updated:** 2026-06-28
**Module:** SCP Foundation (`modules/scp/`)
**Depends On:** `engines/Resolution/ResolutionEngine.md`, `engines/Director/DirectorEngine.md`

**Changelog v1.1.0:**
- Added structured Scene Summary to every scene (Objective, NPCs, Actions, Checks, Outcome)
- Added standard PPE to Entrance/Corridor (loc_ECHO_02) — resolves hearing protection dead-end
- Added Ending D exposure trigger mechanism (3-action threshold)
- Clarified Ending E trigger conditions (Critical Failure on deactivation OR enclosure breach)
- Clarified Ending A: Chen recovery is a natural consequence of deactivation, not a player requirement
- Clarified Ending C: explicit NPC fate per outcome
- Fixed Ending D language for 1-player sessions
- Added Scene 2 Resolution Engine triggers
- Added "Safety interlock disabled" as Tier 2 clue
- Clarified Chen comm badge discovery method
- Added Reyes disposition floor and recovery note
- Added Server Room bypass DC (standard)
- Added Context Linking timing note for Chen's badge connection
- Expanded Scene 7 with per-ending Director guidance

**Changelog v1.1.1:**
- Added live-play pacing guidance for multiplayer action order, dynamic events, event density, proactive NPC behavior, and Director output shape

**Changelog v1.1.2:**
- Added Incident Pressure Events, Investigation Loop Breaker, Anomaly Presence Rule, Inventory Integrity Rule, and Declared Equipment Rule

---

## Overview

| Field | Value |
|-------|-------|
| **Title** | The Signal From Station Echo |
| **Player Count** | 1–2 |
| **Estimated Playtime** | 90–150 minutes |
| **Genre** | Investigation / Horror |
| **Pacing Target** | 1 full Rising Action → Climax → Falling Action → Resolution cycle |
| **Primary Engines Tested** | Resolution, Director, NPC, Memory (Context Linking), QA |

---

## Premise

A remote field observation post — designated Station Echo — has stopped transmitting 18 hours ago.
Players are dispatched as first-responders to assess the situation and restore contact.

Station Echo monitors a low-classification sound-processing anomaly in long-term passive containment.
No breach alarms were triggered before communications went silent.
One vehicle is in the lot. The lights are still on.

---

## Hidden Truth (GM / AI Only — Do Not Reveal to Players)

Dr. Mara Reyes, a junior researcher stationed at Echo, conducted unauthorized tests on the contained object to gather data for a personal paper. The object — which responds to specific complex acoustic patterns — was inadvertently given the activation sequence during her tests at 03:14 station time.

When active, the object emits inaudible low-frequency pulses that cause escalating neurological effects in unprotected humans: first disorientation, then paranoia, then unconsciousness. Effects onset takes 20–40 minutes depending on proximity. Standard ear protection (PPE) significantly reduces exposure, though it does not eliminate it entirely.

Guard Tomás Chen recognized something was wrong and attempted to physically remove the object from the test enclosure. He was incapacitated before he could complete the action. His radio call for help was cut off mid-transmission at 03:47.

Dr. Reyes was wearing hearing protection during the tests, which provided partial but not full immunity. She is disoriented but functional. She barricaded herself in the supply room shortly after Chen collapsed. She knows the deactivation method from her research but has not attempted it — she is too afraid of entering the active lab and, separately, too afraid of the consequences of disclosure.

When the object is deactivated, its low-frequency emissions cease. Characters incapacitated by exposure will naturally recover over 30–60 minutes once the source is removed. This means Chen does not require direct medical intervention — deactivating the object is sufficient for Ending A.

The object is still active. Unprotected exposure accumulates with time spent near the Research Lab.

---

## Key NPCs

```yaml
npc_dr_reyes:
  id: npc_ECHO_001
  name: "Dr. Mara Reyes"
  role: major
  location: supply_room
  visible_to_players: false  # must be found
  disposition:
    toward_players: -20  # fear of consequences, not hostility
    adjustable: true
    floor: -50  # cannot go below -50 even after hostile actions
  knowledge:
    public: []
    private:
      - "The object was activated during her unauthorized test."
      - "Guard Chen attempted to stop it and was knocked out."
      - "She knows the deactivation sequence (from her notes)."
      - "Her notes are in the research lab, which she abandoned."
    secret:
      - "She bypassed the safety interlock to run the test."
      - "She has a backup copy of her notes hidden in the supply room."
  goals:
    primary: "Survive and avoid severe disciplinary consequences."
    secondary: "Undo the damage she caused if she can do so safely."
  behavioral_traits:
    - Intelligent but terrified
    - Will not volunteer incriminating information
    - Responds to evidence and logical arguments over emotional appeals
    - If she believes the players already know what happened, she becomes significantly more cooperative
    - Will offer hearing protection to players voluntarily if asked, or if players express they are in the lab without it — this does not incriminate her and helps her survival
  disposition_adjustment:
    door_forced: -30  # one-time penalty; does not stack
    evidence_presented: +20 per piece of strong evidence shown
    logical_argument: +10 per successful social_interaction check
    offered_protection_from_consequences: +30

npc_guard_chen:
  id: npc_ECHO_002
  name: "Guard Tomás Chen"
  role: minor
  location: monitoring_room
  visible_to_players: true  # found immediately
  initial_state: incapacitated
  recovery: >
    Chen's incapacitation is caused by ongoing exposure to the object's frequencies.
    If the object is deactivated, Chen will recover naturally over 30–60 minutes without
    player intervention. Reviving Chen during the investigation provides information access
    but is not required for any ending.
  disposition:
    toward_players: 40  # when revived, cooperative
  knowledge:
    public:
      - "The anomaly alarm was manually bypassed from within the lab."
      - "He tried to call for help at 03:47."
    private:
      - "He saw Dr. Reyes enter the lab at an unusual hour."
    secret: []
  goals:
    primary: "Recover and report the incident."
  behavioral_traits:
    - Professional, straightforward
    - Will answer direct questions when able to communicate

npc_the_quiet:
  id: npc_ECHO_003
  name: "The Quiet"
  role: background
  nature: anomaly
  location: research_lab
  visible_to_players: false  # indirect effects only
  notes: >
    Not a person. Responds to sound input patterns. Does not communicate.
    Should be treated by NPC Engine as environmental phenomenon, not as
    a dialogue partner. If players attempt to communicate with it directly,
    generate environmental responses (vibration, equipment feedback) only.
    Physical attack on the enclosure or incorrect sound sequences are the
    primary triggers for Ending E.
```

---

## Key Locations

| ID | Name | Description |
|----|------|-------------|
| `loc_ECHO_01` | Station Exterior | Perimeter fence, emergency lighting active, one vehicle in lot. Flickering exterior lamp. No movement. |
| `loc_ECHO_02` | Entrance / Corridor | Motion sensor triggered on entry. Overturned supply cart near door. Equipment humming. **The supply cart contains standard station PPE including ear protection — visible and accessible without a roll.** Corridor branches: monitoring room ahead, research lab left, supply room and server room further right. |
| `loc_ECHO_03` | Monitoring Room | Multiple screens. Most show static or cycling error codes. Guard Chen lies unconscious here. One screen shows partial access log. |
| `loc_ECHO_04` | Research Lab | The primary clue zone. Test equipment disturbed. The object enclosure is active (subtle vibration, amber light). Proximity risk increases with unprotected time spent here. Dr. Reyes' notes are here (hidden clue). |
| `loc_ECHO_05` | Supply Room | Dr. Reyes is barricaded inside. Shelving blocks the door from inside. She has a backup of her notes and additional hearing protection equipment. |
| `loc_ECHO_06` | Server Room | Optional. Access-locked (requires Technical bypass, standard DC; Advantage if player has Technical skill). Contains complete access logs for the last 72 hours. Grants Advantage on any deactivation check if accessed. |

---

## Clue List

### Tier 1 — Explicit (No Roll Required)

| Clue | Location | Information |
|------|----------|-------------|
| Guard Chen unconscious | Monitoring Room | Something incapacitated the station's guard |
| Research lab equipment disturbed | Research Lab | Recent activity in the lab, not routine |
| Empty test log binder on the lab floor | Research Lab | A log was removed or never filed |
| Sound of something cycling mechanically | Corridor/Lab direction | The object enclosure is running |
| Standard ear protection (PPE) in supply cart | Entrance / Corridor | Hearing protection is available and accessible immediately |

### Tier 2 — Hidden (Investigation Roll Required)

| Clue | Location | How Discovered | Roll | Information |
|------|----------|---------------|------|-------------|
| Partial access log on the monitoring screen | Monitoring Room | Examine screens | Investigation (easy) | Dr. Reyes accessed the lab at 03:14, unusual hour |
| Chen's comm badge timestamp | On Chen's person (Monitoring Room) | Found automatically during Chen condition examination, OR separately if player searches Chen's equipment | No additional roll if condition check succeeds; Investigation (easy) if approached separately | He sent a partial distress call at 03:47 |
| Safety interlock disabled | Research Lab, enclosure panel | Examine the enclosure | Investigation (easy) | The safety interlock was manually disabled from inside the lab — this was not an equipment failure |
| Handwritten equation on notepad near the enclosure | Research Lab | Search near the enclosure | Investigation (standard) | Partial deactivation sequence — not complete on its own |
| Faint scratching sounds / blocked door | Corridor near Supply Room | Explore the right corridor branch | Investigation (easy) | Someone barricaded inside the supply room |

### Tier 3 — Deep (Expertise Check or Dr. Reyes' Cooperation)

| Clue | Source | Roll | Information |
|------|--------|------|-------------|
| Dr. Reyes' research notes | Research Lab (hidden under overturned equipment) | Investigation (hard) | Full activation record and complete deactivation sequence |
| Backup notes | Supply Room (Reyes' possession) | Reyes must open door (disposition 0+) and be willing to share (disposition 30+) | Same as above — the complete deactivation sequence |
| Server room access log | Server Room | Technical bypass (standard DC) + Investigation (easy) | Full 72-hour activity log; confirms complete timeline; Advantage on deactivation |

---

## Scene Flow

### Scene 1 — Arrival at Station Echo

> **Scene Summary**
> | | |
> |---|---|
> | **Objective** | Assess the station exterior; decide how to enter |
> | **NPCs Present** | None |
> | **Key Actions Available** | Examine perimeter, check the vehicle, observe exterior details, approach entrance |
> | **Possible Resolution Checks** | None required (entrance unlocked, routine approach) |
> | **Expected Outcome** | Players enter the station; baseline established |

**Pacing:** Rising Action (early)
**Tone:** Mysterious

Director describes the exterior of Station Echo: perimeter fence, emergency lighting casting yellow light on wet concrete, one vehicle in the lot. No sound from inside. A flickering external lamp. The main entrance door is closed but unlocked.

Players must decide how to proceed. No roll is required to enter — the door is simply unlocked. The vehicle in the lot can be examined without a roll: it belongs to the station, key is inside, nothing unusual.

**Context Linking trigger:** None yet. This is the baseline.

---

### Scene 2 — Entry and Corridor

> **Scene Summary**
> | | |
> |---|---|
> | **Objective** | Orient in the station; identify immediate evidence and available resources |
> | **NPCs Present** | None |
> | **Key Actions Available** | Examine supply cart (PPE), listen at corridor branches, search the entrance area, choose a direction |
> | **Possible Resolution Checks** | Listening at branches (investigation, easy); Active corridor search (investigation, easy) |
> | **Expected Outcome** | Players acquire PPE if desired; orient to the station layout; detect the mechanical cycling sound from the lab direction |

**Pacing:** Rising Action
**Tone:** Mysterious / Tense

Motion sensor activates on entry (it still works). An overturned supply cart is near the entrance — its contents have spilled partially onto the floor, including standard station ear protection. The corridor branches ahead: monitoring room straight, research lab to the left, supply room and server room further right.

Equipment hums from deeper in the building. Something cycles mechanically — the sound comes from the left branch (toward the lab).

**Resolution Engine triggers here:**
- Examining the supply cart: trivial — standard station PPE (ear protection) is visible and accessible, no roll required
- Listening at the corridor branches: `investigation` (easy) — the mechanical cycling sound localizes to the lab direction
- Active search of the entrance/corridor area: `investigation` (easy) — reveals no other personnel, confirms the branching layout

**Director note:** Present the supply cart contents neutrally. Do not highlight the PPE as "important." It is simply there. Players who take it are protected from exposure in the lab. Players who do not take it are not warned — the scenario uses environmental tension, not mechanical announcements.

---

### Scene 3 — Monitoring Room

> **Scene Summary**
> | | |
> |---|---|
> | **Objective** | Investigate the monitoring room; gather initial clues; assess Chen's condition |
> | **NPCs Present** | Guard Chen (incapacitated) |
> | **Key Actions Available** | Examine Chen, read screens, examine badge, attempt to revive Chen, use communications equipment |
> | **Possible Resolution Checks** | Chen condition (investigation, easy); Screen log (investigation, easy); Revive Chen (social_interaction or medicine, standard) |
> | **Expected Outcome** | At least 1 Tier 2 clue found; Chen's state established; players have leads toward the lab and supply room |

**Pacing:** Rising Action
**Tone:** Tense

Guard Chen is on the floor. He is breathing — not dead, but unresponsive. Screens show static on most feeds, cycling error messages on one, and a partial access log on another.

**Resolution Engine triggers here:**

- Examining Chen's condition: `investigation` (easy) — reveals he is incapacitated but stable, not wounded. Chen's comm badge is found on his person during this examination with no additional roll required. The badge shows a timestamp: his outgoing distress call was cut off at 03:47.

- Reading the partial access log: `investigation` (easy) — reveals Reyes accessed the lab at 03:14, an unusual hour

- Attempting to revive Chen: `social_interaction` or medicine action (standard DC) — partial success allows yes/no questions via blinking; full success allows limited spoken conversation (Chen can share his public and private knowledge)

- Using station communications equipment: `technical` (standard) — equipment is damaged by the exposure effects; partial success re-establishes one-way contact with outside; full success establishes two-way contact

**2-Player Note:** One player can attempt to revive Chen while the other reads the screens simultaneously. Both actions resolve separately.

**Context Linking trigger:** Once players have both the access log (03:14 timestamp) AND Chen's badge timestamp (03:47), Director connects these within the same or next scene: *The log shows someone entered the lab over 30 minutes before his distress call was cut off. Whatever happened in there had time to develop.*

---

### Scene 4 — Research Lab

> **Scene Summary**
> | | |
> |---|---|
> | **Objective** | Investigate the primary incident site; locate critical clues about the anomaly and the incident cause |
> | **NPCs Present** | The Quiet (background — environmental effects only, no interaction) |
> | **Key Actions Available** | Examine enclosure, examine safety interlock, search for notes, interact with object, check equipment logs on-site |
> | **Possible Resolution Checks** | Enclosure examination (investigation, easy); Safety interlock (investigation, easy); Lab notes search (investigation, hard); Object interaction (item, plausibility evaluation) |
> | **Expected Outcome** | 1–3 Tier 2/3 clues discovered; exposure tension established; players understand the object is the source |

**Pacing:** Rising Action → approaching Climax
**Tone:** Tense / Grim

The lab door is closed but unlocked. On entry, players note disturbed equipment, an empty test log binder on the floor, and the object enclosure — a dull metallic box with a faintly pulsing amber light — still active.

**Exposure Risk (Director Internal Tracking):**
- Track how many Resolution Engine actions a player has taken inside the Research Lab without ear protection.
- After the 3rd such action, Director triggers an exposure check via Resolution Engine: action type `item` (body condition), difficulty `standard`.
  - Critical Failure: incapacitation → Ending D
  - Failure: severe disorientation; player has Disadvantage on all further checks until they leave the lab
  - Partial Success: mild symptoms; environmental descriptions escalate but play continues normally
  - Success or better: player fights off the effects this time; the check resets after leaving and re-entering the lab
- Players wearing ear protection from the supply cart do not trigger this check. The threshold is the same — 3 actions — but the check does not occur.
- Do not announce the threshold or the check. Increase environmental unease gradually through description: a slight headache mentioned in passing, instruments behaving oddly, sound slightly distorted.

**Resolution Engine triggers here:**

- Examining the enclosure: `investigation` (easy) — reveals the enclosure is active; the safety interlock panel is visible on the side
- Examining the safety interlock: `investigation` (easy) — reveals the interlock was manually disabled from inside the lab (not a malfunction, not a breach from outside)
- Searching the lab for notes: `investigation` (hard) — finds Dr. Reyes' research notes under overturned equipment
- Attempting to interact with the object directly: `item` (plausibility evaluation) — the object responds to acoustic input patterns, not physical manipulation; tactile or mechanical interaction produces environmental feedback only (vibration, amber light flicker), not damage or activation change

**Surprise Handling:** If players attempt an approach not described here (e.g., playing specific sounds at the object, recording the mechanical cycling, attempting to physically seal the enclosure, cutting power to the room), evaluate plausibility via Resolution Engine and continue. Do not refuse.

**Context Linking trigger:** If players found the access log in Scene 3, Director should naturally connect it when players find evidence of recent activity in the lab: *The log placed someone in this room at 03:14. The disturbance here looks recent — and deliberate.*

**Context Linking trigger:** If players found the safety interlock disabled AND found the empty test log binder, Director can connect them: *Whatever was done here, someone prepared for it — and then removed the record.*

---

### Scene 5 — Finding Dr. Reyes

> **Scene Summary**
> | | |
> |---|---|
> | **Objective** | Locate and make contact with Dr. Reyes; gather testimony and access to deactivation information |
> | **NPCs Present** | Dr. Reyes (barricaded, disposition -20) |
> | **Key Actions Available** | Speak through door, present evidence, offer protection, ask specific questions, force door, leave and return with more evidence |
> | **Possible Resolution Checks** | Persuasion (variable DC based on evidence); Social interaction through door (incremental disposition); Force door (movement/combat, standard — disposition penalty) |
> | **Expected Outcome** | Disposition change; possible deactivation sequence obtained; lead toward resolution decision |

**Pacing:** Rising Action → Climax
**Tone:** Tense

Players find the supply room door. It is physically blocked from the inside. Reyes does not respond to the first call. She can hear players.

**NPC Engine governs all of Reyes' responses.** Director Engine does not determine what she says or does independently.

**Resolution Engine triggers here:**

- Persuading Reyes to open the door: `persuasion`
  - Standard DC if players have no evidence (no clues linking her to the lab)
  - Easy DC if players have the access log (her name/access connected to the lab at 03:14)
  - Trivial DC if players have found her notes or can demonstrate they already know what happened
- Forcing the door: `combat` or `movement` (standard) — the door can be forced, but imposes a one-time -30 disposition penalty (floor: -50). Reyes will not offer further cooperation voluntarily, but can still be reached through evidence at the floor disposition.
- Communicating through the door (patience, logical argument, evidence presented verbally): `social_interaction` — can improve disposition incrementally (+10 per success); each successful exchange counts as one Resolution check

**Disposition floor and recovery:** Even after door-forcing, Reyes' minimum disposition is -50. She retains her survival goal. If players demonstrate they can deactivate the object without her (e.g., show her the lab notes), she may still cooperate toward her secondary goal (undoing the damage). The floor exists because she is not a threat — she is self-interested.

**Reyes' information by disposition:**
- Below 0: Does not open the door; gives minimal or no verbal response
- 0–29: Opens the door; admits she was in the lab; claims she "doesn't know what happened"
- 30–59: Admits the test and that she may have triggered something; withholds the deactivation sequence but may direct players toward her notes in the lab
- 60+: Full cooperation; provides the deactivation sequence from her backup notes in the supply room; also voluntarily offers the additional hearing protection in the supply room

**PPE note:** Even at disposition 0+ (door opened), Reyes will offer the supply room's hearing protection to players if they ask, or if players mention they need to go into the lab. This aligns with her survival goal — players who are protected can fix the situation.

**2-Player Note:** One player can speak with Reyes through the door while the other retrieves additional evidence from the lab to present to her (e.g., the notepad equation, the safety interlock state). Evidence gathered mid-conversation and then presented raises the DC adjustment retroactively for the current persuasion exchange.

---

### Scene 6 — Resolution Decision

> **Scene Summary**
> | | |
> |---|---|
> | **Objective** | Players commit to a final resolution approach and execute it |
> | **NPCs Present** | Reyes (if cooperation achieved), Chen (unconscious in monitoring room) |
> | **Key Actions Available** | Deactivate via full sequence, deactivate via partial sequence, physically contain and evacuate, evacuate all personnel, improvise |
> | **Possible Resolution Checks** | Varies by chosen approach (see table below) |
> | **Expected Outcome** | One of five endings is reached |

**Pacing:** Climax
**Tone:** Tense / Grim

Players have gathered clues and made NPC contact. They must now decide what to do about the active object.

**Available options (all are valid player choices):**

| Option | Requirements | Resolution Engine Check | Failure leads to |
|--------|-------------|------------------------|-----------------|
| Deactivate using the full sequence | Reyes' full notes (lab or backup) or server logs | `investigation` (standard) — Advantage if server logs obtained | Partial Success = Ending B; Failure = Ending E |
| Deactivate using the partial sequence | Notepad equation only | `investigation` (hard) — risk of complications | Partial Success = Ending B; Critical Failure = Ending E |
| Physically contain the enclosure and evacuate | No special requirement | `movement` (standard) | Failure = station cannot be sealed; escalates to Ending C or E |
| Evacuate all personnel, lock the station | No special requirement | `movement` (easy) | Difficulty is managing both NPCs during exit |
| Improvise a novel approach | Player creativity | Resolution Engine evaluates plausibility | Depends on outcome |

**Ending E trigger — defined:** Ending E is triggered when:
1. A deactivation attempt results in a **Critical Failure**, OR
2. A player physically breaches the object enclosure without completing a deactivation procedure — action type `combat` or `item` targeting the enclosure directly — AND the Resolution result is **Failure or Critical Failure**

In both cases, the object transitions from passive pulse emission to active, full-range output. The station must be immediately evacuated.

**Do not pre-confirm any outcome before Resolution Engine runs.**

**2-Player Note:** In the evacuation option, one player can manage Chen (carry or assist) while the other manages Reyes. For deactivation options, one player can operate the deactivation sequence while the other monitors the enclosure for unexpected reactions.

---

### Scene 7 — Ending

> **Scene Summary**
> | | |
> |---|---|
> | **Objective** | Deliver the aftermath of the resolution; provide narrative closure |
> | **NPCs Present** | Varies by ending (see below) |
> | **Key Actions Available** | None — this is a Director narration scene; player may ask clarifying questions |
> | **Possible Resolution Checks** | None in the aftermath itself |
> | **Expected Outcome** | Players understand what their choices left in the world |

**Pacing:** Falling Action → Resolution
**Tone:** Varies by ending (see below)

Director narrates the aftermath based on the ending reached. Each ending should include: the state of the object, the state of both NPCs, what the players' report would contain, and one lasting consequence for the world.

---

#### Director Guidance — Ending A: Full Containment

**Tone:** Grim but professional  
**Object state:** Deactivated. Enclosure re-sealed. Safety interlock will need replacement.  
**Chen:** Recovering in the monitoring room. He will wake within the hour now that the source is gone.  
**Reyes:** Secured and cooperative. She will face disciplinary review. Her cooperation is noted but does not eliminate consequences.  
**Report:** Unauthorized testing, anomaly activation, one incapacitation, full resolution.  
**World consequence:** Station Echo returns to operational status after inspection. Reyes' case sets a precedent for unsanctioned research protocols.

---

#### Director Guidance — Ending B: Partial Containment

**Tone:** Grim, uncertain  
**Object state:** Deactivated but via improvised or partial method. The deactivation may not be permanent — the sequence was incomplete.  
**Chen:** Recovering. The incomplete deactivation was still sufficient to stop the pulse emission.  
**Reyes:** Situation varies — she may have been cooperative or not. Her fate is left unresolved pending full investigation.  
**Report:** Partial containment achieved. Further testing and review required before the station reopens.  
**World consequence:** The object is flagged for re-evaluation. Station Echo is sealed pending inspection.

---

#### Director Guidance — Ending C: Evacuation

**Tone:** Tense, unresolved  
**Object state:** Still active inside the sealed station.  
**Chen:** Carried out or left in the monitoring room depending on player action. If carried out: he is evacuated with the team and will recover. If left: emergency responders will retrieve him when backup arrives; he is not in immediate danger as his condition is stable.  
**Reyes:** If she cooperated with evacuation, she exits with the players under escort. If she refused to leave, the players must decide whether to forcibly remove her or leave her — Director narrates the outcome of whichever choice the player makes. Her fate outside is uncertain pending the full incident investigation.  
**Report:** Station secured from outside; object still active inside; full containment team required.  
**World consequence:** Incident escalated. Higher authority now involved. Station Echo is under external investigation.

---

#### Director Guidance — Ending D: Failure (Affected)

**Tone:** Grim  
**Object state:** Still active.  
**Player character(s):** Incapacitated by exposure. Found by the backup team that arrives hours later.  
**Chen:** Still unconscious in the monitoring room.  
**Reyes:** Still barricaded in the supply room, or was with the players — her state depends on where she was.  
**Report:** Primary response team incapacitated. Object still active. Escalation required.  
**World consequence:** A second team is dispatched. The incident is now classified at a higher level.

---

#### Director Guidance — Ending E: Failure (Escalation)

**Tone:** Grim / urgent  
**Object state:** Fully activated — high-range output. The station must be evacuated immediately.  
**Chen:** May be evacuated or may be left behind depending on the circumstances and player choices during the emergency exit.  
**Reyes:** Unknown — she was either with the players or still in the supply room when the escalation occurred.  
**Report:** Containment breach. Full evacuation. Object active at maximum output.  
**World consequence:** Station Echo is sealed at the perimeter. A specialized containment team is deployed. The surrounding area is placed under a precautionary cordon.

---

## Ending Branches

| Branch | Trigger Conditions | Outcome |
|--------|--------------------|---------|
| **A — Full Containment** | Object deactivated via complete sequence; object ceases emission; both NPCs survive | Minimal incident. Reyes faces consequences. Chen recovers naturally. Station operational after inspection. |
| **B — Partial Containment** | Object deactivated via partial sequence or improvised method; object ceases emission with complications | Deactivation worked but long-term stability unconfirmed. Station sealed pending review. |
| **C — Evacuation** | Players chose to evacuate rather than deactivate | Station sealed and cordoned. Object active inside. Incident escalated to higher authority. NPC fates vary by player choices during exit. |
| **D — Failure (Affected)** | Player character(s) were incapacitated by unprotected exposure (3-action threshold + failed exposure check) | Mission failure. Backup team required. Player character(s) are casualties. |
| **E — Failure (Escalation)** | Critical Failure on deactivation attempt, OR physical breach of the enclosure without deactivation | Containment breach. Emergency evacuation of surrounding area. Station Echo sealed at perimeter. |

Every ending should include a brief Director narration of the aftermath covering: object state, NPC states, the shape of the players' report, and one world consequence.

---

## Notes for Director Behavior

### Live-Play Turn Order

There is no initiative or speed system by default. In multiplayer play, process player actions in the exact order they are received. Resolve each player action completely before processing the next one, including Resolution Engine checks, NPC Engine responses, World Effects, and clue/context updates.

If a later player's action is affected by an earlier result, use the updated world state. If players explicitly declare a simultaneous action, resolve it as a coordinated action through the Resolution Engine. Do not reorder player actions unless an unavoidable in-world event requires it.

The scenario remains playable with 1 or 2 players. These rules define processing order only; they do not add a required 2-player structure.

### Dynamic Event Pacing

The world must not remain static. After every 2-4 meaningful player actions, the Director should trigger a dynamic world event unless an event has just occurred. Do not wait for players to ask for events. The station, NPCs, and anomaly continue moving independently.

Dynamic events must be logical consequences of the current world state. They may include an NPC moving or interrupting, a radio transmission, alarm sound, light flicker, newly available clue, equipment failure, unexpected anomaly behavior, door locking or unlocking, environmental change, new objective, off-screen NPC action, or containment status change.

Do not use dynamic events to reveal the hidden truth early, bypass investigation requirements, invalidate clue balance, or force an ending. Events should create pressure and new information while preserving player agency.

### Event Density Targets

Use the following live-play density targets:

| Event Type | Frequency | Beta01 Use |
|---|---|---|
| Minor Event | Every 2-3 meaningful player actions | Pressure or new information, such as a light flicker, static burst, faint sound behind the supply room door, screen error change, or enclosure pulse |
| Major Event | Every 5-7 meaningful player actions | Change available choices, such as comms partially reconnecting, Reyes moving position, a door becoming harder or easier to access, or a new operational hazard |
| Critical Event | Once per scenario phase or when escalation conditions are met | Alter direction or ending pressure, such as exposure consequence, failed deactivation escalation, or evacuation urgency |

Minor Events should create pressure or new information. Major Events should change available choices. Critical Events should alter scenario direction or ending pressure.

### Incident Pressure Events

Dynamic events must not be only ambient descriptions. After 2-3 repeated investigation actions without meaningful progression, the Director must introduce an Incident Pressure Event. This event must force the players to respond.

Incident Pressure Events may include direct anomaly manifestation, indirect anomaly evidence, containment instability, NPC abnormal behavior, victim condition worsening, security system failure, physical danger, time pressure, forced choice, clue meaning reversal, or a new threat entering the scene.

Beta01 examples include: Chen's breathing becoming irregular, a monitoring screen replaying distorted audio, the enclosure pulse causing equipment to move, the lab door controls failing, Reyes shifting position inside the supply room, outside comms cutting in with incomplete warning traffic, or an alarm changing from passive error to active containment warning.

Incident Pressure Events must remain logical consequences of the active anomaly and station state. They must not reveal Reyes' hidden truth early, bypass Tier 2/Tier 3 clue requirements, or force an ending.

### Investigation Loop Breaker

If players perform repeated investigation without meaningful progression, the Director must break the loop. Do not keep returning only clue descriptions.

Break the loop by escalating the anomaly, moving an NPC, changing the environment, revealing a partial danger, cutting off a safe option, introducing a consequence, or forcing a choice between two objectives.

Examples: players searching the same room repeatedly may hear the enclosure pulse distort the lights; players rechecking screens may see feeds fail one by one; players stalling outside the supply room may hear Reyes drag shelving away from or harder against the door; players over-investigating the lab may trigger exposure pressure or containment instability.

### Anomaly Presence Rule

Because Beta01 uses the SCP module, the anomaly must be felt during play. The anomaly does not need to fully appear immediately, but each scenario phase should include at least one anomaly presence marker:

- sensory abnormality
- physical trace
- distorted recording
- NPC reaction to anomaly
- containment warning
- impossible environmental change
- direct anomaly effect

Use these markers to keep Beta01 from feeling like a normal investigation. Preserve uncertainty: anomaly presence can be felt before its cause is understood.

### Inventory Integrity Rule

The Director must respect character sheets. If a player attempts to use an item not listed in their character sheet, do not assume they have it and do not resolve the action as if the item exists.

Tell the player the item is not currently listed, then offer alternatives: search the scene for a substitute, request it from an NPC, access a supply point, improvise with existing equipment, or attempt a different method.

If the item is reasonable for the character's role but not listed, the Director may allow a Resolution Engine check to determine whether it is accessible nearby. The item must not be granted automatically.

### Declared Equipment Rule

Only declared equipment is guaranteed. Character role, job, or authority may justify access attempts, but not automatic possession.

Example: a Mobile Task Force character with Level 3 authority may request or locate equipment, but only listed items are immediately available. Missing equipment should create a fair choice or access attempt, not a dead end.

### NPC Proactive Behavior

NPCs should not only answer player questions. Through the NPC Engine, NPCs may interrupt with urgent information, hide information, move to another location, react emotionally, call for help, warn players, make mistakes, reveal partial clues, or trigger new complications.

NPC behavior must remain consistent with motivation and current disposition. Reyes should remain afraid of consequences and survival-focused. Chen, if revived, should remain professional and direct. The Quiet is not a speaking character and only produces environmental responses.

### Director Output Shape

Avoid ending too many responses with only "What do you do?"

Director output should usually include the result of the player action, a world update, an NPC or environmental reaction, and a new pressure, clue, or complication before allowing player response. Keep the response neutral: do not narrate player emotions, do not choose player actions, and do not expose hidden truth before discovery.

### Do Not Expose the Hidden Truth Early

The object's activation cause, Reyes' involvement, and the deactivation method are all hidden information. Director must not name them, reference them, or confirm player guesses before the relevant clue has been discovered and the Resolution Engine has processed the investigation action.

### Dr. Reyes — Disposition Is Earned

Reyes starts at -20 disposition with a floor of -50. Players must invest effort to raise it. She does not volunteer damaging information. She responds to logic, evidence, and offers of limited protection. NPC Engine governs all her responses — Director must not override or soften her resistance for pacing reasons. Even at floor disposition, she will offer hearing protection if asked, because that serves her survival goal.

### The Object Is Not a Character

If players attempt to communicate with or reason with the object, produce only environmental responses: vibration, equipment interference, a change in the cycling sound. The object does not understand language. Do not generate dialogue or intent for it.

### Exposure Risk — Internal Tracking, Environmental Expression

Track exposure internally. After a player's 3rd Resolution Engine action inside the Research Lab without ear protection, trigger an exposure check (action type `item`, difficulty `standard`) without announcing the trigger. Express the escalating risk through environmental descriptions only: subtle disorientation mentioned in one line, instruments behaving oddly, sound seeming slightly off. Ending D is a consequence of player choice (not taking the PPE, spending extended time in the lab), not an arbitrary timer.

Players wearing ear protection from the supply cart (loc_ECHO_02) or from Reyes (loc_ECHO_05 at disposition 0+) are exempt from the exposure check regardless of time spent in the lab.

### Surprise Handling Is Expected

Players will attempt approaches not listed in this document. Every such approach must be evaluated by Resolution Engine for plausibility before any result is determined. Unexpected approaches may succeed, fail with complications, or produce new leads. They should never be rejected by Director alone.

### Adaptive Detail — Pacing-Based Length

During Rising Action scenes (1–4), use medium-length output with sensory details. When the player enters the Climax (Scene 6, resolution decision), shift to shorter, more immediate output. If the player requests `[요청: 중요한 내용만]`, switch to compressed mode: ≤5 sentences, critical result and immediate options only, minimal atmosphere.

### Context Linking — Required Connection Points

The following links must be made if both pieces of information have been found:

| Prior Fact | New Discovery | When to Connect | Connection |
|------------|---------------|-----------------|------------|
| Access log (Reyes in lab at 03:14) | Lab disturbance | On entering the Research Lab | *The log placed someone here at 03:14. The disturbance looks recent and deliberate.* |
| Chen's distress call at 03:47 | Finding Chen unconscious | Within Scene 3, once badge timestamp found | *The timestamp on his badge matches the moment before the station went completely dark.* |
| Safety interlock disabled + empty test log | Together in Research Lab | Immediately when both are noted | *Whatever was done here, someone prepared for it — and removed the record.* |
| Notepad equation (partial sequence) | Reyes' full notes | If player obtains both | *The equation on that notepad is the first half of what's in these notes.* |

---

**END OF Beta01_Scenario v1.1.2**
