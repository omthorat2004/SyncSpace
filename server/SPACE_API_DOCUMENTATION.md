# Space API Documentation

## Overview

The Space API provides endpoints for managing workspace spaces in SyncSpace. This document describes the industry-level implementation following FastAPI best practices and clean architecture principles.

## Architecture

The Space feature follows a **3-layer architecture**:

### 1. **DAO Layer** (`src/server/dao/space_dao.py`)
- **Responsibility**: Database operations only
- **Class**: `SpaceDAO`
- **Methods**:
  - `create_space()` - Create new space
  - `get_space_by_id()` - Retrieve space by ID
  - `get_spaces_by_owner()` - Get all spaces for a user
  - `update_space()` - Update space details
  - `delete_space()` - Delete space
  - `space_exists()` - Check space existence
  - `is_space_owner()` - Verify ownership

### 2. **Service Layer** (`src/server/services/space/space_service.py`)
- **Responsibility**: Business logic and validation
- **Class**: `SpaceService`
- **Features**:
  - Input validation with custom exceptions
  - Authorization checks
  - Business rule enforcement
  - Error handling and logging
- **Validation Constants**:
  - `MIN_SPACE_NAME_LENGTH = 3`
  - `MAX_SPACE_NAME_LENGTH = 255`
  - `MAX_DESCRIPTION_LENGTH = 500`

### 3. **Router Layer** (`src/server/router/space/space.py`)
- **Responsibility**: HTTP endpoints and request/response handling
- **Prefix**: `/api/v1/spaces`
- **Features**:
  - FastAPI dependency injection
  - Comprehensive logging
  - Detailed OpenAPI documentation
  - Error response specifications

## API Endpoints

### 1. Create Space
```
POST /api/v1/spaces
```

**Authentication**: Required (JWT token)

**Request Body**:
```json
{
  "name": "Project Alpha",
  "description": "A space for organizing project ideas"
}
```

**Response** (201 Created):
```json
{
  "space": {
    "id": 1,
    "name": "Project Alpha",
    "description": "A space for organizing project ideas",
    "owner_id": 123,
    "created_at": "2026-05-19T10:30:00Z",
    "updated_at": "2026-05-19T10:30:00Z"
  },
  "message": "Space created successfully"
}
```

**Validation Rules**:
- `name`: Required, 3-255 characters, trimmed
- `description`: Optional, max 500 characters, trimmed

**Error Responses**:
- `400 Bad Request`: Invalid space data
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Database error

---

### 2. Get User's Spaces
```
GET /api/v1/spaces
```

**Authentication**: Required (JWT token)

**Response** (200 OK):
```json
{
  "spaces": [
    {
      "id": 1,
      "name": "Project Alpha",
      "description": "A space for organizing project ideas",
      "owner_id": 123,
      "created_at": "2026-05-19T10:30:00Z",
      "updated_at": "2026-05-19T10:30:00Z"
    }
  ],
  "count": 1
}
```

**Features**:
- Returns spaces ordered by creation date (newest first)
- Only returns spaces owned by authenticated user

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Database error

---

### 3. Get Space Details
```
GET /api/v1/spaces/{space_id}
```

**Authentication**: Required (JWT token)

