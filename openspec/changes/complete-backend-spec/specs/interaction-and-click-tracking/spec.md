## ADDED Requirements

### Requirement: Trend Engagement Logging
The system SHALL provide a `POST /trend/engage` endpoint to log likes, shares, and comments.

#### Scenario: User likes a trend
- **WHEN** a `POST` is sent with `trend_id` and `action=like`
- **THEN** a new record is created in the `engagements` table

### Requirement: Trend Saving
The system SHALL provide a `POST /trend/save` endpoint for users to bookmark content.

#### Scenario: User saves a trend
- **WHEN** a user saves a trend
- **THEN** a record is added to the `saves` table, and the action is restricted by RLS to the authenticated user

### Requirement: Product Click Tracking
The system SHALL provide a `POST /product/click` endpoint to track user redirects to external commerce links.

#### Scenario: User clicks product link
- **WHEN** a click is recorded
- **THEN** a record is created in the `clickouts` table for conversion tracking
