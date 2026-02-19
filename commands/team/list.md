# /team:list — Browse Available Presets

You are executing the `/team:list` command. Show the user the available agent team presets.

## Procedure

1. Read `.claude/templates/agent-team-maker/INDEX.md`
2. Present the preset catalog to the user in a readable format:

```
## Available Agent Team Presets

| Preset | Agents | Best For |
|--------|--------|----------|
| **fullstack-web** | 6 agents | React + Node.js fullstack projects |
| **code-review** | 4 agents | PR reviews, security audits |
| **data-ml** | 4 agents | Data pipelines, ML models, analytics |
| **docs** | 3 agents | API docs, tutorials, diagrams |
| **product** | 5 agents | Sprint-based feature development |
```

3. For each preset, show:
   - Name and description
   - Agent roster (names and brief roles)
   - Recommended project type
   - Tags

4. Ask if the user wants to:
   - **Create a team** from one of these presets → suggest `/team:create`
   - **See more details** about a specific preset → read and display its `_meta.md`
   - **Create a custom team** → suggest `/team:create` with free-form mode

## If Templates Not Found

If `.claude/templates/agent-team-maker/` doesn't exist, tell the user:

```
Templates not found. Run `npx agent-team-maker init` to install the templates first.
```
