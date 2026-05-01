## ADDED Requirements

### Requirement: User Trend Score
The system SHALL calculate and maintain a "Trend Score" for each user based on their accuracy in identifying or interacting with early-stage trends.

#### Scenario: Score increase
- **WHEN** a user interacts with a trend that later reaches a "Mega" phase
- **THEN** the user's trend score is incremented proportionally to their early involvement

### Requirement: Achievement Badges
The system SHALL award badges to users who reach specific trend score milestones or fulfill specific activity criteria.

#### Scenario: Badge award
- **WHEN** a user reaches a trend score of 1000
- **THEN** the "Trend Pioneer" badge is automatically added to their profile
