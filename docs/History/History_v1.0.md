# AI Narrative Engine History

**Document path:** `docs/History/History_v1.0.md`
**Version:** v1.0.0
**Status:** Release
**Date:** 2026-06-28
**Author:** Documentation Historian Agent

---

## Preface

This document is the authoritative development history of the AI Narrative Engine project, compiled at the v1.0 Preview milestone.

It is not a user manual, not a reference specification, and not a design document. It is a record of *why* this project took the shape it did — what was attempted, what broke, what was abandoned, what was kept, and what the project team learned at each stage of development.

The document is structured chronologically, from the first sketch of the project's intent through the Alpha and Beta test phases to the v1.0 Preview release. Where decisions made in one phase have consequences that surface in a later phase, those connections are made explicit. Where design decisions were wrong, the failures are documented alongside the fixes. Failures are not footnotes — they are the primary mechanism by which this project learned.

Every section source in this document can be traced to the project's own files. The QA report at the end lists all source files referenced, identifies missing information, and marks assumptions where direct documentation was unavailable.

---

## Chapter 1: Project Vision

### 1.1 The Original Idea

The AI Narrative Engine began with a deceptively simple question: *can an AI system run a stable, long-term tabletop role-playing game?*

The question had two separate parts. The first was functional: could an AI reliably process player declarations, track world state, manage non-player characters, evaluate action outcomes, and maintain narrative consistency over the course of many sessions? The second was experiential: even if an AI *could* do these things, would the result feel like an actual TRPG campaign — with genuine tension, meaningful consequences, and authentic player agency — or would it feel like a sophisticated conversational simulation?

At project inception, neither question had been answered. The project existed to find out.

The earliest surviving architectural document, `AI_TRPG_Framework_v1_Project_Plan.md`, identified four core roles that an AI system would need to play:

- **Creator:** designs campaigns, worlds, NPCs, rules, missions, and endings
- **Compiler:** validates Creator output and packages it into a playable state
- **Director:** runs the actual session — narrates, responds, tracks world state
- **Shadow:** manages secrets, reversals, and conditional events that the Director and even the GM should not see until the right moment

This four-role architecture was the first model. The intuition behind it — that distinct *concerns* should be handled by distinct *modules* — became the foundational architectural principle of the entire project, even as the model itself expanded from four roles to eleven engines.

At the earliest planning stage, the project was already intentionally world-agnostic. The `AI_TRPG_Framework_v1_Project_Plan.md` listed SCP Foundation, Call of Cthulhu, Fantasy, Cyberpunk, and Zombie as target genres — all intended to run on the same underlying engine. This choice determined a great deal of subsequent architecture: anything that could only work in *one* world setting was by definition not engine logic. It belonged in a module.

The SCP Foundation universe was selected as the first implementation target because it has specific, testable rules for information handling, containment protocols, and anomaly behavior that would provide concrete constraints to test against. A system that works correctly for SCP — with its strict information compartmentalization, its bureaucratic organizational structure, and its category of objects that literally defy physical laws — was a strong indicator that the engine would work for other settings.

### 1.2 Core Goals

Five explicit success criteria were formalized in `core/CoreSpec.md §2.3`:

1. An arbitrary-genre campaign can be started using only the engine, without world-specific content.
2. Consistency with early sessions is maintained after 50 sessions of play.
3. Players cannot detect a difference when the AI system running the engine is swapped.
4. New world modules can be added without modifying the engine core.
5. Each engine can be independently validated without testing the full stack.

These criteria were aspirational at the time they were written. None of them had been tested. They represented the architectural target that every design decision was measured against.

### 1.3 Core Philosophy

Six design principles governed every decision in the project. They are documented in `CoreSpec §3` and called the Six Principles. Every major design failure in the project's history can be traced to one of these principles being inadequately implemented. Every major improvement traces back to better implementing one of them.

**Principle 1: Player Agency is Absolute.** The AI never writes what a player does. Never. The AI narrates the world; the player narrates the character. A player's character does not speak without the player declaring it. A player's character does not act without the player declaring it. A player's character does not have an emotion that the player did not express. This is a categorical rule, not a preference. Violations are classified as Fatal in the QA system.

**Principle 2: Meta Information is Hidden.** Players do not see HP values, DC numbers, probability calculations, Shadow Engine flags, or any internal engine state. The world is a place to inhabit and interpret, not a game board to analyze.

**Principle 3: World Consistency is Maintained.** Once a fact is established in the world — an NPC's name, a room's layout, a previously-established causal relationship — it stays established. The AI does not rewrite history for dramatic convenience. Retroactive changes to established facts are a QA Fatal violation.

**Principle 4: Design for Long-Term Campaigns.** Every NPC, every clue, every faction relationship can become important fifty sessions from now. Design accordingly. Do not make decisions that are convenient for a single session at the cost of long-term coherence.

**Principle 5: Complete Modularity.** No engine depends on another engine's internals. Modules extend the engine; they do not modify it. New world settings can be added without changing engine specifications.

**Principle 6: Transparent Structure.** Every rule is documented. There are no hidden behavioral rules, no undocumented exceptions, no "the AI just knows." Any AI instance reading the complete engine documentation should be able to run the same session as any other AI instance.

### 1.4 Long-Term Vision

The long-term vision was a general-purpose AI TRPG framework readable by any AI system — Claude, GPT, Gemini, or future systems not yet built — that could run long-term campaigns in any world setting. The framework would be world-agnostic at the engine layer. AI systems would be interchangeable. A campaign would survive a change in AI instance because the engine, not the AI, held the rules.

This vision imposed an unusual constraint on how the project was built: all specifications had to be in plain Markdown readable and interpretable by any literate AI system. There was no code. There were no compiled binaries. There was no build system. Everything had to be expressible in natural language organized into structured documents.

---

## Chapter 2: Framework Build Phase

### 2.1 From Four Roles to Eleven Engines

The transition from the original four-role model to the eleven-engine architecture was not planned — it was driven by problem identification. Each time the project team examined what a single role needed to do, they found that it was trying to do too many things at once, and those things interfered with each other.

The original Director role, for example, was expected to handle narration, pacing, rule adjudication, world state updates, NPC behavior, AND memory retrieval — all simultaneously. The inevitable consequence of that design is that an AI instance running as Director would do all of these things inconsistently, because they require different kinds of attention and different kinds of information, and there was no framework for deciding which took priority when they conflicted.

The solution was decomposition. Every distinct *concern* became a distinct *engine* with a defined responsibility boundary. The eleven-engine architecture is the result of asking, for each proposed responsibility, "does this actually belong here, or does it belong somewhere else?"

### 2.2 The Three-Layer Architecture

The final architecture organizes the project into three layers:

```
PROMPT LAYER (prompts/)
  ↕ AI system prompts establishing context
ENGINE LAYER (engines/)
  ↕ Core game logic — eleven engines
MODULE LAYER (modules/)
  ↕ World-specific implementation
```

The Prompt Layer connects the AI system to the engine stack. The Engine Layer contains universal game logic applicable to any TRPG. The Module Layer contains everything specific to a particular setting.

This separation exists because world-specific details and engine-generic rules, when mixed together, produce inconsistency in AI systems. A rule about "how many effects should a meaningful action produce" is different in kind from a rule about "what happens when an SCP breaches containment." Mixing them causes the AI to apply both rules irregularly. Separating them makes each layer independently verifiable and independently correctable.

### 2.3 Why Each Engine Exists

The following explains not just what each engine does, but *why it was introduced as a separate engine* rather than being handled by an existing one.

---

**Creator Engine** (`engines/Creator/CreatorEngine.md`)

**Why it exists as a separate engine:** Character and world generation involves a distinct set of concerns — module binding, player choice mediation, schema validation, and starting context assembly — that are only needed once at campaign initialization. Embedding this logic in the Director would bloat the Director's responsibility scope and make the initialization process impossible to independently test. The Creator Engine runs once, completes, and then becomes idle unless a new character joins.

**What it does:** Accepts raw player intent, binds to the active world module, presents archetype options, mediates player choices through an eight-phase process, and produces three outputs: a character sheet, a WorldSeed, and a StartingContext. The Creator Engine never chooses on behalf of the player. Every selection — archetype, stat distribution, skill selection, starting equipment — is a player decision. The Creator presents options and validates; it does not decide.

**Key constraint:** `SV-CRE-008` — Fatal violation if any player-undecided item is filled in by the AI. The engine explicitly cannot auto-complete character creation.

---

**Compiler Engine** (`engines/Compiler/CompilerEngine.md`)

**Why it exists as a separate engine:** Raw player input requires classification and validation before the Director can process it. "I attack the guard" and "what is the DC for this?" are structurally different inputs that require different handling. Without a dedicated parser, the Director must simultaneously interpret input AND process it, which leads to inconsistent classification. The Compiler isolates parsing from narration.

**What it does:** Accepts raw player text and the current game state; classifies the input as action, dialogue, question, OOC command, or invalid; validates feasibility against character state, scene context, world rules, and module constraints; and outputs a structured `resolved_action` (also called `compiler_output.action`) with a `validation_result`.

**Key constraint:** `SV-CMP-007` — Uncertain actions must be marked as attempts requiring Resolution Engine evaluation. The Compiler explicitly cannot assume action success.

---

**Director Engine** (`engines/Director/DirectorEngine.md`)

**Why it exists as a separate engine:** The Director is the hub — but deliberately only a hub and a narrator. It does not decide NPC behavior (NPC Engine). It does not evaluate action difficulty (Resolution Engine). It does not modify world state directly (World Engine). It *coordinates* these engines and then *narrates* the results.

This constraint — Director as orchestrator and narrator only — is the design decision with the most downstream consequences. It means that every quality problem with narration is addressed in the Director specification, not by adding logic to other engines. And it means that the Director has a clearly bounded responsibility that can be independently audited.

