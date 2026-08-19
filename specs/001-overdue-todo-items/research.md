# Research: Overdue Todo Items

## Decision 1: Derive Overdue State in the Frontend

**Decision**: Compute overdue state from each todo's `dueDate`, `completed` value, and an explicit
current local calendar date. Do not persist or return an `overdue` field from the backend.

**Rationale**: The browser owns the user's local calendar boundary, and the existing API already
returns every persisted input needed for classification. Keeping overdue derived avoids stale data
and preserves all REST and SQLite contracts.

**Alternatives considered**:

- Backend-derived state was rejected because the server's calendar may differ from the user's and
  an open client would still need a midnight refresh mechanism.
- A persisted `overdue` column was rejected because it would become stale and contradict the
  specification's derived-state requirement.

## Decision 2: Compare Validated Calendar Strings

**Decision**: Represent the current local date as canonical `YYYY-MM-DD` and compare it
lexicographically with a strictly validated due date in the same format. Build the current value
from local `Date` fields rather than UTC serialization.

**Rationale**: Canonical year-month-day strings sort chronologically and preserve date-only
semantics. This avoids the timezone shift caused by parsing `YYYY-MM-DD` as UTC or using
`toISOString()` near local midnight. Strict validation ensures malformed backend values are never
classified as overdue.

**Alternatives considered**:

- Comparing elapsed milliseconds was rejected because daylight-saving transitions and UTC parsing
  can make a calendar date change early or late.
- Adding a date library was rejected because the required parsing, validation, and comparison are
  small, deterministic, and supported by built-in APIs.

## Decision 3: Use One Self-Rescheduling Midnight Timeout

**Decision**: `App` owns one timeout scheduled for the next local midnight. When it fires, it
recomputes the current local calendar date and schedules the next timeout from a fresh clock read.
The effect clears its pending timeout on unmount.

**Rationale**: One app-level timer updates every card together without polling or per-card effects.
Constructing the next local midnight with local calendar fields respects 23-hour and 25-hour days.
Recomputing from the actual clock also catches delayed callbacks after a suspended browser tab.

**Alternatives considered**:

- A fixed 24-hour interval was rejected because it drifts across daylight-saving changes and from
  the original mount time.
- Minute polling was rejected because it performs needless recurring work.
- Per-card timers were rejected because they duplicate lifecycle work and can diverge.

## Decision 4: Pass the Date Through Existing Component Boundaries

**Decision**: `App` passes `currentDate` to `TodoList`, which forwards it to each `TodoCard`.
`TodoCard` calls a pure utility during render and conditionally applies the overdue cue and class.

**Rationale**: The dependency is explicit and deterministic in component tests. Existing todo
mutations already replace the affected todo and trigger immediate reclassification, while a date
state change triggers the midnight reclassification without modifying todo data.

**Alternatives considered**:

- An opaque refresh counter was rejected because it hides the value that controls classification.
- React context was rejected because two direct prop boundaries do not justify a new abstraction.
- Memoization was rejected because the O(1) comparison is inexpensive and premature caching adds
  invalidation complexity.

## Decision 5: Use Explicit Text and Theme-Aware Styling

**Decision**: Render visible `Overdue` text in the card's content and apply an overdue CSS class
using existing danger, surface, text, border, spacing, and radius tokens. Completed presentation
takes precedence because completed todos never classify as overdue.

**Rationale**: Visible text makes the distinction understandable without color and available to
assistive technology. Existing tokens support WCAG AA review in both themes without introducing a
parallel design system.

**Alternatives considered**:

- Color-only borders or backgrounds were rejected because they do not satisfy the non-color cue.
- CSS-generated text was rejected because DOM text has more reliable accessibility semantics and
  is easier to test as observable behavior.

## Decision 6: Test Pure Boundaries and User-Visible Transitions

**Decision**: Add Jest unit coverage for date validation, local date formatting, and overdue
classification; React Testing Library coverage for card text/classes; and an `App` integration test
using modern fake timers for local-midnight rollover. Existing component tests cover completion and
editing handlers and will be extended where their resulting overdue transitions are observable.

**Rationale**: This split keeps boundary cases fast and deterministic while proving that scheduling
reaches the rendered UI. Jest, React Testing Library, jest-dom, and MSW are already installed, so no
test dependency is needed.

**Alternatives considered**:

- Testing only utility functions was rejected because it would not verify prop flow, timer
  lifecycle, or visible presentation.
- End-to-end browser tooling was deferred because repository guidance scopes initial development to
  unit and integration tests.

## Resolved Technical Context

All planning unknowns are resolved. The feature requires no dependency, schema, endpoint, service,
or backend production-code change.