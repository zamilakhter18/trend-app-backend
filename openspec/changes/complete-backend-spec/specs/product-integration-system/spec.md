## ADDED Requirements

### Requirement: Product Metadata Management
The system SHALL store product details (name, price, image_url, affiliate_link) in the `products` table.

#### Scenario: Retrieval of products for trend
- **WHEN** `GET /products/{trend_id}` is called
- **THEN** the system returns a list of all products associated with that trend

### Requirement: Sponsored Content Identification
The system SHALL identify and flag sponsored trends using the `sponsored_content` table.

#### Scenario: Sponsored flag in feed
- **WHEN** the feed engine serves a trend linked to `sponsored_content`
- **THEN** the API response MUST include an `is_sponsored: true` flag
