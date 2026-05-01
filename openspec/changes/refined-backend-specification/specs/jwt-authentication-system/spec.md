## ADDED Requirements

### Requirement: JWT-based User Authentication
The system SHALL provide endpoints for user signup and login, returning a valid JWT upon success.

#### Scenario: User login
- **WHEN** a user provides valid email and password to `POST /auth/login`
- **THEN** the system returns a JWT and user profile data

### Requirement: Protected Routes
The system SHALL protect sensitive endpoints using a JWT verification middleware.

#### Scenario: Accessing protected profile
- **WHEN** a user requests `GET /auth/me` without a valid JWT
- **THEN** the server returns a 401 Unauthorized error
