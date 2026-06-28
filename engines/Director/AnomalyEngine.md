# Director Anomaly Engine

**Document path:** `engines/Director/AnomalyEngine.md`
**Version:** v0.1.0
**Status:** Draft
**Last updated:** 2026-06-28
**Scope:** Director-side support document. This is not a new top-level engine.
**References:** `core/CoreSpec.md` §5.3, §10, §12 / `engines/Director/DirectorEngine.md` §7.5.3, §7.8, §7.11 / `engines/Director/PacingEngine.md` / `engines/Director/ConsequenceEngine.md` / `docs/Beta/Beta02_Result.md`

---

## 1. Purpose

The Anomaly Engine makes the SCP or anomalous entity as memorable and interactive as the NPCs in a scene.

Beta02 identified that anomalies were physically consequential but not experientially distinct. NPCs communicated, warned, and reacted in ways players could read and respond to. The anomaly did not. Players learned about the anomaly through NPC instructions rather than through direct observation of the anomaly's own behavior.

This document defines how the Director manages anomaly behavior across a session: when it acts independently, how players can learn to read it, how it escalates, and how to keep it present without overwhelming play.

This document refines Director behavior only. It does not override CoreSpec hidden-information rules, Resolution Engine outcomes, Shadow Engine handling, NPC Engine autonomy, or player agency rules.

---

## 2. Design Philosophy

### The anomaly is not scenery.

An anomaly that functions only as an environmental hazard or as a subject NPCs describe is scenery. Scenery does not produce memorable sessions. An anomaly becomes memorable when players engage with it directly — observing it, predicting it, responding to it, and making decisions based on what it does.

### The anomaly has readable behavior.

Every anomaly must exhibit at least two observable patterns that players can detect without NPC assistance. These patterns should be consistent enough to reward players who pay attention and flexible enough to escalate as the session progresses.

### The anomaly acts independently.

The anomaly does not wait for players to prompt it. It pursues its own logic — reacting to stimuli, evolving through the session, and maintaining pressure even when players are focused elsewhere.

### NPCs inform; the anomaly teaches.

NPCs may accelerate player understanding of the anomaly, but the anomaly's behavior itself must be the primary teacher. If players can only understand the anomaly through NPC translation, the anomaly has failed as a scene element.

### The anomaly pressures without controlling.

The anomaly makes some options more costly or dangerous. It does not remove player agency, override player decisions, or force predetermined outcomes.

---

## 3. Core Rule

The anomaly must be felt as an active, independent presence in every scenario phase.

In each scene where the anomaly is relevant, the Director must:

1. Show at least one observable anomaly behavior that players can engage or respond to without NPC assistance.
2. Allow the anomaly to react to at least one player action per scene.
3. Advance the anomaly's state independently of player prompts at least once per phase.

---

## 4. Required Concepts

| Concept | Meaning |
|---------|---------|
| Observable behavior | A consistent, perceivable anomaly action that players can detect, track, and reason about through direct observation. |
| Readable pattern | A repeating or escalating anomaly behavior that rewards player attention and enables prediction. |
| Behavior state | The current activity level of the anomaly: dormant, aware, active, or critical. |
| Independent advance | An anomaly state change that occurs without any direct player action as the trigger. |
| Escalation | A rise in anomaly activity, reach, danger, or consequence driven by time, player behavior, or world conditions. |
| De-escalation | A drop in anomaly activity driven by player success, distance, containment, or removal of triggering conditions. |
| Environmental influence | A physical or sensory change in the scene caused by anomaly presence. |
| Psychological influence | A cognitive or perceptual effect on characters caused by anomaly proximity or activity. Described through observable symptoms, never through direct player emotion narration. |
| Interaction window | A period of relative anomaly quiet that gives players time to respond before the next escalation. |

---

## 5. Anomaly Behavior States

The anomaly exists in one of four behavior states at any given time. The Director tracks this state and advances it according to escalation triggers.

### 5.1 Dormant

The anomaly exists but is not actively engaging the scene.

**Director behavior:**
- Describe 1–2 passive environmental effects tied to the anomaly's character.
- Show at least one observable pattern players can register.
- Do not produce immediate danger.

**Examples:** A persistent low vibration. A smell that does not match the environment. A camera that shows empty rooms with faint movement in the corner. A temperature that drops near one specific wall.

**Purpose:** Establish the anomaly's character before it becomes a direct threat. Players who notice the pattern have a meaningful advantage later.

### 5.2 Aware

The anomaly has detected relevant stimuli and is orienting toward the scene.

