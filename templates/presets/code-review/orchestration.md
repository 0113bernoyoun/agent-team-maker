<!-- ADAPTATION GUIDE
When adapting this orchestration for a user's project:

Keep as-is:
- Review workflow structure (triage -> assign -> review -> synthesize -> verdict)
- Severity rating system alignment across reviewers
- Quality gate structure (Security Gate, Performance Gate, Quality Gate)
- Communication hierarchy (coordinator as single authority)

Adapt to user's project:
- File pattern triggers -> user's actual file structure patterns
- npm audit -> user's package manager
- Performance thresholds -> project-specific SLAs
- Technology-specific checks -> user's frameworks
-->

## Agent Hierarchy

- **Lead**: review-coordinator
- **Structure**:
  - **review-coordinator**
    - collaborates_with: security-reviewer, performance-optimizer, code-quality-analyst
    - delegates_to: security-reviewer, performance-optimizer, code-quality-analyst
  - **security-reviewer**
    - reports_to: review-coordinator
    - collaborates_with: performance-optimizer, code-quality-analyst
  - **performance-optimizer**
    - reports_to: review-coordinator
    - collaborates_with: security-reviewer, code-quality-analyst
  - **code-quality-analyst**
    - reports_to: review-coordinator
    - collaborates_with: security-reviewer, performance-optimizer

### Permission Table

| Agent | Can Delegate To | Reports To | Collaborates With |
|-------|----------------|------------|-------------------|
| review-coordinator | security-reviewer, performance-optimizer, code-quality-analyst | -- | security-reviewer, performance-optimizer, code-quality-analyst |
| security-reviewer | -- | review-coordinator | performance-optimizer, code-quality-analyst |
| performance-optimizer | -- | review-coordinator | security-reviewer, code-quality-analyst |
| code-quality-analyst | -- | review-coordinator | security-reviewer, performance-optimizer |

## Trigger Matrix

| Situation | Primary Agent | Secondary Agent | Keywords |
|-----------|--------------|-----------------|----------|
| Security-sensitive file changes: auth, payments, sessions, cryptography | security-reviewer | review-coordinator | auth, authentication, authorization, login, logout, password, token, JWT, OAuth, session, cookie, crypto, encrypt, decrypt, hash, payment, billing, OWASP, XSS, CSRF, injection, vulnerability, CVE, secret, API key, credential, privilege |
| Performance hotspot changes: database queries, API endpoints, algorithms on large data | performance-optimizer | review-coordinator | query, database, SQL, Prisma, ORM, index, N+1, pagination, cache, caching, Redis, bundle, lazy load, code split, algorithm, complexity, O(n), loop, iteration, async, await, Promise.all, memory, leak, bottleneck, slow, performance, throughput, latency |
| Code quality review: new modules, refactoring, naming, patterns, documentation | code-quality-analyst | review-coordinator | refactor, refactoring, clean up, rename, extract, reorganize, quality, maintainability, readability, SOLID, DRY, naming, convention, pattern, anti-pattern, code smell, technical debt, documentation, comment, JSDoc, test coverage, unit test, integration test |
| Full PR review: pull request submitted for comprehensive review | review-coordinator | -- | PR, pull request, review, merge, approve, LGTM, code review, diff, changes, ready for review, please review, check this PR, review this, feedback |
| Refactoring validation: large-scale restructuring needs quality and safety checks | code-quality-analyst | security-reviewer | refactor, restructure, reorganize, rewrite, migrate, extract service, extract module, split, consolidate, simplify, modernize, upgrade, redesign |
| Dependency updates: package additions, upgrades, or removals | security-reviewer | performance-optimizer | dependency, dependencies, package, npm, yarn, pnpm, package.json, lockfile, package-lock, yarn.lock, upgrade, update, install, add package, remove package, audit, CVE, vulnerability, outdated, deprecated |

## Intervention Policy

### Critical

| Situation | Action |
|-----------|--------|
| Security vulnerability of Critical or High severity discovered | review-coordinator issues BLOCKED verdict immediately. Security finding is documented in full with severity, attack scenario, and required remediation. No other reviewer findings are needed to block -- security Critical findings block unconditionally. Author must fix and request a fresh security review before the change is reconsidered. |
| Data exposure risk: PII, credentials, or secrets in logs, responses, or source code | security-reviewer escalates to review-coordinator immediately with a CRITICAL finding. review-coordinator issues BLOCKED verdict. The finding must identify every location where the data exposure occurs, not just the first instance found. |
| Authentication or authorization bypass discovered | security-reviewer escalates to review-coordinator with CRITICAL severity. review-coordinator issues BLOCKED verdict and notifies any humans responsible for the affected system of the potential vulnerability window if the code has been deployed previously. |

