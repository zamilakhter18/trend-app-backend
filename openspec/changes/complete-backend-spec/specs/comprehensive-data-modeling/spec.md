## ADDED Requirements

### Requirement: Full Relational Schema Implementation
The system SHALL implement the expanded relational schema including `trend_metadata`, `products`, `engagements`, `ai_analysis`, `trend_scores`, `clickouts`, and `sponsored_content`.

#### Scenario: Complex trend retrieval
- **WHEN** a client requests a trend by ID
- **THEN** the response MUST include data from `trend_metadata`, `ai_analysis`, and associated `products` via SQL joins or views

### Requirement: Automated Trigger for AI Analysis
The system SHALL automatically trigger an AI analysis (Edge Function) whenever a new record is inserted into the `trends` table.

#### Scenario: New trend ingestion
- **WHEN** a new row is added to the `trends` table
- **THEN** a database webhook invokes the `enrich-trend` Edge Function
