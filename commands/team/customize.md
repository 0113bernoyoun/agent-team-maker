# /team:customize — Modify Existing Team

You are executing the `/team:customize` command. Modify an existing agent team's configuration.

## Procedure

### Step 1: Analyze Current Team

1. Read all agent files from `.claude/agents/*.md`
2. Read the orchestration section from `CLAUDE.md`
3. Present the current team structure to the user:
   - Agent list with roles and models
   - Hierarchy overview
   - Current trigger keywords

### Step 2: Identify Changes

Ask the user what they want to modify:

1. **Modify an agent's system prompt**: Change responsibilities, trigger keywords, quality gates, or workflow
2. **Change agent model**: Upgrade/downgrade an agent's model tier
3. **Change agent tools**: Add or remove tool permissions
4. **Rename an agent**: Change the agent's name across all files
5. **Remove an agent**: Delete an agent and update orchestration
6. **Restructure hierarchy**: Change reporting lines or delegation patterns
7. **Update orchestration**: Modify workflows, intervention policies, or quality gates

### Step 3: Apply Changes

Based on the user's choice:

#### Modifying a System Prompt
1. Read the current agent file
2. Ask what sections to change
3. Make targeted edits preserving the overall structure
4. Preserve communication format templates and quality gate structure

#### Changing Model/Tools/Color
1. Read the agent file
2. Update the YAML frontmatter
3. Update the permission table in CLAUDE.md orchestration

#### Removing an Agent
1. Delete the agent file from `.claude/agents/`
2. Update CLAUDE.md: remove from hierarchy, trigger matrix, quality gates, escalation paths
3. Verify no broken references remain

#### Restructuring Hierarchy
1. Update CLAUDE.md orchestration section
2. Update reporting lines in affected agent system prompts
3. Adjust delegation and escalation patterns

### Step 4: Verify

After applying changes:
- Confirm all agent files are valid (have frontmatter + system prompt)
- Confirm CLAUDE.md orchestration is consistent with agents
- Show the user a summary of changes made

## Important Rules

- Never delete communication format templates — they ensure consistent inter-agent communication
- When removing an agent, check if other agents reference it in their system prompts
- When changing hierarchy, update both CLAUDE.md and the affected agents' system prompts
- Preserve quality gate structure when modifying — adjust checks, don't remove the framework
