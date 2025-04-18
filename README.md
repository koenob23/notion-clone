# Notion Clone API

A Next.js 13+ API with Prisma and Clerk authentication for managing pages with version history.

## Features

- Full CRUD operations for pages
- Version history tracking
- Soft delete and restore functionality
- Pagination and search
- Authentication with Clerk
- PostgreSQL database with Prisma ORM

## API Endpoints

### Pages

#### Create a Page
```bash
POST /api/pages
Content-Type: application/json

{
  "title": "Page Title",
  "content": "Page Content"
}
```

#### List Pages
```bash
GET /api/pages?page=1&limit=10&search=keyword&archived=false
```
Query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search in title and content
- `archived`: Show archived pages (default: false)

#### Get Single Page
```bash
GET /api/pages/{pageId}
```
Returns page with its 10 most recent versions.

#### Update Page
```bash
PATCH /api/pages/{pageId}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated Content"
}
```
Automatically creates a version before updating.

#### Archive Page
```bash
DELETE /api/pages/{pageId}
```
Soft deletes the page (marks as archived).

#### Restore Page
```bash
POST /api/pages/{pageId}/restore
```
Restores an archived page.

### Versions

#### Restore Version
```bash
POST /api/pages/{pageId}/versions/{versionId}/restore
```
Restores a specific version of a page, creating a version of the current state first.

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   DATABASE_URL="postgresql://..."
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
   CLERK_SECRET_KEY="..."
   ```
4. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 204: No Content (successful deletion)
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

## Authentication

All endpoints require authentication using Clerk. Include the session token in requests.

## Database Schema

```prisma
model Page {
  id        String   @id @default(cuid())
  title     String
  content   String?
  userId    String
  isArchived Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  versions  PageVersion[]
}

model PageVersion {
  id        String   @id @default(cuid())
  title     String
  content   String?
  pageId    String
  createdAt DateTime @default(now())
  page      Page     @relation(fields: [pageId], references: [id])
}
```

## License

MIT
