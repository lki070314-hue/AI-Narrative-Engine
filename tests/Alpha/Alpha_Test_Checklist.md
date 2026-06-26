# Alpha Test Checklist

**Document ID:** `tests/Alpha/Alpha_Test_Checklist.md`
**Version:** v1.0.0
**Status:** Draft
**Last Updated:** 2026-06-26
**References:** `core/CoreSpec.md`, `core/OutputSpec.md`, `tests/Alpha/Alpha_Fixture_Schema.md`, `tests/Alpha/Alpha_Test_00.md`

---

## Pre-Test Document Gate

- [ ] `core/CoreSpec.md` exists.
- [ ] `core/PromptSpec.md` exists.
- [ ] `core/OutputSpec.md` exists.
- [ ] `core/FolderRule.md` exists.
- [ ] `core/NamingRule.md` exists.
- [ ] All eleven engine spec files exist.
- [ ] `modules/scp/README.md` exists.
- [ ] `modules/scp/WorldOverview.md` exists.
- [ ] `modules/scp/CoreRules.md` exists.
- [ ] `tests/Alpha/Alpha_Fixture_Schema.md` exists.
- [ ] Alpha test files exist under `tests/Alpha/`.

---

## Engine Gate

- [ ] Compiler parses input without adding player intent.
- [ ] Compiler -> Director handoff uses `resolved_action`.
- [ ] Resolution evaluates player action as an attempt before Director narration.
- [ ] Director uses OutputSpec blocks.
- [ ] World inspection is no-op or non-destructive and references valid Alpha IDs.
- [ ] NPC output does not include player dialogue or hidden knowledge.
- [ ] Mission updates allow success and failure.
- [ ] Shadow data is separated from player-facing output.
- [ ] Memory records validated facts only.
- [ ] Save state can be simulated as serialized YAML and restored.
- [ ] QA runs after candidate output.

---

## SCP Module Gate

- [ ] Alpha fixture uses placeholder content only.
- [ ] Alpha fixture declares all placeholder IDs before use.
- [ ] No Season 2 canon events are created.
- [ ] No hidden campaign secrets are invented or revealed.
- [ ] Clearance-gated information is respected.
- [ ] Containment state is represented without leaking hidden detail.

---

## OutputSpec Gate

- [ ] Output uses only `NAR`, `DIA`, `PRM`, `SYS`, `QRY`, and `ERR` blocks.
- [ ] Output blocks are balanced and follow OutputSpec ordering.
- [ ] `NAR` and `DIA` preserve player agency.
- [ ] `SYS`, `QRY`, and `ERR` do not reveal hidden fixture content or engine internals.
- [ ] NPC dialogue does not expose hidden facts.

---

## Result Gate

- [ ] No `P0` QA finding.
- [ ] No `P1` QA finding.
- [ ] All findings are logged in `Alpha_Test_Result_Template.md` format.
- [ ] Final status is one of: `pass`, `pass_with_warnings`, `fail`.

---

**END OF Alpha Test Checklist v1.0.0**