### Standard

| Situation | Action |
|-----------|--------|
| Performance regression: HIGH severity finding would degrade production SLAs | performance-optimizer documents the finding with before/after estimates and routes to review-coordinator. review-coordinator issues CHANGES REQUIRED verdict. The author must provide either a fix or a documented performance impact assessment accepted by the team before merge. |
| Code quality: systemic DRY or SOLID violation across multiple files | code-quality-analyst documents all affected files and routes to review-coordinator. review-coordinator issues CHANGES REQUIRED verdict. The author must address the pattern holistically, not just fix the specific line flagged. |
| Missing tests for non-trivial business logic introduced in the PR | code-quality-analyst flags as MEDIUM finding. review-coordinator includes test requirement in CHANGES REQUIRED verdict. Tests must cover at least the happy path and the primary error case for each new function. |
| Dependency added without clear justification or with a known security advisory | security-reviewer audits the dependency with npm audit and documents findings. performance-optimizer assesses bundle size impact. review-coordinator synthesizes and issues CHANGES REQUIRED if concerns are unresolved, or documents the accepted rationale in the REVIEW SUMMARY. |

### Low Risk

The following changes can be approved with minimal review (code-quality-analyst check alone is sufficient):

- Adding or updating inline code comments and documentation strings
- Renaming variables or functions for clarity within a single file
- Minor formatting adjustments consistent with the project linter rules
- Adding unit tests for existing, previously untested code paths
- Updating configuration values within established ranges
- Removing dead code that has no callers (verify with Grep before approving)
- Extracting a magic string or number into a named constant within the same file

## Workflows

### PR Review

Standard workflow for reviewing a pull request before merge. Covers security, performance, and code quality with a final coordinator verdict.

1. **review-coordinator**: Receive the review request. Use Glob to identify all changed files. Classify risk level (Critical, Standard, Low Risk). Determine which specialist reviewers are needed based on the triage protocol. Issue REVIEW ASSIGNMENT to each selected reviewer specifying scope and focus areas.
   - Next: Assigned reviewers begin parallel analysis
2. **security-reviewer**: Perform security analysis on assigned files. Apply OWASP Top 10 checklist, trace data flows, audit authentication and authorization logic, run npm audit if package files changed. Produce SECURITY FINDINGS REPORT and submit to review-coordinator.
   - Next: Findings submitted to review-coordinator
3. **performance-optimizer**: Perform performance analysis on assigned files. Identify algorithmic complexity issues, database query anti-patterns, bundle size impacts, and caching opportunities. Produce PERFORMANCE FINDINGS REPORT with before/after estimates and submit to review-coordinator.
   - Next: Findings submitted to review-coordinator
4. **code-quality-analyst**: Perform code quality analysis on assigned files. Assess SOLID principles, DRY violations, naming conventions, function design, test quality, and documentation completeness. Produce CODE QUALITY FINDINGS REPORT and submit to review-coordinator.
   - Next: Findings submitted to review-coordinator
5. **review-coordinator**: Collect all specialist findings. Apply quality gates (Security Gate, Performance Gate, Quality Gate). Synthesize findings into a unified REVIEW SUMMARY. Issue final MERGE DECISION: APPROVED, CHANGES REQUIRED, or BLOCKED. Communicate verdict and required actions to the author.

### Security Audit

Dedicated security audit workflow for high-risk areas, compliance requirements, or pre-release security sweeps.

1. **review-coordinator**: Define the audit scope: specific module, service, or feature. Use Glob to enumerate all files in scope. Identify high-risk entry points, data flows involving PII or credentials, and external integrations. Brief security-reviewer on the audit objectives and any known concerns.
   - Next: security-reviewer begins comprehensive audit
2. **security-reviewer**: Conduct comprehensive OWASP Top 10 sweep across all files in scope. Map the full attack surface. Trace every data flow involving user input, sensitive data, or external systems. Run npm audit. Produce a full SECURITY FINDINGS REPORT with all findings categorized by severity.
   - Next: Findings submitted; performance-optimizer reviews data pipeline paths
