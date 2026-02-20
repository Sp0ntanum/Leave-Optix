```markdown
# API Documentation

## Base URL
```
Development: http://localhost:8000
Production: https://api.workload360.com
```

## Authentication
All endpoints (except auth) require JWT token in Authorization header:
```
Authorization: Bearer <access_token>
```

---

## Authentication Endpoints

### POST /api/v1/auth/signup
Register new user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "full_name": "John Doe",
  "role": "employee"
}
```

**Response:** 201 Created
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "employee"
}
```

### POST /api/v1/auth/login
Authenticate user

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:** 200 OK
```json
{
  "access_token": "jwt_token",
  "refresh_token": "refresh_token",
  "token_type": "bearer",
  "expires_in": 1800
}
```

### GET /api/v1/auth/me
Get current user info

**Response:** 200 OK
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "role": "employee"
}
```

---

## Leave Management Endpoints

### POST /api/v1/leaves/
Create leave request

**Request:**
```json
{
  "leave_type": "vacation",
  "start_date": "2024-06-01",
  "end_date": "2024-06-05",
  "reason": "Family vacation trip",
  "is_half_day": false,
  "half_day_period": null
}
```

**Response:** 201 Created
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "leave_type": "vacation",
  "start_date": "2024-06-01",
  "end_date": "2024-06-05",
  "reason": "Family vacation trip",
  "status": "pending",
  "days_count": 5.0,
  "created_at": "2024-05-25T10:00:00Z"
}
```

### GET /api/v1/leaves/
Get leave history (paginated)

**Query Parameters:**
- `status` (optional): pending, approved, rejected, cancelled
- `leave_type` (optional): vacation, sick, personal
- `start_date` (optional): Filter from date
- `end_date` (optional): Filter to date
- `page` (default: 1)
- `page_size` (default: 20, max: 100)

**Response:** 200 OK
```json
{
  "items": [...],
  "total": 50,
  "page": 1,
  "page_size": 20,
  "total_pages": 3
}
```

### GET /api/v1/leaves/me/balance
Get leave balance

**Response:** 200 OK
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

---

## Approval Endpoints (Manager Only)

### GET /api/v1/approvals/pending
Get pending approvals

**Query Parameters:**
- `page` (default: 1)
- `page_size` (default: 20)

**Response:** 200 OK
```json
{
  "items": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "leave_type": "vacation",
      "start_date": "2024-06-01",
      "end_date": "2024-06-05",
      "reason": "Family vacation",
      "days_count": 5.0,
      "users": {
        "full_name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "total": 10,
  "page": 1,
  "page_size": 20
}
```

### POST /api/v1/approvals/{leave_id}/approve
Approve or reject leave

**Request:**
```json
{
  "status": "approved",
  "comments": "Approved for vacation"
}
```
```
