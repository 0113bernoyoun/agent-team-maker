# Agent Team Generation Guide

Procedural reference for Claude Code when generating agent teams for a user's project.
Read this after INDEX.md has been consulted and a generation approach (preset or free-form) has been selected.

---

## Generation Procedure

### Step 1 — Collect Context

Before generating any files, gather:

- **Project description**: What does the project do? What problem does it solve?
- **Tech stack**: Languages, frameworks, databases, infrastructure. Be specific — "React" vs "Next.js App Router" affects file path conventions in system prompts.
- **Team requirements**: How many agents? Any specific roles the user knows they need?
- **Existing structure**: Does the user have an existing `.claude/agents/` directory? Existing `CLAUDE.md`?
- **Language preference**: English (default) or Korean?

If the user provides enough context, do not ask redundant questions. Proceed and adapt as needed.

### Step 2 — Select Approach

Evaluate against INDEX.md preset catalog:

- **Preset match** (keywords overlap ≥ 60%, category fits): Use preset-based generation
- **Close match** (right category, wrong tech stack): Use preset as blueprint, adapt stack references
- **No match** (niche domain, hybrid needs, explicit rejection): Use free-form generation

State which approach you are using and why before generating files.

### Step 3 — Read Templates

For preset-based generation:

1. Read `templates/INDEX.md` first (already done if you are reading this)
2. Read `templates/presets/{preset-id}/_meta.md` to confirm agent roster and orchestration structure
3. Read agent files one at a time from `templates/presets/{preset-id}/agents/`
4. Read `templates/presets/{preset-id}/orchestration.md` last

For free-form generation:

1. Read relevant fragments from `templates/fragments/` for the role types needed
2. Do not read preset agent files — compose from scratch using fragments

Context window management: read and generate ONE agent at a time. Do not batch-read all agent files before
writing any output. This keeps peak context manageable (~25KB: instruction + INDEX + _meta + 1 agent).

### Step 4 — Adapt Content

Apply the adaptation rules (see "Adaptation Rules" section below).
The most critical replacements are tech stack references and file ownership paths.
Skipping adaptation produces generic agents that do not fit the user's actual project.

### Step 5 — Generate Agent Files

For each agent, write a `.md` file to `.claude/agents/` (or `.claude/agents/{preset-id}/` for preset teams).

Write one agent at a time. Confirm each before proceeding to the next in complex generations.

### Step 6 — Generate Orchestration

Append the orchestration section to the user's `CLAUDE.md`.

If `CLAUDE.md` does not exist, create it with the orchestration section only.
If it exists, append — never overwrite existing content.

---

## Customization Levels

### Quick (default)

Apply when the user wants the preset "as-is" or mentions getting started fast.

- Replace all framework/language references with the user's tech stack
- Update file ownership paths to match the user's actual project structure
- Leave system prompt structure, communication formats, and quality gates unchanged
- Estimated time: one pass through each agent file

### Deep

Apply when the user has specific domain requirements, unusual workflows, or wants the agents tailored to their team culture.

- Rewrite system prompt sections to match the user's specific domain logic
- Add or remove roles based on the user's team structure
- Modify quality gate checklist items to reference the user's actual test and lint tooling
- Adjust trigger keywords to include the user's specific tech stack and terminology
- Revise intervention policy thresholds to match the user's risk tolerance
- Estimated time: multiple passes, may require clarifying questions between agents

---

## Agent File Output Format

Every generated agent file must follow this exact structure:

```yaml
---
name: agent-name
description: "Agent description with at least two <example> blocks showing when to delegate to this agent."
model: sonnet
color: green
tools: [Read, Edit, Write, Bash, Grep, Glob]
---

(System prompt content begins here — no blank line between --- and content)
```

### YAML Frontmatter Rules

- `name`: kebab-case, matches the filename (e.g., `tech-lead.md` → `name: tech-lead`)
- `description`: always quoted; must include 2–3 `<example>` blocks with Situation/User/Assistant format
- `model`: use `inherit` for the lead agent; `sonnet` for team leads; `haiku` for individual contributors
- `color`: use distinct colors per team to aid visual identification in the Claude UI
- `tools`: list only tools the agent actually needs; do not give Read-only agents Write or Bash

### Tool Assignment Reference

| Role type | Recommended tools |
|-----------|-------------------|
| Lead / architect | Read, Grep, Glob, Bash |
| Team lead (coding) | Read, Edit, Write, Bash, Grep, Glob |
| Individual contributor (coding) | Read, Edit, Write, Grep, Glob |
| Analyst / reviewer | Read, Grep, Glob |
| Writer / documenter | Read, Edit, Write, Grep, Glob |

### Description Example Block Format

```
<example>
Situation: [Short situation description]
User: "[What the user said]"
Assistant: "[How Claude should respond — showing delegation to this agent]"
</example>
```

