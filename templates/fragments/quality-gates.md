# Quality Gates Fragment

Reusable quality gate checklists organized by domain. Compose these into agent system prompts
or CLAUDE.md orchestration configs. Each gate is a `- [ ]` checklist ready to paste.

---

## Frontend Quality Gates

### Component & Rendering
- [ ] Component has a single, clear responsibility
- [ ] All props are explicitly typed — no implicit `any`
- [ ] Loading state is handled (skeleton or spinner shown during async fetches)
- [ ] Error state is handled with a user-facing message, not a blank screen
- [ ] Empty state is handled with a helpful prompt or illustration
- [ ] No `console.log` or `console.error` statements in production code
- [ ] No hardcoded strings — use i18n keys or named constants

### Accessibility (WCAG 2.1 AA)
- [ ] All interactive elements are keyboard focusable (Tab, Enter, Space)
- [ ] Custom interactive elements have `role`, `aria-label`, and relevant `aria-*` attributes
- [ ] Color contrast ratio >= 4.5:1 for normal text, >= 3:1 for large text
- [ ] Color is not the sole indicator of state (pair with icon or text)
- [ ] All images have descriptive `alt` text; purely decorative images use `alt=""`
- [ ] All form inputs have associated `<label>` elements
- [ ] Focus is trapped in modals and returned to the trigger element on close
- [ ] Dynamic content changes are announced via `aria-live` regions where appropriate
- [ ] Focus ring is visible — never suppress `outline` without a visible replacement

### Responsive Design
- [ ] Layout is correct at 375px (mobile), 768px (tablet), and 1280px (desktop)
- [ ] No horizontal overflow at any tested viewport width
- [ ] Touch targets are at least 44×44px on mobile
- [ ] Body font size is not below 16px on mobile
- [ ] Images use appropriate formats (WebP preferred) and lazy loading

### Performance Budget
- [ ] Bundle size increase is less than 10KB (uncompressed) per pull request
- [ ] No synchronous imports of libraries larger than 50KB
- [ ] First Contentful Paint < 1.5s on simulated 3G
- [ ] Lighthouse performance score >= 85 in CI
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID/INP < 200ms

### TypeScript & Code Quality
- [ ] No TypeScript errors under `strict` mode
- [ ] No unused imports or variables (lint clean)
- [ ] Storybook story exists for every new or modified component
- [ ] Unit tests cover the main behavior and key edge cases
- [ ] Error boundaries are in place for async or dynamic component subtrees

---

## Backend Quality Gates

### Input Validation & Auth
- [ ] All request inputs (params, query string, body) validated at the controller boundary
- [ ] Validation uses an explicit schema (Zod, Joi, class-validator) — never manual type checks
- [ ] Authentication is enforced in middleware, not inline in each controller
- [ ] Authorization (permission checks) happens before any data access
- [ ] Unauthenticated requests return 401; unauthorized requests return 403

### Database & Query Safety
- [ ] No raw SQL string interpolation — all queries are parameterized
- [ ] No Prisma / ORM raw queries with user-supplied values without sanitization
- [ ] N+1 query patterns identified and resolved (eager loading or DataLoader)
- [ ] New database queries have reviewed execution plan (`EXPLAIN ANALYZE`) for index use
- [ ] Every new table has `created_at` and `updated_at` timestamp columns
- [ ] Foreign key constraints are enforced at the database level
- [ ] Migrations are reversible — down migration script exists and has been tested

### Error Handling & Observability
- [ ] Service layer throws domain-specific errors (e.g., `UserNotFoundError`)
- [ ] Controllers pass all errors to the global error handler via `next(error)`
- [ ] Error responses follow the project envelope: `{ data: null, error: { code, message } }`
- [ ] No stack traces or internal error details in production API responses
- [ ] Sensitive data (passwords, tokens, full PII) never appears in logs or responses
- [ ] Request logs include: request ID, user ID, endpoint, status code, duration

### Performance
- [ ] P95 response time < 200ms for read endpoints, < 500ms for write endpoints
- [ ] No synchronous blocking operations on the main event loop
- [ ] Caching applied for frequently read, rarely mutated data
- [ ] Background jobs used for operations taking > 500ms

### Test Coverage
- [ ] Unit tests cover all service layer business logic branches
- [ ] Integration tests cover: happy path, validation error (400), auth error (401), not-found (404)
- [ ] All tests pass with zero failures (`npm test` or equivalent)
- [ ] No TypeScript errors in strict mode
- [ ] OpenAPI / Swagger documentation updated for all new or changed endpoints

---

## Security Quality Gates

