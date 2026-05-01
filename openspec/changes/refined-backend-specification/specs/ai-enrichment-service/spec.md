## ADDED Requirements

### Requirement: Trend Explanation Generation
The system SHALL integrate with an LLM API to generate explanations for why a topic is trending.

#### Scenario: Requesting trend explanation
- **WHEN** a client calls `GET /trend/:id/explanation`
- **THEN** the server returns the precomputed summary from the `ai_analysis` table or triggers a fresh analysis if missing

### Requirement: Vision-based Image Tagging
The system SHALL use a Vision API to automatically tag images associated with ingested signals.

#### Scenario: Image processing during ingestion
- **WHEN** a new image signal is received
- **THEN** the AI service extracts tags and saves them to `trend_metadata`