Each example should show a distinct trigger scenario. At minimum: one clear activation case, one edge or
escalation case.

---

## CLAUDE.md Orchestration Section Format

The orchestration section appended to CLAUDE.md must include these subsections in order:

### 1. Header

```markdown
# {Team Name} - Agent Orchestration

> Generated by agent-team-maker. Preset: `{preset-id}` (or: Custom team)

This section defines the orchestration rules for the **{Team Name}** agent team.
Agents are located in `.claude/agents/`.
```

### 2. Agent Hierarchy

ASCII tree showing reporting relationships. Use box-drawing characters.

```
## Agent Hierarchy

```
               tech-lead
                   │
       ┌───────────┼───────────┐
       │                       │
frontend-team-lead     backend-team-lead
       │                       │
  ui-developer           api-developer
```
```

### 3. Permission Separation

Table showing each agent's model and key tools.

```markdown
## Permission Separation

| Agent | Model | Key Permissions |
|-------|-------|----------------|
| tech-lead | inherit | Read, Grep, Glob, Bash |
| frontend-team-lead | sonnet | Read, Edit, Write, Bash, Grep, Glob |
| ui-developer | haiku | Read, Edit, Write, Grep, Glob |
```

### 4. Trigger Matrix

Table mapping situations to agents with representative keywords.

```markdown
## Auto-Detection Trigger Matrix

| Situation | Primary Agent | Secondary | Keywords |
|-----------|--------------|-----------|----------|
| Frontend component work | frontend-team-lead | ui-developer | React, component, props, hooks |
| API endpoint work | backend-team-lead | api-developer | endpoint, route, controller, REST |
```

### 5. Intervention Policy

Three tiers with concrete situations and required actions.

```markdown
## Hybrid Intervention Policy

### Critical (Pre-approval Required)
- **[Situation]**: [Required action before proceeding]

### Standard (Post-review)
- **[Situation]**: [Review action after completion]

### Low Risk (Autonomous)
- [List of changes that agents can make without pre-approval or post-review]
```

### 6. Workflows

Numbered step sequences for common team operations.

```markdown
## Standard Workflows

### New Feature
[Description]

```
1. [agent] Action → next handoff description
2. [agent] Action → next handoff description
3. [agent] Final action
```
```

### 7. Communication Protocol

Free-form section defining how agents communicate. Must cover:
- Hierarchy and reporting lines
- Message types (delegation, progress update, escalation, blocker)
- Format requirements for each message type
- Cadence (daily, sprint boundary, on-demand)

### 8. Quality Gates

Checklists per agent domain. Format:

```markdown
## Quality Gates

### {Gate Name} ({agent-name})
- [ ] Check item 1
- [ ] Check item 2
```

### 9. Escalation Paths

Table mapping escalation sources to targets with triggering conditions.

```markdown
## Escalation Paths

| From | To | Conditions |
|------|----|-----------|
| ui-developer | frontend-team-lead | Blocked >2h; spec ambiguous; changes needed outside file ownership |
```

### 10. Quick Start

Brief guide for the user on how to use the team.

```markdown
## Quick Start

1. Agents auto-delegate based on file patterns and keywords
2. The **{lead-agent}** has final authority for technical decisions
3. Critical operations require pre-approval
4. Standard operations are post-reviewed
5. Low-risk tasks proceed autonomously
```

---

## Context Window Management Strategy

Peak context during generation: approximately 25KB.
Breakdown: active instruction (~5KB) + INDEX.md (~2KB) + _meta.md (~2KB) + one agent file (~8–15KB) + output buffer.

### Reading Order

1. `templates/INDEX.md` (~2KB) → select preset and confirm approach
2. `templates/presets/{id}/_meta.md` (~2KB) → confirm agent roster, lead, orchestration structure
3. Read + generate ONE agent at a time (~8–15KB each) → write file → release from context before reading next
4. `templates/presets/{id}/orchestration.md` (~5–10KB) → generate CLAUDE.md section last

### Do Not

- Do not read all agent files before writing any output
- Do not hold the full preset source TypeScript file in context when working from markdown templates
- Do not re-read INDEX.md between agents — its information is stable

### For Free-Form Generation

Fragments are smaller (~1–3KB each). Read only the fragments relevant to the roles being created.
Multiple fragments can be held in context simultaneously without risk.

---

## Adaptation Rules

When adapting a blueprint preset for a user's specific project, apply these rules systematically.

### Always KEEP (structure that transfers across any stack)

- Communication format templates (DELEGATION, PROGRESS UPDATE, ESCALATION, STATUS REPORT formats)
- Quality gate checklist structure (the format, not the specific tools)
- Workflow step format and sequencing logic
- Intervention policy tier structure (critical / standard / low-risk classification)
- Escalation path logic and conditions
- The three-section pattern: Core Responsibilities → Communication Format → Quality Gates → Workflow → Protocols

