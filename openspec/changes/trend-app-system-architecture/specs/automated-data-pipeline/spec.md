## ADDED Requirements

### Requirement: External Data Scraping
The Python pipeline SHALL scrape external signals from social media and news APIs to identify potential trends.

#### Scenario: Signal ingestion
- **WHEN** the pipeline identifies a recurring keyword or image across multiple sources
- **THEN** it creates a "Raw Trend" record in the ingestion queue

### Requirement: Data Deduplication
The pipeline SHALL deduplicate incoming data signals to prevent redundant trend creation.

#### Scenario: Duplicate detection
- **WHEN** a new signal has a high similarity score (e.g., >0.9) to an existing trend
- **THEN** the signal is linked to the existing trend instead of creating a new one
