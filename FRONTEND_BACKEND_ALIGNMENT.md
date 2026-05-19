# Frontend-Backend Alignment Document

## Overview

This document ensures complete alignment between frontend TypeScript types and backend Python models/schemas.

---

## Space Alignment

### Backend Model (`space_models.py`)
```python
class Space(Base):
    id: Integer (primary key, autoincrement)
    name: String (not null)
    description: String (nullable)
    owner_id: Integer (foreign key, not null)
    created_at: DateTime (timezone-aware, server default)
    updated_at: DateTime (timezone-aware, server default)
```

### Backend Schema (`schemas/space.py`)
```python
class SpaceResponse(BaseModel):
    id: int
    name: str
    description: str | None
    owner_id: int
    created_at: datetime
    updated_at: datetime
```

### Frontend Type (`space.type.ts`)
```typescript
interface Space {
  id: number                    // ✅ Matches: Integer → number
  name: string                  // ✅ Matches: String → string
  description: string | null    // ✅ Matches: String | None → string | null
  owner_id: number              // ✅ Matches: Integer → number
  created_at: string            // ✅ Matches: DateTime → ISO string
  updated_at: string            // ✅ Matches: DateTime → ISO string
}
```

### Alignment Status: ✅ COMPLETE

---

## Content Alignment

### Backend Model (`space_models.py`)
```python
class Content(Base):
    id: Integer (primary key, autoincrement)
    space_id: Integer (foreign key, not null)
    title: String (not null)
    type: Enum(ContentType) (not null)
    content: Text (not null)
    url: String (nullable)
    created_at: DateTime (timezone-aware, server default)
```

### Backend Schema (`schemas/content.py`)
```python
class ContentResponse(BaseModel):
    id: int
    space_id: int
    title: str
    type: str
    content: str
    url: str | None
    created_at: datetime
```

### Frontend Type (`content.type.ts`)
```typescript
interface Content {
  id: number                    // ✅ Matches: Integer → number
  space_id: number              // ✅ Matches: Integer → number
  title: string                 // ✅ Matches: String → string
  type: ContentType             // ✅ Matches: Enum → union type
  content: string               // ✅ Matches: Text → string
  url: string | null            // ✅ Matches: String | None → string | null
  created_at: string            // ✅ Matches: DateTime → ISO string
}
```

### Alignment Status: ✅ COMPLETE

---

## Content Type Alignment

### Backend Enum (`space_models.py`)
```python
class ContentType(str, enum.Enum):
    NOTE = "note"
    LINK = "link"
    CODE = "code"
```

### Frontend Type (`content.type.ts`)
```typescript
type ContentType = 'note' | 'link' | 'code'
```

### Alignment Status: ✅ COMPLETE

---

## Request/Response Alignment

### Create Space

**Frontend Request:**
```typescript
interface CreateSpaceFormData {
  name: string
  description: string
}
```

**Backend Request Schema:**
```python
class CreateSpaceRequest(BaseModel):
    name: str (min_length=3, max_length=255)
    description: str | None (max_length=500)
```

**Backend Response Schema:**
```python
class CreateSpaceResponse(BaseModel):
    space: SpaceResponse
    message: str
```

**Frontend Response:**
```typescript
interface CreateSpaceApiResponse {
  space: Space
  message: string
}
```

### Alignment Status: ✅ COMPLETE

---

### Create Content

**Frontend Request:**
```typescript
interface CreateContentFormData {
  title: string
  type: ContentType
  content: string
  url?: string
}
```

**Backend Request Schema:**
```python
class CreateContentRequest(BaseModel):
    title: str (min_length=1, max_length=255)
    type: str (one of: note, link, code)
    content: str (max_length=50000)
    url: str | None
```

**Backend Response Schema:**
```python
class CreateContentResponse(BaseModel):
    content: ContentResponse
    message: str
```

**Frontend Response:**
```typescript
interface CreateContentApiResponse {
  content: Content
  message: string
}
```

### Alignment Status: ✅ COMPLETE

---

## Validation Rules Alignment

### Space Name
| Aspect | Backend | Frontend | Status |
|--------|---------|----------|--------|
| Required | ✅ Yes | ✅ Yes | ✅ Match |
| Min Length | 3 | 3 | ✅ Match |
| Max Length | 255 | 255 | ✅ Match |
| Trimmed | ✅ Yes | ✅ Yes | ✅ Match |

### Space Description
| Aspect | Backend | Frontend | Status |
|--------|---------|----------|--------|
| Required | ❌ No | ❌ No | ✅ Match |
| Max Length | 500 | 500 | ✅ Match |
| Nullable | ✅ Yes | ✅ Yes | ✅ Match |

### Content Title
| Aspect | Backend | Frontend | Status |
|--------|---------|----------|--------|
| Required | ✅ Yes | ✅ Yes | ✅ Match |
| Min Length | 1 | 1 | ✅ Match |
| Max Length | 255 | 255 | ✅ Match |
| Trimmed | ✅ Yes | ✅ Yes | ✅ Match |

### Content Body
| Aspect | Backend | Frontend | Status |
|--------|---------|----------|--------|
| Required | ✅ Yes | ✅ Yes | ✅ Match |
| Max Length | 50,000 | 50,000 | ✅ Match |

### Content Type
| Aspect | Backend | Frontend | Status |
|--------|---------|----------|--------|
| Required | ✅ Yes | ✅ Yes | ✅ Match |
| Valid Values | note, link, code | note, link, code | ✅ Match |

### Content URL
| Aspect | Backend | Frontend | Status |
|--------|---------|----------|--------|
| Required | ❌ No | ❌ No | ✅ Match |
| Format | http/https | http/https | ✅ Match |
| Nullable | ✅ Yes | ✅ Yes | ✅ Match |