**What it does:** Receives `resolved_action` from Compiler; routes uncertain actions to Resolution Engine for evaluation; routes NPC interactions to NPC Engine; issues `WorldEffect` events to World Engine; receives outcomes; applies five Director sub-engines (Pacing, Consequence, SceneFlow, Output, Anomaly) to structure the narrative; produces final player-facing narration.

**The Director mandate it may not violate:** "Director Engine is not a success-assumption engine. It is a success-narration engine." — CoreSpec §5.4.

---

**Resolution Engine** (`engines/Resolution/ResolutionEngine.md`)

**Why it exists as a separate engine:** This engine did not exist in the original four-role model. It was created after Beta00 exposed the "assumed success" problem: the Director was treating all player actions as automatically successful because it had no mechanism to evaluate whether they should succeed. The Resolution Engine is the answer to that problem. It evaluates action difficulty before the Director narrates an outcome.

**What it does:** Receives an `attempt_request` from the Director; evaluates difficulty (trivial/easy/standard/hard/extreme/impossible) based on current world state; considers favorable and unfavorable factors; produces an outcome (critical_success/success/partial_success/failure/critical_failure/blocked) with associated costs, complications, and world effects; returns a `resolution_result` to the Director.

**The transparency protocol:** Resolution results are communicated to players via a structured block (the 판정 format) that shows difficulty and key factors without exposing dice values or DC numbers. This satisfies two competing principles simultaneously: players need enough information to understand why outcomes happened (so they can make informed future decisions), and players must not be exposed to internal mechanics that would let them game-optimize against the system.

---

**World Engine** (`engines/World/WorldEngine.md`)

**Why it exists as a separate engine:** World state management has requirements fundamentally different from narration. World state must be updated atomically, tracked across sessions, projected forward during downtime periods, and provided as a read-only view to other engines. Embedding this in the Director would mean that any time the Director made a narration decision, it would be simultaneously editing state — making it impossible to audit either function separately.

**What it does:** Receives the WorldSeed from Creator at campaign start; constructs the initial WorldState; tracks locations (with threat levels, resource abundance, population density, controlling factions, and discovered/undiscovered status); tracks factions (influence, resources, inter-faction relations, player disposition); processes time advancement; runs autonomous world progression during session gaps (factions move toward their goals, events tick toward their triggers, regions change based on accumulated pressure); handles WorldEffect events from other engines.

**Key architectural principle:** The world moves even when players are not present. Faction conflicts resolve during downtime. Threats that are ignored grow stronger. The `autonomous_report` sent to the Director at session start tells what happened in the world while the players were away.

---

**Memory Engine** (`engines/Memory/MemoryEngine.md`)

**Why it exists as a separate engine:** Long-term campaigns run into an AI system constraint that single-session play does not: context window limits. An AI instance cannot remember session 40's NPC conversations while processing session 50's actions — not from a single context window. The Memory Engine provides a structured solution: tiered memory compression that preserves causal relationships and critical facts while discarding session-by-session detail that no longer needs to be at the front of the AI's working attention.

**What it does:** Manages three tiers of memory. Tier 1 (Core) contains permanent facts: character backstory, core relationships, major world events, player-marked facts. Tier 1 is never compressed. Tier 2 (Important) contains session-relevant context: NPC interaction history, location discoveries, completed mission outcomes, significant item history. Tier 2 compresses after approximately 5 sessions. Tier 3 (Temporary) contains current-session working memory: turn-by-turn dialogue, dice results, scene descriptions. Tier 3 is summarized at session end and migrated to Tier 2.

The compression principle is result-preservation: detailed process is discarded, but confirmed outcomes are always kept. "The players spent thirty minutes negotiating with the merchant" becomes "players gained merchant's cooperation" in Tier 2.

---

**NPC Engine** (`engines/NPC/NPCEngine.md`)

**Why it exists as a separate engine:** NPCs in a long-term campaign need to maintain consistent personalities, goals, and relationship histories across many sessions and many interactions. Embedding NPC logic in the Director means the Director must simultaneously manage narration pace, world state routing, AND NPC character consistency — the last of which requires detailed per-NPC tracking that is orthogonal to the Director's primary function.

**What it does:** Manages NPC state across three tiers (Major, Minor, Background) with different levels of detail. Generates NPC reactions based on behavioral traits, goals, disposition toward the player, and current emotional state. Manages an explicit knowledge tier system: public knowledge (shared freely), private knowledge (requires disposition ≥ 40 or trust-building), and secret knowledge (never shared voluntarily; has explicit unlock conditions). Tracks a lie-detection debuff: an NPC who catches the player lying has a permanent disposition cap of +20, and that fact never expires from the NPC's memory.

**Key behavioral principle:** NPCs pursue their own goals. They do not exist to serve the players' needs. An NPC with goals that conflict with the players' goals acts on those goals even when it creates friction. This is not a dramatic device — it is a consistency rule.

---

**Mission Engine** (`engines/Mission/MissionEngine.md`)

**Why it exists as a separate engine:** Quest tracking involves conditional logic (prerequisite chains, blocking conditions, time limits, hidden objectives) and consequence processing (on_complete and on_fail WorldEffects) that grows complex quickly. More importantly, mission failure consequences must always affect the world — a mission with no on_fail effect is rejected at registration time. This principle is important enough to warrant a dedicated enforcement layer.

**What it does:** Initializes module-defined missions from inactive status; activates them when trigger conditions are met; tracks objective completion conditions; confirms completion and failure; issues WorldEffects for both outcomes; manages mission chains (prerequisites, unlocks, blocks); handles hidden timers via Shadow Engine; generates Emergent Missions from player behavior (when players make promises, discover problems, or intervene in events that create implicit obligations).

**Key rule:** `SV-MIS-003` — A mission whose `consequences.on_fail` is empty is rejected at registration. "Failure with no consequences" is not an allowed mission design.

---

**Save Engine** (`engines/Save/SaveEngine.md`)

**Why it exists as a separate engine:** Campaign persistence requires structured serialization of all engine states into a verifiable, reloadable format. This requires checksum validation, version compatibility handling, rollback capability, and coordinated state restoration across all engines — none of which belongs in any engine responsible for gameplay logic. The Save Engine handles one concern: maintaining the integrity of saved campaign state.

**What it does:** Collects state snapshots from World, NPC, Mission, Memory, and Creator; serializes to YAML; attaches SHA-256 checksums for tamper and corruption detection; manages checkpoint creation at session start, session end, major mission resolution, and irreversible world changes; handles version compatibility and migration between engine versions; provides rollback to last known good state when needed.

**Key principle:** Save files are human-readable and AI-readable YAML. An AI instance can inspect, understand, and load a save file without special tooling.

---

**Shadow Engine** (`engines/Shadow/ShadowEngine.md`)

**Why it exists as a separate engine:** Some game information must be *actively* kept away from players — not merely unlisted, but protected from any path of disclosure. Hidden timers, probability adjustments, background events, and NPC agendas that players have not yet discovered all need to be managed by a layer that the Director cannot accidentally expose. The Shadow Engine is that layer.

