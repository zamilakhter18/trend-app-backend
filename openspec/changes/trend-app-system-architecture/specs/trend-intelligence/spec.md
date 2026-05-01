## ADDED Requirements

### Requirement: Trend Enrichment via LLM
The system SHALL enrich new trends with AI-generated explanations using a Large Language Model (LLM).

#### Scenario: Successful enrichment
- **WHEN** a new trend is ingested by the pipeline
- **THEN** an Edge Function triggers an LLM request and saves the generated summary to the trend record

### Requirement: Image Tagging via Vision API
The system SHALL use a Vision API to automatically tag images associated with trends.

#### Scenario: Image tagging
- **WHEN** a trend containing an image is processed
- **THEN** the Vision API identifies key objects and attributes, which are saved as tags in the database
