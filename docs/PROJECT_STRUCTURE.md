# Project Structure

## Complete Directory Structure

```
workload360/
├── backend/                           # FastAPI backend application
│   ├── app/
│   │   ├── api/                      # API endpoints
│   │   │   └── v1/
│   │   │       ├── api.py           # API router aggregation
│   │   │       └── endpoints/        # Individual endpoint modules
│   │   │           ├── auth.py      # Authentication endpoints
│   │   │           ├── leaves.py    # Leave request endpoints
│   │   │           ├── approvals.py # Approval endpoints
│   │   │           ├── workload.py  # Workload analysis
│   │   │           ├── calendar.py  # Calendar endpoints
│   │   │           ├── users.py     # User management
│   │   │           ├── teams.py     # Team management
│   │   │           ├── notifications.py
│   │   │           ├── dashboard.py
│   │   │           └── rules.py     # Auto-approval rules
│   │   │
│   │   ├── core/                    # Core configuration
│   │   │   ├── config.py           # Settings and configuration
│   │   │   ├── security.py         # Auth and security
│   │   │   ├── database.py         # Database connection
│   │   │   └── events.py           # Startup/shutdown events
│   │   │
│   │   ├── schemas/                 # Pydantic schemas
│   │   │   ├── auth.py
│   │   │   ├── leave.py
│   │   │   ├── approval.py
│   │   │   └── rule.py
│   │   │
│   │   ├── services/                # Business logic layer
│   │   │   ├── leave_service.py
│   │   │   ├── approval_service.py
│   │   │   └── workload_service.py
│   │   │
│   │   └── main.py                  # FastAPI application entry
│   │
│   ├── tests/                       # Backend tests
│   │   ├── test_main.py
│   │   ├── test_auth.py
│   │   └── test_leave.py
│   │
│   ├── .env.example                 # Environment variables template
│   ├── Dockerfile                   # Backend container definition
│   ├── requirements.txt             # Python dependencies
│   └── setup.cfg                    # Python tooling config
│
├── frontend/                        # React frontend application
│   ├── public/                      # Static assets
│   │   └── vite.svg
│   │
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   └── layout/
│   │   │       ├── MainLayout.tsx   # Main app layout
│   │   │       ├── AuthLayout.tsx   # Auth pages layout
│   │   │       ├── Sidebar.tsx      # Navigation sidebar
│   │   │       └── Header.tsx       # App header
│   │   │
│   │   ├── pages/                   # Page components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── auth/
│   │   │   │   ├── Login.tsx
│   │   │   │   └── Signup.tsx
│   │   │   ├── leave/
│   │   │   │   ├── LeaveRequests.tsx
│   │   │   │   └── CreateLeaveRequest.tsx
│   │   │   ├── calendar/
│   │   │   │   └── TeamCalendar.tsx
│   │   │   ├── approvals/
│   │   │   │   └── Approvals.tsx
│   │   │   ├── workload/
│   │   │   │   └── WorkloadAnalysis.tsx
│   │   │   ├── manager/
│   │   │   │   └── ManagerDashboard.tsx
│   │   │   └── rules/
│   │   │       └── AutoApprovalRules.tsx
│   │   │
│   │   ├── services/                # API service layer
│   │   │   ├── authService.ts
│   │   │   └── leaveService.ts
│   │   │
│   │   ├── store/                   # State management
│   │   │   └── authStore.ts         # Zustand store
│   │   │
│   │   ├── types/                   # TypeScript types
│   │   │   ├── auth.ts
│   │   │   └── leave.ts
│   │   │
│   │   ├── lib/                     # Utilities and configs
│   │   │   ├── api.ts               # Axios client
│   │   │   └── supabase.ts          # Supabase client
│   │   │
│   │   ├── config/                  # App configuration
│   │   │   └── index.ts
│   │   │
│   │   ├── App.tsx                  # Root component
│   │   ├── main.tsx                 # Application entry
│   │   └── index.css                # Global styles
│   │
│   ├── .env.example                 # Environment variables template
│   ├── Dockerfile                   # Frontend container definition
│   ├── nginx.conf                   # Nginx configuration
│   ├── index.html                   # HTML entry point
│   ├── package.json                 # Node dependencies
│   ├── tsconfig.json                # TypeScript config
│   ├── tailwind.config.js           # Tailwind CSS config
│   ├── postcss.config.js            # PostCSS config
│   └── vite.config.ts               # Vite build config
│
├── database/                        # Database schemas and migrations
│   ├── schema.md                    # Schema documentation
│   └── migrations/
│       ├── 001_initial_schema.sql   # Initial database setup
│       ├── 002_rls_policies.sql     # Row Level Security
│       └── 003_functions_triggers.sql
│
├── docs/                            # Project documentation
│   ├── API.md                       # API documentation
│   ├── DATABASE.md                  # Database documentation
│   ├── ARCHITECTURE.md              # Architecture overview
│   └── DEPLOYMENT.md                # Deployment guide
│
├── .gitignore                       # Git ignore rules
├── docker-compose.yml               # Docker orchestration
└── README.md                        # Project readme
```

