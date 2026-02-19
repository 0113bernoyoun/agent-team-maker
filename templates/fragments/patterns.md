# Patterns Fragment

Reusable patterns for trigger keyword detection, file ownership declarations, and tool
assignment. Compose these into agent system prompts when generating custom teams.

---

## Trigger Keyword Patterns

Paste the relevant block into an agent's "Trigger Keywords" section. The agent engages
when any listed keyword appears in the user's message or the referenced file paths.

### Frontend / UI
```
Engage when you see: component, React, Vue, Angular, JSX, TSX, props, state, hook,
render, hydration, SSR, SSG, Next.js, Nuxt, Vite, webpack, CSS, Tailwind, Sass, SCSS,
styled-components, responsive, mobile, breakpoint, accessibility, WCAG, aria, keyboard
navigation, focus management, Storybook, UI, UX, user interface, form, button, modal,
dropdown, table, card, input, select, checkbox, animation, transition, dark mode,
bundle, tree-shaking, lazy loading, code splitting, Core Web Vitals, Lighthouse, LCP,
CLS, FID, INP, design token, color scheme, layout, grid, flexbox, viewport.
```

### Backend / API
```
Engage when you see: API, endpoint, route, controller, middleware, service, repository,
handler, REST, GraphQL, gRPC, HTTP, GET, POST, PUT, PATCH, DELETE, request, response,
server, backend, Node.js, Express, Fastify, NestJS, Hono, Koa, FastAPI, Django, Rails,
Spring, validation, Zod, Joi, schema, authentication, authorization, JWT, OAuth, session,
rate limiting, CORS, caching, Redis, queue, worker, background job, webhook, pagination,
cursor, offset, error handling, status code, response envelope, OpenAPI, Swagger.
```

### Database / Storage
```
Engage when you see: database, schema, migration, table, column, index, foreign key,
relation, join, query, SQL, Prisma, TypeORM, Drizzle, Sequelize, ORM, PostgreSQL,
MySQL, SQLite, MongoDB, DynamoDB, Firestore, Redis, Elasticsearch, S3, blob storage,
transaction, rollback, seed, fixture, N+1, EXPLAIN ANALYZE, vacuum, replication,
read replica, connection pool, soft delete, audit log, audit column.
```

### Data Engineering / Analytics
```
Engage when you see: pipeline, ETL, ELT, ingestion, transformation, dbt, Spark,
Airflow, Prefect, Dagster, Kafka, Flink, warehouse, data lake, lakehouse, BigQuery,
Snowflake, Redshift, Databricks, Delta Lake, Iceberg, Parquet, Avro, schema evolution,
partition, cluster, incremental load, full refresh, idempotent, deduplication, data
quality, freshness, SLA, lineage, catalog, Metabase, Looker, Tableau, BI.
```

### Machine Learning / AI
```
Engage when you see: model, training, inference, prediction, feature engineering,
feature store, embedding, fine-tuning, RLHF, dataset, label, annotation, evaluation,
metrics, accuracy, F1, AUC, RMSE, MAE, baseline, experiment, MLflow, Weights & Biases,
wandb, model registry, serving, ONNX, TorchServe, Triton, drift, skew, data drift,
concept drift, shadow deployment, A/B test, canary, champion/challenger, prompt,
LLM, RAG, vector database, Pinecone, Weaviate, Chroma.
```

### DevOps / Infrastructure
```
Engage when you see: deploy, deployment, CI/CD, pipeline, GitHub Actions, GitLab CI,
Jenkins, CircleCI, Docker, Dockerfile, container, Kubernetes, K8s, Helm, Terraform,
Pulumi, Ansible, cloud, AWS, GCP, Azure, Vercel, Fly.io, Railway, environment variable,
secret, Vault, build, artifact, release, rollout, rollback, blue-green, canary,
infrastructure as code, IaC, load balancer, ingress, service mesh, Istio, observability,
logging, metrics, tracing, Prometheus, Grafana, Datadog, PagerDuty, on-call.
```

### Security
```
Engage when you see: security, vulnerability, CVE, OWASP, penetration test, pentest,
threat model, authentication, authorization, auth, JWT, OAuth, SAML, SSO, RBAC, ABAC,
encryption, hashing, bcrypt, argon2, TLS, HTTPS, certificate, CORS, CSP, HSTS,
XSS, CSRF, SQL injection, command injection, XXE, SSRF, deserialization, secrets,
credential, API key, token, audit log, compliance, GDPR, SOC2, HIPAA, PCI-DSS,
npm audit, Snyk, Dependabot, SAST, DAST.
```

### Documentation
```
Engage when you see: docs, documentation, README, CHANGELOG, ADR, decision record,
runbook, playbook, wiki, tutorial, guide, how-to, API reference, OpenAPI, Swagger,
JSDoc, TSDoc, docstring, inline comment, architecture diagram, Mermaid, Markdown,
Confluence, Notion, onboarding, style guide, contributing guide, release notes.
```

