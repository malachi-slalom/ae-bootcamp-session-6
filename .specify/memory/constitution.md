<!--
Sync Impact Report
- Version change: template (unratified) -> 1.0.0
- Modified principles: none; initial adoption
- Added principles:
	- I. Deliver the Core Todo Contract
	- II. Keep Responsibilities Simple and Explicit
	- III. Test Behavior as Part of Development
	- IV. Preserve Data and Handle Failures
	- V. Build an Accessible, Consistent Interface
- Added sections: Technical and Product Constraints; Development Workflow and Quality Gates
- Removed sections: none
- Follow-up TODOs: none
-->
# Todo App Constitution

## Core Principles

### I. Deliver the Core Todo Contract
Every change MUST preserve the single-user todo contract: users can create, view, edit, complete,
reopen, and delete todos. Titles MUST be required and limited to 255 characters; due dates MUST
remain optional; new todos MUST start incomplete; and the list MUST show newest todos first.
Deletion MUST require confirmation. Features explicitly listed as out of scope MUST NOT be added
without an approved specification and constitution amendment. This keeps delivery focused on the
documented product rather than unrequested expansion.

### II. Keep Responsibilities Simple and Explicit
Modules, components, and functions MUST have one clear responsibility and use descriptive names.
Frontend presentation, API communication, and backend business or persistence logic MUST remain
separated. Implementations MUST prefer straightforward code and existing project patterns over
premature abstraction or optimization. Shared logic MUST be extracted when duplication creates a
maintenance burden, and circular dependencies MUST NOT be introduced. These constraints keep the
React and Express packages understandable and independently changeable.

### III. Test Behavior as Part of Development
Tests MUST be written before or alongside production changes and MUST verify externally observable
behavior rather than implementation details. New behavior, regressions, and bug fixes MUST include
focused unit or integration coverage. Tests MUST be independent, use descriptive names, isolate
external dependencies, and follow Arrange-Act-Assert. The repository MUST maintain at least 80%
coverage across packages and 100% coverage for identified critical user workflows. All relevant
tests MUST pass before a change is merged.

### IV. Preserve Data and Handle Failures
Every todo mutation MUST be persisted immediately through the existing Express API, and persisted
state MUST survive a page refresh. Inputs MUST be validated at API boundaries, especially required
titles, title length, dates, and identifiers. Operations that can fail MUST handle errors explicitly,
return or display actionable messages, and leave the application in a consistent state. This
principle protects the product's primary promise: users do not lose or silently corrupt their work.

### V. Build an Accessible, Consistent Interface
User-facing changes MUST follow the documented design tokens, 8px spacing grid, typography,
component states, and light/dark theme behavior. Interactive controls MUST be keyboard accessible,
have visible focus indicators, expose associated labels or descriptive accessible names, and meet
WCAG AA color contrast. The theme preference MUST persist in local storage and default to the
system preference on first use. Layouts MUST remain usable at documented desktop, tablet, and
mobile widths. Consistency and accessibility are acceptance criteria, not optional polish.

## Technical and Product Constraints

- The repository MUST remain an npm-workspace monorepo with a React frontend and Node.js/Express
	backend unless an approved architectural amendment states otherwise.
- Frontend data access MUST use the backend REST API; application source MUST NOT introduce a
	separate persistence path or user-specific data isolation.
- Code MUST use two-space indentation, LF line endings, no trailing whitespace, and the naming and
	import conventions in `docs/coding-guidelines.md`.
- Public or critical JavaScript interfaces MUST use JSDoc where type or contract ambiguity would
	otherwise create risk.
- Authentication, collaboration, priorities, categories, recurrence, reminders, undo/redo, bulk
	operations, filtering, and search remain outside the approved product scope.

## Development Workflow and Quality Gates

1. Confirm the requested behavior against `docs/functional-requirements.md` and this constitution.
2. Add or update focused tests that express the expected behavior, then implement the smallest
	 clear change that satisfies them.
3. Run relevant package tests during development and the full repository test suite before merge.
4. Review coverage for changed critical paths and run configured lint checks; errors and warnings
	 MUST be resolved before a pull request is opened.
5. Review UI changes against `docs/ui-guidelines.md`, including keyboard use, focus visibility,
	 contrast, responsive layout, interaction states, and both themes.
6. Keep commits atomic and descriptive. Pull requests MUST explain the reason for the change and
	 identify any justified exception to these rules.

## Governance

This constitution is the highest-priority project governance document. Repository guidelines and
feature specifications MUST comply with it; where documents conflict, this constitution controls.

Amendments MUST be proposed in writing with the affected principles, rationale, compatibility
impact, and any required migration plan. Approval requires project maintainer review. The amended
constitution MUST include an updated Sync Impact Report, semantic version, and amendment date.

Versions follow semantic versioning: MAJOR for incompatible principle removals or redefinitions,
MINOR for new principles or materially expanded obligations, and PATCH for non-semantic
clarifications. Every pull request review MUST verify constitutional compliance. Any exception MUST
be documented in the pull request with its scope, rationale, owner, and removal or review date.

**Version**: 1.0.0 | **Ratified**: 2026-08-18 | **Last Amended**: 2026-08-18
