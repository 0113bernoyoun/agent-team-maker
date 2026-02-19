<!-- ADAPTATION GUIDE
This orchestration config is extracted from the data-ml preset.
When the generator processes this file, it merges hierarchy, trigger matrix,
intervention policies, workflows, communication protocol, quality gates,
and escalation paths into the final team configuration.

Customization points:
- hierarchy.lead: Change the team lead agent
- hierarchy.structure: Add/remove agents and reporting lines
- triggerMatrix: Adjust keyword routing for your domain
- interventionPolicy: Tune critical vs. standard vs. low-risk thresholds
- workflows: Add or modify multi-agent workflow sequences
- qualityGates: Adjust checks per agent role
- escalationPaths: Modify escalation conditions between agents
-->

## Agent Hierarchy

**Lead**: data-architect

```
data-architect (lead -- schema, governance, architecture authority)
       |
       +-- data-engineer (pipeline implementation, data infrastructure)
       |       |
       |       +-- collaborates with ml-engineer (feature data supply)
       |
       +-- ml-engineer (model development and MLOps)
       |       |
       |       +-- collaborates with data-analyst (exploratory analysis for model development)
       |
       +-- data-analyst (analysis, reporting, business insights)
```

### Structure

| Agent | Reports To | Collaborates With | Delegates To |
|-------|-----------|-------------------|--------------|
| data-architect | -- | data-engineer, ml-engineer, data-analyst | data-engineer, ml-engineer, data-analyst |
| data-engineer | data-architect | ml-engineer, data-analyst | -- |
| ml-engineer | data-architect | data-engineer, data-analyst | -- |
| data-analyst | data-architect | data-engineer, ml-engineer | -- |

---

## Trigger Matrix

### Schema design or data modeling for a new entity or dataset
- **Primary**: data-architect
- **Secondary**: data-engineer
- **Keywords**: schema, data model, entity, table design, column, dimension, fact table, star schema, normalization, denormalization, data contract, DADR, master data, slowly changing dimension, SCD, schema evolution, schema migration, backward compatible

### ETL/ELT pipeline development or data transformation
- **Primary**: data-engineer
- **Secondary**: data-architect
- **Keywords**: pipeline, ETL, ELT, ingestion, transformation, dbt, Airflow, DAG, Spark, PySpark, batch job, streaming, Kafka, CDC, change data capture, incremental load, backfill, deduplication, upsert, merge, data warehouse, BigQuery, Snowflake, Redshift, Delta Lake, Parquet

### ML model development, training, or deployment
- **Primary**: ml-engineer
- **Secondary**: data-engineer
- **Keywords**: machine learning, ML model, model training, model deployment, prediction, inference, classification, regression, recommendation, feature engineering, feature store, scikit-learn, XGBoost, LightGBM, PyTorch, TensorFlow, experiment tracking, MLflow, model registry, model serving, model drift, retraining, A/B test model, canary deployment, shadow mode

### Data analysis, reporting, or business metric investigation
- **Primary**: data-analyst
- **Secondary**: data-engineer
- **Keywords**: analysis, report, dashboard, KPI, metric, trend, cohort, funnel, retention, conversion, segmentation, visualization, SQL query, ad-hoc, business insight, anomaly investigation, metric drop, growth analysis, churn analysis, revenue analysis, user behavior, engagement, attribution, executive summary

### Data governance, compliance, or access control decision
- **Primary**: data-architect
- **Keywords**: governance, compliance, GDPR, CCPA, PII, personally identifiable information, data classification, access control, retention policy, data deletion, right to erasure, data lineage, data catalog, ownership, audit, regulatory, sensitive data, data masking, tokenization, anonymization

### Data quality degradation or pipeline failure
- **Primary**: data-engineer
- **Secondary**: data-architect
- **Keywords**: data quality, pipeline failure, SLA breach, missing data, null values, duplicate records, stale data, schema drift, volume anomaly, data anomaly, freshness alert, dead-letter queue, data incident, reconciliation, data discrepancy, metric discrepancy, Great Expectations, dbt test failure, data validation failure

