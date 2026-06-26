# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**AI Narrative Engine** is a general-purpose TRPG (Tabletop RPG) engine designed for AI systems (Claude, GPT, Gemini) to create and run long-term campaigns. This is **not** a world-building project — it is a reusable, modular game engine that is world-agnostic.

Current status: Draft v0.1 (specification-first, all content in Markdown).

**Always read `core/CoreSpec.md` before starting any work.** It is the highest-priority document in the repository; no other document overrides it.

---

## Core Philosophy

1. Respect player agency — AI never writes player actions
2. AI does not expose meta-information to players
3. All worlds maintain internal consistency
4. Designed for long-term campaigns, not one-shots
5. All systems must be modular and reusable

---

## Development Rules

- **All development is written in Markdown.** There is no code, no build system, and no test runner.
- Documents must be designed for reuse across different world settings.
- Nothing may be coupled to a specific world (e.g., SCP Foundation).

---

## Architecture

The engine is organized into three layers:

### Engine Layer (`engines/`)
Ten modular engines, each responsible for a discrete function:

| Engine | Responsibility |
|--------|---------------|
| `Creator/` | Character and world generation |
| `Compiler/` | Parsing and validation of game state |
| `Director/` | Scene narration and pacing |
| `World/` | World state and environment |
| `Memory/` | Campaign history and long-term context |
| `NPC/` | NPC behavior and dialogue |
| `Mission/` | Quest and objective tracking |
| `Save/` | Game state persistence |
| `Shadow/` | Hidden/behind-the-scenes mechanics |
| `QA/` | Quality assurance and consistency checks |

### Module Layer (`modules/`)
Domain-specific implementations that apply engines to a particular world setting:
- `modules/generic/` — World-agnostic, reusable game mechanics
- `modules/scp/` — SCP Foundation universe implementation

### Prompt Layer (`prompts/`)
- `prompts/system/00_Master_SystemPrompt.md` — The master system prompt that establishes AI context

---

## Directory Map

```
core/          ← CoreSpec.md (read first)
engines/       ← 10 engine specifications
modules/       ← World-specific implementations
prompts/       ← AI system prompts
templates/     ← Reusable game setup templates
examples/      ← Reference campaign implementations
tests/         ← Validation and test specifications
docs/          ← Additional documentation
issues/        ← Issue tracking
```

---

## When Adding New Content

- New engine specifications go in `engines/<EngineName>/`
- World-agnostic mechanics go in `modules/generic/`
- World-specific content goes in `modules/<world-name>/`
- All new documents must be self-contained and not reference a specific world setting unless placed under a world-specific module directory
