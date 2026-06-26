# Alpha Fixture Schema

**Document ID:** `tests/Alpha/Alpha_Fixture_Schema.md`
**Version:** v1.0.0
**Status:** Draft
**Last Updated:** 2026-06-26
**References:** `tests/Alpha/Alpha_Test_00.md`, `core/OutputSpec.md`

---

## 1. Purpose

This document defines the shared placeholder fixture schema for Alpha tests. It is a documentation-only contract for validating specifications and must not create campaign canon or require engine behavior changes.

---

## 2. Placeholder ID Rules

Alpha placeholder IDs must be explicit in the fixture before use.

Allowed ID prefixes:

| Entity | Prefix | Example |
|--------|--------|---------|
| Campaign | `camp_ALPHA_` | `camp_ALPHA_001` |
| Session | `ses_ALPHA_` | `ses_ALPHA_001` |
| Scene | `scene_ALPHA_` | `scene_ALPHA_001` |
| Character | `char_ALPHA_` | `char_ALPHA_001` |
| Location | `loc_ALPHA_` | `loc_ALPHA_001` |
| NPC | `npc_ALPHA_` | `npc_ALPHA_001` |
| Object | `obj_ALPHA_` | `obj_ALPHA_001` |
| Mission | `mis_ALPHA_` | `mis_ALPHA_001` |
| Action | `act_ALPHA_` | `act_ALPHA_001` |
| Attempt | `att_ALPHA_` | `att_ALPHA_001` |
| Memory | `mem_ALPHA_` | `mem_ALPHA_001` |
| Save | `save_ALPHA_` | `save_ALPHA_001` |

Generated Alpha IDs are allowed only when the result explicitly records the generated ID and keeps the same prefix rules. Non-placeholder IDs are invalid unless they are stable document IDs such as `scp-foundation`.

---

## 3. Fixture Schema

```yaml
alpha_fixture:
  schema_version: "1.0.0"
  campaign_canon: false
  module_id: scp-foundation
  ids:
    campaign_id: camp_ALPHA_001
    session_id: ses_ALPHA_001
    scene_id: scene_ALPHA_001
    actor_id: char_ALPHA_001
    location_id: loc_ALPHA_001
    guard_npc_id: npc_ALPHA_001
    sealed_door_id: obj_ALPHA_001
    mission_id: mis_ALPHA_001
    action_id: act_ALPHA_001
    attempt_id: att_ALPHA_001
    memory_id: mem_ALPHA_001
    save_id: save_ALPHA_001
  player_input: "I inspect the sealed door and ask the guard what happened here."
  visible_context:
    location_summary: "The character is in a restricted facility corridor."
    objects:
      - id: obj_ALPHA_001
        label: sealed door
        visible: true
    npcs:
      - id: npc_ALPHA_001
        label: guard
        visible: true
  hidden_context:
    allowed_in_player_output: false
    contents: "[redacted test-only hidden facts]"
```

---

## 4. Compiler To Director Handoff

Alpha tests use `resolved_action` as the single Compiler -> Director handoff object. `compiler_output.action` and `ResolvedAction` refer to the same object shape for Alpha validation.

```yaml
resolved_action:
  id: act_ALPHA_001
  actor_id: char_ALPHA_001
  source_input: "I inspect the sealed door and ask the guard what happened here."
  attempt_required: true
  attempt_request_id: att_ALPHA_001
  intents:
    - type: inspect
      target_ids:
        - obj_ALPHA_001
      parameters:
        inspection_mode: visual
    - type: dialogue
      target_ids:
        - npc_ALPHA_001
      parameters:
        utterance_summary: "asks what happened here"
  validation_result:
    status: valid
    severity: none
    reason: null
  clarification_request: null
```

The handoff must preserve the submitted player intent. It may split compatible declared intents, but it must not add implied actions such as opening the door, bypassing access controls, threatening the guard, or touching the object.

---

## 5. World Inspection Handling

The Alpha inspection is a non-destructive state check.

World handling must be one of:

- `world_effects: []`
- a no-op inspection record that references `act_ALPHA_001`, `char_ALPHA_001`, and `obj_ALPHA_001`

The inspection must not open the sealed door, move the character, reveal hidden facts, discover a new anomaly property, or create campaign canon.

---

## 6. Simulated Serialization

Alpha tests do not require physical save-file writes. Save validation is simulated serialization:

```yaml
simulated_serialization:
  save_id: save_ALPHA_001
  document_version: "1.0.0"
  schema_version: "1.0.0"
  output_format: yaml
  physical_write_required: false
  round_trip_required: true
```

The test passes if the placeholder state can be represented as valid YAML and restored to the same documented IDs and player-visible facts.

---

## 7. Document Version Alignment

For Alpha tests, Memory Engine `memory_archive.metadata.schema_version` and Save Engine `save_file.metadata.document_version` both use `"1.0.0"` as the test document schema version. Engine implementation versions are out of scope for Alpha Test 00.

---

**END OF Alpha Fixture Schema v1.0.0**