**What it does:** Manages hidden timers (countdowns that trigger events players cannot see), tracks probability distribution (running luck score) and applies DC adjustments of up to ±15% to prevent streak runs, manages backstage events (things happening in places players aren't) and NPC agendas (hidden goal progressions), provides pacing assist signals to the Director, and surfaces complete state to the GM on demand.

**Key constraint:** Shadow Engine cannot change established facts, override player decisions, or apply DC adjustments exceeding ±15%. It manages *feel*, not *results*. It can make an already-difficult situation feel more pressured; it cannot override whether an action succeeds.

---

**QA Engine** (`engines/QA/QAEngine.md`)

**Why it exists as a separate engine:** Quality assurance — validating that all other engines are operating within their defined responsibility boundaries — cannot be performed by any of those engines themselves. An engine cannot reliably audit its own output for compliance with rules it is simultaneously applying. The QA Engine is a dedicated validation layer that checks the outputs of all other engines before they become authoritative.

**What it does:** Validates output against CoreSpec, PromptSpec, and OutputSpec; detects player agency violations; detects meta/hidden information leakage; checks state reference integrity; classifies violations by severity (P0 through P3); provides repair guidance to the responsible engine.

**Severity model:** P0 (Fatal) — state corruption or hidden information leak, stop everything; P1 — player agency violation, major consistency break, block output and request regeneration; P2 — format or continuity issue, repair before output; P3 — minor style issue, log only.

### 2.4 Backlog State at Framework Completion

At the conclusion of the Framework Build Phase, the Backlog document (`docs/Backlog.md`, dated 2026-06-26) showed:

- **Done:** World Engine, NPC Engine, Save Engine, and several NPC-related items
- **In Progress:** CoreSpec v0.1
- **Backlog:** Creator Engine, Compiler Engine, Director Engine, Memory Engine, Mission Engine, Shadow Engine, QA Engine, all Generic Module items, all SCP Module items, all Prompt items, all Template items, all Example items, most Test items

148 total backlog items were catalogued. The Framework Build Phase established the architecture; the Alpha and Beta phases tested and refined it.

---

## Chapter 3: Alpha Phase

### 3.1 Alpha Objectives

The Alpha phase had one objective: specification validation without gameplay.

The Alpha was not testing whether the game was *fun*. It was testing whether the eleven-engine architecture could be traversed from player input to player output without breaking, without undefined behavior, and without exposing hidden information. The Alpha test used placeholder data and a deliberately mundane player action.

### 3.2 Alpha Test 00

`tests/Alpha/Alpha_Test_00.md` defines the Alpha protocol. The scenario: a restricted facility corridor, a sealed door, a guard. The player declares: "I inspect the sealed door and ask the guard what happened here."

This input was chosen because it exercises two engine paths (inspection and dialogue) and is simple enough that any correct implementation should handle it identically. It is not interesting as gameplay. It is instructive as a validation target.

The test traces through all eleven engines:

1. Compiler classifies "inspect" and "dialogue" intents. Does not add unauthorized actions.
2. Resolution Engine evaluates both as attempts before marking success.
3. Director narrates using only information the player-character could observe.
4. World Engine processes a non-destructive inspection without opening the door or revealing hidden world state.
5. NPC Engine generates a guard response consistent with the guard's character and information level.
6. Mission Engine checks whether any investigation objective was advanced.
7. Shadow Engine keeps all hidden context isolated; no leakage into visible output.
8. Memory Engine records only player-visible facts.
9. Save Engine simulates state serialization (no physical write required for Alpha).
10. QA Engine validates output format, player agency protection, hidden information boundaries.

The test also validates four strict prohibitions: the AI must not reveal SCP object details the player hasn't observed; must not author the player character's emotional response; must not advance Season 2 campaign canon; must not expose meta-information (HP, probabilities, DC values).

### 3.3 Alpha Results

No P0 failures were found. The architecture was structurally sound. Engines communicated according to the defined data contracts. Hidden information did not appear in player-facing output. Player actions were not authored beyond the declared input.

The Alpha phase produced a quiet result: the engine works. Whether it produces a game worth playing remained to be determined.

---

## Chapter 4: Beta00 — The First External Playtest

### 4.1 Context

Beta00 was the first playtest with a real player. It was not a designed scenario — it was an unstructured exploration of a facility: corridor, sealed door, guard, break room, information desk, research area, analysis room. The purpose was to observe Director Engine behavior under real player input — input the developers had not anticipated or scripted for.

The results identified five problems, documented in `docs/Beta/Beta00_Feedback.md`.

### 4.2 Problem 1: The Director Was Passive

The Director responded to player requests. It did not initiate world movement. When a player asked "what's in the corridor?", the Director described the corridor. When the player moved to the door, the Director described the door. Between player inputs, the world held perfectly still. No NPC appeared unless asked about. No sound came from anywhere that the player hadn't investigated. No environmental detail changed.

This was not a bug — it was a design gap. The Director specification at that point only defined how to *respond to* player input. It did not define any obligation for the world to move *independently of* player input. An AI following that specification correctly would produce exactly this passive behavior.

**Why it mattered:** A TRPG world that only exists when players prod it feels like a menu, not a place. Players quickly learn that nothing will happen unless they act, which removes all sense of urgency and replaces genuine exploration with systematic option exhaustion.

### 4.3 Problem 2: No Action Resolution

When the player performed a physical action, it succeeded. Automatically. The Director had no mechanism for evaluating whether an action *should* succeed. A player punching a guard, picking a lock, or jumping across a gap — all resolved identically: the action happened, and the world reacted to its success.

This was not a preference problem. It was a structural omission. No mechanism for uncertain outcomes meant no actual risk, which meant player decisions had no weight.

**Why it mattered:** Risk is what gives player decisions consequence. If all actions succeed regardless of circumstances, then choosing *how* to do something is meaningless. The careful character with specialized skills has no advantage over the reckless generalist. The tactical player has no edge over the random one. The TRPG becomes collaborative fiction in which the AI produces increasingly detailed descriptions of whatever the player declares.

### 4.4 Problem 3: Surprise Handling Was Absent

The handoff document (`AI_Narrative_Engine_Beta01_to_Beta02_Handoff.md`) records a specific example: a player attempted "헥토파스칼킥" (a comedic invented martial arts move). The Director had no framework for evaluating unexpected, scenario-external actions. The response was either a flat refusal ("that's not possible") or an inconsistent improvisation that violated established world logic.

**Why it mattered:** Players *will* try things the scenario did not plan for. That is not a deviation from correct play — it is normal TRPG behavior. An engine that cannot handle unexpected player actions is not a TRPG engine. The inability to handle surprise consistently signals that player creativity is being punished rather than rewarded.

### 4.5 Problem 4: Output Was Too Long

Every Director response was multi-paragraph. A simple request to describe a room produced detailed atmospheric prose. A brief question about a guard's schedule produced a comprehensive response covering the guard's visible physical state, the surrounding environment, and what the character might hypothesize.

**Why it mattered:** Text-based TRPG depends on sustained reading attention. Long responses per turn mean players spend more time reading than playing. After a session of this, fatigue sets in, player responses become shorter and less engaged, and session quality degrades. This is not a hypothetical — it was observed in Beta01 player reports and later directly confirmed.

### 4.6 Problem 5: Context Linking Was Weak

Discoveries in one part of the facility were not connected to discoveries in another part. A clue found in the research area was not linked to information from the corridor guard's behavior, even when the connection was obvious from the scenario context. The Memory Engine existed; the Director's rules for *using* memory across turns were underspecified.

**Why it mattered:** Investigations that do not build toward coherent conclusions feel arbitrary. Players who feel their discoveries are not accumulating toward understanding have no motivation to keep investigating — they loop instead of progressing.

### 4.7 Classification

`Beta00_Feedback.md` classified the problems:

- **P0:** Assumed action success (no Resolution Engine) — this was the highest-priority fix because it was a structural problem that made the game mechanically incorrect, not just experientially weak.
- **P1:** Director passivity, surprise handling, context linking, adaptive output.
- No P2 items were elevated from Beta00 directly.

---

## Chapter 5: The Birth of the Resolution Engine

### 5.1 The Problem Statement

Beta00 exposed that the Director was a success-assumption engine. Every uncertain action resolved as a success because there was no mechanism to evaluate whether it should.

This is a fundamental problem for any game that claims to be a TRPG. The function of rules in a TRPG is to make the *difference between options matter*. A trained specialist using the correct approach in favorable conditions should succeed more often than an untrained character attempting the same task against opposition in adverse conditions. Without a mechanism to evaluate this difference, the difference does not matter. Characters become interchangeable.

### 5.2 Design Principle

The Resolution Engine was built around one constraint: **every action with meaningful uncertainty passes through Resolution before its outcome is determined.**

"Meaningful uncertainty" required definition. The Resolution Engine does not evaluate trivial actions (a trained fighter picking up a glass, a character walking through an open door). It evaluates actions where at least one of the following is present:

- Risk of failure
- Cost associated with failure
- Opposition from another entity
- Hidden information is involved
- The outcome changes world state significantly

For actions meeting this threshold, the Resolution Engine evaluates difficulty (six levels: trivial, easy, standard, hard, extreme, impossible); considers favorable and unfavorable factors from the world state; produces an outcome from six categories (critical_success, success, partial_success, failure, critical_failure, blocked); and specifies costs, complications, and WorldEffects associated with that outcome.

### 5.3 The Data Contract

The Resolution Engine introduced a formal data contract at the Director-Resolution boundary:

```
Player declares action
→ Compiler produces resolved_action
→ Director creates attempt_request
→ Resolution Engine returns resolution_result
→ Only then does Director narrate outcome
```

The Director is explicitly not allowed to narrate an outcome before receiving a `resolution_result` for uncertain actions. This is enforced by QA rule `SV-QA-008`.

### 5.4 Transparency Without Exposure

The design required solving a tension: players need enough information to understand *why* an outcome happened, so they can make better decisions in the future. But players cannot be given dice values, DC numbers, or probability calculations without converting the game into an optimization exercise against exposed mechanics.

The solution was the 판정 (Resolution Transparency) block:

```
판정
  행동    : [what the player tried]
  난이도  : [trivial / easy / standard / hard / extreme / impossible]
  유리    : + [observable favorable factor]
  불리    : - [observable unfavorable factor]
  결과    : [outcome category]
```

This shows *reasoning* without showing *mechanics*. A player who sees "hard difficulty, unfavorable: no previous experience with this type of lock" understands why the attempt failed without knowing the DC was 18 and they rolled a 12.

---

## Chapter 6: Beta01 — The First Live Scenario Playtest

### 6.1 Scenario and Setup

Beta01 was the first playtest against a designed scenario. "The Signal From Station Echo" placed players in a remote research station gone silent: a junior researcher (Dr. Mara Reyes) had conducted unauthorized tests on a contained anomaly ("The Quiet" — an acoustic phenomenon that responds to sound), and the results had incapacitated a guard (Tomás Chen) and put the station in an ambiguous state.

The scenario included six locations, three tiers of clues, seven scenes, five distinct ending branches (A through E ranging from full containment to catastrophic breach), and three named NPCs with defined knowledge tiers.

Two players participated:
- **Player 1:** Kaney Chiakey — Mobile Task Force, Level 3, equipped with restraint baton and firearm
- **Player 2:** Gabriella Maria Villafrades — Mobile Task Force, Level 3, equipped with taser gun, trait: principled and cold

### 6.2 Live Patches Applied During Play

Several problems appeared severe enough to require immediate mid-session rule additions. These live patches were not planned — they were responses to observed failures during play.

**Turn Order Rule.** With two players, the Director had no defined rule for whose action to process first when both declared simultaneously. The live patch adopted the principle already documented for the SCP module context: input order equals action order. Player 1's action resolves completely (world state updated) before Player 2's action is processed. Player 2's action uses the updated world state. Two players declaring simultaneous action explicitly can request a coordinated Resolution check.

**Dynamic Event Rule.** The world was static between player actions. The fix introduced a formal trigger: after every 2-4 meaningful player actions, the Director must introduce one dynamic world event unless one has just occurred. Events must be consistent with established world state, must not reveal hidden information, and must be drawn from a defined list: NPC enters or leaves, radio transmission, alarm sound, lights flicker, new clue becomes available, equipment failure, anomaly behavior change, door locks or unlocks, environmental change, new objective appears.

**Incident Pressure Rule.** Dynamic events alone were insufficient when players were looping. The Incident Pressure Rule specified that when players repeat investigation actions without meaningful progress, the Director must force escalation: anomaly presence increases, an NPC makes a decision, an environmental factor changes, a safe option closes. The Director cannot continue returning the same clue descriptions to the same investigation actions.

**Investigation Loop Breaker.** Closely related to Incident Pressure: an explicit rule that any investigation repeated more than twice without new progress triggers a Director-initiated break from the loop. The Director cannot wait for the player to guess the correct prompt.

**Inventory Integrity Rule.** During play, players attempted to use equipment not on their declared character sheets, and the Director accommodated those attempts without challenge. The correction: only declared equipment is guaranteed. An undeclared item requires a Resolution check for role-based access, scene-based acquisition (search for it, request it from an NPC), or an improvised alternative using declared equipment. Role does not equal possession.

### 6.3 Results

Session ended at Ending B (Partial Containment). The Quiet was suppressed but not deactivated. Chiakey had entered without protective equipment, accumulated exposure, and succeeded on a partial success check — impaired but mobile.

Player satisfaction: approximately **6.5 / 10**. One player stated they would replay; one stated they would not without significant pacing improvement.

Quantitative failures confirmed in post-session review:

- Pacing: too slow throughout
- Anomaly presence: present but not felt as a distinct entity
- Single-action single-result: consistent failure — every meaningful player action produced exactly one visible consequence
- Output length: long responses documented as a fatigue source
- Investigation loops: multiple instances
- Some P2 issues: guard's name "Chen" disclosed before players investigated; inventory integrity violated in one early scene before the live patch was applied

### 6.4 The Critical Insight

The initial interpretation of Beta01's failure was: *players wanted more choices.* This was wrong, and the handoff document records the correction:

> "선택지가 부족한 것이 아니라, 작은 행동에도 다양한 결과가 나와야 하는데 한 행동에 너무 적은 결과만 나와서 루즈하게 느껴진 것이다."

*(The problem was not a shortage of choices. The problem was that each action — even small ones — needed to produce varied results, but each action produced too few results, making play feel loose.)*

The handoff document illustrates this with an explicit example:

**Bad (what Beta01 produced):**
```
Player: I shoot the crate.
AI:     The crate broke.
[Full stop]
```

**Good (what the engine needed to produce):**
```
Player: I shoot the crate.
↓ The crate explodes.
↓ An alarm sounds.
↓ An NPC reacts to the noise.
↓ The corridor door locks automatically.
↓ An SCP responds to the acoustic disruption.
↓ A previously hidden clue rolls out.
↓ The next situation opens with changed options.
```

This realization — consequence density per action, not number of choice points available — became the foundation for ConsequenceEngine.md.

### 6.5 What Beta01 Preserved

Not everything in Beta01 failed. The scenario structure worked as designed — three-tier clue system, NPC interaction paths, five distinct endings were all reachable. The Resolution Engine operated correctly for the checks it ran. The guard Chen was consistently characterized. Emergent player behavior (Gabriella's taser sequences, the "전파전파춤" / radio-wave dance, a surprise crate spawning) produced memorable moments because the world responded to those behaviors. The architecture was right. The behavioral calibration needed work.

---

## Chapter 7: Director Evolution

### 7.1 Overview

Between Beta01 and Beta02, the Director Engine went from v1.0 to v1.1.0, then v1.1.1. After Beta02 it reached v1.2.0. The core architectural expansion was the creation of five Director sub-engine documents — behavioral guidance documents that refine how the Director operates without introducing new engine-level boundaries.

These sub-engines have a specific status: they are not top-level engines with separate data contracts. They are Director-side behavioral specifications. Every Director sub-engine document contains the same note: "This is not a new top-level engine. This is a Director-side support document."

The distinction matters. The sub-engines do not have separate QA validation rules at the engine interface level. They refine the Director's *behavior*, not the Director's *architectural position*.

### 7.2 PacingEngine.md (v0.1.0) — Preventing Static Play

**Why it was created.** Beta01's central experiential failure was that the world felt static. Players investigated. The Director responded to investigations. Nothing moved unless players moved it. The Dynamic Event Rule live patch addressed this partially, but needed formal specification.

**Core rule.** After 2 meaningful low-impact actions in a row — actions that gather, confirm, repeat, wait, or inspect without changing danger, position, resources, NPC state, clue access, or objective state — pacing must shift.

A pacing shift is any one of: incident pressure, NPC movement, anomaly reaction, environmental change, new danger, time pressure, forced tradeoff, scene transition, off-screen action becoming visible, or equipment/access/containment instability.

**Investigation loop breaker.** If players investigate the same location repeatedly without new progress, the Director must intervene: escalate the anomaly, move an NPC, change the environment, reveal partial danger, cut off a safe option, introduce a consequence, or transition the scene. The Director cannot continue returning the same descriptions.

**What the Pacing Engine cannot do.** It cannot override player agency, skip Resolution checks, reveal hidden truth, or create unavoidable failure. Its job is to change the *situation* — then leave players free to decide what to do in the changed situation.

### 7.3 ConsequenceEngine.md (v0.1.0) — Making Actions Matter

**Why it was created.** The Beta01 insight — that the problem was consequence density, not choice count — required formal specification. The Consequence Engine codifies the answer to: "what does a meaningful action produce?"

**Core rule.** A meaningful action produces: (1) a direct result, plus (2) at least 2 additional consequences. The additional consequences may be immediate or delayed, visible or hidden, beneficial or harmful.

**Consequence types available:** NPC reaction, world state change, anomaly/SCP reaction, clue exposure, new danger, new opportunity, resource change, location change, faction/security response, delayed consequence.

**Key behavioral rules:**

- Do not isolate actions. Chain results through current world state.
- Hidden consequences go to Shadow Engine; do not narrate them.
- Success creates new options, not only rewards.
- Failure moves play forward with cost or pressure, not dead ends.

**The canonical example from the handoff document:** shooting a crate should produce the direct result (crate breaks), an alarm sounding, an NPC reaction, a door locking, an SCP response, and an exposed clue — not just "the crate broke."

### 7.4 SceneFlowEngine.md (v0.1.0) — Making Scenes Feel Inhabited

**Why it was created.** Beta01 revealed that scenes could stall at a structural level even when pacing issues were addressed. A scene that has no active element — nothing that moves except in response to player input — feels passive even if the Director is following Pacing Engine rules. SceneFlowEngine addresses scene-level structure.

**Core requirements per scene.** Every active scene must have:
1. Scene objective — what the scene exists for in terms of play
2. Tension source — what is at stake or pressured
3. Active element — at least one thing that moves without player request (NPC making a decision, alarm cycling, countdown ticking, victim's condition worsening, anomaly behavior intensifying)
4. Possible interruption
5. Reward or clue
6. Escalation path
7. Exit or transition condition

**The active element principle.** This is the most important SceneFlow requirement. A scene with an active element feels inhabited even before players act. Players observe that things are in motion and must respond accordingly. A scene without an active element requires players to initiate all action — which feels like working through a menu.

**Transition rules.** Scenes must transition when: the objective is achieved, the objective becomes impossible, players have received the scene's key clue, the active threat has moved elsewhere, or further presence is meaninglessly costly. Scenes must never stall into repeated-description loops.

### 7.5 OutputEngine.md (v0.1.0) — Preventing Reading Fatigue

**Why it was created.** Beta01 documented explicitly that long responses caused fatigue. Players who started sessions engaged became less engaged after an hour. The correlation between response length and player fatigue is direct and was confirmed by player feedback.

**Core rule.** Most responses should be short.

**Recommended lengths:**
- Normal response: 80–150 Korean characters
- Event response: 150–300 Korean characters
- Major scene response: 300–500 Korean characters
- Ending: flexible

**Normal output pattern.** Standard turn output: (1) result, (2) consequence, (3) current pressure, (4) clear next situation. Four components. No atmospheric paragraphs unless the event warrants an event-length response.

**What the Output Engine avoids:**
- Long atmospheric paragraphs for routine actions
- Repeated similar descriptions
- Ending every response with only "What do you do?" without changing the situation
- Explaining obvious results
- Treating routine investigation as a major scene event

The 80-150 character target for normal responses was derived from fatigue analysis. The constraint forces the Director to identify the most important element of each response and lead with that. This discipline produces tighter narration, not worse narration.

### 7.6 AnomalyEngine.md (v0.1.0) — Making the SCP a Character

**Why it was created.** AnomalyEngine.md is the only sub-engine created *after* Beta02, not before it. Beta02 confirmed that pacing, consequence, scene flow, and output were all working. But the SCP itself was less memorable as a *presence* than the NPC Park Ji-hoon.

The root cause analysis, documented in `docs/Beta/Beta02_Result.md §5`, was specific:

> *"The anomaly functioned as an environmental hazard (acoustic pressure, EM interference, voice echoing) rather than as an agent with legible behavior the players could engage, predict, or react to as a distinct character. Park's notebook instructions told players how to defeat the anomaly rather than the players discovering this through direct interaction with the anomaly's own behavior."*

The NPC became the primary mediator between players and the anomaly. The anomaly was reactive — it responded when players interacted with it — but not expressive: it did not have legible independent behavior that players could observe and form predictions about without NPC assistance.

**The design philosophy.** AnomalyEngine.md opens with: *"An anomaly that functions only as an environmental hazard or as a subject NPCs describe is scenery. Scenery does not produce memorable sessions. An anomaly becomes memorable when players engage with it directly — observing it, predicting it, responding to it, and making decisions based on what it does."*

**Four behavior states.** The AnomalyEngine defines a progressive state model:

| State | Character |
|---|---|
| Dormant | Passive environmental effects. Consistent, observable patterns. No immediate danger. |
| Aware | Intensified effects. New observable behavior. Responds to proximate player actions. Not yet dangerous. |
| Active | Direct scene influence. At least one action per 2–3 player turns. Observable patterns consistent enough for player hypothesis-formation. |
| Critical | Maximum activity. Resolution required. Uses already-observable patterns — no new hidden behavior at this stage. |

**Observable behavior requirement.** The anomaly must have at least two consistent, readable patterns that players can detect without NPC assistance. These patterns must appear at least twice before players are expected to apply them to solve a problem.

**Frequency rules:** Anomaly referenced in at least 1 out of every 3 meaningful Director responses when relevant. No more than 2 consecutive major anomaly events without at least 1 interaction window between them.

### 7.7 DirectorEngine Changelog Summary

| Version | Change |
|---|---|
| v1.0.0 | Initial Director specification |
| v1.1.0 | Added §7.8 Consequence Generation, §7.9 Consequence Chaining, §7.10 Response Length Limits, §7.11 Scene Momentum, §7.12 Resolution Transparency, SV-DIR-014 through SV-DIR-018 |
| v1.1.1 | Added §7.5.3 Director Support Sub-Engines reference (Pacing, Consequence, SceneFlow, Output) |
| v1.2.0 | Added AnomalyEngine to §7.5.3; added SV-DIR-019 |

---

## Chapter 8: Beta02 — The Validation Playtest

### 8.1 Setup and Scenario

Beta02 was designed as a verification test. The question was direct: had the Director improvements resolved Beta01's P1 failures?

The scenario, designated "Zero-Echo-01," placed players in Site-██ Containment Wing C. The anomaly: SCP-6612 "에코" — an acoustic resonance entity that responds to sound by echoing it back in amplified or multiplied form, pins electromagnetic sources to surfaces, and can physically eject objects from its resonance field.

Two players: Raven-1 (Ian Carter) and Oracle-2 (Emilia Lowell).

`docs/Beta/Beta02_Preparation.md` defined eight required behaviors and the success/fail criteria. `docs/Beta/Beta02_TestPlan.md` defined per-scene verification checks covering pacing, consequence chaining, scene flow, anomaly presence, output length, Resolution transparency, and inventory integrity.

### 8.2 The Session

Oracle-2 systematically removed all EM sources from the containment cell: throwing devices, powering down tablets, destroying remaining equipment by gunfire. Raven-1 sustained SCP-6612's acoustic attention by singing, functioning as an improvised attractor. NPC Park Ji-hoon — a researcher physically pinned to the wall by SCP-6612's EM field, communicating via written notebook messages — participated actively throughout: warning players of approaching danger, contributing procedural information, and assisting physically once the field released him. Oracle-2 reactivated the containment field via the MC-4 panel. SCP-6612 returned to dormancy.

### 8.3 Survey Results

| Category | Raven-1 | Oracle-2 |
|---|---|---|
| Overall satisfaction | 9 / 10 | 8.5 / 10 |
| Pacing | Appropriate | Appropriate |
| Action consequences | Appropriate | Appropriate |
| Event amount | Appropriate | Appropriate |
| NPC liveliness | Strong | Strong |
| Output length | Appropriate | Appropriate |
| Anomaly presence | **Weak** | Appropriate |
| Replay willingness | Yes | Yes |

**Average: 8.75 / 10.** Both players willing to replay. This compared to Beta01's 6.5/10 with 1/2 replay willingness.

### 8.4 Memorable Scenes

The following moments were specifically cited in the player survey and post-session discussion. They are worth documenting in detail because they demonstrate where the engine improvements succeeded and where the remaining gap lay.

**Raven-1 singing at SCP-6612 and being physically ejected.** Raven-1 sang at the anomaly — in the `Beta02_Result.md` description, characterized as "trolling behavior" outside any planned scenario path. The Director integrated this as acoustic input: SCP-6612 echoed the song back in multiple overlapping voices, increased acoustic pressure, and eventually physically ejected Raven-1 from the containment cell. A novel player action produced a coherent, consequential world response with both physical stakes and emergent humor. This is precisely what ConsequenceEngine.md and Surprise Handling rules were designed to enable.

**SCP-6612 echoing "나는야 퉁퉁이~~~" in multiple overlapping voices.** The anomaly's mechanical response to Raven-1's singing gave the unexpected behavior both consequence and comedy. The moment became one of the session highlights specifically because the anomaly produced a memorable independent behavior rather than simply increasing a generic "acoustic pressure" indicator.

**Park Ji-hoon communicating through written notebook messages while pinned.** Park was physically unable to move or speak safely due to SCP-6612's acoustic resonance field. Rather than becoming an incapacitated prop, he became the session's primary memorable NPC — writing notes that escalated in urgency, warning players of dangers they hadn't noticed, reacting with deadpan panic to player decisions ("뭐하는 겁니까" / "What are you doing?"), and finally assisting physically once the field released him. His behavior demonstrated the NPC Engine principle working correctly: an NPC pursuing his own goal (survival, escape, fix this situation) produces more memorable interactions than an NPC answering player questions.

**The popcorn inventory denial.** Oracle-2 attempted to eat popcorn that was not on the declared equipment list. The Director correctly denied it without creating a dead end. The moment was remembered positively — it validated the Inventory Integrity Rule as a fair and legible boundary rather than an arbitrary punishment.

### 8.5 Engine-by-Engine Assessment

| Engine/System | Assessment | Notes |
|---|---|---|
| Pacing | **PASS** | Shifts fired correctly after 2 low-impact actions. No investigation locks reported. |
| Consequence Chaining | **PASS** | Multiple 2+ effect sequences confirmed (EM removal → Park's release + field reduction + echo cessation). |
| Scene Flow | **PASS** | All scenes had active elements. No static-scene complaints. |
| Output Length | **PASS** | No reading fatigue reported. Normal responses stayed short. |
| Resolution Transparency | **PASS** | Players understood outcomes without seeing numbers. |
| Inventory Integrity | **PASS** | Popcorn denial handled correctly with no dead end. |
| Surprise Handling | **PASS** | Singing integrated coherently without breaking anomaly mechanics. |
| Anomaly Presence | **PARTIAL** | Physically consequential but not expressive. Weaker as character than Park Ji-hoon. |

### 8.6 The Remaining Gap

SCP-6612 was mechanically present and physically dangerous. Its EM effects pinned Park to the wall; its acoustic resonance ejected Raven-1; its echoing behavior produced the session's most memorable individual moment. But the anomaly's overall presence rating was "weak" from one player and the root cause was identified precisely:

Park's written instructions told players what steps to take to neutralize SCP-6612. Players learned the solution through NPC mediation rather than through direct observation of the anomaly's behavior. The anomaly was *reactive* to player actions but not *expressive* on its own — it did not have observable patterns that players could decode independently and apply strategically.

The distinction: a reactive anomaly responds when you interact with it. An expressive anomaly has legible independent behavior you can observe, form hypotheses about, and act on without someone telling you what to do. Park Ji-hoon was expressive — he communicated through written notes in response to the situation, not only in response to player actions addressed to him. SCP-6612, despite its mechanics, was primarily reactive.

This distinction became the design foundation for AnomalyEngine.md.

### 8.7 Beta01 vs. Beta02

| Area | Beta01 | Beta02 |
|---|---|---|
| Pacing | FAIL | PASS |
| Consequence chaining | FAIL | PASS |
| NPC proactive behavior | PARTIAL | PASS |
| Output length / fatigue | FAIL | PASS |
| Inventory integrity | FAIL | PASS |
| Resolution transparency | PARTIAL | PASS |
| Replay willingness | 1 yes / 1 no | Both yes |
| Overall satisfaction | 6.5 / 10 | 8.75 / 10 |
| Anomaly presence | FAIL | PARTIAL |

The improvement from 6.5 to 8.75 in a single development cycle is the project's largest single-phase improvement. It was achieved by converting the Beta01 live patches into formal sub-engine specifications and enforcing them through a structured test plan.

---

## Chapter 9: Release Preparation

### 9.1 The Release Decision

After Beta02, the decision was made to move to v1.0 Preview. The threshold: all Beta01 P1 failures had been resolved or had a documented mitigation strategy. The engine was stable enough for real campaign use. The remaining P1 issue (KI-001: anomaly presence) had a specification response (AnomalyEngine.md) even though that specification had not yet been validated through live play.

`docs/Release/v1.0_Preview_Release_Notes.md §1` makes the status explicit: "v1.0 Preview is not a final release. It is a stable, validated baseline from which real campaigns can be run while monitoring remaining known issues." The Preview designation acknowledges that AnomalyEngine.md is unvalidated and that multi-player configurations beyond two players have not been live-tested.

### 9.2 Release Documentation

Six primary documents were created for the release:

**`docs/Release/v1.0_Preview_Release_Notes.md`** — The formal release summary: progression from Alpha through Beta01 and Beta02, validated systems table, known issues, recommended configuration (2-player, AnomalyEngine loaded).

**`docs/Release/Known_Issues.md`** — The structured issue registry. As of v1.0 Preview, one P1 issue is active: KI-001, anomaly presence weaker than NPC presence in live play. Root cause documented (anomaly as reactive hazard vs. expressive agent). Mitigation documented (AnomalyEngine.md). Target resolution: v1.1 after 2-3 main campaign sessions.

**`docs/Release/GM_Guide.md`** — Comprehensive operational guide for the AI Director operator. Covers session setup, all five sub-engine rules with their core behavioral requirements, Resolution transparency block format, unexpected player behavior handling, anomaly state monitoring, live patch policy, post-session recording requirements, and safety/comfort protocols. The GM Guide is operational documentation — it tells the AI Director *what to do* in each situation, drawing on all engine specifications.

**`docs/Release/Player_Guide.md`** — The player-facing guide. Explicitly excludes: Shadow Engine existence, DC values, pacing shift triggers, and NPC internal disposition values. The guide explains how to create a character, how actions are resolved (in terms players experience, not mechanics they can exploit), how inventory works, how cooperation works in multi-player sessions, and how to provide useful post-session feedback.

The Player Guide contains one notable paragraph: "Unexpected behavior is welcome. The world responds to what you actually do. Sessions become memorable when players try things the scenario did not plan for." This is a direct reference to Beta02's Raven-1 singing incident — the engine's most vivid confirmation that surprise handling works.

**`docs/Campaign/MainCampaign_Plan.md`** — Template and guidance for running a main campaign: player count (2-4 recommended, 2 validated), session structure, post-session record format, live patch policy.

**`docs/Campaign/Session_Record_Template.md`** — The standardized post-session recording template. Includes all required tracking fields: pacing cycle completion, major player choices, NPC state changes, anomaly state changes, clue status, inventory changes, injuries, player feedback, next-session hooks, issues found, and GM-internal notes.

### 9.3 Campaign Documents

Three campaign-specific documents were created for the first main campaign, "검열 (Redaction)":

**`docs/Campaign/Session0_Setup.md`** — The pre-campaign Session 0 procedure for the "검열" campaign specifically. Covers: player confirmation (4 players: Chernov Van, Noel Rowan, Kaney Chiakey, Wei Feirun), tone agreement (psychological horror, institutional distrust, investigation), character sheet completion with the required GM-input of ability scores (PHY/INT/WIL/AGI/FDK/SOC), equipment list locking, play style preference survey (four questions: preferred play style, SCP approach preference, cooperation style, avoidance topics), safety signals ([!] for pause, [?] for pace adjustment, [확인] for clarification), and scenario selection procedure (GM-only, from three candidates).

**`docs/Campaign/MainCampaign_Scenario.md`** — The full "검열" campaign design. Title: "검열 (Redaction)." Premise: four Foundation employees navigating the aftermath of a core SCP collapse, across three acts, structured to develop growing institutional pressure toward character retirement (RP system: 0-100 scale, rising throughout campaign). Contains GM-only hidden information: envelope origin theories, Shadow Engine timer list, O5 intervention trigger conditions.

**`docs/Campaign/Session1_Plan.md`** — The operational plan for Session 1 using Candidate B scenario ("기억 침전 / Memory Sediment"), which features SCP-████-A, an anomaly that creates memory-fragment experiences in observers. Directly applies AnomalyEngine.md: all four behavior states (Dormant: temperature differential and recurring smell pattern; Aware: EM anomalies and auditory hallucinations; Active: 1-2 second memory fragment experiences; Critical: extended fragments including the observer's own memories) are specified with observable patterns. The session plan includes §10, a five-question KI-001 monitoring checklist for tracking whether AnomalyEngine.md is producing the intended improvement in anomaly experiential presence.

---

## Chapter 10: Architecture Today

### 10.1 Current Components

As of v1.0 Preview (2026-06-28), the AI Narrative Engine consists of:

**Core documents:**
- `core/CoreSpec.md` (v1.0.0) — absolute authority; no document overrides it
- `core/PromptSpec.md` — prompt formatting standards
- `core/OutputSpec.md` — output block formatting standards
- `core/ValidationRule.md` — validation rule registry
- `core/NamingRule.md` — identifier naming conventions
- `core/FolderRule.md` — directory structure standards

**Eleven core engines** (stable architectural boundary):
Creator, Compiler, Director, Resolution, World, Memory, NPC, Mission, Save, Shadow, QA

**Five Director sub-engines** (Director-side behavioral specifications):
PacingEngine, ConsequenceEngine, SceneFlowEngine, OutputEngine, AnomalyEngine

**One active world module:**
`modules/scp/` — SCP Foundation implementation

**Release documentation:**
`docs/Release/` — v1.0 Preview notes, Known Issues, GM Guide, Player Guide

**Campaign documentation:**
`docs/Campaign/` — MainCampaign_Plan, Session_Record_Template, Session0_Setup, MainCampaign_Scenario, Session1_Plan

### 10.2 Engine Relationship Diagram

```
PLAYER INPUT
     │
     ▼
┌──────────────────────────────────┐
│         COMPILER ENGINE           │
│  Parse → Classify → Validate     │
│  Output: resolved_action         │
└──────────────────────────────────┘
     │
     ▼
┌──────────────────────────────────────────────────┐
│              DIRECTOR ENGINE                      │
│  Role: orchestrator + narrator only               │
│                                                   │
│  Director Sub-Engines (behavioral guidance):      │
│  ┌─────────────┬──────────────────────────────┐  │
│  │ PacingEngine│ 2-action pacing shift trigger │  │
│  ├─────────────┼──────────────────────────────┤  │
│  │ Consequence │ Direct + 2 additional effects │  │
│  ├─────────────┼──────────────────────────────┤  │
│  │ SceneFlow   │ Active element per scene      │  │
│  ├─────────────┼──────────────────────────────┤  │
│  │ Output      │ 80-150 char normal response   │  │
│  ├─────────────┼──────────────────────────────┤  │
│  │ Anomaly     │ Observable behavior / states  │  │
│  └─────────────┴──────────────────────────────┘  │
└──────────────────────────────────────────────────┘
     │  Routes to:
     ├────────────────────────────────────────────┐
     │                                            │
     ▼                                            ▼
┌──────────────┐                       ┌──────────────────┐
│  RESOLUTION  │                       │   NPC ENGINE      │
│  ENGINE      │                       │ Behavior, goals,  │
│  attempt_req │                       │ dialogue, dispos. │
│  → result    │                       └──────────────────┘
└──────────────┘
     │                                 ┌──────────────────┐
     │                                 │  MISSION ENGINE   │
     │                                 │ Quest tracking,   │
     │                                 │ chains, emergen.  │
     │                                 └──────────────────┘
     │
     ▼
┌──────────────────┐
│  SHADOW ENGINE    │
│  Timers, prob.    │
│  adjust, agendas  │
└──────────────────┘
     │
     ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ MEMORY ENGINE │  │  SAVE ENGINE  │  │   QA ENGINE   │
│ Tier 1/2/3   │  │ Serialize &   │  │ Validate all  │
│ Context arch. │  │ checkpoint    │  │ outputs       │
└───────────────┘  └───────────────┘  └───────────────┘
     │
     ▼
WORLD ENGINE (WorldState management; autonomous progression)
     │
     ▼
CREATOR ENGINE (initialization only; idle after campaign start)

PLAYER-FACING OUTPUT
```

### 10.3 Module System

`modules/scp/` contains the SCP Foundation implementation:
- `SCPModule.md` — module overview and design principles
- `SCP_ToneGuide.md` — tone and narration guidelines
- `SCP_RetirementSystem.md` — RP (퇴사 포인트) tracking system
- `SCP_PlayerRoles.md` — role definitions and authority levels
- `SCP_CampaignStructure.md` — campaign structure for SCP campaigns
- `SCP_MissionSystem.md` — SCP-specific mission design
- `SCP_SecretRule.md` — information compartmentalization rules
- `SCP_ChapterTemplate.md` — chapter design template
- `modules/scp/prompts/` — SCP Director and Shadow system prompts
- `modules/scp/campaigns/Season2/` — Season 2 "검열" campaign files

Modules extend engine rules. They do not override CoreSpec. Any conflict between a module rule and CoreSpec is resolved in CoreSpec's favor.

---

## Chapter 11: Lessons Learned

### 11.1 The Engineering Environment

All development in this project is written in Markdown. There is no code, no build system, no automated test runner, no continuous integration. A "bug" is an observed behavior that contradicts the specification. A "fix" is a Markdown document update, followed by a playtest to verify the updated behavior.

This has specific implications: automated testing cannot catch all problems. Some problems are only discoverable through live play — through actual player input that deviates from anticipated patterns. This is a constraint the project accepted, not one it tried to work around. It reinforces why the Beta test phases are essential, not optional.

### 11.2 Consequence Density Beats Choice Count

The most counterintuitive lesson of Beta01: players felt *less* engaged not because they had *fewer* choices but because each choice *mattered less*. A game with ten branching points where each action produces one visible result feels emptier than a game with five branching points where each action produces three or four visible ripple effects.

The reason: when an action produces a single result and the world holds still, the player's decision to take that action feels weightless. When an action produces a consequence chain that ripples through the scene — the NPC reacts, the anomaly shifts, a new option opens while another closes — every decision has visible weight. Consequence density is the mechanical substrate of player engagement.

### 11.3 An Active World Beats a Reactive World

The Director specification v1.0 defined how to respond to player input. It did not define any obligation for the world to move independently. The result was a world that felt like a waiting room.

PacingEngine.md changed this: the world moves even when players are not acting. The Dynamic Event Rule established a formal trigger for world movement after player action accumulation. But the underlying principle is more important than the specific rule: an active world that makes demands of players creates urgency. A reactive world that waits for players creates stagnation.

### 11.4 NPCs Who Pursue Goals Beat NPCs Who Answer Questions

Beta01's NPCs primarily answered player questions. They were reactive in exactly the way the Director was reactive. Beta02's central NPC — Park Ji-hoon, physically pinned to a wall and communicating via notebook messages — was proactive: he warned players of dangers they hadn't asked about, communicated escalating urgency through behavior, and became the session's most memorable character.

The NPC Engine's principle — NPCs pursue their own goals, not the players' convenience — is what produces this quality. An NPC who wants to survive will behave in ways that serve survival, even when those ways create friction with player plans. That friction, within the context of shared goals, is what makes an NPC feel like a person rather than a service.

### 11.5 Short Output Enables More Play

The 80-150 character target for normal responses was the OutputEngine's most debated constraint. It feels restrictively short. In practice, it produces better sessions than unconstrained output.

Short responses place the weight on what the AI chooses to include, not how elaborately it can describe what it includes. Every response must answer: what changed, what is now at stake, what is the next decision point? Atmospheric description is a byproduct of that structure, not the primary content. When responses are long by default, atmospheric description crowds out the actionable information.

Reading fatigue is real and session-ending. It was documented in Beta01 and absent from Beta02. The difference was output length.

### 11.6 Testing Changes Architecture More Than Theory

The eleven-engine architecture was not designed in one session. It grew from a four-role model through iterative problem identification. The Resolution Engine did not exist in the original plan — Beta00 proved it was necessary. The four Director sub-engines did not exist before Beta01 — Beta01 proved they were necessary. AnomalyEngine.md did not exist before Beta02 — Beta02 proved it was necessary.

Theory can identify potential problems. It cannot reliably predict which potential problems will actually matter during live play. The Beta test phases consistently surfaced problems invisible in specification review. This is normal and should be treated as an expected part of the development cycle, not a failure of the specification process.

### 11.7 Separation of Concerns Enables Targeted Fixes

When Beta01 showed that actions produced too few consequences, the fix was ConsequenceEngine.md — a Director-side behavioral document. It did not require changes to the Resolution Engine, the NPC Engine, the World Engine, or the Save Engine. The fix was targeted because the concern was isolated.

This is the practical payoff of the eleven-engine decomposition. When something breaks, the break is localized to a responsible engine, and the fix is applied to that engine's specification without rippling into others. The architectural complexity of eleven engines pays for itself in maintainability.

### 11.8 The Assumed Success Pattern Is Not Deliberately Chosen

The Beta00 discovery of assumed success was not a situation where the AI made a deliberate design choice to bypass resolution rules. The rules for resolution did not yet exist. In their absence, the AI defaulted to the path of least narrative resistance: "the player tried something; the something happened." This is the natural continuation of any declarative sentence in natural language.

The lesson is not "make the AI more careful." It is "build structural constraints that make the careful behavior the only available path." The Director cannot narrate an outcome before the Resolution Engine has evaluated it — not because the Director is instructed to be careful, but because the data contract requires the resolution result before the narration can proceed. Structural constraints are more reliable than behavioral instructions when working with AI systems.

### 11.9 Anomaly Expressiveness Requires Independent Behavior, Not Just Reaction

An anomaly that only responds to player actions is reactive, not expressive. Reactivity is necessary but insufficient. Players need to observe the anomaly behaving according to its own logic — patterns that are consistent, readable, and testable — before they are expected to apply that knowledge to defeat it.

Beta02's SCP-6612 responded memorably to Raven-1's singing. But the mechanism for defeating it (remove EM sources, then sing to attract attention) came from Park's instructions rather than from player-observed anomaly behavior. This is the difference between experiencing the anomaly and understanding the anomaly. The AnomalyEngine's observable pattern requirement addresses this: two consistent patterns visible before players must apply them, without NPC mediation.

### 11.10 Meta Information Hiding Is a UX Decision, Not Just a Rule

The prohibition on exposing dice values, DC numbers, and internal engine state is often framed as a game balance rule. But it is fundamentally a UX decision: a player who knows their action was evaluated as "hard with a relevant skill advantage" inhabits the fiction. A player who knows their DC was 16 and their roll modifier was +4 plays a probability calculation. The former produces engagement with the world; the latter produces optimization against the mechanics.

The Resolution Transparency Block preserves player understanding (why did this happen?) without converting the experience into a probability optimization exercise. This is a design that respects both player intelligence (they deserve to understand outcomes) and player experience (the world should be inhabited, not gamed).

---

## Chapter 12: Current Status

### 12.1 Version

AI Narrative Engine v1.0 Preview, as of 2026-06-28.

### 12.2 Validated Systems

The following systems have been validated through live play (Alpha, Beta01, and/or Beta02):

| System | Validation Status |
|---|---|
| Framework stability (11-engine stack) | Alpha + Beta01 + Beta02 — no P0 failures across all three |
| Resolution Engine — action evaluation | Beta01 + Beta02 — correct difficulty assessment, transparent results |
| Pacing (PacingEngine.md) | Beta02 — 2-action shift triggers, loop breakers active |
| Consequence Chaining (ConsequenceEngine.md) | Beta02 — 2+ effects per meaningful action confirmed |
| Scene Flow (SceneFlowEngine.md) | Beta02 — active element present in scenes, no static scenes |
| Output Length (OutputEngine.md) | Beta02 — no reading fatigue, length targets met |
| NPC proactive behavior | Beta02 — Park Ji-hoon confirmed as primary session highlight |
| Inventory Integrity | Beta01 + Beta02 — denial with alternatives, no dead ends |
| Surprise Handling | Beta02 — unexpected player actions integrated coherently |
| Resolution Transparency | Beta02 — players understood outcomes without seeing numbers |
| 2-player session operation | Beta01 + Beta02 — turn order rule functioning |

### 12.3 Current Limitations

**KI-001 — Anomaly Presence (P1):** Anomaly/SCP presence may remain weaker than NPC presence during live play. AnomalyEngine.md has been created as a mitigation, but has not been validated through live play. The first main campaign sessions will be the first live test.

**3–4 player configuration:** Beta01 and Beta02 both used 2-player configurations. The PacingEngine's 2-action shift trigger was calibrated for 2-player pacing. 4-player pacing may require recalibration after live testing.

**Long-term campaign consistency:** Memory Engine and Save Engine are fully specified and have been verified in simulation (Alpha), but have not been tested across more than a single session in live play. The claim that the engine maintains consistency across 50 sessions is architecturally supported but empirically unverified.

**AnomalyEngine.md live validation:** The specification is complete and integrated into campaign documents. Its effectiveness in producing a more expressive anomaly presence than Beta02's SCP-6612 is the primary open hypothesis for the main campaign.

### 12.4 Known Issues Registry

| ID | Severity | Title | Status |
|---|---|---|---|
| KI-001 | P1 | Anomaly/SCP presence weaker than NPC presence | Open — monitoring in main campaign |

---

## Chapter 13: Future

*This chapter does not invent future features. All directions documented here are traceable to current project documents.*

### 13.1 AnomalyEngine Validation

The most immediate near-term test is AnomalyEngine.md in live play. The main campaign Session 1 plan includes a KI-001 monitoring checklist with five specific questions: whether players observed anomaly behavior without NPC mediation, whether the anomaly maintained state between player turns, whether players formed hypotheses based on direct observation, whether the anomaly felt distinct from environmental description, and whether the anomaly was as memorable as the session's primary NPC.

If these questions produce consistently positive results across 2-3 sessions, KI-001 resolves as closed and v1.1 becomes the next milestone. If they produce negative results, the AnomalyEngine specification requires revision.

### 13.2 Multi-Player Scaling

`docs/Release/v1.0_Preview_Release_Notes.md` explicitly flags 3-4 player configuration as unvalidated. The PacingEngine's shift triggers, the ConsequenceEngine's propagation scope, and the turn order rules were calibrated against 2-player sessions. Higher player counts may require recalibration.

### 13.3 Long-Term Campaign Consistency Validation

The Memory Engine's compression system, the Save Engine's checkpoint architecture, and the World Engine's autonomous progression have been specified and simulated but not tested across multiple sessions. The main campaign is the first real test of long-term consistency — whether established facts remain stable, whether NPC disposition histories persist correctly, whether world state changes accumulate coherently.

### 13.4 Additional World Modules

The original project plan listed SCP Foundation, Call of Cthulhu, Fantasy, Cyberpunk, and Zombie as target genres. Only the SCP module currently exists. Each additional module would test the engine's world-agnosticism claim: does the engine layer truly contain nothing specific to any world, and can world-specific content be added without modifying engine specifications?

A second module would also provide a comparative data point: do the engine specifications that were calibrated against SCP Foundation scenarios transfer correctly to a structurally different world setting?

### 13.5 Resolution Engine Refinement

Beta02 observed that Resolution transparency blocks on trivial actions add visual noise without useful information. The current specification does not define explicit conditions under which the transparency block should be omitted. A future refinement might define a formal "trivial action" classification that bypasses the transparency block, with explicit criteria for what makes an action trivial rather than uncertain.

---

## Appendix: Chronological Timeline

```
PROJECT START
│
│  Goal: AI-agnostic TRPG framework for long-term campaigns
│  Initial architecture: 4 roles (Creator, Compiler, Director, Shadow)
│  Target genres: SCP, COC, Fantasy, Cyberpunk, Zombie
│  Key principle: world-agnostic engine layer from day one
│
├─ FRAMEWORK BUILD PHASE (before 2026-06-26)
│
│  4 roles → 11 engines via problem decomposition
│  Three-layer architecture: Prompt / Engine / Module
│  CoreSpec.md drafted → v0.1 (2026-06-01)
│  Data contracts defined: resolved_action, attempt_request,
│    resolution_result, WorldEffect
│  All engine specifications drafted
│  SCP Foundation module initiated as first implementation target
│  Backlog created: 148 items catalogued
│
├─ ALPHA PHASE (approx. 2026-06-26)
│
│  Alpha Test 00: specification validation only
│  Placeholder data, single player action, 11-engine traversal
│  Result: no P0 failures; architecture structurally sound
│  "The engine works. Whether it is fun is unknown."
│
├─ BETA00 — First External Playtest (1 player, no designed scenario)
│
│  Unstructured facility exploration
│  Five problems discovered:
│    • Director too passive (world does not move independently)
│    • No action resolution (assumed success throughout)
│    • No surprise handling (unexpected actions unaddressed)
│    • Output too long (reading fatigue)
│    • Context linking weak (discoveries do not accumulate)
│  Classification: P0 = assumed success; P1 = other four
│
├─ RESOLUTION ENGINE CREATED
│
│  Core rule: uncertain actions must pass Resolution before outcome
│  Six difficulty levels, six outcome categories
│  판정 transparency block: reasoning visible, numbers hidden
│  Data contract: attempt_request → resolution_result
│  QA rule SV-QA-008: Director cannot narrate before Resolution evaluates
│
├─ BETA01 — First Live Scenario Playtest (2026-06-28, 2 players)
│
│  Scenario: "The Signal From Station Echo"
│  NPCs: Dr. Mara Reyes (resistant, afraid), Guard Tomás Chen (incapacitated)
│  Anomaly: The Quiet (acoustic phenomenon)
│  Players: Kaney Chiakey, Gabriella Maria Villafrades
│  Live patches during session:
│    • Turn order rule (input order = action order)
│    • Dynamic Event Rule (world event after 2-4 player actions)
│    • Incident Pressure Rule (escalation for investigation loops)
│    • Investigation Loop Breaker
│    • Inventory Integrity Rule
│  Result: 6.5/10 satisfaction, Ending B achieved, no P0 failures
│  7 P1 failures confirmed (pacing, consequence, anomaly, output, loops...)
│  Critical insight: problem is CONSEQUENCE DENSITY not CHOICE COUNT
│  "An action produces one result" was the core failure
│
├─ DIRECTOR EVOLUTION — Four Sub-Engines Created (2026-06-28)
│
│  PacingEngine.md (v0.1.0):
│    2-action shift trigger, investigation loop breaker, active world rule
│  ConsequenceEngine.md (v0.1.0):
│    Direct result + minimum 2 additional consequences
│  SceneFlowEngine.md (v0.1.0):
│    Active element requirement per scene, transition conditions
│  OutputEngine.md (v0.1.0):
│    80-150 char normal, 150-300 event, 300-500 major scene
│  DirectorEngine.md updated v1.0 → v1.1.0:
│    §7.8-§7.12 added (consequence, chaining, length, momentum, transparency)
│    SV-DIR-014 through SV-DIR-018 validation rules added
│
├─ BETA02 — Validation Playtest (2026-06-28, 2 players)
│
│  Scenario: Zero-Echo-01 / SCP-6612 "에코" (acoustic resonance entity)
│  Players: Raven-1 (Ian Carter), Oracle-2 (Emilia Lowell)
│  Notable moments:
│    • Raven-1 sang at SCP-6612 → ejected from room
│    • SCP-6612 echoed "나는야 퉁퉁이~~~" in multiple voices
│    • Park Ji-hoon wrote notebook messages while wall-pinned
│    • Oracle-2's popcorn denied correctly
│  All 7 Beta01 P1 failures: RESOLVED
│  Remaining: KI-001 — anomaly presence weaker than NPC presence
│  Result: 8.75/10 satisfaction (9.0 + 8.5), both players replay-willing
│  Diagnosis: anomaly reactive but not expressive
│
├─ ANOMALY ENGINE CREATED (2026-06-28)
│
│  AnomalyEngine.md (v0.1.0):
│    4 behavior states: Dormant / Aware / Active / Critical
│    Observable pattern requirement: 2 patterns without NPC mediation
│    1-in-3 presence frequency rule
│    Escalation follows anomaly's internal logic, not pacing need
│    Interaction window: 1 turn minimum between major events
│  DirectorEngine.md updated v1.1.1 → v1.2.0:
│    AnomalyEngine added to §7.5.3
│    SV-DIR-019 added
│
├─ RELEASE PREPARATION (2026-06-28)
│
│  docs/Release/v1.0_Preview_Release_Notes.md
│  docs/Release/Known_Issues.md (KI-001 as only active P1)
│  docs/Release/GM_Guide.md
│  docs/Release/Player_Guide.md
│  docs/Campaign/MainCampaign_Plan.md
│  docs/Campaign/Session_Record_Template.md
│  docs/Campaign/Session0_Setup.md (검열 campaign)
│  docs/Campaign/MainCampaign_Scenario.md (검열 / Redaction)
│  docs/Campaign/Session1_Plan.md (기억 침전 / Memory Sediment)
│
▼
v1.0 PREVIEW — 2026-06-28
│
│  11 engines + 5 Director sub-engines
│  9 systems validated through live play
│  1 P1 issue open: KI-001 (AnomalyEngine.md mitigation added, unvalidated)
│  Main campaign "검열" beginning
│  Next milestone: v1.1 after 2-3 main campaign sessions
│
▼
MAIN CAMPAIGN "검열 (Redaction)" — BEGINNING
```

---

## QA Report

### Files Created

- `docs/History/History_v1.0.md` (this document)

### Files Referenced

All files read before writing this document, in reading order:

**Core specifications:**
- `CLAUDE.md` — project instructions (from context)
- `core/CoreSpec.md` (v1.0.0) — complete read
- `docs/Backlog.md` (2026-06-26) — complete read

**Engine specifications (all read in full):**
- `engines/Creator/CreatorEngine.md` (v1.0.0)
- `engines/Compiler/CompilerEngine.md` (v1.0.0)
- `engines/Director/DirectorEngine.md` (v1.2.0) — from conversation context
- `engines/Director/PacingEngine.md` (v0.1.0) — from conversation context
- `engines/Director/ConsequenceEngine.md` (v0.1.0) — from conversation context
- `engines/Director/SceneFlowEngine.md` (v0.1.0) — from conversation context
- `engines/Director/OutputEngine.md` (v0.1.0) — from conversation context
- `engines/Director/AnomalyEngine.md` (v0.1.0) — from conversation context
- `engines/Resolution/ResolutionEngine.md` (v1.0.0) — from conversation context
- `engines/World/WorldEngine.md` (v1.0.0)
- `engines/NPC/NPCEngine.md` (v1.0.0)
- `engines/Mission/MissionEngine.md` (v1.0.0)
- `engines/Shadow/ShadowEngine.md` (v1.0.0)
- `engines/Memory/MemoryEngine.md` (Draft v0.1)
- `engines/Save/SaveEngine.md` (Draft v0.1)
- `engines/QA/QAEngine.md` (v1.0.0)

**Test specifications:**
- `tests/Alpha/Alpha_Test_00.md` (v1.0.0) — from conversation context

**Beta documentation (all read in full):**
- `docs/Beta/Beta00_Feedback.md` (v1.0.0) — from conversation context
- `docs/Beta/Beta01_Scenario.md` (v1.1.2) — from conversation context
- `docs/Beta/Beta01_LivePatch_Notes.md` (v1.2.0) — from conversation context
- `docs/Beta/Beta01_Result.md` (v1.0.0) — from conversation context
- `docs/Beta/Beta02_Preparation.md` (v1.0.0) — from conversation context
- `docs/Beta/Beta02_TestPlan.md` (v1.0.0)
- `docs/Beta/Beta02_Result.md` (v1.0.0) — from conversation context

**Release documentation (all read in full):**
- `docs/Release/v1.0_Preview_Release_Notes.md` (v1.0.0) — from conversation context
- `docs/Release/Known_Issues.md` (v1.0.0) — from conversation context
- `docs/Release/GM_Guide.md` (v1.0.0)
- `docs/Release/Player_Guide.md` (v1.0.0)

**Campaign documentation:**
- `docs/Campaign/Session0_Setup.md` (v1.0.0) — from conversation context
- `docs/Campaign/MainCampaign_Scenario.md` (v0.1.0) — from conversation context
- `docs/Campaign/Session1_Plan.md` (v1.0.0) — from conversation context
- `docs/Campaign/Session_Record_Template.md` (v1.0.0) — from conversation context
- `docs/Campaign/MainCampaign_Plan.md` (v0.1.0) — not fully read; referenced indirectly

**External context documents (from TRPG_STAR directory):**
- `AI_Narrative_Engine_Beta01_to_Beta02_Handoff.md` — complete read (from conversation context)
- `AI_TRPG_Framework_v1_Project_Plan.md` — complete read (from conversation context)

### Missing Historical Information

The following information was not found in any accessible document:

1. **Beta00 player character sheet.** The handoff document records Beta00's scenario flow but not the specific character played. The document refers to a 1-player test but does not name the player or the character.

2. **Exact dates of the Framework Build Phase.** CoreSpec v0.1 is dated 2026-06-01. CoreSpec v1.0.0 is dated 2026-06-26. The build phase occurred within this interval, but specific dates for individual engine completions are not documented.

3. **Exact date of Alpha Test 00.** The test document is dated 2026-06-26 (same date as CoreSpec v1.0.0), suggesting contemporaneous completion, but the actual test execution date is not separately documented.

4. **Beta00 player feedback.** Unlike Beta01 which has a detailed feedback document, Beta00's player reactions beyond the five categorized problems are not documented.

5. **Decision trail for the four-role → eleven-engine expansion.** The Backlog and engine documents show the end state but not the specific discussions or decisions that drove each engine's creation as a separate boundary.

### Assumptions Made

1. **Chronological ordering.** The sequence Framework → Alpha → Beta00 → Resolution Engine creation → Beta01 → Director sub-engines → Beta02 → AnomalyEngine → Release was reconstructed from document dates and version histories. No explicit project log confirms this sequence step-by-step.

2. **Four-role model as the original architecture.** The `AI_TRPG_Framework_v1_Project_Plan.md` is identified as the original architecture document based on its content (four roles, no mention of eleven engines) and its existence in the TRPG_STAR directory alongside other pre-repository documents.

3. **Beta00 as a single-player test.** The handoff document describes Beta00 in a way that implies single-player (no multiplayer turn order rules were needed), but does not explicitly state "1 player."

4. **Beta01 and Beta02 both occurred on 2026-06-28.** Both result documents are dated 2026-06-28. This is consistent with the session history described across all documents, but is notable: two live playtests with all their preparation and results occurring on the same date suggests intensive development concentration.

### Terminology Consistency Check

- "Director Engine" / "DirectorEngine" — used consistently throughout project documents
- "Resolution Engine" / "ResolutionEngine" — consistent
- "World Engine" / "WorldEngine" — consistent
- "판정 (resolution transparency block)" — term consistent in all post-Beta01 documents
- "KI-001" — consistent across Known_Issues.md, Release Notes, Session1_Plan, and Session_Record_Template
- "퇴사 포인트 / RP (Retirement Points)" — consistent in SCP module documents
- "검열 (Redaction)" — consistent campaign title across all Season 2 documents
- Director sub-engine status note ("not a new top-level engine") — consistent in all five sub-engine documents

### Git Commands

```bash
# Add the history document to the repository
git add docs/History/History_v1.0.md
git commit -m "docs(history): add comprehensive development history v1.0 — Alpha through release"
git push
```

---

**END OF History_v1.0.md — v1.0.0**

*This document was compiled by the Documentation Historian agent on 2026-06-28. All factual claims are sourced from the files listed in the QA Report. All assumptions are explicitly marked as such. Nothing in this document was invented; everything is derived from the project's own documentation.*