### Feature engineering or feature data availability for ML
- **Primary**: ml-engineer
- **Secondary**: data-engineer
- **Keywords**: feature engineering, feature pipeline, feature store, feature definition, training data, feature availability, feature grain, feature freshness, training-serving skew, feature distribution, feature importance, feature validation, feature request, embeddings, preprocessing, feature computation, feature backfill

---

## Intervention Policy

### Critical

1. **Schema migration affecting production tables with existing data**
   data-architect reviews and approves the full migration plan before any execution. A DADR is required. Backup and rollback procedures must be verified in staging. Migration is executed during a documented maintenance window with data-engineer monitoring throughout.

2. **Production data pipeline failure affecting downstream ML models or analyst reports**
   data-engineer responds immediately to diagnose and restore the pipeline. data-architect is notified if the root cause involves schema drift or governance issues. ml-engineer and data-analyst are informed of affected outputs. Incident is documented with root cause and remediation within 24 hours.

3. **ML model deployment to production serving live traffic**
   ml-engineer must pass the full model quality gate and MLOps quality gate before deployment. data-architect reviews any new data access requirements. Shadow mode or canary deployment is required for the first 48 hours. Rollback procedure is verified before traffic is shifted.

4. **PII data exposure or compliance violation in a pipeline or analysis**
   data-architect is notified immediately and treats this as the highest severity incident. The affected pipeline or query is suspended. Legal and compliance teams are notified per the incident response plan. Root cause analysis and remediation are completed before any resumption.

### Standard

1. **New data pipeline for a new source system or data domain**
   data-architect approves the schema design and governance classification before implementation begins. data-engineer builds the pipeline following the architecture standards. Documentation and data catalog entry are required before production deployment.

2. **Feature engineering for a new ML model or feature set expansion**
   ml-engineer defines the feature computation logic and coordinates with data-engineer for data availability. data-architect reviews the data access pattern if new tables or PII classification is involved. Feature pipelines are validated for training-serving consistency before the model goes to production.

3. **New recurring report or automated dashboard**
   data-analyst documents the metric definitions and SQL logic. data-engineer reviews the query for performance and data quality assumptions. data-architect confirms the underlying tables are appropriate and governed. Report is peer-reviewed before distribution to business stakeholders.

4. **Dependency or platform library upgrade for data infrastructure**
   data-engineer evaluates compatibility with existing pipelines and tests in staging. data-architect reviews if the upgrade affects data contracts or platform-level architecture. Rollback procedure is documented before production upgrade.

### Low Risk (No Escalation Required)

- Adding inline comments or documentation to existing SQL queries
- Creating or updating analytical notebook for exploratory investigation (not production)
- Adding dbt data quality tests to existing models without changing transformation logic
- Updating metric definition documentation without changing the underlying computation
- Adjusting dashboard layout, colors, or chart types without changing underlying queries
- Writing or updating pipeline runbook documentation
- Ad-hoc SQL analysis queries that do not modify any table
- Adding logging or observability to existing pipelines without changing transformation logic

---

## Workflows

### 1. Data Pipeline Development

End-to-end workflow for building a new production data pipeline from requirements through deployment, coordinating schema approval, implementation, quality validation, and monitoring setup.

| Step | Agent | Action | Next |
|------|-------|--------|------|
| 1 | data-architect | Receive the data need from ml-engineer or data-analyst. Design the canonical schema for the new dataset. Classify data governance requirements (PII, retention, access). Write and approve the DADR before any implementation begins. | data-engineer receives the approved schema specification |
| 2 | data-engineer | Implement the ingestion pipeline, transformation logic (dbt models or Spark job), and Airflow DAG following the approved DADR. Configure data quality tests, dead-letter handling, and SLA monitoring. Test fully in staging environment. | data-architect conducts architecture review; ml-engineer or data-analyst validates output |
| 3 | data-architect | Review the implementation against the DADR specification. Verify governance controls are enforced. Confirm the data catalog entry is complete. Approve for production deployment. | data-engineer deploys to production and monitors first three runs |
| 4 | data-engineer | Deploy pipeline to production. Monitor the first three scheduled runs for correctness, volume, and SLA compliance. Communicate successful deployment to ml-engineer and data-analyst with the FEATURE DATA HANDOFF or dataset availability notice. | -- |

