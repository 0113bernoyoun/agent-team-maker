# Orchestration Fragment

Reusable orchestration patterns for agent hierarchy, workflows, intervention policy,
and escalation. Compose these into CLAUDE.md orchestration configs or agent system prompts.

---

## Hierarchy Templates

### Flat Team (coordinator + specialists)
Best for: small focused tasks, < 5 agents, single domain work.

```
coordinator
    │
    ├── specialist-a
    ├── specialist-b
    └── specialist-c
```

Orchestration config sketch:
```
hierarchy:
  lead: coordinator
  structure:
    - agent: coordinator
      delegates_to: [specialist-a, specialist-b, specialist-c]
    - agent: specialist-a
      reports_to: coordinator
    - agent: specialist-b
      reports_to: coordinator
    - agent: specialist-c
      reports_to: coordinator
```

### Two-Level (lead → team leads → ICs)
Best for: multi-domain projects, 6–10 agents, clear functional separation.

```
               lead
                │
        ┌───────┴───────┐
   team-lead-a      team-lead-b
        │                │
    ┌───┴───┐        ┌───┴───┐
   ic-a-1  ic-a-2  ic-b-1  ic-b-2
```

Orchestration config sketch:
```
hierarchy:
  lead: lead
  structure:
    - agent: lead
      delegates_to: [team-lead-a, team-lead-b]
    - agent: team-lead-a
      reports_to: lead
      delegates_to: [ic-a-1, ic-a-2]
    - agent: team-lead-b
      reports_to: lead
      delegates_to: [ic-b-1, ic-b-2]
    - agent: ic-a-1
      reports_to: team-lead-a
    - agent: ic-a-2
      reports_to: team-lead-a
    - agent: ic-b-1
      reports_to: team-lead-b
    - agent: ic-b-2
      reports_to: team-lead-b
```

### Hub-and-Spoke (central coordinator dispatching to peers)
Best for: cross-functional tasks where specialists are independent, no sub-delegation.

```
             coordinator
            /     |      \
    domain-a  domain-b  domain-c
```

Orchestration config sketch:
```
hierarchy:
  lead: coordinator
  structure:
    - agent: coordinator
      delegates_to: [domain-a, domain-b, domain-c]
    - agent: domain-a
      reports_to: coordinator
      collaborates_with: [domain-b, domain-c]
    - agent: domain-b
      reports_to: coordinator
      collaborates_with: [domain-a, domain-c]
    - agent: domain-c
      reports_to: coordinator
      collaborates_with: [domain-a, domain-b]
```

---

## Workflow Templates

Paste the relevant workflow into the `workflows` array of an orchestration config.
Adjust agent names to match the actual team roster.

### Feature Development
End-to-end delivery from requirements through release.

```
Workflow: New Feature Development
Description: Coordinates product, design, and engineering to deliver a new feature
             from user story to production-ready code.

Steps:
1. [product-lead] Define user story with acceptance criteria, success metrics, and
   explicit out-of-scope items. Confirm feasibility with tech-lead.
   → engineering-lead receives specification

2. [engineering-lead] Break down the specification into technical tasks. Negotiate
   any shared interface contracts (API, data schema) with peer teams before work starts.
   → specialists receive delegated tasks in parallel

3. [specialist] Implement assigned task per technical specification. Self-review
   against the quality gate checklist. Submit for review when acceptance criteria are met.
   → engineering-lead conducts code review

4. [engineering-lead] Review implementation against quality gates. Approve or return
   with documented change requests. Verify integration in shared staging environment.
   → product-lead verifies acceptance criteria

5. [product-lead] Confirm all acceptance criteria are met in staging. Verify success
   metric instrumentation is in place. Approve for production release.
```

### Bug Fix
Structured triage-to-verified-fix flow.

```
Workflow: Bug Fix
Description: Investigates a reported defect, implements a targeted fix, and verifies
             resolution without introducing regressions.

Steps:
1. [lead] Triage the bug report. Assign severity (Critical / High / Medium / Low).
   Route to the agent responsible for the affected system layer.
   → assigned agent investigates

2. [assigned-agent] Reproduce the issue locally. Write a failing test that captures
   the bug before writing any fix — this becomes the regression guard.
   → fix implementation begins

3. [assigned-agent] Implement the minimal fix that makes the failing test pass without
   breaking any existing tests. Review the changeset for unintended side effects.
   → lead reviews the fix

4. [lead] Review the fix: verify root cause is addressed (not just symptoms), the
   regression test is in place, and no new issues are introduced. Approve for merge.

5. [lead] Verify the fix in staging. For Critical or High severity, write a brief
   postmortem: root cause, timeline, impact, and one prevention action.
```

### Code Review
Structured review from submission to merge decision.

```
Workflow: Code Review
Description: Ensures all changes meet quality, security, and architectural standards
             before merging to the main branch.

Steps:
1. [author] Open pull request with: summary of changes, motivation (link to task or
   issue), testing instructions, and self-review checklist completed. Assign reviewer.
   → reviewer receives the PR

2. [reviewer] Review against the domain quality gate checklist (see quality-gates.md).
   Approve, request changes with specific actionable comments, or escalate to the
   lead if architectural concerns are found.

3. [author] Address all review comments. Re-request review for significant changes;
   mark trivial comments as resolved and merge if reviewer has approved.

4. [lead] (if escalated) Conduct architectural review. Approve with documented
   rationale or return with required changes before the PR can proceed.
```

### Analytics / Data Investigation
From scoped question to documented insight.

