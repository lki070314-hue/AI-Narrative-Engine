# Alpha Test 00

**Document ID:** `tests/Alpha/Alpha_Test_00.md`
**Version:** v1.0.0
**Status:** Draft
**Last Updated:** 2026-06-26
**References:** `core/CoreSpec.md`, `tests/Alpha/Alpha_Test_Checklist.md`

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

```yaml
alpha_fixture:
  campaign_canon: false
  module_id: scp-foundation
  player_input: "I inspect the sealed door and ask the guard what happened here."
  actor_id: char_ALPHA_001
  scene_id: scene_ALPHA_001
  location_id: loc_ALPHA_001
  visible_context:
    - "The character is in a restricted facility corridor."
    - "A sealed door is visible."
    - "A guard NPC is present."
  hidden_context:
    allowed_in_player_output: false
    contents: "[redacted test-only hidden facts]"
```

---

## 4. Required Engine Checks

1. Compiler Engine parses the input into `inspect` and `dialogue` intent without adding player actions.
2. Director Engine can frame a response using only visible context.
3. World Engine can accept a non-destructive inspection effect or no-op state check.
4. NPC Engine can produce a guard response without revealing hidden facts.
5. Mission Engine can evaluate whether an investigation objective was advanced.
6. Shadow Engine keeps hidden context isolated.
7. Memory Engine records only player-visible facts and validated outcomes.
8. Save Engine can serialize the updated placeholder state.
9. QA Engine validates output format, agency, hidden information, and state references.

---

## 5. Pass Criteria

Alpha Test 00 passes only if:

- No hidden context appears in player-facing output.
- No player action is authored beyond the submitted input.
- No Season 2 canon event is created or referenced.
- All referenced IDs are either in the fixture or generated as Alpha placeholder IDs.
- QA result is `pass` or `warning` with no `P0` or `P1` findings.

---

## 6. Fail Criteria

The test fails if any output:

- Reveals hidden fixture content.
- Invents campaign canon.
- Forces player intent.
- Uses an undefined non-placeholder ID.
- Skips QA validation.

---

**END OF Alpha Test 00 v1.0.0**
