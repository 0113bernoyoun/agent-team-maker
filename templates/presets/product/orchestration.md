<!-- ADAPTATION GUIDE
When applying this orchestration to a specific project, customize the following:
- Trigger keywords: Add project-specific terminology (e.g., your framework names, domain terms)
- Workflows: Adjust steps based on your team's SDLC (e.g., Kanban vs Scrum, CI/CD pipeline)
- Quality gates: Add project-specific checks (e.g., performance benchmarks, compliance requirements)
- Intervention policy: Adjust critical/standard/low-risk based on your team's maturity and risk tolerance
- Communication protocol: Adapt task/status/contract/QA formats to match your project management tools
- Sprint cycle: Modify the sprint workflow to match your team's cadence (1-week, 2-week, etc.)
-->

## Agent Hierarchy

**Lead**: product-manager

| Agent | Delegates To | Reports To | Collaborates With |
|-------|-------------|------------|-------------------|
| product-manager | sprint-planner, product-frontend-dev, product-backend-dev, product-qa | -- | -- |
| sprint-planner | -- | product-manager | product-frontend-dev, product-backend-dev |
| product-frontend-dev | -- | product-manager | product-backend-dev, product-qa |
| product-backend-dev | product-qa | product-manager | product-frontend-dev, product-qa |
| product-qa | -- | product-manager | product-frontend-dev, product-backend-dev |

## Trigger Matrix

| Situation | Primary Agent | Secondary Agent | Keywords |
|-----------|--------------|-----------------|----------|
| Feature planning and sprint work | product-manager | sprint-planner | feature, sprint, planning, roadmap, backlog, priority |
| Task decomposition and estimation | sprint-planner | product-manager | breakdown, estimate, task, story points, capacity |
| Frontend feature implementation | product-frontend-dev | -- | UI, component, page, frontend, React, CSS, layout |
| Backend feature implementation | product-backend-dev | -- | API, endpoint, database, migration, backend, server |
| Full-stack feature (frontend + backend) | product-manager | sprint-planner | full feature, end-to-end, implement feature |
| Testing and QA | product-qa | -- | test, QA, bug, regression, verification, release |
| Bug fix | product-manager | product-qa | bug, fix, issue, broken, error, defect |

## Intervention Policy

### Critical
- **Database schema changes**: product-manager must approve migration plan
- **Authentication/security changes**: product-manager reviews with backend dev
- **Release deployment**: product-qa must sign off, product-manager approves
- **Sprint scope changes**: product-manager must approve and communicate

### Standard
- **New feature implementation**: product-manager reviews on completion
- **API contract changes**: Both frontend and backend devs must agree
- **Bug fix implementation**: product-qa verifies fix
- **Performance optimization**: product-manager reviews metrics

### Low Risk (no approval needed)
- Styling and CSS adjustments
- Code refactoring within single component
- Adding logging or monitoring
- Documentation updates
- Test additions
- Minor UI text changes

## Workflows

### Feature Development
End-to-end feature development from requirements to release.

1. **product-manager**: Define requirements and user stories
2. **sprint-planner**: Break down into tasks and plan sprint
3. **product-backend-dev**: Implement API and backend logic
4. **product-frontend-dev**: Implement UI and integrate with API
5. **product-qa**: Test against acceptance criteria
6. **product-manager**: Review and approve for release

### Bug Fix
Systematic bug investigation, fix, and verification.

1. **product-manager**: Triage and prioritize bug
2. **product-qa**: Reproduce and document bug details
3. **product-frontend-dev**: Fix bug (or product-backend-dev if backend issue)
4. **product-qa**: Verify fix and regression test
5. **product-manager**: Close bug and update release notes

### Sprint Cycle
Standard sprint planning and execution cycle.

1. **product-manager**: Prioritize backlog for next sprint
2. **sprint-planner**: Plan sprint with task assignments
3. **product-frontend-dev**: Execute frontend tasks
4. **product-backend-dev**: Execute backend tasks
5. **product-qa**: Sprint testing and validation
6. **product-manager**: Sprint review and retrospective

## Communication Protocol

### Inter-Agent Communication Protocol

**Task Assignment** (product-manager -> team):
```
TASK: [Title]
STORY: [Parent user story reference]
ASSIGNEE: [Agent name]
PRIORITY: [P0-P3]
SPRINT: [Sprint number]
ACCEPTANCE CRITERIA:
- [Criterion 1]
- [Criterion 2]
DEPENDENCIES: [List of dependent tasks]
```

**Status Update** (team -> product-manager):
```
UPDATE: [Task title]
STATUS: Not Started | In Progress | Complete | Blocked
PROGRESS: [% or description]
BLOCKERS: [Any blockers]
ETA: [Estimated completion]
```

**API Contract** (product-backend-dev <-> product-frontend-dev):
```
CONTRACT: [Endpoint name]
METHOD: [HTTP method]
PATH: [URL path]
REQUEST: [Schema]
RESPONSE: [Schema]
STATUS: Draft | Agreed | Implemented
```

**QA Report** (product-qa -> product-manager):
```
QA: [Feature/Sprint]
VERDICT: Pass | Fail | Blocked
TESTS: [X passed / Y total]
BUGS: [List of bugs found]
RECOMMENDATION: [Release ready or not]
```

## Quality Gates

### Feature Completeness
**Owner**: product-manager
- All acceptance criteria met
- User story requirements fully implemented
- Edge cases handled appropriately
- Documentation updated
- Release notes prepared

### Code Quality
**Owner**: product-manager
- Code follows project conventions
- No console errors or warnings
- Error handling is comprehensive
- Performance within acceptable limits
- Security best practices followed

### QA Validation
**Owner**: product-qa
- All test cases passed
- No critical or high severity bugs open
- Regression tests passed
- Cross-browser testing completed (if applicable)
- Performance benchmarks met

## Escalation Paths

| From | To | Conditions |
|------|----|-----------|
| sprint-planner | product-manager | Capacity exceeds velocity, Unclear requirements, Dependency conflicts |
| product-frontend-dev | product-manager | Missing API contracts, Scope creep identified, Technical blocker |
| product-backend-dev | product-manager | Schema change needed, Security concern, Third-party dependency issue |
| product-qa | product-manager | Critical bug found, Acceptance criteria unclear, Release blocker identified |
