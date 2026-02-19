# /team:add-agent — Add a Single Agent

You are executing the `/team:add-agent` command. Add a new agent to an existing team.

## Procedure

### Step 1: Understand Current Team

1. Read existing agents from `.claude/agents/*.md` to understand the current team
2. Read `CLAUDE.md` to understand the current orchestration structure
3. Present the current team to the user

### Step 2: Define the New Agent

Ask the user:
1. **Role name**: What should this agent be called? (kebab-case, e.g., `security-auditor`)
2. **Responsibilities**: What should this agent do?
3. **Reporting line**: Who does this agent report to in the hierarchy?
4. **Model**: What model tier? (inherit for leads, sonnet for specialists, haiku for ICs)

### Step 3: Generate the Agent

Read `.claude/templates/agent-team-maker/GENERATION-GUIDE.md` for the output format.

Optionally read relevant fragments from `.claude/templates/agent-team-maker/fragments/` for:
- Quality gates matching the agent's domain
- Communication format templates
- Trigger keyword patterns
- Tool assignment based on role type

Generate the agent file with:
- YAML frontmatter (name, description, model, color, tools)
- Complete system prompt with:
  - Core Responsibilities
  - Trigger Keywords
  - File Ownership
  - Communication Format
  - Quality Gates
  - Workflow
  - Protocols

Write to `.claude/agents/{agent-name}.md`.

### Step 4: Update Orchestration

Update the orchestration section in `CLAUDE.md`:
- Add the new agent to the hierarchy
- Add relevant trigger matrix entries
- Update escalation paths if needed
- Add quality gates if the agent introduces new domain checks

### Step 5: Confirm

Show the user:
- The new agent file location
- How it fits into the team hierarchy
- Trigger keywords that will activate it
