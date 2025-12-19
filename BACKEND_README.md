// ... existing code ...

## 🌐 API Endpoints

### Base URL
```
https://your-backend-domain.com/api
```

---

### 🔑 Authentication

#### 1. Register User
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

**Response Success (201)**:
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

#### 2. Login User
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### 3. Logout User
```http
POST /api/logout
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 👥 Users (Testing)

#### 4. Get All Users
```http
GET /api/users
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student"
    }
  ]
}
```

---

#### 5. Create User
```http
POST /api/users
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "instructor"
}
```

---

#### 6. Get User Detail
```http
GET /api/users/{id}
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### 📚 Courses Management

#### 7. Get All Courses
```http
GET /api/courses
```

**Query Parameters**:
- `category` (optional): Filter by category
- `level` (optional): beginner, intermediate, advanced
- `search` (optional): Search by title or description

**Response Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Web Development Fundamentals",
      "description": "Learn the basics of web development",
      "instructor": {
        "id": 2,
        "name": "Jane Smith"
      },
      "thumbnail": "https://example.com/thumbnail.jpg",
      "category": "Programming",
      "level": "beginner",
      "total_students": 150,
      "total_modules": 12
    }
  ]
}
```

---

#### 8. Get Course by ID
```http
GET /api/courses/{id}
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Web Development Fundamentals",
    "description": "Learn the basics of web development",
    "instructor": {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    },
    "thumbnail": "https://example.com/thumbnail.jpg",
    "category": "Programming",
    "level": "beginner",
    "status": "published",
    "total_students": 150,
    "created_at": "2024-01-15T10:00:00Z"
  }
}
```

---

#### 9. Create Course (Instructor Only)
```http
POST /api/courses
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Advanced React Patterns",
  "description": "Deep dive into React patterns",
  "category": "Programming",
  "level": "advanced",
  "thumbnail": "https://example.com/thumbnail.jpg"
}
```

**Response Success (201)**:
```json
{
  "success": true,
  "message": "Course created successfully",
  "data": {
    "id": 5,
    "title": "Advanced React Patterns",
    "instructor_id": 2
  }
}
```

---

#### 10. Update Course (Instructor Only)
```http
PUT /api/courses/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Advanced React Patterns Updated",
  "description": "Updated description",
  "status": "published"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Course updated successfully"
}
```

---

#### 11. Delete Course (Instructor Only)
```http
DELETE /api/courses/{id}
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

### 📖 Modules Management

#### 12. Get Modules by Course ID
```http
GET /api/courses/{courseId}/modules
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "course_id": 1,
      "title": "Introduction to HTML",
      "description": "Learn HTML basics",
      "content": "# Introduction to HTML\n\nHTML is...",
      "order_number": 1,
      "duration": 45,
      "video_url": "https://example.com/video.mp4"
    }
  ]
}
```

---

#### 13. Create Module (Instructor Only)
```http
POST /api/courses/{courseId}/modules
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "CSS Fundamentals",
  "description": "Learn CSS basics",
  "content": "# CSS Fundamentals\n\n## Selectors\n\nCSS selectors...",
  "video_url": "https://example.com/video.mp4",
  "order_number": 2,
  "duration": 60
}
```

**Response Success (201)**:
```json
{
  "success": true,
  "message": "Module created successfully",
  "data": {
    "id": 10,
    "title": "CSS Fundamentals"
  }
}
```

**Note**: Field `content` berisi Markdown yang akan dirender di frontend.

---

#### 14. Update Module (Instructor Only)
```http
PUT /api/modules/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "CSS Advanced Techniques",
  "content": "# CSS Advanced\n\nUpdated content...",
  "duration": 90
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Module updated successfully"
}
```

---

#### 15. Delete Module (Instructor Only)
```http
DELETE /api/modules/{id}
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Module deleted successfully"
}
```

---

### 🎓 Enrollments

#### 16. Enroll in Course (Student Only)
```http
POST /api/enrollments
Authorization: Bearer {token}
Content-Type: application/json

{
  "course_id": 1
}
```

**Response Success (201)**:
```json
{
  "success": true,
  "message": "Successfully enrolled in course",
  "data": {
    "enrollment_id": 15,
    "course_id": 1,
    "student_id": 1
  }
}
```

---

#### 17. Get My Enrollments (Student Only)
```http
GET /api/enrollments/me
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 15,
      "course": {
        "id": 1,
        "title": "Web Development Fundamentals",
        "thumbnail": "https://example.com/thumbnail.jpg"
      },
      "progress": 35,
      "status": "active",
      "enrolled_at": "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

#### 18. Unenroll from Course (Student Only)
```http
DELETE /api/enrollments/{id}
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Successfully unenrolled from course"
}
```

---

#### 19. Get Students in Course (Instructor Only)
```http
GET /api/courses/{id}/students
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "progress": 35,
      "enrolled_at": "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

### 📊 Dashboard

#### 20. Instructor Dashboard
```http
GET /api/instructor/dashboard
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "total_courses": 5,
    "total_students": 250,
    "total_modules": 45,
    "recent_enrollments": [
      {
        "student_name": "John Doe",
        "course_title": "Web Development",
        "enrolled_at": "2024-01-20T10:00:00Z"
      }
    ],
    "courses": [
      {
        "id": 1,
        "title": "Web Development Fundamentals",
        "total_students": 150,
        "status": "published"
      }
    ]
  }
}
```

---

#### 21. Student Progress
```http
GET /api/student/progress
Authorization: Bearer {token}
```

**Response Success (200)**:
```json
{
  "success": true,
  "data": {
    "total_enrolled": 3,
    "completed_courses": 1,
    "in_progress": 2,
    "total_modules_completed": 25,
    "courses": [
      {
        "course_id": 1,
        "course_title": "Web Development Fundamentals",
        "progress": 75,
        "completed_modules": 9,
        "total_modules": 12
      }
    ]
  }
}
```

---

#### 22. Test Create Endpoint
```http
POST /api/test-create
Content-Type: application/json

{
  "test": "data"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Test endpoint working"
}
```

// ... existing code ...
```

```json file="" isHidden