**Path Parameters**:
- `space_id` (integer): ID of the space

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Project Alpha",
  "description": "A space for organizing project ideas",
  "owner_id": 123,
  "created_at": "2026-05-19T10:30:00Z",
  "updated_at": "2026-05-19T10:30:00Z"
}
```

**Authorization**:
- User must be the owner of the space

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not the space owner
- `404 Not Found`: Space doesn't exist
- `500 Internal Server Error`: Database error

---

### 4. Update Space
```
PUT /api/v1/spaces/{space_id}
```

**Authentication**: Required (JWT token)

**Path Parameters**:
- `space_id` (integer): ID of the space

**Request Body**:
```json
{
  "name": "Project Beta",
  "description": "Updated description"
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "name": "Project Beta",
  "description": "Updated description",
  "owner_id": 123,
  "created_at": "2026-05-19T10:30:00Z",
  "updated_at": "2026-05-19T11:45:00Z"
}
```

**Validation Rules**:
- `name`: Optional, 3-255 characters if provided
- `description`: Optional, max 500 characters if provided
- At least one field must be provided

**Authorization**:
- User must be the owner of the space

**Error Responses**:
- `400 Bad Request`: Invalid space data
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not the space owner
- `404 Not Found`: Space doesn't exist
- `500 Internal Server Error`: Database error

---

### 5. Delete Space
```
DELETE /api/v1/spaces/{space_id}
```

**Authentication**: Required (JWT token)

**Path Parameters**:
- `space_id` (integer): ID of the space

**Response** (200 OK):
```json
{
  "message": "Space deleted successfully",
  "space_id": 1
}
```

**Authorization**:
- User must be the owner of the space

**Important**:
- This operation is irreversible
- All content within the space will be deleted (CASCADE delete)

**Error Responses**:
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: User is not the space owner
- `404 Not Found`: Space doesn't exist
- `500 Internal Server Error`: Database error

---

## Exception Handling

### Custom Exceptions

All space-related exceptions inherit from `SpaceException` and are defined in `src/server/exceptions/space_exceptions.py`:

| Exception | Status Code | Description |
|-----------|------------|-------------|
| `SpaceNotFound` | 404 | Space doesn't exist |
| `UnauthorizedSpaceAccess` | 403 | User doesn't own the space |
| `SpaceNameRequired` | 400 | Space name is missing |
| `SpaceNameTooShort` | 400 | Space name < 3 characters |
| `SpaceNameTooLong` | 400 | Space name > 255 characters |
| `DescriptionTooLong` | 400 | Description > 500 characters |
| `DuplicateSpaceName` | 400 | Space name already exists for user |
| `SpaceCreationFailed` | 500 | Database error during creation |

### Error Response Format

All errors follow the standard format:

```json
{
  "message": "Error description"
}
```

---

## Dependency Injection

The service is injected using FastAPI's dependency system:

```python
def get_space_service(db: AsyncSession = Depends(get_db)) -> SpaceService:
    dao = SpaceDAO(db)
    return SpaceService(dao)
```

**Dependency Chain**:
```
get_db() → SpaceDAO(db) → SpaceService(dao) → Router endpoint
```

---

## Database Schema

### Spaces Table

```sql
CREATE TABLE spaces (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR NOT NULL,
    description VARCHAR,
    owner_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX (owner_id)
);
```

### Relationships

- **One-to-Many**: User → Spaces (one user can own many spaces)
- **One-to-Many**: Space → Contents (one space can contain many contents)
- **Cascade Delete**: Deleting a user or space deletes related records

---

## Logging

All endpoints include comprehensive logging:

```python
logger.info(f"Creating space '{payload.name}' for user {current_user.id}")
logger.info(f"Space created successfully: {space.id}")
```

Logs are written to the application logger and can be monitored via:
- Application logs
- Structured logging systems
- Monitoring dashboards

---

## Security Features

1. **Authentication**: All endpoints require valid JWT token
2. **Authorization**: Users can only access/modify their own spaces
3. **Input Validation**: All inputs validated before database operations
4. **SQL Injection Prevention**: SQLAlchemy parameterized queries
5. **Error Messages**: Generic error messages to prevent information leakage

---

## Testing

### Example cURL Requests

**Create Space**:
```bash
curl -X POST http://localhost:8000/api/v1/spaces \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Project Alpha",
    "description": "A space for organizing project ideas"
  }'
```

**Get Spaces**:
```bash
curl -X GET http://localhost:8000/api/v1/spaces \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Get Space Details**:
```bash
curl -X GET http://localhost:8000/api/v1/spaces/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Update Space**:
```bash
curl -X PUT http://localhost:8000/api/v1/spaces/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Project Beta",
    "description": "Updated description"
  }'
```

**Delete Space**:
```bash
curl -X DELETE http://localhost:8000/api/v1/spaces/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Frontend Integration

The frontend API service (`src/services/api.service.ts`) provides methods for all space operations:

```typescript
// Create space
protectedApi.createSpace(name, description)

// Get all spaces
protectedApi.getSpaces()

// Update space
protectedApi.updateSpace(id, name, description)

// Delete space
protectedApi.deleteSpace(id)
```

---

## Best Practices Implemented

1. **Separation of Concerns**: DAO, Service, Router layers
2. **Dependency Injection**: FastAPI Depends() pattern
3. **Async/Await**: Full async support for database operations
4. **Type Hints**: Complete type annotations for IDE support
5. **Error Handling**: Custom exceptions with appropriate HTTP status codes
6. **Validation**: Input validation at service layer
7. **Logging**: Comprehensive logging for debugging
8. **Documentation**: OpenAPI/Swagger documentation
9. **Security**: Authentication and authorization checks
10. **Database Integrity**: Foreign keys and cascade deletes

---

## Future Enhancements

- [ ] Space sharing and collaboration
- [ ] Space templates
- [ ] Space archiving
- [ ] Bulk operations
- [ ] Advanced filtering and search
- [ ] Space activity audit logs
- [ ] Rate limiting
- [ ] Caching layer
