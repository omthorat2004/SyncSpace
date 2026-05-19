# Frontend API Endpoints Reference

## Overview

This document provides a complete reference of all API endpoints available in the frontend API service (`src/services/api.service.ts`).

## Public API Endpoints (No Authentication Required)

### Authentication

#### Health Check
```typescript
publicApi.healthCheck()
```
- **Method**: GET
- **Endpoint**: `/health`
- **Returns**: Health status
- **Usage**: Check if backend is running

#### Login
```typescript
publicApi.login(email: string, password: string)
```
- **Method**: POST
- **Endpoint**: `/api/v1/auth/login`
- **Body**: `{ email, password }`
- **Returns**: User object, access token, refresh token
- **Usage**: Authenticate user

#### Register/Signup
```typescript
publicApi.register(name: string, email: string, password: string)
```
- **Method**: POST
- **Endpoint**: `/api/v1/auth/signup`
- **Body**: `{ name, email, password }`
- **Returns**: User object, access token, refresh token
- **Usage**: Create new user account

#### Refresh Token
```typescript
publicApi.refreshToken()
```
- **Method**: POST
- **Endpoint**: `/api/v1/auth/refresh`
- **Returns**: New access token, new refresh token
- **Usage**: Refresh expired access token

#### Forgot Password
```typescript
publicApi.forgotPassword(email: string)
```
- **Method**: POST
- **Endpoint**: `/api/v1/auth/forgot-password`
- **Body**: `{ email }`
- **Returns**: Success message
- **Usage**: Request password reset

#### Reset Password
```typescript
publicApi.resetPassword(token: string, newPassword: string)
```
- **Method**: POST
- **Endpoint**: `/api/v1/auth/reset-password`
- **Body**: `{ token, newPassword }`
- **Returns**: Success message
- **Usage**: Reset password with token

---

## Protected API Endpoints (Authentication Required)

All protected endpoints require a valid JWT token in the Authorization header.

### User Profile

#### Get Current User
```typescript
protectedApi.getCurrentUser()
```
- **Method**: GET
- **Endpoint**: `/api/v1/user/me`
- **Returns**: Current user object
- **Usage**: Fetch authenticated user details

#### Update Profile
```typescript
protectedApi.updateProfile(data: { name?: string; email?: string })
```
- **Method**: PUT
- **Endpoint**: `/api/v1/user/profile`
- **Body**: `{ name?, email? }`
- **Returns**: Updated user object
- **Usage**: Update user profile information

#### Change Password
```typescript
protectedApi.changePassword(oldPassword: string, newPassword: string)
```
- **Method**: POST
- **Endpoint**: `/api/v1/user/change-password`
- **Body**: `{ oldPassword, newPassword }`
- **Returns**: Success message
- **Usage**: Change user password

---

### Spaces

#### Get All Spaces
```typescript
protectedApi.getSpaces()
```
- **Method**: GET
- **Endpoint**: `/api/v1/spaces`
- **Returns**: Array of spaces
- **Usage**: Fetch all spaces owned by user
- **Example**:
```typescript
const response = await protectedApi.getSpaces();
const spaces = response.data.spaces;
```

#### Get Space Details
```typescript
protectedApi.getSpace(spaceId: number)
```
- **Method**: GET
- **Endpoint**: `/api/v1/spaces/{spaceId}`
- **Parameters**: `spaceId` - ID of the space
- **Returns**: Space object
- **Usage**: Fetch specific space details
- **Example**:
```typescript
const response = await protectedApi.getSpace(1);
const space = response.data;
```

#### Create Space
```typescript
protectedApi.createSpace(name: string, description: string = '')
```
- **Method**: POST
- **Endpoint**: `/api/v1/spaces`
- **Body**: `{ name, description }`
- **Returns**: Created space object
- **Validation**:
  - `name`: Required, 3-255 characters
  - `description`: Optional, max 500 characters
- **Usage**: Create new space
- **Example**:
```typescript
const response = await protectedApi.createSpace(
  'My Project',
  'A space for my project'
);
const newSpace = response.data.space;
```

#### Update Space
```typescript
protectedApi.updateSpace(
  spaceId: number,
  data: { name?: string; description?: string }
)
```
- **Method**: PUT
- **Endpoint**: `/api/v1/spaces/{spaceId}`
- **Parameters**: `spaceId` - ID of the space
- **Body**: `{ name?, description? }`
- **Returns**: Updated space object
- **Validation**:
  - `name`: Optional, 3-255 characters if provided
  - `description`: Optional, max 500 characters if provided
- **Usage**: Update space information
- **Example**:
```typescript
const response = await protectedApi.updateSpace(1, {
  name: 'Updated Project Name',
  description: 'Updated description'
});
const updatedSpace = response.data;
```