### 2. ML Model Lifecycle

Full lifecycle workflow for building, validating, deploying, and maintaining an ML model in production, from problem framing through monitoring and retraining.

| Step | Agent | Action | Next |
|------|-------|--------|------|
| 1 | ml-engineer | Frame the ML problem: define objective, success metrics, baseline comparison, and data requirements. Submit FEATURE DATA REQUEST to data-engineer for any missing feature data. Escalate to data-architect for data governance review if new data access is needed. | data-engineer makes feature data available; ml-engineer proceeds with experimentation |
| 2 | data-engineer | Implement or extend feature pipeline as specified in the FEATURE DATA REQUEST. Validate feature data quality and provide the FEATURE DATA HANDOFF documentation to ml-engineer with schema, grain, and quality guarantees. | ml-engineer begins model experimentation with validated feature data |
| 3 | ml-engineer | Run tracked experiments. Evaluate candidate models against the model quality gate. Conduct sliced evaluation and business metric simulation. Select champion model. Implement serving pipeline and load test for production latency requirements. | data-architect reviews data access compliance; ml-engineer prepares model card |
| 4 | data-architect | Review model serving data access patterns for governance compliance. Confirm that production prediction logging meets audit and retention requirements. Approve production deployment from a data governance perspective. | ml-engineer deploys to production in shadow or canary mode |
| 5 | ml-engineer | Deploy model to production using shadow mode or canary rollout. Monitor performance for 48 hours. Configure drift detection and retraining pipeline. Commit model card to /docs/models/. Report deployment outcome to data-architect. | -- |

### 3. Analytics Report

Workflow for producing a rigorous, reproducible analytical report or investigation, from scoping through delivery.

| Step | Agent | Action | Next |
|------|-------|--------|------|
| 1 | data-analyst | Clarify the business question and scope with the requestor. Consult the data catalog to identify available datasets. Confirm data freshness and quality with data-engineer. Write and validate SQL following the analytical standards. Produce visualizations. | data-analyst prepares the ANALYTICAL FINDING REPORT and commits SQL to repository |
| 2 | data-analyst | Document findings in the ANALYTICAL FINDING REPORT format: direct answer, methodology, key findings, caveats. Cross-check results against alternative data sources or known totals. Escalate DATA QUALITY ALERT to data-engineer if discrepancies are found. | findings are delivered to requestor; data quality issues are escalated |
| 3 | data-engineer | If a DATA QUALITY ALERT is raised: investigate the pipeline or source data issue, communicate impact assessment to data-architect, remediate the root cause, and confirm with data-analyst that the corrected data is available for re-analysis. | -- |

---

## Communication Protocol

### Data Team Inter-Agent Communication Protocol

### Overview
All agents in the data-ml team communicate through structured, documented formats. All data decisions, schema approvals, and analytical findings must be written down -- verbal agreements are not acceptable in a data context where reproducibility and auditability are requirements.

### Communication Hierarchy

```
data-architect (lead -- schema, governance, architecture authority)
       |
       +-- data-engineer (pipeline implementation, data infrastructure)
       |       |
       |       +-- collaborates with ml-engineer (feature data supply)
       |
       +-- ml-engineer (model development and MLOps)
       |       |
       |       +-- collaborates with data-analyst (exploratory analysis for model development)
       |
       +-- data-analyst (analysis, reporting, business insights)
```

### Reporting Lines

- **data-engineer**, **ml-engineer**, and **data-analyst** all report to **data-architect** for schema and governance decisions.
- **data-engineer** and **ml-engineer** collaborate directly on feature data -- ml-engineer raises FEATURE DATA REQUESTs to data-engineer.
- **data-analyst** and **ml-engineer** collaborate directly on exploratory analysis -- no formal escalation required for this collaboration.
- **data-analyst** reports data quality issues to **data-engineer** via DATA QUALITY ALERT, who escalates to **data-architect** if the root cause is architectural.

### Message Types and Formats