### Always ADAPT (content that is stack-specific)

| Blueprint element | Adaptation action |
|-------------------|-------------------|
| Framework references | Replace React → Vue/Angular/Svelte, Express → FastAPI/Django/Rails, etc. |
| File ownership paths | Update `/src/components/` → actual project directory structure |
| Trigger keywords | Add user's specific tech stack terms; keep generic terms |
| Quality gate tool checks | Replace `npm test` → `pytest`, `cargo test`, `go test`, etc. |
| Quality gate metric checks | Replace Lighthouse/bundle size checks with relevant stack equivalents |
| Deployment references | Replace Vercel/AWS with user's actual infrastructure |
| Database references | Replace PostgreSQL/Prisma with user's actual data layer |
| Code patterns | Replace TypeScript patterns with user's language patterns |

### Stack Replacement Examples

**React → Vue 3**
- `React, component, hooks, JSX, TSX` → `Vue, component, composables, SFC, template`
- `/src/components/*.tsx` → `/src/components/*.vue`
- `useState/useReducer` → `ref/reactive`
- `React Query` → `VueQuery or Pinia`
- `Storybook stories` → `Storybook stories` (keep — Storybook supports Vue)

**Node.js/Express → Python/FastAPI**
- `Node.js, Express, Fastify` → `Python, FastAPI, uvicorn`
- `Zod schemas` → `Pydantic models`
- `npm test` → `pytest`
- `TypeScript interfaces` → `Python type hints and dataclasses`
- `/src/routes/` → `/app/routers/`
- `package.json` → `pyproject.toml or requirements.txt`

**PostgreSQL/Prisma → MongoDB/Mongoose**
- Migration files → schema versioning approach
- `EXPLAIN ANALYZE` → `explain()` plan
- `Parameterized queries` → sanitized queries with Mongoose (injection risk still applies)
- `created_at/updated_at` → same concept, Mongoose timestamps option

### When the User's Stack Has No Direct Equivalent

Keep the conceptual quality gate but rewrite the specific check.

Example — frontend performance budget exists in a mobile app context:
- Original: "Bundle size increase < 10KB per PR (uncompressed)"
- Adapted: "App size delta < 500KB per PR; verify with `flutter build --analyze-size`"

The principle (track size impact per change) transfers; the specific metric and tool are replaced.

---

## Common Generation Scenarios

### "Generate a team for my project" (minimal context)

1. Ask for: project description and primary tech stack
2. Assess against preset catalog
3. Propose the matching preset with a brief rationale
4. If accepted: proceed with quick customization
5. If declined or no fit: switch to free-form

### "Use the fullstack preset but we use Vue and Django"

1. Select `fullstack-web` as the blueprint
2. Apply stack replacement rules for Vue + Django throughout all agent files
3. Update file paths, tool references, and quality gate checks
4. Keep all communication formats and orchestration structure unchanged

### "I need a 2-person team for just code review and documentation"

1. No preset fits exactly — free-form generation
2. Design: review-agent (Read, Grep, Glob) + docs-agent (Read, Edit, Write)
3. Flat structure — both report to user; no delegation chain needed
4. Pull review fragments for the review role, docs fragments for the docs role
5. Lightweight CLAUDE.md section: hierarchy, trigger matrix, basic quality gates only

### "Add a security specialist to my existing team"

1. Read the user's existing `.claude/agents/` to understand current team structure
2. Design a security-reviewer agent (using the code-review preset's security-reviewer as blueprint)
3. Adapt the agent to report to the appropriate existing lead
4. Append a new row to the existing CLAUDE.md trigger matrix and escalation paths table
5. Do not regenerate the entire CLAUDE.md

### "Generate a team in Korean"

All system prompt content is written in Korean. YAML frontmatter fields (`name`, `description`, `model`,
`color`, `tools`) remain in English — these are parsed by Claude Code and must not be localized.

---

## Quality Checklist Before Delivering Output

Before telling the user generation is complete, verify:

- [ ] Every agent file has valid YAML frontmatter with name, description, model, color, tools
- [ ] Every description field has at least 2 `<example>` blocks
- [ ] Lead agent uses `model: inherit`
- [ ] No agent has tools it does not need (e.g., Read-only reviewer does not have Write)
- [ ] All tech stack references in system prompts match the user's actual stack
- [ ] File ownership paths reference real directories in the user's project (or sensible defaults if structure unknown)
- [ ] CLAUDE.md orchestration section covers all 10 required subsections
- [ ] Escalation paths are complete — every non-lead agent has at least one escalation condition
- [ ] Quality gates reference the user's actual test and lint commands, not generic placeholders
- [ ] No agent file contains `TODO`, `PLACEHOLDER`, or `[INSERT]` markers — all content is complete