#### Delete Space
```typescript
protectedApi.deleteSpace(spaceId: number)
```
- **Method**: DELETE
- **Endpoint**: `/api/v1/spaces/{spaceId}`
- **Parameters**: `spaceId` - ID of the space
- **Returns**: Success message
- **Usage**: Delete space and all its contents
- **Example**:
```typescript
await protectedApi.deleteSpace(1);
```

---

### Content

#### Get Contents
```typescript
protectedApi.getContents(spaceId: number, type?: string)
```
- **Method**: GET
- **Endpoint**: `/api/v1/spaces/{spaceId}/contents`
- **Parameters**:
  - `spaceId` - ID of the space (required)
  - `type` - Content type filter: 'note', 'link', 'code' (optional)
- **Query Parameters**: `content_type` (if type provided)
- **Returns**: Array of content objects
- **Usage**: Fetch all contents in a space with optional filtering
- **Example**:
```typescript
// Get all contents
const response = await protectedApi.getContents(1);
const contents = response.data.contents;

// Get only notes
const notesResponse = await protectedApi.getContents(1, 'note');
const notes = notesResponse.data.contents;
```

#### Get Content Details
```typescript
protectedApi.getContent(spaceId: number, contentId: number)
```
- **Method**: GET
- **Endpoint**: `/api/v1/spaces/{spaceId}/contents/{contentId}`
- **Parameters**:
  - `spaceId` - ID of the space
  - `contentId` - ID of the content
- **Returns**: Content object
- **Usage**: Fetch specific content details
- **Example**:
```typescript
const response = await protectedApi.getContent(1, 5);
const content = response.data;
```

#### Create Content
```typescript
protectedApi.createContent(
  spaceId: number,
  data: {
    title: string;
    type: string;
    content: string;
    url?: string;
  }
)
```
- **Method**: POST
- **Endpoint**: `/api/v1/spaces/{spaceId}/contents`
- **Parameters**: `spaceId` - ID of the space
- **Body**:
  - `title` - Content title (required, 1-255 characters)
  - `type` - Content type: 'note', 'link', 'code' (required)
  - `content` - Content body (required, max 50,000 characters)
  - `url` - URL for link type (optional, must start with http/https)
- **Returns**: Created content object
- **Usage**: Create new content in a space
- **Example**:
```typescript
// Create a note
const noteResponse = await protectedApi.createContent(1, {
  title: 'My First Note',
  type: 'note',
  content: 'This is my first note'
});

// Create a link
const linkResponse = await protectedApi.createContent(1, {
  title: 'Useful Article',
  type: 'link',
  content: 'A great article about React',
  url: 'https://example.com/article'
});

// Create a code snippet
const codeResponse = await protectedApi.createContent(1, {
  title: 'React Hook Example',
  type: 'code',
  content: 'const [count, setCount] = useState(0);'
});
```

#### Update Content
```typescript
protectedApi.updateContent(
  spaceId: number,
  contentId: number,
  data: Partial<{
    title: string;
    content: string;
    url: string;
  }>
)
```
- **Method**: PUT
- **Endpoint**: `/api/v1/spaces/{spaceId}/contents/{contentId}`
- **Parameters**:
  - `spaceId` - ID of the space
  - `contentId` - ID of the content
- **Body**: `{ title?, content?, url? }`
- **Validation**:
  - `title`: Optional, 1-255 characters if provided
  - `content`: Optional, max 50,000 characters if provided
  - `url`: Optional, must start with http/https if provided
- **Returns**: Updated content object
- **Usage**: Update content information
- **Example**:
```typescript
const response = await protectedApi.updateContent(1, 5, {
  title: 'Updated Title',
  content: 'Updated content body'
});
const updatedContent = response.data.content;
```

#### Delete Content
```typescript
protectedApi.deleteContent(spaceId: number, contentId: number)
```
- **Method**: DELETE
- **Endpoint**: `/api/v1/spaces/{spaceId}/contents/{contentId}`
- **Parameters**:
  - `spaceId` - ID of the space
  - `contentId` - ID of the content
- **Returns**: Success message
- **Usage**: Delete content from a space
- **Example**:
```typescript
await protectedApi.deleteContent(1, 5);
```

---

### Search & Tags

#### Search
```typescript
protectedApi.search(
  query: string,
  filters?: { tag?: string; type?: string }
)
```
- **Method**: GET
- **Endpoint**: `/api/v1/search`
- **Query Parameters**:
  - `q` - Search query (required)
  - `tag` - Filter by tag (optional)
  - `type` - Filter by content type (optional)
- **Returns**: Array of matching content
- **Usage**: Search across all content
- **Example**:
```typescript
const response = await protectedApi.search('React', {
  type: 'code'
});
```

#### Get Tags
```typescript
protectedApi.getTags()
```
- **Method**: GET
- **Endpoint**: `/api/v1/tags`
- **Returns**: Array of tags
- **Usage**: Fetch all available tags
- **Example**:
```typescript
const response = await protectedApi.getTags();
const tags = response.data;
```

