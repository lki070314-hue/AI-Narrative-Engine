# [0002] Creator Engine 명세 작성

- **Type:** New Spec
- **Status:** Resolved
- **Priority:** High
- **Affects:** `engines/Creator/CreatorEngine.md`
- **Reported:** 2026-06-26
- **Resolved:** 2026-06-26

## Description

Creator Engine의 상세 명세 문서가 존재하지 않았다. 시스템 프롬프트(`00_Creator_SystemPrompt.md`)만 있었으며, 엔진의 입력/출력 계약, 데이터 구조, 생성 단계 프로토콜, 검증 규칙이 정의되어 있지 않았다.

## Motivation

다른 엔진(NPC Engine, World Engine, Memory Engine)은 명세 문서가 있어 엔진 간 인터페이스 계약이 명확하다. Creator Engine만 명세가 없으면 World Engine, Director Engine, Save Engine과의 연계 지점이 불분명하다.

## Scope

- [x] Requires new document
- [ ] Requires changes to existing document(s)
- [x] World-agnostic (engine-layer)
- [x] Engine-level change (goes in `engines/Creator/`)

## Acceptance Criteria

- [x] `engines/Creator/CreatorEngine.md` 생성
- [x] CoreSpec §5.1 준수
- [x] 입력/출력 명세 작성
- [x] 플레이어 행동을 대신 결정하지 않는 규칙 명문화
- [x] NPC 생성 책임이 NPC Engine에 있음을 명확히 구분
- [x] Creator Engine은 세계 구조(WorldSeed)와 캐릭터 시트만 생성
- [x] 다른 엔진과의 인터페이스 충돌 없음
- [x] QA 검증 규칙 포함

## Design Decisions

**NPC 생성 제외:** CoreSpec §5.1.3에는 "시작 NPC 목록 및 기본 관계도 생성"이 Creator Engine의 역할로 기술되어 있으나, 이슈 요구사항에 따라 NPC 인스턴스 생성은 NPC Engine으로 완전히 위임한다. Creator Engine은 세력(Faction) 구조와 갈등 시드만 생성하며, 이를 기반으로 NPC Engine이 필요한 시점에 NPC를 생성한다.

**시스템 프롬프트와의 관계:** 기존 `00_Creator_SystemPrompt.md`는 NPC seeds 생성을 포함하고 있다. 본 명세가 더 구체적인 설계 기준이므로, 향후 시스템 프롬프트는 본 명세에 맞게 개정이 필요하다.

## Notes

- 관련 파일: `engines/Creator/00_Creator_SystemPrompt.md` (추후 이슈 #0002 결정사항에 맞게 개정 권고)
- 참조: `core/CoreSpec.md` §5.1, §7, §14
