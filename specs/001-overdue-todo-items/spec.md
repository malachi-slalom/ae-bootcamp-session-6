# Feature Specification: Overdue Todo Items

**Feature Branch**: `001-overdue-todo-items`

**Created**: 2026-08-18

**Status**: Draft

**Input**: User description: "Support for Overdue Todo Items: users need to easily identify and distinguish incomplete tasks that are past their due date, with automated coverage for overdue determination and display."

## Clarifications

### Session 2026-08-19

- Q: When the app remains open across local midnight, when must overdue indicators update? → A: Automatically after local midnight without user action.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Identify Overdue Work (Priority: P1)

As a todo application user, I can immediately distinguish incomplete todos whose due dates have passed so that I can prioritize overdue work without comparing each date to today's date.

**Why this priority**: Correctly identifying and visibly distinguishing overdue work is the feature's primary user value.

**Independent Test**: Display a list containing incomplete todos due before, on, and after the current date, plus an undated todo, and verify that only the todo due before the current date is explicitly identified as overdue.

**Acceptance Scenarios**:

1. **Given** an incomplete todo with a due date before the user's current calendar date, **When** the user views the todo list, **Then** the todo is explicitly labeled and visually distinguished as overdue.
2. **Given** an incomplete todo due on the user's current calendar date, **When** the user views the todo list, **Then** the todo is not identified as overdue.
3. **Given** an incomplete todo with a future due date or no due date, **When** the user views the todo list, **Then** the todo is not identified as overdue.

---

### User Story 2 - Clear Overdue State on Completion (Priority: P2)

As a todo application user, I can complete an overdue todo and immediately see that it is no longer presented as overdue, while retaining its completed state and due date.

**Why this priority**: An overdue indicator that remains after completion would misrepresent the user's outstanding workload.

**Independent Test**: Mark an overdue todo complete and verify that its overdue label and visual distinction disappear while its completed presentation remains.

**Acceptance Scenarios**:

1. **Given** an incomplete overdue todo, **When** the user marks it complete, **Then** the todo is no longer labeled or visually distinguished as overdue.
2. **Given** a completed todo with a due date before the current date, **When** the user views the todo list, **Then** the todo is presented as completed and not as overdue.
3. **Given** a completed past-due todo, **When** the user reopens it, **Then** the todo is immediately labeled and visually distinguished as overdue.

### Edge Cases

- A due date equal to the user's current calendar date is due today, not overdue.
- An open app automatically updates overdue indicators after the user's local calendar date advances past midnight, without refresh, reopening, editing, or other user action.
- Changing an overdue todo's due date to today, a future date, or no date removes its overdue state.
- Changing an incomplete todo's due date from today, a future date, or no date to a past date applies its overdue state.
- Date comparisons use calendar dates rather than elapsed hours, so time-of-day and daylight-saving transitions do not make an item overdue early.
- Invalid due dates continue to follow existing validation and error behavior and are not assigned an overdue state.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST classify a todo as overdue only when it is incomplete, has a valid due date, and that due date is earlier than the user's current calendar date.
- **FR-002**: The system MUST NOT classify completed todos, todos without due dates, todos due today, or todos with future due dates as overdue.
- **FR-003**: The todo list MUST display an explicit "Overdue" text cue for every overdue todo.
- **FR-004**: The todo list MUST visually distinguish overdue todos from non-overdue todos while preserving the readability of the title, due date, status control, and actions.
- **FR-005**: The overdue distinction MUST remain understandable without color alone and MUST meet the application's accessibility, light-theme, and dark-theme requirements.
- **FR-006**: The displayed overdue state MUST update when a todo is completed, reopened, or has its due date changed.
- **FR-007**: While the app remains open, the displayed overdue state MUST update automatically after the user's local calendar date advances past midnight, without refresh, reopening, editing, or other user action.
- **FR-008**: Adding overdue presentation MUST NOT change the existing newest-first list order or any todo creation, editing, completion, reopening, or deletion behavior.
- **FR-009**: Automated verification MUST cover overdue classification boundaries and the user-visible overdue presentation, including transitions caused by completion, reopening, due-date changes, and the local calendar date advancing past midnight while the app remains open.

### Key Entities

- **Todo**: A task with a required title, optional due date, completion status, and creation date. Its overdue state is derived from its due date, completion status, and the user's current calendar date; it is not a separately managed status.
- **Current Calendar Date**: The date currently applicable to the user, used as the comparison boundary for determining whether an incomplete todo's due date has passed.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In acceptance testing, 100% of incomplete todos dated before the current date are identified as overdue, and 0% of completed, undated, due-today, or future-dated todos are identified as overdue.
- **SC-002**: At least 90% of representative users can identify all overdue todos in a mixed list of at least 10 items within 5 seconds without manually comparing dates.
- **SC-003**: In 100% of tested completion, reopening, due-date-edit, and open-app midnight-rollover scenarios, the visible overdue state matches the todo's resulting status, due date, and current local calendar date without additional user action.
- **SC-004**: The overdue cue is perceivable and understandable in both supported themes, at documented viewport sizes, and when color perception is unavailable.
- **SC-005**: All automated checks for overdue date boundaries and visible states pass, with no regression in existing todo workflows.

## Assumptions

- Due dates represent calendar dates and do not include a time-of-day deadline.
- "Current date" means the calendar date in the user's local environment.
- Overdue is a derived presentation state; users do not manually set or persist it.
- Existing due-date validation, newest-first ordering, and todo workflows remain authoritative and unchanged.
- Delivery includes focused automated behavior coverage following the repository's established testing standards.