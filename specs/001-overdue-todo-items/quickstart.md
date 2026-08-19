# Quickstart: Validate Overdue Todo Items

## Prerequisites

- Node.js 16 or newer
- npm dependencies installed from the repository root
- Branch `001-overdue-todo-items` checked out

```bash
npm install
```

## Automated Validation

Run focused frontend tests during implementation:

```bash
npm test --workspace=frontend -- --runInBand dateUtils.test.js
npm test --workspace=frontend -- --runInBand TodoCard.test.js
npm test --workspace=frontend -- --runInBand TodoList.test.js
npm test --workspace=frontend -- --runInBand App.test.js
```

Expected outcomes:

- Date utility tests pass for past, today, future, absent, invalid, leap-day, and completed inputs.
- Component tests find visible `Overdue` text and the overdue class only for qualifying todos.
- Mutation tests remove or restore the cue immediately after completion, reopening, and due-date
  edits.
- Fake-timer integration coverage shows an incomplete due-today todo becoming overdue after the
  local calendar date advances past midnight without another user action or API request.

Run the full repository regression and coverage suite:

```bash
npm test
```

Expected outcome: frontend and backend suites pass, frontend coverage includes the new utility and
midnight scheduler, and no existing todo workflow regresses.

## Manual Validation

Start both packages:

```bash
npm start
```

Open `http://localhost:3000` and create incomplete todos dated before today, today, after today, and
with no due date.

Verify:

1. Only the past-dated incomplete todo shows visible `Overdue` text and the overdue card treatment.
2. Completing that todo removes the overdue treatment; reopening restores it.
3. Editing its due date to today, a future date, or no date removes the treatment.
4. Editing an incomplete todo to a past date applies the treatment.
5. Todo order remains newest first and create, edit, complete, reopen, and delete still work.

Repeat the presentation check in light and dark themes at representative widths of 375px, 768px,
and 1280px. Confirm the title, due date, checkbox, and actions remain readable and operable with the
keyboard, the text cue makes sense without color, focus indicators remain visible, and color
contrast meets WCAG AA.

The midnight behavior is primarily validated by the deterministic fake-timer test. For an optional
manual check, leave an incomplete todo due today visible across local midnight and confirm its cue
appears without refresh, editing, or other user action.

See [data-model.md](./data-model.md) for state derivation and
[contracts/overdue-presentation.md](./contracts/overdue-presentation.md) for interface details.