#### 1. DADR (Data Architecture Decision Record)
**Owner**: data-architect
**Trigger**: Any new schema, schema change, new data source, governance policy change
**Required before**: Any implementation begins
**Committed to**: /docs/data-architecture/

#### 2. FEATURE DATA REQUEST (ml-engineer -> data-engineer)
**Trigger**: ml-engineer needs data that does not exist in the feature store or serving layer
**Contains**: Feature name, computation logic, grain, freshness, training lookback, scale estimate
**SLA for response**: data-engineer acknowledges within 24 hours and provides timeline estimate

#### 3. FEATURE DATA HANDOFF (data-engineer -> ml-engineer)
**Trigger**: Feature data pipeline is deployed and available
**Contains**: Dataset location, schema, quality guarantees, sample query, known caveats
**Required before**: ml-engineer begins training with the new feature

#### 4. ANALYTICAL FINDING REPORT (data-analyst)
**Trigger**: Completion of any analytical task or investigation
**Contains**: Business question, direct answer, methodology, findings, caveats, SQL reference
**Committed to**: /docs/reports/ (report) and /sql/reports/ or /sql/adhoc/ (query)

#### 5. DATA QUALITY ALERT (data-analyst -> data-engineer)
**Trigger**: Anomaly detected in data during analysis that suggests a pipeline or source issue
**Contains**: Dataset affected, issue description, downstream impact, evidence
**SLA**: data-engineer acknowledges and assesses within 4 business hours

#### 6. ESCALATION TO DATA-ARCHITECT
**Trigger**: Schema decision beyond implementer authority, governance question, compliance concern, cross-team data conflict
**Format**: Defined in each agent's system prompt
**SLA**: data-architect responds within 1 business day for standard, same day for critical

#### 7. PIPELINE STATUS REPORT (data-engineer)
**Trigger**: Pipeline incidents, SLA breaches, or significant infrastructure changes
**Contains**: Pipeline name, status, metrics, incidents, upcoming maintenance

#### 8. MODEL DEVELOPMENT STATUS (ml-engineer)
**Trigger**: Regular cadence during model development, or on data-architect request
**Contains**: Model stage, experiment progress, current best metrics, blockers

### Communication Principles

- **Reproducibility first**: All analytical findings reference committed SQL. All model results reference logged experiments. No undocumented analysis enters a business decision.
- **Schema authority is absolute**: No schema change is implemented without a DADR from data-architect. Implementers may propose; data-architect decides.
- **Data quality is a shared responsibility**: data-analyst detects and reports anomalies; data-engineer investigates and remediates; data-architect identifies if root cause is architectural.
- **Feature data is a contract**: Once ml-engineer and data-engineer agree on a FEATURE DATA HANDOFF, the schema and quality guarantees are treated as a contract. Changes require a new versioned handoff.
- **Governance is non-negotiable**: PII and compliance requirements set by data-architect are enforced without exception by all implementing agents.

### Cadence

- **On change**: DADR, FEATURE DATA REQUEST/HANDOFF, and DATA QUALITY ALERT are event-driven -- sent when the situation arises.
- **On completion**: ANALYTICAL FINDING REPORT is delivered when the analysis is complete.
- **On incident**: PIPELINE STATUS REPORT and MODEL DEVELOPMENT STATUS blocking updates are sent immediately.
- **Regular**: MODEL DEVELOPMENT STATUS reports are shared at each major experiment milestone.

---

## Quality Gates

### Data Quality Gate
**Owner**: data-architect

- [ ] Schema conforms to naming conventions: snake_case, no ambiguous abbreviations, consistent unit suffixes
- [ ] All required audit columns present: created_at, updated_at, appropriate partition key
- [ ] PII columns are identified, classified, and governed per the retention and access policy
- [ ] Schema is backward compatible or a migration plan with a deprecation period is documented
- [ ] DADR is written and committed to /docs/data-architecture/ before implementation begins
- [ ] Partitioning strategy is defined and documented in the data catalog
- [ ] Data catalog entry is complete: owner, description, schema, quality metrics, update frequency
- [ ] Downstream consumers (models, dashboards, reports) are identified and notified of schema changes
- [ ] Governance controls are enforced: access restrictions, masking of PII in non-production environments
- [ ] Pipeline idempotency is verified: re-run produces identical output for the same time window
- [ ] Data quality tests are passing: not_null, unique, referential integrity, freshness, volume bounds
- [ ] Dead-letter handling is in place for malformed records and failure alerting is configured

