# /team:create — Generate an Agent Team

You are executing the `/team:create` command. Your goal is to generate a customized team of Claude Code sub-agents tailored to the user's project.

## Prerequisites

The template files should be at `.claude/templates/agent-team-maker/`. If not found, tell the user to run `npx agent-team-maker init` first.

## Procedure

### Step 1: Collect Project Context

Ask the user these questions (skip any you can infer from the codebase):

1. **Project description**: What does this project do? (1-2 sentences)
2. **Tech stack**: What frameworks, languages, and tools are used?
3. **Team needs**: What kind of team do you need? (development, review, data/ML, documentation, product management, or custom)
4. **Customization level**: Quick setup (preset with minimal changes) or deep customization (fully adapted to your project)?

If the user has already provided context (e.g., "create a fullstack team for my Next.js + Prisma project"), extract what you can and only ask for missing information.

You can also analyze the codebase to infer the tech stack:
- Read `package.json` for dependencies
- Check for `tsconfig.json`, `next.config.*`, `vite.config.*`, etc.
- Look at the directory structure with Glob

### Step 2: Select Approach

Read `.claude/templates/agent-team-maker/INDEX.md` to review available presets.

Based on the user's answers, recommend one of:
- **Preset-based**: One of the 5 presets matches their needs → proceed to Step 3a
- **Free-form**: No preset fits well → proceed to Step 3b

Present the recommendation and let the user confirm.

### Step 3a: Preset-Based Generation

1. Read the preset's `_meta.md` to confirm agent roster and suitability
2. Show the user the agent list and ask if they want to modify it (add/remove/rename agents)
3. Read `.claude/templates/agent-team-maker/GENERATION-GUIDE.md` for generation rules

For each agent in the roster:
1. Read the agent's blueprint from `templates/presets/{preset-id}/agents/{agent-name}.md`
2. Follow the `<!-- ADAPTATION GUIDE -->` in the blueprint
3. Adapt the system prompt:
   - **Quick mode**: Replace framework/tool references with user's stack. Keep everything else.
   - **Deep mode**: Rewrite sections to match the user's specific project structure, conventions, and workflows.
4. Write the adapted agent file to `.claude/agents/{agent-name}.md` with proper YAML frontmatter

### Step 3b: Free-Form Generation

1. Read `.claude/templates/agent-team-maker/GENERATION-GUIDE.md` for rules
2. Read `.claude/templates/agent-team-maker/fragments/` files for building blocks
3. Design a custom agent roster based on user needs:
   - Define roles, responsibilities, and hierarchy
   - Assign appropriate models (lead=inherit, specialist=sonnet, IC=haiku)
   - Assign tools based on role type (see fragments/patterns.md)
4. For each agent, compose a system prompt using:
   - Role-specific sections from fragments
   - Quality gates from fragments/quality-gates.md
   - Communication formats from fragments/communication.md
   - Trigger keywords from fragments/patterns.md
5. Write each agent file to `.claude/agents/{agent-name}.md`

### Step 4: Generate Orchestration

Read the preset's `orchestration.md` (for preset-based) or compose from `fragments/orchestration.md` (for free-form).

Generate the orchestration section and add it to the project's `CLAUDE.md`:
- If `CLAUDE.md` exists: append the orchestration section at the end
- If `CLAUDE.md` doesn't exist: create it with the orchestration section

The orchestration section should include:
- Agent Hierarchy (ASCII tree)
- Permission Separation table
- Auto-Detection Trigger Matrix
- Intervention Policy (Critical/Standard/Low Risk)
- Standard Workflows
- Communication Protocol
- Quality Gates
- Escalation Paths
- Quick Start guide

### Step 5: Summary

After generation is complete, present a summary:

```
## Team Created Successfully

**Preset**: {preset-name} (or "Custom")
**Agents**: {count} agents generated
**Location**: .claude/agents/

### Generated Files
- .claude/agents/{agent-1}.md
- .claude/agents/{agent-2}.md
- ...
- CLAUDE.md (orchestration section added)

### How to Use
- Claude Code will automatically detect which agent to use based on your request
- Use the trigger keywords from the orchestration section to target specific agents
- The {lead-agent} has final authority for {domain} decisions

### Next Steps
- Review the generated agent files and adjust if needed
- Run `/team:customize` to modify agents after generation
- Run `/team:add-agent` to add more agents to the team
```

## Context Window Management

To avoid overloading the context window:
- Read INDEX.md first (~2KB) to select a preset
- Read _meta.md (~2KB) to confirm agent roster
- Read and generate ONE agent at a time (~8-15KB per blueprint)
- Read orchestration.md last (~5-10KB)
- Do NOT read all blueprints at once

## Important Rules

- Always preserve the communication format templates from blueprints
- Always preserve quality gate checklist structure
- Always adapt file ownership paths to the user's actual project structure
- Never generate placeholder or TODO content — every agent must be complete
- Use `inherit` model for the lead agent, not a specific model name
