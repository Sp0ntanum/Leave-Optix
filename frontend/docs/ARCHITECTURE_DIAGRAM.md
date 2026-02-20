# Manager Module - Architecture Diagram

## Component Hierarchy

```
App.tsx
└── DashboardProvider (Context)
    └── Routes
        └── MainLayout
            └── Manager Pages
                ├── ManagerDashboard
                ├── Approvals
                └── WorkloadVisualization
```

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         User Action                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      React Component                         │
│  (ManagerDashboard / Approvals / WorkloadVisualization)     │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    DashboardContext                          │
│  - fetchManagerDashboard()                                   │
│  - fetchPendingApprovals()                                   │
│  - fetchWorkloadVisualization()                              │
│  - updateLeaveStatus()                                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Manager Service                           │
│  - getManagerDashboard()                                     │
│  - getPendingApprovals()                                     │
│  - getWorkloadVisualization()                                │
│  - updateLeaveStatus()                                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      API Client (Axios)                      │
│  - Request Interceptor: Add JWT token                        │
│  - Response Interceptor: Handle 401/403                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (FastAPI)                     │
│  GET  /dashboard/manager                                     │
│  GET  /manager/approvals                                     │
│  PUT  /leave/update/:id                                      │
│  GET  /manager/workload-visualization                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Database (Supabase)                       │
└─────────────────────────────────────────────────────────────┘
```

## Component Structure

### ManagerDashboard.tsx
```
ManagerDashboard
├── Loader (if loading)
└── Content
    ├── Header (h1)
    ├── Stats Grid (3 cards)
    │   ├── Pending Approvals Card
    │   ├── Risk Indicator Card (with StatusBadge)
    │   └── Active Projects Card
    └── Charts Grid (2 columns)
        ├── Team Workload Card
        │   └── TeamWorkloadBarChart
        └── Active Projects List
            └── Project Items (with StatusBadge)
```

### Approvals.tsx
```
Approvals
├── Loader (if loading)
├── Content
│   ├── Header (h1)
│   └── Table Card
│       └── Table
│           ├── Header Row
│           └── Data Rows
│               ├── Employee Name
│               ├── Date Range
│               ├── Type
│               ├── Reason
│               ├── Status (StatusBadge)
│               └── Actions
│                   ├── Approve Button
│                   └── Reject Button
└── Modal (confirmation)
    ├── Title
    ├── Message
    └── Actions
        ├── Cancel Button
        └── Confirm Button
```

### WorkloadVisualization.tsx
```
WorkloadVisualization
├── Loader (if loading)
└── Content
    ├── Header (h1)
    └── Charts Stack
        ├── Task Distribution Card
        │   ├── Title
        │   ├── TeamWorkloadBarChart
        │   └── Description Text
        ├── Team Capacity Card
        │   ├── Title
        │   ├── LeaveStatusPieChart
        │   └── Description Text
        └── Leave Trends Card
            ├── Title
            ├── LeaveTrendsLineChart
            └── Description Text
```

## State Management

### Auth State (Zustand)
```
useAuthStore
├── user: User | null
├── accessToken: string | null
├── setUser(user)
├── setAccessToken(token)
└── logout()
```

### Dashboard State (Context)
```
DashboardContext
├── State
│   ├── managerDashboard: ManagerDashboardData | null
│   ├── pendingApprovals: PendingApproval[]
│   ├── workloadVisualization: WorkloadVisualization | null
│   ├── loadingManagerDashboard: boolean
│   ├── loadingApprovals: boolean
│   ├── loadingWorkload: boolean
│   └── error: string | null
└── Actions
    ├── fetchManagerDashboard()
    ├── fetchPendingApprovals()
    ├── fetchWorkloadVisualization()
    └── updateLeaveStatus(id, status)
```

## API Request Flow

### Example: Approve Leave Request

```
1. User clicks "Approve" button
   ↓
2. Approvals.tsx: handleAction(id, 'Approved')
   ↓
3. Modal opens for confirmation
   ↓
4. User clicks "Confirm"
   ↓
5. Approvals.tsx: handleConfirm()
   ↓
6. DashboardContext: updateLeaveStatus(id, 'Approved')
   ↓
7. ManagerService: updateLeaveStatus(id, 'Approved')
   ↓
8. API Client: PUT /leave/update/:id
   - Adds Authorization: Bearer <token>
   ↓
9. Backend validates JWT and updates database
   ↓
10. Response returns to frontend
    ↓
11. Context: toast.success('Leave request approved')
    ↓
