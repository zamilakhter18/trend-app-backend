## ADDED Requirements

### Requirement: Trend Submission
The system SHALL allow authenticated users to submit new trends, consisting of a title, description, and optional tags.

#### Scenario: User submits a trend
- **WHEN** an authenticated user sends a POST request with trend details
- **THEN** the trend is saved in the `trends` table with the user as the owner

### Requirement: Trend Retrieval
The system SHALL provide an API to fetch a list of trends, supporting pagination and filtering by tags.

#### Scenario: Fetching trends
- **WHEN** a client requests trends with a specific tag
- **THEN** the system returns a paginated list of trends matching that tag
