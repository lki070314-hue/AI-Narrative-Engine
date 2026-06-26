# Alpha Test 00

**Document ID:** `tests/Alpha/Alpha_Test_00.md`
**Version:** v1.0.0
**Status:** Draft
**Last Updated:** 2026-06-26
**References:** `core/CoreSpec.md`, `core/OutputSpec.md`, `tests/Alpha/Alpha_Fixture_Schema.md`, `tests/Alpha/Alpha_Test_Checklist.md`

---

## 1. Purpose

Alpha Test 00 verifies that the minimum AI Narrative Engine loop can be evaluated using placeholder SCP module state without running gameplay, creating campaign canon, or exposing hidden information.

---

## 2. Scope

Test only the document-defined engine flow:

```text
Compiler -> Director -> World -> NPC -> Mission -> Shadow -> Memory -> Save -> QA
```

This is a specification validation test, not a gameplay session.

---

## 3. Test Fixture

Alpha Test 00 uses the shared schema in `tests/Alpha/Alpha_Fixture_Schema.md`.

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

Compiler output passed to Director must use the `resolved_action` schema from `tests/Alpha/Alpha_Fixture_Schema.md`.

```yaml
resolved_action:
  id: act_ALPHA_001
  actor_id: char_ALPHA_001
  source_input: "I inspect the sealed door and ask the guard what happened here."
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

This schema is the Alpha handoff contract. The Compiler may split compatible declared intents, but it must not add actions not present in the input.

---

## 5. World Inspection Handling

The sealed-door inspection is a non-destructive state check. World Engine may return no world effect, or a no-op inspection record that references `act_ALPHA_001`, `char_ALPHA_001`, and `obj_ALPHA_001`.

The inspection must not open the sealed door, move the character, reveal hidden facts, discover a new anomaly property, or create campaign canon.

---

## 6. Simulated Serialization

Save Engine validation in Alpha Test 00 is simulated serialization only.

```yaml
simulated_serialization:
  save_id: save_ALPHA_001
  document_version: "1.0.0"
  schema_version: "1.0.0"
  output_format: yaml
  physical_write_required: false
  round_trip_required: true
```

No physical save file must be written for this test. The serialized placeholder state must round-trip to the same documented Alpha IDs and player-visible facts.

---

## 7. OutputSpec Validation

QA must validate candidate player-facing output against `core/OutputSpec.md`:

- Output uses only documented block IDs: `NAR`, `DIA`, `PRM`, `SYS`, `QRY`, `ERR`.
- Output blocks are balanced and ordered according to OutputSpec.
- `NAR` and `DIA` do not author player actions or player dialogue beyond the submitted input.
- `SYS`, `QRY`, and `ERR` do not expose hidden fixture content or engine internals.
- Dialogue attributed to `npc_ALPHA_001` does not reveal hidden facts.

---

## 8. Required Engine Checks

1. Compiler Engine parses the input into `inspect` and `dialogue` intent without adding player actions.
2. Director Engine can frame a response using only visible context.
3. World Engine can accept a non-destructive inspection effect or no-op state check.
4. NPC Engine can produce a guard response without revealing hidden facts.
5. Mission Engine can evaluate whether an investigation objective was advanced.
6. Shadow Engine keeps hidden context isolated.
7. Memory Engine records only player-visible facts and validated outcomes.
8. Save Engine can simulate serialization of the updated placeholder state.
9. QA Engine validates output format, agency, hidden information, and state references.

---

## 9. Pass Criteria

Alpha Test 00 passes only if:

- No hidden context appears in player-facing output.
- No player action is authored beyond the submitted input.
- No Season 2 canon event is created or referenced.
- All referenced IDs are declared in the fixture or recorded as generated Alpha placeholder IDs.
- Compiler -> Director handoff uses `resolved_action`.
- Save validation is simulated serialization and does not require a physical write.
- OutputSpec validation is completed.
- QA result is `pass` or `warning` with no `P0` or `P1` findings.

---

## 10. Fail Criteria

The test fails if any output:

- Reveals hidden fixture content.
- Invents campaign canon.
- Forces player intent.
- Uses an undefined non-placeholder ID.
- Uses a Compiler -> Director handoff shape other than `resolved_action`.
- Requires physical save-file writes for Alpha Test 00.
- Skips QA validation.

---

**END OF Alpha Test 00 v1.0.0**
