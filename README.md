# agent-team-maker

Generate customized Claude Code sub-agent teams with template-based generation.

**agent-team-maker** installs preset agent team templates into your project, then uses Claude Code slash commands to generate tailored agent configurations from those templates. You get a coordinated team of specialized AI agents — each with defined roles, tools, quality gates, and communication protocols.

[한국어 README](./README.ko.md)

## Quick Start

```bash
# Install templates into your project
npx agent-team-maker init

# Then in Claude Code:
/team:create      # Generate an agent team
/team:list        # Browse available presets
```

## What It Does

1. **Installs templates** — Copies agent blueprints and slash commands into your project's `.claude/` directory
2. **Generates agents** — Claude Code reads the templates and creates adapted agent files for your specific tech stack
3. **Sets up orchestration** — Adds coordination rules to `CLAUDE.md` so agents work together with clear hierarchy and workflows

## Available Presets

| Preset | Agents | Best For |
|--------|--------|----------|
| **fullstack-web** | 6 | React + Node.js fullstack projects with tech lead oversight |
| **code-review** | 4 | PR reviews, security audits, refactoring validation |
| **data-ml** | 4 | Data pipelines, ML model lifecycle, analytics |
| **docs** | 3 | API docs, tutorials, architecture diagrams |
| **product** | 5 | Sprint-based feature development with integrated QA |

No preset fits? `/team:create` also supports **free-form generation** — describe your needs and get a custom team built from reusable fragments.

## Installation

### Option 1: npx (recommended)

```bash
npx agent-team-maker init
```

### Option 2: Install to a specific directory

```bash
npx agent-team-maker init --target=/path/to/your/project
```

### Option 3: Shell script (no Node.js required)

```bash
curl -fsSL https://raw.githubusercontent.com/0113bernoyoun/agent-team-maker/main/install.sh | bash
```

### What gets installed

```
your-project/
└── .claude/
    ├── templates/agent-team-maker/   # Agent blueprints and generation guide
    │   ├── INDEX.md
    │   ├── GENERATION-GUIDE.md
    │   ├── fragments/                # Reusable prompt building blocks
    │   └── presets/                   # 5 preset team templates
    ├── commands/team/                 # Slash commands
    │   ├── create.md
    │   ├── list.md
    │   ├── add-agent.md
    │   └── customize.md
    └── agents/                       # Generated agents go here
```

## Commands

| Command | Description |
|---------|-------------|
| `/team:create` | Generate a full agent team — choose a preset or go free-form |
| `/team:list` | Browse available presets with agent rosters and descriptions |
| `/team:add-agent` | Add a single agent to an existing team |
| `/team:customize` | Modify an existing team's agents or orchestration |

## How It Works

### 1. Choose a preset

```
/team:create
```

Claude Code asks about your project and recommends a preset. You confirm the agent roster and customization level (quick or deep).

### 2. Agents are generated

Each agent blueprint is adapted to your tech stack:
- Framework references are replaced (e.g., React → Vue, Express → FastAPI)
- File ownership paths match your project structure
- Quality gate checks use your actual tooling (e.g., `npm test` → `pytest`)

Generated agent files are written to `.claude/agents/`.

### 3. Orchestration is configured

A coordination section is added to `CLAUDE.md` with:
- Agent hierarchy (who reports to whom)
- Trigger matrix (which agent handles which keywords)
- Intervention policy (what needs approval vs. autonomous)
- Standard workflows (feature development, bug fixes, sprints)
- Quality gates and escalation paths

### 4. Agents auto-activate

Once set up, Claude Code automatically delegates to the right agent based on your request. The lead agent coordinates the team.

## Generated Agent File Format

```yaml
---
name: tech-lead
description: "Architecture decisions and code quality oversight..."
model: inherit
color: yellow
tools: [Read, Grep, Glob, Bash]
---
(System prompt with role, responsibilities, communication format, quality gates)
```

- **model**: `inherit` for leads (matches your active model), `sonnet` for team leads, `haiku` for ICs
- **tools**: Only what each agent needs — reviewers get Read-only, implementers get Edit+Write
- **description**: Includes `<example>` blocks showing when to delegate to this agent

## Customization

### Quick mode (default)
Replaces framework/tool references with your stack. Keeps everything else.

### Deep mode
Rewrites system prompts to match your specific domain, conventions, and workflows.

### After generation
- Edit any agent file in `.claude/agents/` directly
- Run `/team:customize` to modify agents interactively
- Run `/team:add-agent` to add specialists

## Project Structure

```
agent-team-maker/
├── src/init.ts            # CLI entry point
├── templates/             # Source templates (copied on init)
│   ├── INDEX.md           # Preset catalog
│   ├── GENERATION-GUIDE.md
│   ├── fragments/         # Reusable prompt building blocks
│   └── presets/           # 5 preset team configurations
├── commands/team/         # Slash command definitions
├── dist/                  # Compiled output
├── install.sh             # Shell-based installer
└── package.json
```

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) CLI
- Node.js 18+ (for `npx` installation)

## License

MIT
