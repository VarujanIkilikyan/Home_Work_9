# Assignment: Posts CRUD Implementation

## Overview
In this assignment, you will implement a complete CRUD (Create, Read, Update, Delete) functionality for blog posts in an Express.js application. Users should be able to manage their own posts while viewing posts created by others.

## Prerequisites
- Understanding of Express.js routing and middleware
- Knowledge of async/await and Promises
- Familiarity with JSON file-based data storage
- Understanding of JWT authentication (already implemented in the project)

## Project Structure
Your project already contains:
- `/controllers/users.js` - User authentication logic
- `/models/users.js` - User data model with file-based storage
- `/middlewares/authorize.js` - Authentication middleware
- `/routes/users.js` - User routes (login, registration, profile)

## Your Task

### 1. Create Posts Model (`/models/posts.js`)

Create a new file `/models/posts.js` that handles all post-related data operations.

**Required Functions:**

```javascript
// Initialize posts data file
export async function initializePostsFile()

// Get all posts (with optional filtering by id)
export async function getAllPosts(filters = {})

// Get a single post by ID
export async function getPostById(postId)

// Get posts by user ID
export async function getPostsByUserId(userId)

// Create a new post
export async function createPost({ title, content, userId })

// Update a post
export async function updatePost(postId, updates)

// Delete a post
export async function deletePost(postId)
```

**Data Structure:**
Each post should have the following fields:
- `id` - Unique identifier (use uuid v7)
- `title` - Post title (string, required)
- `content` - Post content (string, required)
- `userId` - ID of the user who created the post (string, required)
- `createdAt` - Creation timestamp (ISO string)
- `updatedAt` - Last update timestamp (ISO string)

**Storage:**
- Store posts in `/data/posts.json`
- Use the same file storage pattern as in `models/users.js`

### 2. Create Posts Controller (`/controllers/posts.js`)

Update the existing `/controllers/posts.js` file with the following methods:

**Required Controller Methods:**

```javascript
// GET /posts - Get all posts with optional id filter
async getAllPosts(req, res, next)

// GET /posts/:id - Get a single post by ID
async getPost(req, res, next)

// POST /posts - Create a new post (requires authentication)
async createPost(req, res, next)

// PUT /posts/:id - Update a post (requires authentication + ownership)
async updatePost(req, res, next)

// DELETE /posts/:id - Delete a post (requires authentication + ownership)
async deletePost(req, res, next)
```

**Business Rules:**
1. **GET /posts**
   - Should return all posts
   - Support filtering by `id` query parameter (e.g., `/posts?id=123`)
   - No authentication required
   - Response should include user information for each post

2. **GET /posts/:id**
   - Return a single post by ID
   - No authentication required
   - Include user information in the response

3. **POST /posts**
   - Requires authentication
   - Required fields: `title`, `content`
   - Auto-assign `userId` from the authenticated user
   - Return the created post

4. **PUT /posts/:id**
   - Requires authentication
   - User can only update their own posts
   - Allowed fields to update: `title`, `content`
   - Return error 403 if user tries to update someone else's post

5. **DELETE /posts/:id**
   - Requires authentication
   - User can only delete their own posts
   - Return error 403 if user tries to delete someone else's post

### 3. Update Posts Routes (`/routes/posts.js`)

Update the existing `/routes/posts.js` file to include all CRUD routes.

**Required Routes:**

```javascript
import { Router } from 'express';
import controller from '../controllers/posts.js';
import authorize from '../middlewares/authorize.js';

const router = Router();

// Public routes
router.get('/', controller.getAllPosts);
router.get('/:id', controller.getPost);

// Protected routes (require authentication)
router.post('/', authorize, controller.createPost);
router.put('/:id', authorize, controller.updatePost);
router.delete('/:id', authorize, controller.deletePost);

export default router;
```

### 4. Initialize Posts Data File

Update `/models/index.js` to initialize the posts data file:

```javascript
import { initializeDataFile } from './users.js';
import { initializePostsFile } from './posts.js';

await initializeDataFile();
await initializePostsFile();
```

## API Response Format

**Success Response:**
```json
{
  "status": "ok",
  "post": { ... },
  "posts": [ ... ]
}
```

**Error Response:**
```json
{
  "status": "error",
  "message": "Error description"
}
```

## Testing Your Implementation

### 1. Register a User
```bash
POST /users/registration
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

### 2. Login
```bash
POST /users/login
{
  "email": "test@example.com",
  "password": "password123"
}
```
Save the returned token for authenticated requests.

### 3. Create a Post
```bash
POST /posts
Headers: { "Authorization": "your-token-here" }
Body: {
  "title": "My First Post",
  "content": "This is the content of my first post."
}
```

### 4. Get All Posts
```bash
GET /posts
```

### 5. Get All Posts Filtered by ID
```bash
GET /posts?id=post-id-here
```

### 6. Get Single Post
```bash
GET /posts/post-id-here
```

### 7. Update a Post
```bash
PUT /posts/post-id-here
Headers: { "Authorization": "your-token-here" }
Body: {
  "title": "Updated Title",
  "content": "Updated content"
}
```

### 8. Delete a Post
```bash
DELETE /posts/post-id-here
Headers: { "Authorization": "your-token-here" }
```

## Evaluation Criteria

1. **Functionality (40%)**
   - All CRUD operations work correctly
   - ID filtering works on GET /posts
   - Proper ownership validation for update/delete

2. **Code Quality (30%)**
   - Clean, readable code
   - Proper error handling
   - Consistent with existing codebase patterns

3. **Security (20%)**
   - Authentication required for protected routes
   - Users can only modify their own posts
   - Proper validation of input data

4. **API Design (10%)**
   - Consistent response format
   - Appropriate HTTP status codes
   - Clear error messages

## Bonus Challenges

1. Add pagination to GET /posts (limit and offset parameters)
2. Add sorting options (by date, title, etc.)
3. Add a search functionality to filter posts by title or content
4. Add comments functionality for posts
5. Add post categories/tags

## Submission Guidelines

1. Ensure all code is properly formatted
2. Test all endpoints thoroughly
3. Include the `/data/posts.json` file in `.gitignore`
4. Submit your code via the course platform

## Resources

- Express.js Documentation: https://expressjs.com/
- UUID Package: https://www.npmjs.com/package/uuid
- HTTP Status Codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

## Getting Help

If you encounter issues:
1. Review the existing user implementation for reference
2. Check the Express.js error handling pattern in `app.js`
3. Use console.log for debugging
4. Ask questions in the course forum

Good luck!