12. Context: fetchPendingApprovals() (refresh list)
    ↓
13. Approvals.tsx: Table updates with new data
    ↓
14. Modal closes
```

## Authentication Flow

```
1. User logs in
   ↓
2. Backend returns JWT token
   ↓
3. Frontend stores token in localStorage
   ↓
4. Zustand store updates accessToken
   ↓
5. User navigates to manager page
   ↓
6. API request is made
   ↓
7. Request interceptor adds: Authorization: Bearer <token>
   ↓
8. Backend validates token
   ↓
9. If valid: Return data
   If invalid (401/403):
   ↓
10. Response interceptor catches error
    ↓
11. Clear localStorage
    ↓
12. Redirect to /login
```

## Error Handling Flow

```
API Call
├── Success
│   ├── Update state with data
│   └── Show success toast (if applicable)
└── Error
    ├── Extract error message
    │   ├── err.response?.data?.detail (backend message)
    │   └── Fallback to generic message
    ├── Show error toast
    ├── Set error state
    └── If 401/403: Auto-logout and redirect
```

## Responsive Breakpoints

```
Mobile (< 768px)
├── Single column layout
├── Stacked cards
├── Horizontal scroll for tables
└── Full-width charts

Tablet (768px - 1024px)
├── 2-column grid
├── Side-by-side cards
└── Responsive charts

Desktop (> 1024px)
├── 3-column grid
├── Wider layout
└── Optimized spacing
```

## File Dependencies

```
ManagerDashboard.tsx
├── useDashboard (from DashboardContext)
├── Loader (from components/ui)
├── StatusBadge (from components/ui)
└── TeamWorkloadBarChart (from components/charts)

Approvals.tsx
├── useDashboard (from DashboardContext)
├── Loader (from components/ui)
├── StatusBadge (from components/ui)
└── Modal (from components/ui)

WorkloadVisualization.tsx
├── useDashboard (from DashboardContext)
├── Loader (from components/ui)
├── TeamWorkloadBarChart (from components/charts)
├── LeaveStatusPieChart (from components/charts)
└── LeaveTrendsLineChart (from components/charts)

DashboardContext.tsx
├── managerService (from services)
└── toast (from react-toastify)

managerService.ts
└── apiClient (from lib/api)

api.ts
└── config (from config)
```

## Chart Data Flow

```
Backend API
↓
{
  taskDistribution: [
    { member: "John", tasks: 7 },
    { member: "Alice", tasks: 5 }
  ]
}
↓
DashboardContext
↓
workloadVisualization.taskDistribution
↓
WorkloadVisualization.tsx
↓
<TeamWorkloadBarChart data={workloadVisualization.taskDistribution} />
↓
Recharts renders bar chart
```

## Styling Architecture

```
Tailwind CSS
├── Global Styles (index.css)
│   ├── @layer base
│   └── @layer components
│       ├── .btn-primary
│       ├── .btn-secondary
│       ├── .card
│       └── .input
├── Utility Classes (inline)
│   ├── Layout: flex, grid, space-y-*
│   ├── Spacing: p-*, m-*, gap-*
│   ├── Colors: bg-*, text-*
│   ├── Typography: text-*, font-*
│   └── Responsive: md:*, lg:*
└── Custom Colors (tailwind.config.js)
    └── primary: { 50-900 }
```

## Security Layers

```
1. Authentication
   └── JWT token required for all manager endpoints

2. Authorization
   └── Role-based routing (manager/admin only)

3. Token Management
   ├── Stored in localStorage
   ├── Auto-added to requests
   └── Auto-cleared on logout/401

4. Error Handling
   ├── 401: Unauthorized → Auto-logout
   ├── 403: Forbidden → Auto-logout
   └── Other errors → Toast notification

5. Input Validation
   └── Backend validates all inputs
```

## Performance Optimizations

```
1. Code Splitting
   └── React Router lazy loading (if needed)

2. Memoization
   └── React.memo for expensive components (if needed)

3. Efficient Re-renders
   └── Context only updates when data changes

4. Optimized Charts
   └── ResponsiveContainer prevents unnecessary re-renders

5. Loading States
   └── Prevent duplicate API calls

6. Error Boundaries
   └── Graceful error handling
```

This architecture ensures:
✅ Clean separation of concerns
✅ Reusable components
✅ Type safety with TypeScript
✅ Efficient state management
✅ Proper error handling
✅ Secure authentication
✅ Responsive design
✅ Maintainable codebase
