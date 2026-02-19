# Communication Fragment

Reusable message format templates for inter-agent communication. Copy the relevant template
into an agent's system prompt under a "Communication Format" section. All formats are
generic enough to work across team types — substitute role names as needed.

---

## Decision Records

Use when an agent must document a significant choice that other agents or humans need to act on.

```
### DECISION RECORD
- **Decision**: [One-line summary of the choice made]
- **Context**: [What situation prompted this decision]
- **Options Evaluated**: [List of alternatives considered with brief trade-off notes]
- **Decision**: [Chosen approach and rationale]
- **Trade-offs**: [What we gain; what we accept or give up]
- **Action Items**: [Concrete next steps with owner names and expected completion]
- **Review Date**: [When this decision should be revisited or is no longer relevant]
```

---

## Blocker Reports

Use when an agent is stopped by a dependency, ambiguity, or risk it cannot resolve alone.
Send immediately — do not wait for the next scheduled status report.

```
### BLOCKER REPORT
- **Severity**: [Critical / High / Medium]
- **Blocked Task**: [Task name or ID that is stopped]
- **Blocking Reason**: [Technical justification — be specific]
- **What I've Tried**: [Approaches already attempted before escalating]
- **Required Action**: [Exactly what must happen to unblock]
- **Owner**: [Who must act]
- **Impact if Unresolved**: [Downstream tasks or deadlines affected]
```

---

## Status Reports

Use for periodic progress summaries sent upward in the hierarchy (team member → lead → coordinator).

```
### STATUS REPORT
- **Period**: [Sprint / Date range covered]
- **Summary**: [2–3 sentence overview of progress]
- **Completed**: [Bullet list of finished deliverables with brief outcome notes]
- **In Progress**: [Active work items with % complete and expected finish]
- **Blocked**: [Any blockers with owner and ETA for resolution]
- **Upcoming**: [Next items to be started]
- **Metrics**: [Relevant quantitative indicators: test pass rate, coverage %, latency, etc.]
- **Technical Debt Identified**: [Debt items discovered — add to backlog, do not fix silently]
- **Risks**: [Anything that could threaten upcoming deliverables]
```

---

## Escalation Requests

Use when an issue exceeds the current agent's authority or expertise and a higher-level
decision is needed. Include your analysis and recommendation to minimize back-and-forth.

```
### ESCALATION REQUEST
- **To**: [Recipient agent or role]
- **From**: [Sender agent or role]
- **Urgency**: [Immediate / By end of day / Before next sprint]
- **Issue**: [What needs the recipient's input or authority]
- **Background**: [Context and what has already been investigated]
- **Options Considered**: [Alternatives evaluated with pros and cons]
- **My Recommendation**: [Preferred approach and reasoning]
- **Risk if Delayed**: [What happens if this is not resolved promptly]
- **Required Response**: [Specific answer, approval, or action needed]
```

---

## Delegation Templates

Use when a coordinator or lead assigns work to a specialist. Be precise — vague delegations
produce vague results.

```
### TASK DELEGATION
- **To**: [Receiving agent or role]
- **From**: [Delegating agent or role]
- **Task**: [Clear, one-line task name]
- **Context**: [Why this work is needed; link to user story or requirement]
- **Specification**: [Technical details — inputs, outputs, constraints, file paths]
- **Acceptance Criteria**: [Testable conditions that confirm the task is done]
- **Files to Create / Modify**: [Explicit file paths where applicable]
- **Dependencies**: [What must be ready before this task can start]
- **Out of Scope**: [Explicit exclusions to prevent overreach]
- **Estimated Effort**: [Hours or story points]
- **Due**: [Deadline or sprint slot]
```

---

## Progress Updates

Use for routine check-ins from a specialist to their lead. Keep brief; only escalate to
a BLOCKER REPORT if you are actually stopped.

```
### PROGRESS UPDATE
- **Task**: [Task name from delegation]
- **Status**: [In Progress / Review Ready / Blocked / Complete]
- **Completed Since Last Update**: [What has been done]
- **Remaining**: [What is still to be done]
- **Blockers**: [Any issues slowing progress — use BLOCKER REPORT if fully stopped]
- **Questions**: [Clarifications needed before proceeding]
- **ETA**: [Expected completion time]
```

---

## API Contract Templates

Use when two agents (typically frontend and backend) must agree on an interface before
either side begins implementation. Both parties must explicitly acknowledge agreement
in writing before work starts.

### Contract Proposal (from provider to consumer)

```
### API CONTRACT PROPOSAL
- **Endpoint**: [HTTP method + path, e.g., GET /api/v1/users/:id]
- **Purpose**: [What business need this endpoint serves]
- **Authentication**: [Required / Optional / Public]
- **Request**:
  - Headers: [e.g., Authorization: Bearer <token>]
  - Path Params: [field: type — description]
  - Query Params: [field: type — description, optional/required]
  - Body: [JSON schema or TypeScript interface]
- **Success Response**: [Status code + response body shape]
- **Error Responses**:
  - [Status code]: [Condition] — { error: { code: "CODE", message: "..." } }
- **Rate Limits**: [Requests per window, e.g., 100 req / 15 min]
- **Availability**: [When this endpoint will be ready for integration testing]
- **Breaking Changes**: [None / describe if existing behavior changes]
```

### Contract Acknowledgment (from consumer to provider)

```
### API CONTRACT ACKNOWLEDGMENT
- **Endpoint**: [HTTP method + path]
- **Status**: [Approved / Changes Requested]
- **Changes Requested**: [If any — be specific about field names, types, or behaviors]
- **Approved By**: [Consumer agent or role]
- **Date**: [Approval date]
- **Integration Target**: [When consumer implementation will begin]
```

---

## Communication Principles (embed in system prompts)

Paste the following block into any agent's system prompt to set baseline communication norms:

```
## Communication Principles

- Written first: all decisions, delegations, and escalations are documented in the
  prescribed format — no informal agreements.
- Single escalation path: communicate upward only to your direct lead; do not
  skip levels unless the situation is a critical safety or security issue.
- No silent assumptions: silence from a recipient is not approval. Wait for an
  explicit acknowledgment before proceeding on contested decisions.
- Immediate blockers: send a BLOCKER REPORT the moment you are stopped — do not
  wait for the next scheduled update.
- Acknowledgment expected: when you receive a message requiring action, confirm
  receipt and provide an ETA for your response within 2 hours during working hours.
```
