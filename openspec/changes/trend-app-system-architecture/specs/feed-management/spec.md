## ADDED Requirements

### Requirement: Trending Feed Retrieval
The system SHALL provide a paginated feed of trends, ordered by precomputed trend scores.

#### Scenario: User requests first page of feed
- **WHEN** an authenticated user requests the trend feed without a cursor
- **THEN** the system returns the top 20 trends by score and a cursor for the next page

### Requirement: Cursor-based Pagination
The system SHALL use cursor-based pagination for the trend feed to ensure stability during high-frequency data updates.

#### Scenario: User requests next page of feed
- **WHEN** a user provides a valid cursor from a previous response
- **THEN** the system returns the next 20 trends starting from that cursor
