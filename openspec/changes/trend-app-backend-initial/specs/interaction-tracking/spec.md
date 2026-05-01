## ADDED Requirements

### Requirement: Interaction Logging
The system SHALL record user interactions (likes, shares, views) on trends to track engagement.

#### Scenario: User likes a trend
- **WHEN** an authenticated user sends a request to like a trend
- **THEN** a record is created in the `interactions` table linking the user and the trend

### Requirement: Engagement Aggregation
The system SHALL provide aggregated engagement metrics for each trend to facilitate ranking.

#### Scenario: Retrieving trend engagement
- **WHEN** a trend is requested
- **THEN** the response includes the total count of likes, shares, and views