---

## API Endpoint Alignment

### Space Endpoints

| Operation | Backend Endpoint | Frontend Method | Status |
|-----------|------------------|-----------------|--------|
| Create | POST /api/v1/spaces | createSpace() | ✅ Match |
| Read All | GET /api/v1/spaces | getSpaces() | ✅ Match |
| Read One | GET /api/v1/spaces/{id} | getSpace(id) | ✅ Match |
| Update | PUT /api/v1/spaces/{id} | updateSpace(id, data) | ✅ Match |
| Delete | DELETE /api/v1/spaces/{id} | deleteSpace(id) | ✅ Match |

### Content Endpoints

| Operation | Backend Endpoint | Frontend Method | Status |
|-----------|------------------|-----------------|--------|
| Create | POST /api/v1/spaces/{id}/contents | createContent(spaceId, data) | ✅ Match |
| Read All | GET /api/v1/spaces/{id}/contents | getContents(spaceId, type?) | ✅ Match |
| Read One | GET /api/v1/spaces/{id}/contents/{cid} | getContent(spaceId, contentId) | ✅ Match |
| Update | PUT /api/v1/spaces/{id}/contents/{cid} | updateContent(spaceId, contentId, data) | ✅ Match |
| Delete | DELETE /api/v1/spaces/{id}/contents/{cid} | deleteContent(spaceId, contentId) | ✅ Match |

---

## Error Response Alignment

### Backend Error Format
```python
{
  "message": "Error description"
}
```

### Frontend Error Handling
```typescript
if (error.response?.data?.message) {
  // Use error.response.data.message
}
```

### Alignment Status: ✅ COMPLETE

---

## DateTime Handling

### Backend
- Uses `DateTime(timezone=True)` with server defaults
- Returns ISO 8601 format strings in JSON

### Frontend
- Receives ISO 8601 strings
- Stores as `string` type
- Formats for display using `new Date(dateString)`

### Alignment Status: ✅ COMPLETE

---

## Null/Optional Handling

### Backend
- Uses `str | None` for optional fields
- Returns `null` in JSON for None values

### Frontend
- Uses `string | null` for optional fields
- Handles `null` values properly

### Alignment Status: ✅ COMPLETE

---

## Redux State Alignment

### Space State
```typescript
interface SpaceState {
  spaces: Space[]              // ✅ Matches backend Space[]
  currentSpace: Space | null   // ✅ Matches backend Space | null
  loading: boolean
  error: string | null
  isCreateModalOpen: boolean
}
```

### Content State
```typescript
interface ContentState {
  contents: Content[]          // ✅ Matches backend Content[]
  currentContent: Content | null // ✅ Matches backend Content | null
  loading: boolean
  error: string | null
  isCreateModalOpen: boolean
  isEditModalOpen: boolean
  selectedType: ContentType | 'all'
  currentSpaceId: number | null
}
```

### Alignment Status: ✅ COMPLETE

---

## Summary Table

| Component | Backend | Frontend | Status |
|-----------|---------|----------|--------|
| **Models** |
| Space Model | ✅ | ✅ | ✅ Aligned |
| Content Model | ✅ | ✅ | ✅ Aligned |
| **Schemas** |
| Space Schemas | ✅ | ✅ | ✅ Aligned |
| Content Schemas | ✅ | ✅ | ✅ Aligned |
| **Types** |
| Space Type | ✅ | ✅ | ✅ Aligned |
| Content Type | ✅ | ✅ | ✅ Aligned |
| ContentType Enum | ✅ | ✅ | ✅ Aligned |
| **Validation** |
| Space Validation | ✅ | ✅ | ✅ Aligned |
| Content Validation | ✅ | ✅ | ✅ Aligned |
| **API Endpoints** |
| Space Endpoints | ✅ | ✅ | ✅ Aligned |
| Content Endpoints | ✅ | ✅ | ✅ Aligned |
| **Error Handling** |
| Error Format | ✅ | ✅ | ✅ Aligned |
| **State Management** |
| Redux State | ✅ | ✅ | ✅ Aligned |

---

## Changes Made

### Backend Changes
1. ✅ Updated `Content` model with proper constraints:
   - Added `autoincrement=True` to id
   - Added `nullable=False` to required fields
   - Added `index=True` to foreign keys
   - Changed `created_at` to use `DateTime(timezone=True)` with server default

2. ✅ Created `schemas/content.py` with proper validation:
   - `CreateContentRequest` with validation
   - `UpdateContentRequest` with validation
   - `ContentResponse` with proper types
   - Response schemas for all operations

### Frontend Changes
1. ✅ Updated `space.type.ts`:
   - Changed `id` from `string` to `number`
   - Changed `owner_id` from `string` to `number`
   - Changed `description` to `string | null`

2. ✅ Created `content.type.ts`:
   - Proper `Content` interface with all fields
   - `ContentType` union type
   - `CreateContentFormData` interface
   - Response interfaces

---

## Verification Checklist

- [x] Backend models match frontend types
- [x] Backend schemas match frontend interfaces
- [x] Validation rules are consistent
- [x] API endpoints are properly mapped
- [x] Error handling is aligned
- [x] DateTime handling is consistent
- [x] Null/optional handling is consistent
- [x] Redux state matches backend responses
- [x] All types are properly exported
- [x] All schemas are properly defined

---

## Status: ✅ COMPLETE ALIGNMENT

All frontend and backend components are now properly aligned and ready for production use.

**Last Updated**: May 19, 2026
**Version**: 1.0.0
**Status**: ✅ Fully Aligned