3. **performance-optimizer**: Review data pipeline paths identified by security-reviewer for performance implications. Verify that security controls (input validation, rate limiting, encryption) do not introduce unacceptable latency. Flag any performance-security trade-offs that need a design decision.
   - Next: Findings submitted to review-coordinator
4. **review-coordinator**: Synthesize security and performance findings. Produce the REVIEW SUMMARY with all findings ranked by severity. Issue overall audit verdict. For Critical or High findings, produce a remediation plan with priorities, owners, and target resolution dates.

### Refactoring Review

Focused workflow for validating that a refactoring improves quality without introducing regressions in security, performance, or correctness.

1. **review-coordinator**: Receive the refactoring for review. Use Glob and Bash (git diff --stat) to understand the scope and scale of the change. Identify the stated goal of the refactoring. Assign code-quality-analyst as lead reviewer and security-reviewer to verify no security regressions.
   - Next: Parallel review by code-quality-analyst and security-reviewer
2. **code-quality-analyst**: Evaluate whether the refactoring achieves its stated goal: improved clarity, reduced duplication, better SOLID compliance, or simpler structure. Verify naming is improved or at minimum not degraded. Assess test coverage before and after. Produce CODE QUALITY FINDINGS REPORT.
   - Next: Findings submitted to review-coordinator
3. **security-reviewer**: Audit the refactored code for security regressions: verify that security controls present before the refactoring are preserved. Check that reorganization has not removed or weakened input validation, authorization checks, or data sanitization. Report any regressions as findings.
   - Next: Findings submitted to review-coordinator
4. **review-coordinator**: Synthesize findings. Assess whether the refactoring is a net improvement: does it achieve its goal without introducing regressions? Issue MERGE DECISION: APPROVED if the refactoring is a clear improvement with no blocking findings, CHANGES REQUIRED if the refactoring is sound but needs specific adjustments, BLOCKED if the refactoring introduces regressions or fails to achieve its stated goal.

## Communication Protocol

### Overview

All agents in the code-review team communicate through structured, documented formats. review-coordinator is the single point of contact for review requests and the sole issuer of merge decisions. Specialist reviewers communicate their findings exclusively to review-coordinator using the prescribed report formats.

### Communication Hierarchy

```
         review-coordinator
              |
    +---------+---------+
    |         |         |
security-  performance-  code-quality-
reviewer   optimizer    analyst
```

### Reporting Lines

- **security-reviewer**, **performance-optimizer**, and **code-quality-analyst** report findings to **review-coordinator** only.
- Specialists do not issue merge decisions -- only **review-coordinator** issues the final verdict.
- Specialists may collaborate with each other to cross-reference findings (e.g., security-reviewer flagging a performance implication, code-quality-analyst noting a pattern that compounds a security risk), but all communications go through review-coordinator.

### Message Types and Formats

#### 1. Review Assignment (review-coordinator -> Specialist)
Used when dispatching a specialist to review specific files. Must include: reviewer name, file scope, focus areas, risk level, and when findings are needed.

#### 2. Specialist Findings Report (Specialist -> review-coordinator)
Each specialist uses their prescribed report format:
- security-reviewer: SECURITY FINDINGS REPORT
- performance-optimizer: PERFORMANCE FINDINGS REPORT
- code-quality-analyst: CODE QUALITY FINDINGS REPORT

All reports include: scope, severity counts, individual findings with code examples and remediation, and a domain-specific verdict (PASS / FAIL).

#### 3. Review Summary and Merge Decision (review-coordinator -> Author)
After collecting all specialist reports, review-coordinator synthesizes the REVIEW SUMMARY and issues the MERGE DECISION (APPROVED, CHANGES REQUIRED, or BLOCKED) with clear rationale and required actions.

#### 4. Cross-Specialist Observation (Specialist -> review-coordinator, flagged for other specialist)
When a specialist notices something outside their primary domain that another specialist should verify, they include a note in their report marked as "Cross-Specialist Observation." review-coordinator then decides whether to request additional analysis from the relevant specialist.

### Severity Rating Alignment

All three specialists use compatible severity systems:

| Severity | Security | Performance | Quality | Merge Impact |
|----------|----------|-------------|---------|--------------|
| Critical | Auth bypass, RCE, data exposure | -- | -- | Always BLOCKED |
| High | OWASP vulnerability, CVE | Production SLA regression | Systemic DRY/SOLID violation | BLOCKED or CHANGES REQUIRED |
| Medium | Defense-in-depth gap | Moderate inefficiency | Named pattern violation | CHANGES REQUIRED |
| Low | Best practice gap | Minor optimization | Style or readability | Recommended |
| Informational | Awareness item | Scale consideration | Pattern note | No action required |

