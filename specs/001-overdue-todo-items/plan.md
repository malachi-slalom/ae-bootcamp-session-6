# Implementation Plan: Overdue Todo Items

**Branch**: `001-overdue-todo-items` | **Date**: 2026-08-19 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-overdue-todo-items/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command; its definition describes the execution workflow.

## Summary

Derive an overdue presentation state for incomplete todos whose valid calendar due date precedes
the user's current local calendar date. A pure frontend date utility will classify todos without
changing persisted data or REST responses. `App` will own one self-rescheduling local-midnight
timeout and pass the current calendar date through `TodoList` to `TodoCard`, where an explicit text
cue and theme-aware visual treatment will be rendered. Focused Jest and React Testing Library tests
will cover date boundaries, state transitions, presentation, and midnight rollover.

## Technical Context

**Language/Version**: JavaScript (ES2022-compatible), React 18.2, Node.js 16+

**Primary Dependencies**: React 18.2, React DOM 18.2, Express 4.18, existing CSS theme tokens; no
new runtime dependency

**Storage**: Existing SQLite in-memory todo store through the Express REST API; no schema or
persisted-field changes

**Testing**: Jest via Create React App, React Testing Library, jest-dom, MSW; existing backend Jest
and Supertest suite for regression verification

**Target Platform**: Modern desktop, tablet, and mobile browsers supported by the existing
Browserslist; Node.js server on Linux

**Project Type**: npm-workspace web application with React frontend and Express REST backend

**Performance Goals**: O(1) classification per card, O(n) list render, and overdue presentation
updated on the first render triggered at local midnight without background polling

**Constraints**: Calendar-date rather than elapsed-time comparison; one timer per mounted app;
derived state is not persisted; newest-first ordering and existing workflows remain unchanged;
WCAG AA contrast and non-color text cue in light and dark themes; at least 80% package coverage

**Scale/Scope**: Single-user todo list, one existing screen, three component boundaries, one date
utility, and focused frontend tests; no backend feature code

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Core todo contract**: PASS. Overdue is display-only; create, view, edit, complete, reopen,
  delete, optional due dates, and newest-first ordering remain unchanged.
- **Simple responsibilities**: PASS. Pure date logic, app-level scheduling, list prop forwarding,
  and card presentation remain separated; no new framework or persistence path is introduced.
- **Behavioral testing**: PASS. Unit and component/integration tests will cover all classification
  boundaries and critical transitions, including fake-timer midnight rollover.
- **Data preservation and failures**: PASS. Existing API mutations and validation remain
  authoritative; no stored `overdue` field or API behavior changes.
- **Accessible interface**: PASS. The card uses explicit "Overdue" text plus a theme-token visual
  treatment, retaining readable content and existing keyboard interactions at supported widths.

No constitutional exceptions are required. Phase 0 may proceed.

## Project Structure

### Documentation (this feature)

```text
specs/001-overdue-todo-items/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/
│   └── overdue-presentation.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
packages/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   └── services/todoService.js
│   └── __tests__/app.test.js
└── frontend/
  └── src/
    ├── App.js
    ├── App.css
    ├── __tests__/App.test.js
    ├── components/
    │   ├── TodoCard.js
    │   ├── TodoList.js
    │   └── __tests__/
    │       ├── TodoCard.test.js
    │       └── TodoList.test.js
    ├── services/todoService.js
    ├── styles/theme.css
    └── utils/
      ├── dateUtils.js
      └── __tests__/dateUtils.test.js
```

**Structure Decision**: Retain the existing two-package web application. All feature behavior is
owned by the frontend because overdue depends on the browser's local calendar date and is not
persisted. The backend and its API tests are regression surfaces only.

## Post-Design Constitution Check

Phase 1 design preserves every pre-design gate. The data model defines `overdue` as derived and
non-persisted, the presentation contract keeps API shapes unchanged, and the quickstart validates
accessibility, themes, ordering, workflows, and automated coverage. No complexity exception was
introduced.

## Complexity Tracking

No constitution violations require justification.
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