### ML Quality Gate
**Owner**: ml-engineer

- [ ] Test set evaluation metrics meet or exceed the documented minimum performance threshold
- [ ] Model outperforms current production model or documented baseline by a statistically significant margin
- [ ] Sliced evaluation across key subgroups shows no unacceptable performance disparities
- [ ] Experiment is fully logged in MLflow or equivalent: parameters, metrics, artifacts, data version, environment
- [ ] Training-serving skew test passed: serving pipeline produces identical features to training pipeline on the same inputs
- [ ] Model is registered in the model registry with semantic version and champion/challenger designation
- [ ] Model card is written and committed to /docs/models/ covering purpose, features, evaluation results, and caveats
- [ ] Serving latency is within SLA: P99 inference time is below the documented threshold under expected load
- [ ] Drift detection is configured with documented thresholds for feature drift and prediction drift
- [ ] Retraining pipeline is tested and scheduled; trigger conditions are documented
- [ ] Rollback procedure is documented and verified: previous model version is available in the registry
- [ ] Production prediction logging is enabled for auditability and future retraining data collection

### Analytics Quality Gate
**Owner**: data-analyst

- [ ] Business question is clearly stated at the top of the analysis document
- [ ] All metrics are defined with exact computation logic, numerator, denominator, and applicable filters
- [ ] SQL query is committed to the repository before findings are shared with stakeholders
- [ ] Results have been sanity-checked against known totals or an alternative data source
- [ ] Denominators are validated as non-zero; SAFE_DIVIDE or equivalent is used in SQL
- [ ] Sample sizes are reported alongside rates and averages so readers can assess reliability
- [ ] All charts have labeled axes, a title including the time period, and a data source citation
- [ ] Caveats and known data quality limitations are explicitly documented in the report
- [ ] Metric definitions align with those in the data catalog; discrepancies are flagged to data-architect
- [ ] Findings are presented in plain language accessible to a non-technical business audience
- [ ] Recommendations (if included) are clearly distinguished from factual findings
- [ ] Analysis is reproducible: any reader with repository access can re-run the SQL and produce the same result

---

## Escalation Paths

### data-engineer -> data-architect
- Source system schema change would break the canonical data model or an existing pipeline
- New data source requires governance classification or compliance review before ingestion
- Pipeline implementation requires schema changes that were not covered in the approved DADR
- Data quality issue is suspected to have a root cause in the canonical data model rather than the pipeline
- Two pipelines are producing conflicting values for the same metric -- definition arbitration needed
- Infrastructure or storage decision has long-term architectural implications beyond the current pipeline
- Proposed backfill operation would require significant compute resources or a maintenance window

### ml-engineer -> data-architect
- Model requires access to data with PII classification or a new governance requirement
- Feature engineering requires schema changes to existing tables in the serving layer
- Serving infrastructure decision has platform-level implications beyond a single model
- Training data audit trail or model prediction logging requires changes to retention or access policy
- Data access pattern for real-time inference introduces new governance or compliance considerations
- Conflicting metric definitions between analytical reports and model training labels need resolution

### data-analyst -> data-engineer
- Analysis reveals data anomaly that suggests a pipeline failure, missing data, or schema drift
- Report requires data that does not exist in the current serving layer
- Query performance on existing tables is degrading and affecting analytical productivity
- Source data appears to have changed in structure or content without a documented schema change
- Metric values in the analytical result contradict values in an existing production dashboard

### data-analyst -> data-architect
- Metric definition used in a report conflicts with the canonical definition in the data catalog
- Analysis reveals a data governance concern (PII appearing in a non-classified table, unexpected data exposure)
- Business stakeholder requests access to a dataset that the analyst does not have authority to grant
- Report contradicts a previously approved analytical finding -- arbitration on the correct methodology needed
