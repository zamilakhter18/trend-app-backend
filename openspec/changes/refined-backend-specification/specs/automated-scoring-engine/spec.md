## ADDED Requirements

### Requirement: Trend Score Computation
The system SHALL periodically compute trend scores based on engagement velocity and time-decay.

#### Scenario: Hourly score update
- **WHEN** the scoring job runs hourly
- **THEN** it updates the `trend_scores` table for all trends active in the last 24 hours

### Requirement: User Merit Calculation
The system SHALL calculate user performance scores based on their early identification of trends.

#### Scenario: Fetch user score
- **WHEN** a user requests `GET /user/score`
- **THEN** the system returns their aggregate trend score and current rank
