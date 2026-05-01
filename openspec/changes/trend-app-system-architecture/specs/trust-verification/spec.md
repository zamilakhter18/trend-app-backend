## ADDED Requirements

### Requirement: Content Labeling
The system SHALL clearly label all content in the feed as either "Organic" or "Sponsored".

#### Scenario: Sponsored content display
- **WHEN** a trend is flagged as sponsored in the database
- **THEN** it MUST be displayed with a prominent "Sponsored" badge in the UI

### Requirement: Trust Score for Content Sources
The system SHALL maintain a trust score for external data sources to prioritize high-fidelity signals.

#### Scenario: Source prioritization
- **WHEN** multiple sources report a trend
- **THEN** sources with higher trust scores contribute more weight to the initial trend score
