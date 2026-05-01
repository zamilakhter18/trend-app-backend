## ADDED Requirements

### Requirement: Real-time Trend Feed
The system SHALL broadcast new trend submissions to all connected clients in real-time using Supabase Realtime.

#### Scenario: New trend broadcast
- **WHEN** a new row is inserted into the `trends` table
- **THEN** Supabase Realtime emits a broadcast event to subscribed clients with the trend data

### Requirement: Real-time Interaction Counts
The system SHALL broadcast updated interaction counts (likes, comments) for trends in real-time.

#### Scenario: Interaction count update
- **WHEN** the count of interactions for a trend changes
- **THEN** the updated count is pushed to clients viewing that trend