```
Workflow: Analytics Investigation
Description: Answers a defined business question through structured querying,
             visualization, and documented findings.

Steps:
1. [analyst-lead] Clarify the question with the requester: what decision will this
   inform, what is the time frame, and what granularity is needed?
   → scope document agreed upon

2. [data-analyst] Write and validate queries against the agreed scope. Check for
   data quality issues (nulls, outliers, date gaps) before drawing conclusions.
   → query results reviewed by analyst-lead

3. [analyst-lead] Spot-check the query logic and results for correctness. Confirm
   the data source and time range match the agreed scope.
   → visualization and reporting begins

4. [data-analyst] Build charts, dashboards, or summary tables. Write a short narrative:
   key finding, supporting evidence, confidence level, and recommended action.

5. [analyst-lead] Review narrative for accuracy and clarity. Share findings with the
   requester and document in the agreed location (wiki, report folder, etc.).
```

---

## Intervention Policy Templates

### Critical (pre-approval required)
Work must stop until the lead reviews and approves before implementation begins.

```
critical:
  - situation: "Architecture changes that affect multiple agents, teams, or system-wide patterns"
    action: "Lead reviews impact, writes or reviews ADR, and explicitly approves before
             any implementation begins. All affected agents are briefed."

  - situation: "Security vulnerabilities or changes to authentication and authorization logic"
    action: "Lead is notified immediately. Work is treated as a blocker on all other tasks.
             A dedicated security review is mandatory before merging."

  - situation: "Production deployments or infrastructure changes"
    action: "Lead approves the deployment plan. All quality gate stages must pass.
             A rollback procedure must be documented before deployment proceeds."

  - situation: "Irreversible data operations (destructive migrations, bulk deletes, schema drops)"
    action: "Lead reviews the operation and a backup or rollback procedure is verified.
             The operation is tested in a non-production environment first."
```

### Standard (post-review)
Work can proceed, but the lead reviews before the output is shipped or merged.

```
standard:
  - situation: "New feature implementation spanning multiple agents or domains"
    action: "Agents negotiate interface contracts in writing before starting.
             Each agent's lead reviews the implementation. Integration is verified
             in a shared staging environment before merging."

  - situation: "Significant refactoring of existing modules"
    action: "The owning agent scopes the refactoring, confirms test coverage exists
             before starting, and the lead reviews all changes. Lead is notified
             if the refactoring crosses ownership boundaries."

  - situation: "Adding new external dependencies"
    action: "The agent evaluates the package for security, maintenance, and size impact.
             Lead is consulted for dependencies with architectural implications.
             A brief justification is included in the PR description."

  - situation: "Breaking changes to shared interfaces or contracts"
    action: "All consuming agents must agree in writing before implementation.
             A versioning or migration strategy is defined before work begins."
```

### Low Risk (autonomous)
Agents proceed without pre-approval; output may be spot-checked at the lead's discretion.

```
lowRisk:
  - "Styling adjustments, spacing, or color fixes within existing components"
  - "Fixing typos in user-facing strings or inline comments"
  - "Adding or improving log statements (non-sensitive data only)"
  - "Writing additional unit tests for existing code paths"
  - "Updating README, developer documentation, or inline JSDoc/TSDoc"
  - "Renaming local variables or improving readability within a single file"
  - "Adding Storybook stories or equivalent visual documentation for existing components"
```

---

## Escalation Pattern Templates

### Escalation Conditions by Role Tier

**Individual Contributor → Team Lead**
```
escalationPaths:
  - from: "specialist"
    to: "team-lead"
    conditions:
      - "Blocked on a task for more than 2 hours without a clear path forward"
      - "Technical specification is ambiguous or contradictory"
      - "Discovered a bug or security issue outside the scope of the current task"
      - "Implementation requires changes to files or systems outside owned scope"
      - "A new dependency is needed that was not in the original specification"
      - "Test failures that cannot be resolved without architectural changes"
```

**Team Lead → Lead / Coordinator**
```
escalationPaths:
  - from: "team-lead"
    to: "lead"
    conditions:
      - "Two teams or agents cannot reach agreement on a shared interface after two rounds"
      - "A decision has architectural implications beyond the team's scope"
      - "A security vulnerability affecting authentication or system-wide authorization is found"
      - "An infrastructure or deployment change is required to unblock the team"
      - "Performance issue requires infrastructure-level intervention (caching layer, replicas)"
      - "A breaking change to an existing contract affects external consumers"
```

### Escalation Message Format

Use this format when sending an escalation (see communication.md for the full template):

```
### ESCALATION REQUEST
- **To**: [Recipient]
- **From**: [Sender]
- **Urgency**: [Immediate / By end of day / Before next sprint]
- **Issue**: [What needs the recipient's authority or expertise]
- **Background**: [Context and investigation already done]
- **Options Considered**: [Alternatives with pros and cons]
- **My Recommendation**: [Preferred approach and reasoning]
- **Risk if Delayed**: [What breaks or worsens without a timely response]
- **Required Response**: [Specific approval, answer, or action needed]
```

### Escalation Timing Rules

Paste into the "Protocols" section of any team lead or coordinator prompt:

```
## Escalation Timing

- Critical severity: escalate immediately — do not wait for the next scheduled update.
- High severity: escalate within 1 hour of identifying the issue.
- Medium severity: escalate in the next scheduled status report unless it becomes a blocker.
- When escalating, always include your analysis and recommendation — do not escalate
  a raw problem without having investigated it first.
- The recipient must acknowledge the escalation and provide an ETA for response
  within 2 hours during working hours.
```
