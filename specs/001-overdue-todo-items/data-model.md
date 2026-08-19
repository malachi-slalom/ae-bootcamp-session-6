# Data Model: Overdue Todo Items

## Todo

Existing persisted entity returned by the REST API.

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `id` | integer | Yes | Positive, backend-generated identifier |
| `title` | string | Yes | Trimmed, non-empty, maximum 255 characters |
| `dueDate` | string or null | No | Calendar date represented as `YYYY-MM-DD`; existing invalid values are not overdue |
| `completed` | integer/boolean | Yes | `0`/`false` means incomplete; `1`/`true` means completed |
| `createdAt` | timestamp string | Yes | Backend-generated; continues to control newest-first ordering |

### Relationships

- A todo has zero or one due date.
- A todo is evaluated against exactly one current calendar date for a render.
- No stored entity or relationship is added for overdue state.

### Validation

- Existing API validation remains authoritative for persisted fields.
- Overdue classification accepts only a real canonical calendar date. Values with an invalid shape
  or impossible month/day combination produce `overdue = false` and retain existing display/error
  behavior.
- The due date and current date are date-only values; neither has a time or timezone suffix.

## Current Calendar Date

Ephemeral frontend value representing the user's browser-local date.

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `value` | string | Yes | Canonical `YYYY-MM-DD`, generated from local year, month, and day fields |

The value is initialized when `App` mounts and replaced after each scheduled local-midnight
boundary. It is not sent to the API or persisted.

## Derived Overdue State

Ephemeral boolean calculated for presentation.

| Field | Type | Persisted | Derivation |
|-------|------|-----------|------------|
| `overdue` | boolean | No | `not completed AND valid dueDate AND dueDate < currentDate` |

### State Transitions

| Trigger | Before | After |
|---------|--------|-------|
| Incomplete todo's due date becomes earlier than current date | Not overdue | Overdue |
| Overdue todo is completed | Overdue | Not overdue |
| Completed past-due todo is reopened | Not overdue | Overdue |
| Overdue todo's due date changes to today, future, or null | Overdue | Not overdue |
| Incomplete todo's due date changes from today, future, or null to past | Not overdue | Overdue |
| Current local date advances beyond an incomplete todo's due date | Not overdue | Overdue |
| Invalid due date is encountered | Not overdue | Not overdue |

No transition changes `createdAt`, list ordering, or any persisted value other than the existing
user-initiated completion or due-date mutation.