## Key Architecture Decisions

### Backend Structure
- **Layered Architecture**: Separation between API, Business Logic, and Data layers
- **Dependency Injection**: FastAPI's built-in DI for cleaner code
- **Service Layer**: Business logic isolated in service classes
- **Schemas**: Pydantic models for validation and serialization

### Frontend Structure
- **Feature-based Organization**: Pages grouped by feature
- **Component Reusability**: Shared components in `/components`
- **Service Layer**: API calls abstracted in service files
- **State Management**: 
  - Server state: React Query
  - Client state: Zustand
  - Auth state: Zustand with persistence

### Database Structure
- **Normalized Schema**: Proper relationships and foreign keys
- **RLS Security**: Row-level security for data isolation
- **Computed Columns**: Automatic calculations for derived values
- **Triggers**: Automated business logic at database level

## Module Responsibilities

### Backend Modules

**`app/api/v1/endpoints/`**
- Define REST API routes
- Handle HTTP requests/responses
- Validate input via Pydantic schemas
- Call service layer for business logic

**`app/services/`**
- Implement business logic
- Interact with database
- Handle complex operations
- Return data to API layer

**`app/core/`**
- Application configuration
- Security and authentication
- Database connections
- Shared utilities

**`app/schemas/`**
- Request/response models
- Data validation rules
- Type definitions

### Frontend Modules

**`src/pages/`**
- Route-level components
- Page layouts and structure
- Integration of multiple components

**`src/components/`**
- Reusable UI components
- Layout components
- Shared functionality

**`src/services/`**
- API communication
- Data fetching/mutation
- Error handling

**`src/store/`**
- Global state management
- Auth state
- UI state

**`src/types/`**
- TypeScript interfaces
- Type definitions
- Shared types

## Development Workflow

1. **Backend Development**:
   - Define schemas in `schemas/`
   - Implement business logic in `services/`
   - Create API endpoints in `api/v1/endpoints/`
   - Write tests in `tests/`

2. **Frontend Development**:
   - Define types in `types/`
   - Create API services in `services/`
   - Build components in `components/`
   - Create pages in `pages/`

3. **Database Changes**:
   - Write migration SQL in `database/migrations/`
   - Update schema documentation
   - Test with sample data

## Environment Configuration

Each environment uses specific `.env` files:

**Backend** (`backend/.env`):
- Supabase credentials
- JWT secrets
- Redis configuration
- Email settings

**Frontend** (`frontend/.env`):
- API URL
- Supabase public keys
- App configuration

## Build and Deployment

**Development**:
```bash
docker-compose up -d
```

**Production**:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Testing Structure

**Backend Tests**:
- Unit tests: Test individual functions
- Integration tests: Test API endpoints
- Database tests: Test database operations

**Frontend Tests** (to be implemented):
- Component tests: React Testing Library
- Integration tests: Cypress/Playwright
- E2E tests: Full user flows