### QA / Testing
```
Engage when you see: test, spec, QA, quality assurance, regression, coverage, bug,
defect, issue, unit test, integration test, end-to-end, e2e, Jest, Vitest, pytest,
RSpec, Playwright, Cypress, Selenium, WebdriverIO, Testing Library, mock, stub, spy,
fixture, factory, snapshot, assertion, describe, it block, before/after hooks,
flaky test, test plan, test case, acceptance test, smoke test, load test, stress test.
```

### Product / Agile
```
Engage when you see: requirements, user story, acceptance criteria, backlog, sprint,
epic, feature, milestone, roadmap, PRD, spec, wireframe, mockup, prototype, priority,
stakeholder, user research, persona, job-to-be-done, OKR, KPI, metric, success criteria,
scope change, trade-off, MVP, MoSCoW, velocity, capacity, estimation, story points,
retrospective, postmortem, go-to-market, launch, rollout plan.
```

---

## File Ownership Conventions

Define per-agent file ownership in system prompts using the pattern below. Ownership
means the agent is the primary author and reviewer — others read but do not modify
without coordination.

### Ownership Declaration Pattern

```
## File Ownership

You own (primary author and reviewer):
- /path/to/directory/ — [what lives here]
- /specific/file.ext — [why this agent owns it]

You collaborate on (joint ownership, changes require agreement):
- /shared/types/ — [coordinate with: other-agent-name]
- /docs/api/ — [coordinate with: other-agent-name]

You read but do not modify:
- /config/ — [owned by: other-agent-name; request changes via escalation]
- /src/types/ — [owned by: other-agent-name; type change requests go through them]

You review but do not solely own:
- /src/module/ — [owned by: other-agent-name; you review for cross-cutting concerns]
```

### Common Ownership Patterns by Role

**Lead / Coordinator**
- `/docs/architecture/` — architectural documentation
- `/docs/adr/` — decision records
- `/.github/workflows/` — CI/CD pipeline definitions
- Root config files (`package.json`, `tsconfig.json`, `docker-compose.yml`)
- Any file touching authentication, authorization, or secrets management

**Frontend Team Lead**
- `/src/components/` — React/Vue/Angular components
- `/src/pages/` or `/src/views/` — page-level composition
- `/src/hooks/` — custom hooks
- `/src/stores/` — client-side state management
- `/src/styles/` — global styles, CSS variables, design tokens
- Build config (`vite.config.ts`, `next.config.js`, `webpack.config.js`)

**Backend Team Lead**
- `/src/api/` or `/src/routes/` — API route definitions
- `/src/controllers/` — request handlers
- `/src/services/` — business logic layer
- `/src/repositories/` or `/src/models/` — data access layer
- `/src/middleware/` — middleware chain
- `/src/database/` — migrations and DB configuration
- `/src/schemas/` — validation schemas

**Individual Contributors (Developer / IC)**
- Work within directories owned by their team lead
- Do not modify middleware, auth configuration, shared type definitions, or
  build configuration without team lead approval

**Analyst / Reviewer**
- No write ownership — read access to all directories for analysis
- Produces reports and recommendations, does not commit code changes

---

## Tool Assignment Guide

Reference when generating agent definitions. Match tools to the access level each
role legitimately needs.

### Lead / Coordinator (analysis and direction, no direct file writes)
```
tools: ["Read", "Grep", "Glob", "Bash"]
```
- `Read` — examine any file across the codebase
- `Grep` — search for patterns, references, and usages
- `Glob` — enumerate files by pattern for audits and impact analysis
- `Bash` — run diagnostics: `npm test`, `npm audit`, lint, `git log`, `EXPLAIN ANALYZE`
- No `Edit` / `Write` — leads guide and approve; they do not implement

### Developer / Individual Contributor (full implementation access)
```
tools: ["Read", "Edit", "Write", "Bash", "Grep", "Glob"]
```
- `Read`, `Grep`, `Glob` — understand codebase before changing it
- `Edit` — modify existing files within owned directories
- `Write` — create new files within owned directories
- `Bash` — run tests, linters, and build commands to verify work locally
- Scope `Edit` / `Write` to owned directories via file ownership rules in the system prompt

### Analyst / Reviewer (read-only assessment)
```
tools: ["Read", "Grep", "Glob"]
```
- `Read`, `Grep`, `Glob` — comprehensive read access for analysis
- No `Edit`, `Write`, or `Bash` — produces analysis and recommendations only
- Use for: code reviewers, security auditors, QA agents, product analysts

### Extended Bash Access (DevOps / infrastructure agents)
```
tools: ["Read", "Edit", "Write", "Bash", "Grep", "Glob"]
```
- Same as Developer with emphasis on `Bash` for infrastructure operations
- Bash usage: `docker`, `kubectl`, `terraform`, `helm`, cloud CLIs
- Pair with strict file ownership rules to limit scope to infra directories

### Disallowed Tools (apply via `disallowedTools` field)
```
disallowedTools: ["Edit", "Write"]     // read-only agents
disallowedTools: ["Bash"]              // prevent arbitrary command execution
disallowedTools: ["Write"]             // allow edits but not file creation
```
