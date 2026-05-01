## ADDED Requirements

### Requirement: Interaction Logging
The system SHALL provide endpoints to log user engagements (likes, comments, shares).

#### Scenario: User engages with trend
- **WHEN** a `POST /trend/engage` is sent with trend_id and action
- **THEN** a record is created in the `engagements` table

### Requirement: Commerce Click Tracking
The system SHALL track click-throughs to e-commerce products for conversion analysis.

#### Scenario: Product clickout
- **WHEN** a user clicks a product link via `POST /product/click`
- **THEN** a record is created in the `clickouts` table and the user is redirected or the count is incremented
