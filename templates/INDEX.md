# Agent Team Maker — Template Index

This file is a catalog for Claude Code. Read it first to select a preset or plan free-form team generation.
It is not user-facing documentation — it is an operational reference.

---

## Preset Catalog

| ID | Name | Agents | Category | Best For |
|----|------|--------|----------|----------|
| fullstack-web | Fullstack Web Development | 6 (tech-lead, product-manager, frontend-team-lead, backend-team-lead, ui-developer, api-developer) | development | React + Node.js projects, full team with two-tier orchestration |
| code-review | Code Review & Refactoring | 4 (review-coordinator, security-reviewer, performance-optimizer, code-quality-analyst) | review | PR reviews, security audits, refactoring validation, dependency updates |
| data-ml | Data & ML Engineering | 4 (data-architect, data-engineer, ml-engineer, data-analyst) | data | Data pipelines, ML model lifecycle, analytics and reporting |
| docs | Documentation Team | 3 (docs-strategist, technical-writer, diagram-specialist) | docs | API docs, tutorials, architecture diagrams, documentation overhauls |
| product | Product Development Team | 5 (product-manager, sprint-planner, product-frontend-dev, product-backend-dev, product-qa) | product | Sprint-based feature development with integrated QA |

---

## Preset Selection Guide

Match user intent to a preset by scanning for these signals.

### fullstack-web
- Keywords: React, Next.js, Node.js, Express, fullstack, frontend and backend, REST API, PostgreSQL, TypeScript web app
- Signals: User mentions both a UI layer and a server/API layer; project has or needs component + endpoint work
- Team size signal: User wants a full team with tech lead oversight and individual contributors
- Avoid if: The project is backend-only, data-focused, or the user only wants review work

### code-review
- Keywords: PR review, code review, security audit, refactoring, vulnerability scan, technical debt, merge decision
- Signals: User has existing code to evaluate rather than new code to build; asking for quality or safety assessment
- Team size signal: User wants structured review with specialist domains (security, performance, quality)
- Avoid if: The user wants to build something new, not review something existing

### data-ml
- Keywords: data pipeline, ETL, ML model, training, inference, analytics, data warehouse, Spark, Airflow, dbt, Python data stack
- Signals: Project centers on data movement, transformation, modeling, or machine learning workflows
- Team size signal: User needs separation between infrastructure (pipeline) and analytics/ML work
- Avoid if: The project is a standard web app that happens to have a database

### docs
- Keywords: documentation, API docs, README, technical writing, architecture diagrams, tutorials, changelog, OpenAPI
- Signals: User wants to produce written documentation, not build or review code; content creation is the primary output
- Team size signal: Small focused team; user does not need engineering roles
- Avoid if: Documentation is a side task in a larger engineering effort — add a docs agent to another preset instead

### product
- Keywords: sprint, agile, product roadmap, feature delivery, QA, acceptance testing, backlog, story points
- Signals: User wants end-to-end feature delivery with planning and testing included; mentions sprint cadence or QA sign-off
- Team size signal: User needs product management discipline built into the team, not just engineering
- Avoid if: User wants pure engineering without sprint structure or wants a tech-lead-driven architecture focus

---

## Free-Form Generation Guide

Use free-form generation when no preset fits the user's context. Common triggers:
- User describes a niche domain (game development, embedded systems, blockchain, hardware tooling)
- User wants fewer agents than any preset provides
- User explicitly declines a preset suggestion
- User's tech stack has no meaningful overlap with any preset (e.g., pure Rust, Go microservices, mobile-only)
- User wants a hybrid (e.g., "a review team that can also write docs")

### Process

1. **Analyze needs**: Ask for project type, tech stack, team size preference, and primary workflows if not provided
2. **Design roles**: Define 2–6 agents. Each agent needs: a clear single responsibility, a lead/contributor designation, and a reporting relationship
3. **Compose from fragments**: Pull role patterns, communication formats, and quality gates from the fragments/ directory to avoid writing from scratch
4. **Compose agents**: Write YAML frontmatter + system prompt for each agent
5. **Compose orchestration**: Generate the CLAUDE.md orchestration section covering hierarchy, trigger matrix, workflows, and quality gates

### Agent Design Heuristics

- 2–3 agents: flat structure, all report to user; no sub-delegation needed
- 4–5 agents: one lead agent + 3–4 contributors; lead handles orchestration
- 6+ agents: two-tier hierarchy (lead → team leads → contributors); requires explicit escalation paths
- Every team needs at least one agent with Read+Grep+Glob for analysis work
- Implementer agents (those who write code or content) need Edit+Write in their tools list
- The lead agent should use `model: inherit` so it matches the user's active model

### When Preset is Close But Not Exact

Adapt rather than reject. If a user building a Vue + Django project asks for a team, `fullstack-web` is the right
starting point — replace React references with Vue and Express/Node with Django throughout the system prompts.
This is faster and produces better results than free-form generation from scratch.

---

## Template Directory Structure

```
templates/
├── INDEX.md                  ← this file
├── GENERATION-GUIDE.md       ← procedural guide for Claude Code
├── fragments/                ← reusable prompt building blocks
│   └── ...
└── presets/
    ├── fullstack-web/
    │   ├── _meta.md          ← agent roster, orchestration summary
    │   ├── orchestration.md  ← CLAUDE.md orchestration section template
    │   └── agents/
    │       ├── tech-lead.md
    │       ├── product-manager.md
    │       ├── frontend-team-lead.md
    │       ├── backend-team-lead.md
    │       ├── ui-developer.md
    │       └── api-developer.md
    ├── code-review/
    │   └── agents/
    │       ├── review-coordinator.md
    │       ├── security-reviewer.md
    │       ├── performance-optimizer.md
    │       └── code-quality-analyst.md
    ├── data-ml/
    │   └── agents/
    │       ├── data-architect.md
    │       ├── data-engineer.md
    │       ├── ml-engineer.md
    │       └── data-analyst.md
    ├── docs/
    │   └── agents/
    │       ├── docs-strategist.md
    │       ├── technical-writer.md
    │       └── diagram-specialist.md
    └── product/
        └── agents/
            ├── product-manager.md
            ├── sprint-planner.md
            ├── product-frontend-dev.md
            ├── product-backend-dev.md
            └── product-qa.md
```

Note: Preset agent files in `templates/presets/` are static blueprints used as references when generating
adapted agent files for a user's project. The source of truth for preset definitions is `src/presets/*.ts`.