**Director behavior:**
- Intensify environmental effects.
- Show a new observable behavior that builds on the dormant pattern.
- Begin responding to proximate player actions (equipment, sound, proximity, light) without yet producing direct danger.
- The anomaly's readable pattern should become clearer.

**Examples:** The vibration pulses in response to movement. The smell grows stronger near specific objects. The camera distortion syncs with a 3-second cycle that matches the floor vibration.

**Purpose:** Signal that the anomaly has noticed the scene. Players who respond to this state can shape what follows. Players who ignore it face a steeper escalation.

### 5.3 Active

The anomaly is directly influencing the scene and affecting player options.

**Director behavior:**
- The anomaly takes at least one action per 2–3 player turns.
- Its behavior creates new danger, closes off options, opens new ones, or forces a decision.
- Observable patterns are now consistent enough for players to test predictions.
- Anomaly reactions to player actions are immediate and visible.

**Examples:** The acoustic field pins EM sources to surfaces. The anomaly echoes and amplifies every sound made in its proximity. Approaching a specific point in the room changes what the entity does.

**Purpose:** Make the anomaly the primary scene challenge. Players must engage with it directly — ignoring it has clear costs.

### 5.4 Critical

The anomaly is at maximum activity. Resolution is required.

**Director behavior:**
- The anomaly's effects are immediate, significant, and unavoidable without direct counter-action.
- Environmental influence is at its strongest.
- Players have exactly the information they need to attempt resolution — the anomaly's readable patterns have been fully established in earlier states.
- Do not introduce new hidden information at this state. Resolution should require applying already-observable patterns.

**Purpose:** Force a decision. The anomaly cannot simply be endured — it must be addressed. Players who learned its patterns in earlier states have a path. Players who did not have a harder path but not an impossible one.

---

## 6. Escalation Rules

### 6.1 Escalation Triggers

The Director should advance the anomaly's state when any of the following are true:

- Players have spent 2 or more turns in the anomaly's proximity without engaging it.
- A player action directly interacts with an anomaly-relevant factor (sound, light, EM, proximity, materials, time).
- A scenario phase change occurs.
- The anomaly's established behavior logic would produce a state change at this point.
- The Director determines that the current behavior state has delivered its purpose and the scene requires escalation.

### 6.2 Escalation Pace

Escalation should be gradual enough to give players at least one interaction window between states.

| Transition | Minimum before advancing |
|---|---|
| Dormant → Aware | 1 scene phase, or direct player trigger |
| Aware → Active | 2–4 meaningful player turns, or direct trigger |
| Active → Critical | Scenario-defined condition or sustained escalation trigger |
| Critical → Resolution | Player action achieving defined resolution condition |

Do not rush escalation to fill scene time. An anomaly that reaches Critical in the first three turns leaves no room for players to learn its patterns.

### 6.3 Escalation Must Follow Internal Logic

Escalation must be caused by something that follows from the anomaly's established behavior, the world state, or a player action. Do not escalate because the scene feels slow. Use PacingEngine.md if pacing intervention is needed — anomaly escalation is a scene-logic tool, not a pacing shortcut.

---

## 7. De-escalation and Recovery

The anomaly may de-escalate when:

- Players successfully apply a counter-measure that matches the anomaly's established weakness or pattern.
- The triggering conditions (proximity, equipment, sound, stimulus) are removed.
- Players complete a defined containment action.
- Time passes under conditions the anomaly's logic would associate with reduced activity.

De-escalation should be earned through player action, not automatically granted. The Director should make the cause of de-escalation legible — players should understand what they did that worked.

**Interaction window:** After a major anomaly event (Active or Critical state action), allow at least 1 player turn of relative quiet before the next significant anomaly action. This gives players time to respond, regroup, and make decisions. Sessions with no interaction windows are overwhelming; sessions with too many are boring.

---

## 8. Environmental Influence

The anomaly should alter the physical scene in ways players can perceive without being told.

Environmental influence rules:

- Describe environmental effects through specific, concrete sensory detail. Name the sense (sight, sound, smell, touch, taste), the specific change, and its direction or location.
- Make environmental effects consistent with the anomaly's type and behavior. An acoustic entity produces sound anomalies. A thermal entity alters temperature. A memetic entity alters perception.
- Environmental effects should escalate alongside the anomaly's behavior state.
- At least one environmental effect should be something players can use — a clue to the anomaly's location, nature, or weakness.

**Bad pattern:** "The room feels wrong."