### OWASP Top 10 Coverage
- [ ] Injection: all database queries parameterized; no `eval()` on user input
- [ ] Broken Auth: short-lived access tokens; refresh token rotation implemented
- [ ] Sensitive Data Exposure: PII and credentials encrypted at rest and in transit (HTTPS only)
- [ ] XXE: XML parsing disabled or restricted if XML is accepted
- [ ] Broken Access Control: every endpoint enforces least-privilege authorization
- [ ] Security Misconfiguration: debug mode disabled in production; default credentials removed
- [ ] XSS: output is escaped; Content-Security-Policy header configured
- [ ] Insecure Deserialization: no deserialization of untrusted data without validation
- [ ] Using Components with Known Vulnerabilities: `npm audit` returns zero critical or high
- [ ] Insufficient Logging: security events (failed logins, permission denials) are logged with context

### Credentials & Secrets
- [ ] No credentials, API keys, or secrets committed to source control
- [ ] `.env` files are in `.gitignore` and documented via `.env.example`
- [ ] Secrets are injected via environment variables or a secrets manager at runtime
- [ ] `git log` and `git diff` scanned for accidental secret exposure before PR merge

### Network & API Hardening
- [ ] CORS configured explicitly — no wildcard `*` origins in production
- [ ] Rate limiting applied on all public endpoints; stricter limits on auth endpoints
- [ ] Content-Security-Policy, X-Frame-Options, and HSTS headers set
- [ ] PII fields (email, phone, SSN) are not returned unless the endpoint explicitly requires them

### Dependency Audit
- [ ] `npm audit` (or equivalent) returns no critical or high severity findings
- [ ] New dependencies are from trusted sources with active maintenance
- [ ] License compatibility checked for new open-source dependencies

---

## Data Quality Gates

### Schema & Naming Conventions
- [ ] Table and column names follow project snake_case convention
- [ ] Every table has `id`, `created_at`, `updated_at` audit columns
- [ ] Soft-delete tables have a `deleted_at` nullable column
- [ ] Column types are semantically correct (e.g., `BOOLEAN` not `TINYINT` for flags)
- [ ] Indexes exist on all foreign key columns and high-cardinality filter columns

### Pipeline Correctness
- [ ] Pipeline runs are idempotent — re-running produces the same result without side effects
- [ ] Incremental loads validated against source counts (row count, sum checks)
- [ ] Null handling is explicit — no silent coercions of nulls to defaults
- [ ] Data type contracts between source and destination are verified at pipeline start
- [ ] Deduplication logic is tested with known duplicate inputs

### Data Freshness & SLAs
- [ ] Pipeline SLA is documented (e.g., "data must be < 6 hours stale by 09:00 UTC")
- [ ] Freshness check alert fires when data age exceeds the SLA threshold
- [ ] Volume bounds alerts configured: alert if row count is < 80% or > 120% of expected range

---

## ML Quality Gates

### Evaluation & Thresholds
- [ ] Model evaluated on a held-out test set (not validation set) before promotion
- [ ] All primary metrics meet the agreed acceptance thresholds (e.g., F1 >= 0.85)
- [ ] Performance is broken down by relevant slices (demographics, data source, time period)
- [ ] Failure modes analyzed: what types of examples does the model get wrong?

### Training–Serving Consistency
- [ ] Feature engineering code is shared between training and serving pipelines
- [ ] Training–serving skew test passes (distribution of features matches between environments)
- [ ] Model input schema is versioned and validated at inference time

### Experiment & Registry
- [ ] Experiment parameters, metrics, and artifacts logged to the experiment tracker (MLflow, W&B, etc.)
- [ ] Model registered in the model registry with version, metadata, and evaluation report
- [ ] Comparison against the current production baseline is documented

### Drift & Monitoring
- [ ] Data drift detection configured on key input features (statistical test + threshold)
- [ ] Prediction distribution monitored in production (alert on significant distribution shift)
- [ ] Ground truth feedback loop defined — how and when labels are collected post-deployment

---

## General Quality Gates

### CI/CD Pipeline
- [ ] Lint stage passes with zero warnings above configured severity
- [ ] Type-check stage passes with zero errors
- [ ] Unit test stage passes with all tests green
- [ ] Integration test stage passes (requires running service / test database)
- [ ] Build / compile stage succeeds and produces a deployable artifact
- [ ] Security scan stage passes (`npm audit`, SAST tool, or equivalent)

### Documentation & Housekeeping
- [ ] README updated if setup steps, environment variables, or architecture changed
- [ ] CHANGELOG updated with user-facing changes (if project maintains one)
- [ ] ADR (Architectural Decision Record) written for significant design choices
- [ ] No circular dependencies between modules (verified by dependency analysis tool)
- [ ] No dead code or commented-out blocks left in the changeset
- [ ] `.env.example` reflects all new required environment variables
