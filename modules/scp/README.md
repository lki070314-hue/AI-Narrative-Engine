# SCP Module README

**Document ID:** `modules/scp/README.md`
**Version:** v1.0.0
**Status:** Draft
**Last Updated:** 2026-06-26
**References:** `core/CoreSpec.md`, `core/FolderRule.md`, `modules/scp/SCPModule.md`

---

## Purpose

This directory contains the SCP Foundation module for AI Narrative Engine. It is a world-specific module layered over the generic engine rules.

This module must not override CoreSpec. SCP-specific documents may specialize tone, roles, mission structure, secrecy, and setting rules only inside the module boundary.

---

## Required Alpha Files

| File | Purpose |
|------|---------|
| `README.md` | Module index and usage boundary. |
| `WorldOverview.md` | Player-safe world overview. |
| `CoreRules.md` | Module rules and engine bindings. |
| `SCPModule.md` | Existing module specification. |

---

## Safety Boundary

Alpha Test must use placeholder state and public module rules only.

Do not include:

- Season 2 canon events.
- Hidden campaign secrets.
- Undiscovered SCP object details.
- Player character actions not declared by the player.

---

## Alpha Readiness

The SCP module is Alpha-ready only when:

- CoreRules and WorldOverview are present.
- Generic mechanics dependencies are acknowledged.
- Shadow and secret content stays isolated from player-facing prompts.
- QA validates hidden information separation before output.

---

**END OF SCP Module README v1.0.0**
