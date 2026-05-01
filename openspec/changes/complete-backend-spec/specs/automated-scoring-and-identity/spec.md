## ADDED Requirements

### Requirement: Trend Score Calculation
The system SHALL compute trend scores based on engagement velocity and time-decay.

#### Scenario: Score update
- **WHEN** the scoring engine runs
- **THEN** it updates the `trend_scores` table with the latest values for active trends

### Requirement: User Merit Score
The system SHALL provide a `GET /user/score` endpoint to retrieve the authenticated user's trend performance metrics.

#### Scenario: Fetch user score
- **WHEN** a user requests their score
- **THEN** the system aggregates data from their interaction history and returns a rank/score