---

### Activity

#### Get Recent Activity
```typescript
protectedApi.getRecentActivity()
```
- **Method**: GET
- **Endpoint**: `/api/v1/activity/recent`
- **Returns**: Array of recent activities
- **Usage**: Fetch recent user activities
- **Example**:
```typescript
const response = await protectedApi.getRecentActivity();
const activities = response.data;
```

---

### Authentication

#### Logout
```typescript
protectedApi.logout()
```
- **Method**: POST
- **Endpoint**: `/api/v1/auth/logout`
- **Returns**: Success message
- **Usage**: Logout current user
- **Example**:
```typescript
await protectedApi.logout();
```

---

## Response Format

### Success Response
```typescript
{
  data: {
    // Response data
  },
  status: 200,
  statusText: "OK"
}
```

### Error Response
```typescript
{
  response: {
    status: 400,
    data: {
      message: "Error description"
    }
  }
}
```

---

## Error Handling

All API calls should handle errors:

```typescript
try {
  const response = await protectedApi.createContent(spaceId, data);
  // Handle success
} catch (error) {
  if (error.response?.status === 400) {
    // Handle validation error
  } else if (error.response?.status === 401) {
    // Handle unauthorized
  } else if (error.response?.status === 403) {
    // Handle forbidden
  } else if (error.response?.status === 404) {
    // Handle not found
  } else {
    // Handle other errors
  }
}
```

---

## Usage in Redux Thunks

### Example: Create Content Thunk
```typescript
export const createContent = createAsyncThunk<
  Content,
  { spaceId: number; data: CreateContentFormData },
  { rejectValue: string }
>(
  'content/createContent',
  async ({ spaceId, data }, { rejectWithValue }) => {
    try {
      const response = await protectedApi.createContent(spaceId, data);
      return response.data.content;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to create content'));
    }
  }
);
```

### Example: Fetch Contents Thunk
```typescript
export const fetchContents = createAsyncThunk<
  { contents: Content[]; spaceId: number },
  { spaceId: number; type?: ContentType },
  { rejectValue: string }
>(
  'content/fetchContents',
  async ({ spaceId, type }, { rejectWithValue }) => {
    try {
      const response = await protectedApi.getContents(spaceId, type);
      return {
        contents: response.data.contents,
        spaceId,
      };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err, 'Failed to fetch contents'));
    }
  }
);
```

---

## Content Types

### Note (📝)
- Type: `'note'`
- Fields: title, content
- Max content: 50,000 characters

### Link (🔗)
- Type: `'link'`
- Fields: title, content, url
- URL validation: Must start with http:// or https://

### Code (💻)
- Type: `'code'`
- Fields: title, content
- Max content: 50,000 characters

---

## Best Practices

1. **Always handle errors** - Wrap API calls in try-catch
2. **Use Redux thunks** - Don't call API directly from components
3. **Validate inputs** - Validate before sending to API
4. **Check authentication** - Ensure token is valid before making requests
5. **Use TypeScript** - Leverage type safety for API calls
6. **Cache responses** - Use Redux to cache API responses
7. **Handle loading states** - Show loading indicators during API calls
8. **Provide feedback** - Show success/error messages to users

---

## Testing API Endpoints

### Using cURL

```bash
# Get spaces
curl -X GET http://localhost:8000/api/v1/spaces \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create content
curl -X POST http://localhost:8000/api/v1/spaces/1/contents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Note",
    "type": "note",
    "content": "Note content"
  }'

# Get contents
curl -X GET http://localhost:8000/api/v1/spaces/1/contents \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get contents by type
curl -X GET "http://localhost:8000/api/v1/spaces/1/contents?content_type=note" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## API Endpoint Summary

| Feature | Method | Endpoint | Auth |
|---------|--------|----------|------|
| **Spaces** |
| Get all spaces | GET | `/api/v1/spaces` | ✓ |
| Get space | GET | `/api/v1/spaces/{id}` | ✓ |
| Create space | POST | `/api/v1/spaces` | ✓ |
| Update space | PUT | `/api/v1/spaces/{id}` | ✓ |
| Delete space | DELETE | `/api/v1/spaces/{id}` | ✓ |
| **Content** |
| Get contents | GET | `/api/v1/spaces/{id}/contents` | ✓ |
| Get content | GET | `/api/v1/spaces/{id}/contents/{cid}` | ✓ |
| Create content | POST | `/api/v1/spaces/{id}/contents` | ✓ |
| Update content | PUT | `/api/v1/spaces/{id}/contents/{cid}` | ✓ |
| Delete content | DELETE | `/api/v1/spaces/{id}/contents/{cid}` | ✓ |

---

**Total Endpoints**: 10 (5 Spaces + 5 Content)

**Status**: ✅ All endpoints implemented and documented
