## ADDED Requirements

### Requirement: Express Server Initialization
The system SHALL feature a Node.js Express server configured with standard middleware (CORS, Helmet, Body-Parser).

#### Scenario: Server health check
- **WHEN** a client sends a GET request to `/health`
- **THEN** the server returns a 200 OK status with basic system health metrics

### Requirement: Supabase Admin Integration
The Express server SHALL integrate with the Supabase Service Role Key to perform administrative operations (bypassing RLS when necessary for internal logic).

#### Scenario: Background data enrichment
- **WHEN** the server processes an AI enrichment task
- **THEN** it uses the Supabase Admin client to update protected tables like `ai_analysis`
