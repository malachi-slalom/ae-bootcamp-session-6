---

description: "Implementation tasks for overdue todo item presentation"
---

# Tasks: Overdue Todo Items

**Input**: Design documents from `/specs/001-overdue-todo-items/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/overdue-presentation.md, quickstart.md

**Tests**: Automated tests are required by FR-009 and the project constitution. Write each focused test before its corresponding implementation and confirm that it fails for the expected reason.

**Organization**: Tasks are grouped by user story so each story can be implemented and tested as a distinct increment.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches a different file and does not depend on incomplete work
- **[Story]**: User story served by the task (`US1` or `US2`)
- Every task includes an exact repository-relative file path

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing frontend test harness before feature work begins; no dependency or project scaffolding changes are required.

- [X] T001 Run the existing frontend test baseline using the test script in packages/frontend/package.json and record any pre-existing failures against specs/001-overdue-todo-items/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Confirm shared prerequisites before user-story implementation.

No foundational code changes are required. The existing React state flow, REST response shape, Jest/React Testing Library setup, and theme tokens already provide the shared infrastructure for both stories.

**Checkpoint**: Baseline behavior is known and user-story work can begin.

---

## Phase 3: User Story 1 - Identify Overdue Work (Priority: P1) MVP

**Goal**: Explicitly label and visually distinguish only incomplete todos with valid due dates before the user's current local calendar date, including automatic rollover after local midnight.

**Independent Test**: Render incomplete todos due before, on, and after the supplied current date together with an undated todo, a completed past-due todo, and an invalidly dated todo; verify only the incomplete past-due todo has visible `Overdue` text and the overdue class, then advance fake timers across local midnight and verify a due-today todo becomes overdue without another API request or user action.

### Tests for User Story 1

- [X] T002 [P] [US1] Add failing unit coverage for local date formatting, next-local-midnight delay, canonical date validation, leap days, and overdue boundaries in packages/frontend/src/utils/__tests__/dateUtils.test.js
- [X] T003 [P] [US1] Add failing presentation coverage for overdue text/class and past, today, future, absent, invalid, and completed due-date states in packages/frontend/src/components/__tests__/TodoCard.test.js
- [X] T004 [P] [US1] Add failing mixed-list coverage for forwarding one currentDate value to every card while preserving input order in packages/frontend/src/components/__tests__/TodoList.test.js
- [X] T005 [P] [US1] Add a failing modern-fake-timer integration test for initial local-date propagation, automatic midnight rollover, no rollover API request, and timeout cleanup in packages/frontend/src/__tests__/App.test.js

### Implementation for User Story 1

- [X] T006 [US1] Implement pure getCurrentLocalDate, getMillisecondsUntilNextLocalMidnight, and isOverdue exports with strict canonical calendar validation in packages/frontend/src/utils/dateUtils.js
- [X] T007 [US1] Derive overdue state during render, apply the overdue class, and render visible `Overdue` text near the due date without changing existing accessible controls in packages/frontend/src/components/TodoCard.js
- [X] T008 [US1] Add the currentDate prop and forward it unchanged to every TodoCard while preserving todo order and existing handlers in packages/frontend/src/components/TodoList.js
- [X] T009 [US1] Initialize currentDate, own one self-rescheduling local-midnight timeout with unmount cleanup, and pass currentDate to TodoList in packages/frontend/src/App.js
- [X] T010 [US1] Add theme-token-based overdue card and text styling with a non-color visual cue, completed-state precedence, and responsive readability in packages/frontend/src/App.css
- [X] T011 [US1] Run the focused US1 suites for packages/frontend/src/utils/__tests__/dateUtils.test.js, packages/frontend/src/components/__tests__/TodoCard.test.js, packages/frontend/src/components/__tests__/TodoList.test.js, and packages/frontend/src/__tests__/App.test.js

**Checkpoint**: User Story 1 is fully functional and independently testable as the MVP.

---

## Phase 4: User Story 2 - Clear Overdue State on Completion (Priority: P2)

**Goal**: Immediately remove overdue presentation when a todo is completed and restore or recalculate it when the todo is reopened or its due date changes.

**Independent Test**: Starting with an incomplete overdue todo, apply completed, reopened, due-today, future-dated, undated, and past-dated updates and verify after each rendered update that completed presentation and overdue presentation are mutually exclusive and the due date remains visible when present.

### Tests for User Story 2

- [X] T012 [P] [US2] Add failing rerender coverage for completion, reopening, and past/today/future/null due-date transitions while retaining due-date display in packages/frontend/src/components/__tests__/TodoCard.test.js
- [X] T013 [P] [US2] Add failing integration coverage for immediate overdue removal/restoration from PATCH toggle and PUT edit responses without changing list order in packages/frontend/src/__tests__/App.test.js

### Implementation for User Story 2

- [X] T014 [US2] Use functional todo state updates for create, toggle, edit, and delete responses so mutation-driven overdue reclassification cannot be lost to stale list closures in packages/frontend/src/App.js
- [X] T015 [US2] Run the focused transition suites for packages/frontend/src/components/__tests__/TodoCard.test.js and packages/frontend/src/__tests__/App.test.js

**Checkpoint**: User Stories 1 and 2 both work, and all required overdue transitions are covered.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validate accessibility, themes, regressions, and documented acceptance behavior across the completed feature.

- [X] T016 [P] Verify overdue text, contrast, focus visibility, control readability, and layout in both themes at 375px, 768px, and 1280px, adjusting packages/frontend/src/App.css if needed
- [X] T017 Run the full frontend and backend regression and coverage commands defined in package.json, packages/frontend/package.json, and packages/backend/package.json and confirm at least 80% package coverage with no REST or workflow regressions
- [X] T018 Execute every automated and manual scenario in specs/001-overdue-todo-items/quickstart.md and update that file with any corrected validation commands or discovered limitations

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 - Setup**: No dependencies; establishes the regression baseline.
- **Phase 2 - Foundational**: Depends on Phase 1; confirms that no shared code is missing.
- **Phase 3 - US1**: Depends on Phase 2 and delivers the MVP.
- **Phase 4 - US2**: Depends on US1's derived overdue presentation, then validates mutation transitions independently.
- **Phase 5 - Polish**: Depends on US1 and US2 completion.

### User Story Dependency Graph

```text
Setup -> Foundation -> US1 (P1, MVP) -> US2 (P2) -> Polish
```

US2 builds on US1's classification and rendering contract but does not introduce a separate overdue state or backend dependency.

### Within Each User Story

- Write and run the story's failing tests before production changes.
- Implement pure utilities before components that consume them.
- Implement child component behavior before parent prop forwarding and scheduling.
- Run the focused story suites before moving to the next phase.

## Parallel Execution Examples

### User Story 1

After T001, four contributors can prepare the failing tests concurrently:

```text
T002: packages/frontend/src/utils/__tests__/dateUtils.test.js
T003: packages/frontend/src/components/__tests__/TodoCard.test.js
T004: packages/frontend/src/components/__tests__/TodoList.test.js
T005: packages/frontend/src/__tests__/App.test.js
```

Then complete T006 -> T007 -> T008 -> T009, with T010 following the class and markup contract from T007, and finish with T011.

### User Story 2

After US1 is complete, two contributors can prepare transition tests concurrently:

```text
T012: packages/frontend/src/components/__tests__/TodoCard.test.js
T013: packages/frontend/src/__tests__/App.test.js
```

Complete T014 after both tests express the expected state transitions, then run T015.

### Polish

T016 can run independently while T017 performs automated regression and coverage validation; complete T018 after both provide final validation results.

## Implementation Strategy

### MVP First

1. Complete Setup and Foundational phases.
2. Complete US1 tests and implementation in dependency order.
3. Run T011 and validate the US1 independent test.
4. Stop here for an MVP that correctly identifies overdue work and updates at midnight.

### Incremental Delivery

1. Deliver US1 classification, presentation, and midnight rollover.
2. Add US2 mutation transition coverage and stale-state protection.
3. Complete cross-theme, responsive, regression, and quickstart validation.

### Task Completeness Notes

- The date utility owns all calendar validation and comparison behavior; no backend or persisted-field task is needed.
- App owns exactly one midnight scheduler; no polling or per-card timer task is included.
- TodoList only forwards the shared date, and TodoCard only derives and presents overdue state.
- Existing REST contracts, newest-first ordering, and mutation workflows remain unchanged and are regression-tested rather than reimplemented.