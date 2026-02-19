<!-- ADAPTATION GUIDE
When applying this orchestration to a specific project, customize the following:
- Trigger keywords: Add project-specific terminology (e.g., your doc framework, specific tools)
- Workflows: Adjust steps based on your documentation toolchain (e.g., Docusaurus, GitBook, Sphinx)
- Quality gates: Add project-specific checks (e.g., localization, SEO, accessibility standards)
- Intervention policy: Adjust critical/standard/low-risk based on your team's maturity
- Communication protocol: Adapt task/deliverable/review formats to match your workflow tools
-->

## Agent Hierarchy

**Lead**: docs-strategist

| Agent | Delegates To | Reports To | Collaborates With |
|-------|-------------|------------|-------------------|
| docs-strategist | technical-writer, diagram-specialist | -- | -- |
| technical-writer | -- | docs-strategist | diagram-specialist |
| diagram-specialist | -- | docs-strategist | technical-writer |

## Trigger Matrix

| Situation | Primary Agent | Secondary Agent | Keywords |
|-----------|--------------|-----------------|----------|
| README or project docs update | technical-writer | docs-strategist | README, CHANGELOG, CONTRIBUTING, project docs |
| API documentation needed | technical-writer | docs-strategist | API docs, endpoint, reference, swagger |
| Architecture visualization | diagram-specialist | docs-strategist | diagram, flowchart, architecture diagram, ERD, mermaid |
| Documentation strategy or overhaul | docs-strategist | -- | documentation strategy, docs overhaul, content plan, restructure docs |
| Tutorial or guide writing | technical-writer | -- | tutorial, guide, how-to, getting started, walkthrough |
| Code documentation and comments | technical-writer | -- | JSDoc, docstring, code comments, inline docs |

## Intervention Policy

### Critical
- **Public API documentation changes**: docs-strategist must review before publishing
- **Breaking change documentation**: docs-strategist reviews and coordinates cross-references

### Standard
- **New feature documentation**: docs-strategist reviews after completion
- **Internal guide updates**: Post-review by docs-strategist
- **Diagram creation**: docs-strategist validates accuracy and placement

### Low Risk (no approval needed)
- Typo fixes in documentation
- Formatting improvements
- Adding code example comments
- Minor README updates
- Link fixes

## Workflows

### Documentation Overhaul
Comprehensive documentation restructuring and rewriting.

1. **docs-strategist**: Audit existing docs and identify gaps
2. **docs-strategist**: Create documentation plan and assign tasks
3. **technical-writer**: Write documentation content
4. **diagram-specialist**: Create supporting diagrams
5. **docs-strategist**: Review, validate, and approve

### API Documentation
Document API endpoints with examples and schemas.

1. **docs-strategist**: Define API doc scope and structure
2. **technical-writer**: Write endpoint documentation with examples
3. **diagram-specialist**: Create API flow sequence diagrams
4. **docs-strategist**: Review accuracy and completeness

### Architecture Documentation
Document system architecture with diagrams and explanations.

1. **docs-strategist**: Define architecture doc scope
2. **diagram-specialist**: Create architecture diagrams
3. **technical-writer**: Write architectural explanations
4. **docs-strategist**: Review and approve

## Communication Protocol

### Inter-Agent Communication Format

All documentation team communication follows this structure:

**Task Assignment** (docs-strategist -> writer/diagram):
```
TASK: [Title]
TYPE: [API Reference | Tutorial | How-to | Conceptual | Diagram]
PRIORITY: [High | Medium | Low]
SCOPE: [Description of what to cover]
REFERENCES: [Related files or docs]
```

**Deliverable Submission** (writer/diagram -> docs-strategist):
```
DELIVERABLE: [Title]
STATUS: [Draft | Ready for Review]
FILES: [Modified files]
NOTES: [Key decisions or open questions]
```

**Review Feedback** (docs-strategist -> writer/diagram):
```
REVIEW: [Title]
VERDICT: Approved | Revisions Needed
FEEDBACK:
- [Specific feedback items]
ACTION ITEMS:
- [Required changes]
```

## Quality Gates

### Content Quality
**Owner**: docs-strategist
- Writing is clear, concise, and grammatically correct
- Content follows the style guide
- Appropriate documentation type used (tutorial vs reference vs how-to)
- Target audience properly addressed
- Cross-references and links are valid

### Technical Accuracy
**Owner**: docs-strategist
- All code examples tested and working
- API descriptions match actual implementation
- Configuration options are complete and accurate
- Version-specific information is correct
- Error codes and messages are documented

### Visual Quality
**Owner**: docs-strategist
- Diagrams render correctly
- Diagrams accurately represent the system
- Visual style is consistent across all diagrams
- Diagrams have clear labels and legends
- Appropriate diagram type used for the content

## Escalation Paths

| From | To | Conditions |
|------|----|-----------|
| technical-writer | docs-strategist | Unclear requirements, Conflicting information in source code, Scope expansion needed |
| diagram-specialist | docs-strategist | System too complex for single diagram, Missing architectural context, Inconsistent component relationships |
