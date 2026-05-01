## ADDED Requirements

### Requirement: Cursor-based Pagination for Feed
The `GET /feed` endpoint SHALL support stable pagination using an encoded cursor.

#### Scenario: Requesting next page of trends
- **WHEN** a client provides a cursor from the previous response
- **THEN** the server returns the next set of items strictly following that cursor's sort position

### Requirement: Trend Detail Retrieval
The `GET /trend/:id` endpoint SHALL return comprehensive trend data, including content, metadata, and AI analysis.

#### Scenario: Fetch trend with products
- **WHEN** a valid trend ID is requested
- **THEN** the response includes associated product links from the `products` table
