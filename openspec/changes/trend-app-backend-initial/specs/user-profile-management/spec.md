## ADDED Requirements

### Requirement: User Registration and Authentication
The system SHALL provide secure user registration and authentication using Supabase Auth, supporting email/password and social providers.

#### Scenario: Successful sign up
- **WHEN** a user provides a valid email and password
- **THEN** a new user account is created and a verification email is sent

### Requirement: User Profile Storage
The system SHALL store user profile metadata (username, avatar_url, bio) in a dedicated `profiles` table.

#### Scenario: Profile creation on signup
- **WHEN** a new user record is created in `auth.users`
- **THEN** a corresponding record in the `public.profiles` table MUST be automatically created via a database trigger