## Quality Gates

All three gates must pass for an APPROVED verdict.

### Security Gate (security-reviewer)

- No Critical severity security findings (authentication bypass, RCE, data exposure, SQL injection)
- No High severity security findings (IDOR, weak cryptography in active use, XSS in authenticated context)
- All user inputs are validated before processing -- no raw user data reaches database queries or system commands
- Authentication and authorization are enforced at appropriate layers -- not ad-hoc or client-side only
- No credentials, API keys, or secrets are present in source code or committed files
- Sensitive data (PII, passwords, tokens) is not present in logs or API responses
- Dependency changes have been audited with npm audit and no known HIGH or CRITICAL CVEs are introduced
- CORS configuration is explicit and does not use wildcard origins in production contexts
- File upload endpoints (if present) validate file type, size, and store files outside the web root
- Rate limiting is present on authentication endpoints and other abuse-sensitive routes

### Performance Gate (performance-optimizer)

- No N+1 database queries on any endpoint expected to serve lists or collections
- All list endpoints implement pagination -- no unbounded queries returning unlimited rows
- New database queries on frequently-called paths have appropriate index coverage
- No synchronous blocking operations (fs.readFileSync, execSync) in request handlers
- Multiple independent async operations are parallelized with Promise.all rather than awaited serially
- No algorithm with O(n^2) or worse complexity on data sets that can grow unbounded
- Frontend bundle size increase per PR does not exceed 50KB without documented justification
- React components with expensive computations or callbacks are memoized appropriately
- useEffect hooks with subscriptions, timers, or listeners return cleanup functions to prevent memory leaks
- Caching is applied for high-read, low-write data where cache invalidation is well-defined

### Quality Gate (code-quality-analyst)

- No HIGH severity code quality findings (systemic DRY violations, severe SOLID violations, misleading naming)
- New non-trivial functions have unit tests covering at least the happy path and primary error case
- Public APIs (exported functions, components, classes) have JSDoc or TSDoc documentation
- Function names accurately describe what the function does -- no misleading or overly generic names
- No business logic is duplicated across two or more files when it could be shared
- New modules have a clear, single responsibility -- no modules that import from many unrelated domains
- No functions exceeding 100 lines without strong justification
- No commented-out code blocks left in the codebase
- No console.log, console.debug, or temporary debug statements in production code
- Naming conventions are consistent with the established project style for the file type and language

## Escalation Paths

### security-reviewer -> review-coordinator

- Any Critical severity finding is identified -- escalate immediately without waiting for full report completion
- A High severity finding is identified that may require architectural changes beyond the PR scope
- A dependency has a known CVE of HIGH or CRITICAL severity
- Authentication or authorization logic is changed in a way that may affect the security model of the entire system
- PII, credentials, or secrets are found in source code or configuration files
- A vulnerability is found in code that appears to have already been deployed to production

### performance-optimizer -> review-coordinator

- A High severity performance finding would require infrastructure changes (new caching layer, database index additions in production, query restructuring) beyond a simple code fix
- An endpoint is identified with no pagination that is expected to serve large data sets in production
- A performance regression would affect multiple teams or services beyond the PR scope
- A trade-off between security controls and performance requires a design decision from stakeholders
- Bundle size impact is large enough to require a product decision about acceptable load time trade-offs

### code-quality-analyst -> review-coordinator

- A HIGH finding involves systemic duplication or violation spanning many files beyond the current PR
- Test coverage is so insufficient that the PR cannot be safely reviewed for correctness
- A naming or structural issue affects a public API that other teams depend on, making the fix potentially breaking
- A SOLID violation would require a significant refactoring of adjacent code not included in this PR
- The refactoring under review has made the code objectively worse than before -- this needs a BLOCKED verdict

### Quick Start

1. A review request arrives. **review-coordinator** triages it using Glob and the file pattern triggers.
2. Based on risk level and file patterns, **review-coordinator** assigns one or more specialists with a REVIEW ASSIGNMENT.
3. Specialists analyze their assigned files in parallel and produce their respective FINDINGS REPORTS.
4. **review-coordinator** collects all reports, applies the three quality gates, and synthesizes a REVIEW SUMMARY.
5. **review-coordinator** issues the MERGE DECISION (APPROVED, CHANGES REQUIRED, or BLOCKED) with rationale and next steps.
