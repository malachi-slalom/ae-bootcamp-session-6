# Contract: Overdue Presentation

## Scope

This contract defines the frontend classification, scheduling, component, and visible presentation
boundaries for overdue todo items. Existing REST request and response shapes remain unchanged.

## Date Utility Contract

### `getCurrentLocalDate(date?)`

- **Input**: Optional JavaScript `Date`; defaults to the current system time.
- **Output**: Browser-local calendar date in canonical `YYYY-MM-DD` format.
- **Guarantee**: Does not derive the calendar date through UTC serialization.

### `isOverdue(dueDate, completed, currentDate)`

- **Inputs**:
  - `dueDate`: nullable API date value.
  - `completed`: existing API completion value (`0`/`1`, with equivalent booleans accepted).
  - `currentDate`: canonical local calendar date supplied by `App`.
- **Output**: Boolean.
- **True only when**: The todo is incomplete, `dueDate` is a real canonical calendar date, and
  `dueDate` precedes `currentDate`.
- **False when**: Completed, undated, due today, future-dated, or invalidly dated.
- **Side effects**: None.

### `getMillisecondsUntilNextLocalMidnight(date?)`

- **Input**: Optional JavaScript `Date`; defaults to the current system time.
- **Output**: Positive millisecond delay to the next browser-local calendar boundary.
- **Guarantee**: Uses the next local calendar day rather than adding a fixed 24 hours.

## Scheduling Contract

`App` owns a single mounted midnight scheduler.

1. Initialize `currentDate` from the browser-local clock.
2. Schedule one timeout for the next local midnight.
3. On callback, replace `currentDate` using a fresh clock read.
4. Schedule the following timeout from that same fresh clock context.
5. Clear the pending timeout when `App` unmounts.

A delayed callback must use the date at callback time, so a suspended tab catches up when execution
resumes. No API request or todo mutation is required for rollover.

## Component Contract

### `TodoList`

Adds one required presentation prop:

| Prop | Type | Purpose |
|------|------|---------|
| `currentDate` | canonical date string | Forward the shared comparison boundary to every `TodoCard` |

Existing todo order and handler props are preserved.

### `TodoCard`

Adds one required presentation prop:

| Prop | Type | Purpose |
|------|------|---------|
| `currentDate` | canonical date string | Derive the card's overdue state during render |

When overdue, the rendered card must:

- Contain visible text exactly `Overdue` near the due date.
- Apply an overdue class that provides a non-color visual distinction while retaining readable
  title, due date, checkbox, edit action, and delete action.
- Preserve all existing keyboard and accessible names for interactive controls.

When not overdue, the card must render neither the overdue text nor overdue class. Completed styling
takes precedence because a completed todo cannot be overdue.

## REST Compatibility Contract

No endpoint, request body, response body, status code, or ordering behavior changes. The frontend
continues to consume these existing fields from `GET /api/todos` and mutation responses:

```text
Todo = {
  id: integer,
  title: string,
  dueDate: YYYY-MM-DD | null,
  completed: 0 | 1,
  createdAt: timestamp
}
```

`PUT /api/todos/:id` continues to update title/due date, and
`PATCH /api/todos/:id/toggle` continues to toggle completion. Their returned todo is immediately
reclassified against the current date. No `overdue` property is accepted or returned.