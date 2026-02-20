# API Documentation - Workload360

## Base URL
```
Development: http://localhost:8000/api/v1
Production: https://api.workload360.com/api/v1
```

## Authentication
All API endpoints (except auth endpoints) require JWT authentication.

Include the access token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### POST /auth/signup
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "full_name": "John Doe",
  "role": "employee"
}
```

**Response: 201 Created**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "employee"
}
```

#### POST /auth/login
Authenticate user and get tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response: 200 OK**
```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

#### GET /auth/me
Get current user information.

**Response: 200 OK**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "employee"
}
```

### Leave Requests

#### GET /leaves/
Get user's leave requests with pagination and filters.

**Query Parameters:**
- `status` (optional): Filter by status
- `start_date` (optional): Filter from date
- `end_date` (optional): Filter to date
- `page` (default: 1): Page number
- `page_size` (default: 20): Items per page

**Response: 200 OK**
```json
{
  "items": [...],
  "total": 100,
  "page": 1,
  "page_size": 20,
  "total_pages": 5
}
```

#### POST /leaves/
Create a new leave request.

**Request Body:**
```json
{
  "leave_type": "vacation",
  "start_date": "2024-03-15",
  "end_date": "2024-03-20",
  "reason": "Family vacation",
  "is_half_day": false
}
```

**Response: 201 Created**

#### GET /leaves/{leave_id}
Get a specific leave request.

**Response: 200 OK**

#### PUT /leaves/{leave_id}
Update a pending leave request.

**Response: 200 OK**

#### DELETE /leaves/{leave_id}
Cancel a leave request.

**Response: 204 No Content**

#### GET /leaves/balance/summary
Get user's leave balance.

**Response: 200 OK**
```json
{
  "user_id": "uuid",
  "balances": {
    "vacation": {
      "total": 20,
      "used": 5,
      "pending": 2,
      "available": 13
    },
    "sick": {
      "total": 10,
      "used": 2,
      "pending": 0,
      "available": 8
    }
  }
}
```

### Approvals (Manager Only)

#### GET /approvals/pending
Get pending approval requests.

**Query Parameters:**
- `page`, `page_size`: Pagination

**Response: 200 OK**

#### POST /approvals/{leave_id}/approve
Approve or reject a leave request.

**Request Body:**
```json
{
  "status": "approved",
  "comments": "Approved for vacation"
}
```

**Response: 200 OK**

### Workload Analysis

#### GET /workload/team/{team_id}/analysis
Get team workload analysis.

**Query Parameters:**
- `start_date` (optional)
- `end_date` (optional)

**Response: 200 OK**

#### GET /workload/capacity/forecast
Get team capacity forecast.

**Query Parameters:**
- `team_id` (required)
- `days_ahead` (default: 30)

**Response: 200 OK**

### Calendar

#### GET /calendar/team/{team_id}
Get team calendar view.

**Query Parameters:**
- `start_date` (required)
- `end_date` (required)

**Response: 200 OK**

### Notifications

#### GET /notifications/
Get user notifications.

**Query Parameters:**
- `unread_only` (default: false)
- `page`, `page_size`: Pagination

**Response: 200 OK**

#### PUT /notifications/{notification_id}/read
Mark notification as read.

**Response: 200 OK**

### Auto-Approval Rules (Manager Only)

#### GET /rules/
Get all auto-approval rules.

**Response: 200 OK**

#### POST /rules/
Create a new auto-approval rule.

**Request Body:**
```json
{
  "name": "Auto-approve short leaves",
  "description": "Automatically approve leaves less than 3 days",
  "team_id": "uuid",
  "conditions": {
    "max_days": 3,
    "advance_notice_days": 7
  },
  "is_active": true,
  "priority": 1
}
```

**Response: 201 Created**

## Error Responses

### 400 Bad Request
```json
{
  "detail": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Could not validate credentials"
}
```

### 403 Forbidden
```json
{
  "detail": "Required role: manager"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## Rate Limiting
- 100 requests per minute per user
- 1000 requests per hour per user

## Pagination
All list endpoints support pagination:
- Default page size: 20
- Maximum page size: 100
- Response includes total count and page metadata