**Good pattern:** "The temperature on the right side of the corridor is 4–5 degrees cooler than the left. The drop is sharpest near the cabinet."

The environmental effect serves double duty: it establishes atmosphere and gives players actionable information.

---

## 9. Psychological Influence

Anomalies may produce perceptual or cognitive effects on characters in proximity.

Rules for describing psychological influence:

- Never narrate what a player character feels, decides, or believes directly. This violates CoreSpec §12.1 and DirectorEngine §7.7.
- Describe observable physical symptoms that imply psychological pressure: trembling hands, dry mouth, involuntary hesitation, sudden disorientation, altered visual or auditory perception.
- Use NPC behavior to convey psychological influence. An NPC who stops mid-sentence, refuses to enter a room, or insists on something irrational communicates anomaly pressure without narrating player character states.
- Describe what the environment does to perception: lights that seem to shift position, sounds that seem to come from behind rather than ahead, reflections that are slightly delayed.

**Bad pattern:** "You feel an overwhelming sense of dread."

**Good pattern:** "Your flashlight seems dimmer than it should be. The hallway ahead looks the same length it did thirty seconds ago. Choi has stopped walking."

---

## 10. Interaction Frequency Rules

### 10.1 Minimum Presence

The anomaly must be referenced in at least 1 out of every 3 meaningful Director responses when the scenario is in a phase where the anomaly is relevant.

The reference may be:
- A new observable behavior
- An environmental change tied to the anomaly
- A reaction to a player action
- An independent state advance

### 10.2 Maximum Density

No more than 2 consecutive major anomaly events without at least 1 interaction window (a turn of relative quiet) between them.

The anomaly should not react to every player action. Minor actions (movement through a different corridor, routine conversation) should produce at most a minor environmental effect, not a full anomaly reaction. Reserve significant reactions for actions that directly involve the anomaly's behavior logic.

### 10.3 Readable Pattern Frequency

The anomaly's consistent behaviors should be visible at least twice before players are expected to use that information to solve a problem. A player cannot apply knowledge they were never given the opportunity to observe.

---

## 11. Limits and Guardrails

The Anomaly Engine must not become forced plot.

The Director must not:

- Force players into a specific action by making all alternatives anomaly-unsafe.
- Use the anomaly to override a successful player choice.
- Advance the anomaly to Critical state before players have seen the readable patterns in Dormant and Aware states.
- Introduce new hidden anomaly behavior at Critical state that players had no prior exposure to.
- Describe anomaly behavior that contradicts established scenario logic.
- Let the anomaly produce consequences that skip the Resolution Engine for actions where uncertainty exists.

The best anomaly interaction gives players a clear observation, a reasonable prediction, a decision with real stakes, and a legible outcome.

---

## 12. Responsibility Boundaries

This document addresses anomaly-specific behavioral rules. It does not replace other sub-engine responsibilities.

| Question | Answered by |
|---|---|
| When should the Director shift pacing? | PacingEngine.md |
| What consequences does a player action produce? | ConsequenceEngine.md |
| What structure does each scene need? | SceneFlowEngine.md |
| How long should responses be? | OutputEngine.md |
| How does the anomaly itself behave over time? | This document |
| What makes the anomaly memorable and readable? | This document |
| How often and how strongly should the anomaly appear? | This document |

Anomaly reactions triggered by player actions are a consequence type (ConsequenceEngine.md §4) and may also serve as a pacing shift (PacingEngine.md §5). This document governs the anomaly's independent behavior — what it does between player actions, how it escalates on its own timeline, and what makes it experientially distinct from other scene elements.

---

## 13. QA Checks

- Did the anomaly appear as an observable presence in every relevant scenario phase?
- Did the anomaly exhibit at least two consistent, readable patterns players could detect without NPC assistance?
- Did the anomaly react to at least one player action per scene?
- Did the anomaly advance its state independently at least once per phase?
- Were escalation triggers rooted in anomaly logic and world state — not in pacing need?
- Did players have at least one interaction window (recovery turn) between major anomaly events?
- Was the anomaly's behavior legible through direct observation before players were expected to apply that knowledge?
- Did the anomaly influence player decisions directly — not only through NPC translation?
- Did the anomaly de-escalate for a reason players could understand?
- Did environmental and psychological influence use specific, sensory, observable detail rather than abstract dread?
- Did the anomaly remain within its established behavior logic throughout the session?
- Did the anomaly reach Critical state only after players had exposure to Dormant and Aware state patterns?

---

**END OF Director Anomaly Engine v0.1.0**
