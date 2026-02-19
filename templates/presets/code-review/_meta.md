---
id: code-review
name: Code Review & Refactoring
description: A specialized code review team with a review coordinator and three domain experts covering security, performance, and code quality.
category: review
tags: [review, refactoring, security, performance, quality]
recommended-plan: max5x
---

## Agent Roster

| Agent | Role Type | Default Model | Default Color | Description |
|-------|-----------|---------------|---------------|-------------|
| review-coordinator | lead | inherit | blue | Coordinates reviews, assigns specialists, issues merge verdicts |
| security-reviewer | specialist | sonnet | red | OWASP Top 10, dependency audit, auth pattern analysis |
| performance-optimizer | specialist | sonnet | yellow | Algorithm complexity, query efficiency, bundle size, caching |
| code-quality-analyst | specialist | haiku | green | SOLID, DRY, naming, documentation, test quality |

## Best Suited For
- PR review workflows requiring structured, multi-domain analysis
- Security audits and compliance checks
- Large refactoring validation
- Teams needing consistent, documented review processes

## Assumed Tech Stack
- Any TypeScript/JavaScript project
- Node.js ecosystem (npm audit)
- Git-based workflow with pull requests
