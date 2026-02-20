# Architecture Overview - Workload360

## System Architecture

Workload360 follows a modern, scalable microservices-inspired architecture with clear separation of concerns.

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend Layer                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React 18 + TypeScript + Tailwind CSS                │  │
│  │  - Component-based UI                                 │  │
│  │  - React Query for data fetching                      │  │
│  │  - Zustand for state management                       │  │
│  │  - React Router for navigation                        │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        API Gateway Layer                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  FastAPI (Python)                                     │  │
│  │  - RESTful API endpoints                              │  │
│  │  - JWT authentication middleware                      │  │
│  │  - Request validation (Pydantic)                      │  │
│  │  - CORS handling                                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
              ┌─────────────┼─────────────┐
              ▼             ▼             ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
│  Business Logic  │ │   Services   │ │    Cache     │
│                  │ │              │ │              │
│  • Leave Service │ │ • Auth       │ │   Redis      │
│  • Approval Svc  │ │ • Workload   │ │              │
│  • Workload Svc  │ │ • Notif.     │ │  - Session   │
│  • Calendar Svc  │ │              │ │  - Cache     │
└──────────────────┘ └──────────────┘ └──────────────┘
        │                   │
        └────────┬──────────┘
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data Layer                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Supabase (PostgreSQL + Auth)                        │  │
│  │  - Relational database                                │  │
│  │  - Row Level Security (RLS)                           │  │
│  │  - Real-time subscriptions                            │  │
│  │  - Built-in authentication                            │  │
│  │  - Automated backups                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Frontend Application

**Technology Stack:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Query for server state
- Zustand for client state
- React Router v6 for routing

**Key Features:**
- Server-side state management with React Query
- Optimistic UI updates
- Automatic request retries
- Client-side caching
- Type-safe API calls

### 2. Backend API

**Technology Stack:**
- FastAPI (Python 3.11+)
- Pydantic for data validation
- Supabase client for database access
- Python-JOSE for JWT handling

**Architecture Patterns:**
- **Layered Architecture:**
  - API Layer: Route handlers and request/response models
  - Service Layer: Business logic
  - Data Layer: Database access
  - Core Layer: Configuration, security, utilities

**Key Features:**
- Automatic API documentation (OpenAPI/Swagger)
- Request/response validation
- Dependency injection
- Async/await for I/O operations
- Middleware for auth, CORS, logging

### 3. Database

**Supabase (PostgreSQL):**
- Normalized relational schema
- Foreign key constraints
- Computed columns
- Triggers for business logic
- Row Level Security policies
- Indexes for query optimization

**Key Tables:**
- user_profiles
- teams
- leave_requests
- leave_balances
- approval_rules
- workload_metrics
- notifications

### 4. Authentication & Authorization

**Flow:**
```
1. User submits credentials → Frontend
2. Frontend → POST /api/v1/auth/login → Backend
3. Backend → Supabase Auth
4. Supabase validates → Returns JWT tokens
5. Backend → Returns tokens to Frontend
6. Frontend stores access_token
7. All subsequent requests include: Authorization: Bearer <token>
8. Backend validates token with Supabase
9. RLS policies enforce data access
```

**Security Measures:**
- JWT-based authentication
- HTTP-only cookies for refresh tokens (optional)
- Row Level Security in database
- Role-based access control
- CORS configuration
- Rate limiting

## Data Flow

### Leave Request Creation Flow

```
User (Frontend)
    │
    ├─ 1. Fill leave request form
    │
    ├─ 2. POST /api/v1/leaves
    │
    ▼
Backend API
    │
    ├─ 3. Validate request data
    │
    ├─ 4. Check leave balance
    │
    ├─ 5. Calculate days count
    │
    ├─ 6. Check auto-approval rules
    │
    ├─ 7. Insert into leave_requests table
    │
    ▼
Database (Supabase)
    │
    ├─ 8. Trigger: update_leave_balance()
    │   └─ Update pending_days in leave_balances
    │
    ├─ 9. Trigger: notify_leave_request_update()
    │   └─ Create notification for manager
    │
    ├─ 10. Function: check_auto_approval_rules()
    │   └─ Auto-approve if rules match
    │
    ▼
Response
    │
    ├─ Return created leave request
    │
    ▼
Frontend
    │
    ├─ Update UI optimistically
    │
    └─ Show success notification
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API servers
- Load balancer distribution
- Redis for shared session storage
- Database connection pooling

### Vertical Scaling
- Resource limits per container
- CPU/Memory optimization
- Database query optimization
- Caching strategies

### Performance Optimization
- Database indexes on frequently queried columns
- Redis caching for:
  - User sessions
  - Leave balances
  - Workload metrics
- Frontend:
  - Code splitting
  - Lazy loading
  - Image optimization
  - Browser caching

## Security Architecture

### Defense in Depth

1. **Network Layer**
   - HTTPS/TLS encryption
   - VPC/Security groups
   - DDoS protection

2. **Application Layer**
   - Input validation
   - SQL injection prevention (parameterized queries)
   - XSS prevention
   - CSRF protection

3. **Authentication Layer**
   - JWT token expiration
   - Secure password hashing (Supabase)
   - Multi-factor authentication (optional)

4. **Database Layer**
   - Row Level Security
   - Encrypted at rest
   - Regular backups
   - Audit logging

## Monitoring & Observability

### Logging
- Structured logging (JSON format)
- Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL
- Centralized log aggregation

### Metrics
- Request/response times
- Error rates
- Database query performance
- Cache hit rates
- System resource usage

### Alerts
- High error rates
- Slow response times
- Database connection issues
- System resource thresholds

## Future Enhancements

### Planned Features
1. **Real-time Updates**
   - WebSocket integration
   - Live notifications
   - Real-time calendar updates

2. **Advanced Analytics**
   - Predictive workload analysis
   - ML-based leave pattern detection
   - Capacity planning recommendations

3. **Mobile Application**
   - React Native mobile app
   - Push notifications
   - Offline support

4. **Integrations**
   - Calendar sync (Google, Outlook)
   - Slack/Teams notifications
   - HR system integrations
   - SSO (SAML, OAuth2)

5. **Advanced Features**
   - Multi-level approval workflows
   - Carry-over leave policies
   - Leave donation/sharing
   - Team swap/coverage requests
