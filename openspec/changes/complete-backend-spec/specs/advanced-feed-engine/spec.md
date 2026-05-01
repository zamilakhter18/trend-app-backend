## ADDED Requirements

### Requirement: Cursor-based Feed API
The system SHALL provide a `GET /feed` endpoint that supports cursor-based pagination.

#### Scenario: Retrieval with cursor
- **WHEN** a client calls `GET /feed?cursor=XYZ&limit=20`
- **THEN** the system returns 20 items starting after the encoded cursor `XYZ`

### Requirement: Trend Detail Retrieval
The system SHALL provide a `GET /trend/{id}` endpoint to retrieve all details for a specific trend.

#### Scenario: Valid trend ID
- **WHEN** a user requests a valid trend ID
- **THEN** the system returns the trend body, metadata, and associated AI analysis
