# Employee Module - Implementation Guide

## Overview
Complete Employee module for a React application with FastAPI backend integration. This module includes employee dashboard, leave management, and team calendar features.

## Implemented Files

### 1. API Service Layer
- **services/api.js**
  - Axios instance with JWT authentication
  - Employee dashboard endpoint
  - Leave application endpoint
  - Leave history endpoint
  - Team calendar endpoint
  - Comprehensive error handling

### 2. Context Management
- **context/DashboardContext.jsx**
  - Centralized state management for employee data
  - Functions: `fetchEmployeeDashboard()`, `fetchLeaveHistory()`, `fetchTeamCalendar()`
  - Loading states for each data fetch
  - Error handling

### 3. Employee Pages

#### **pages/employee/EmployeeDashboard.jsx**
- Displays leave balance (Casual, Sick, Earned)
- Shows workload score with color-coded badge
- Team availability overview
- Upcoming leaves list
- Fully responsive layout

#### **pages/employee/ApplyLeave.jsx**
- Form fields: Start Date, End Date, Leave Type, Reason
- Validation: All fields required, end date >= start date
- Success/error toast notifications
- Redirects to leave history on successful submission

#### **pages/employee/LeaveHistory.jsx**
- Table view of all leave applications
- Columns: Date Range, Type, Reason, Status, Applied On
- Status badges with color coding:
  - Pending → Yellow
  - Approved → Green
  - Rejected → Red
- "Apply for Leave" button in header

#### **pages/employee/TeamCalendar.jsx**
- Monthly calendar view
- Shows count of team members on leave for each date
- Click on dates to see employee names and leave types
- Navigation between months
- Modal popup for leave details
- Today's date highlighting

### 4. Reusable UI Components

#### **components/ui/Card.jsx**
- Soft rounded card with shadow
- Optional title prop
- Clean minimal design

#### **components/ui/Table.jsx**
- Reusable table component
- Column configuration with custom render functions
- Empty state message
- Hover effects on rows

#### **components/ui/Loader.jsx**
- Spinner component with size variants (sm, md, lg)
- Full-screen mode option
- Consistent animation

#### **components/ui/Toast.jsx**
- Toast notifications for success/error messages
- Types: success, error, warning, info
- Auto-dismiss with configurable duration
- Manual close button

#### **components/ui/StatusBadge.jsx**
- Color-coded status badges
- Types: 'leave' and 'workload'
- Leave status colors: Approved (green), Pending (yellow), Rejected (red)
- Workload colors: Low (green), Medium (yellow), High (red)

## Integration Steps

### 1. Wrap App with DashboardProvider

```jsx
import { DashboardProvider } from './context/DashboardContext';

function App() {
  return (
    <DashboardProvider>
      {/* Your app routes */}
    </DashboardProvider>
  );
}
```

### 2. Add Routes (Already Protected)

Routes should already be wrapped with `<ProtectedRoute allowedRoles={['employee']} />`:

```jsx
// Example - assumes this is already done
<Route path="/employee/dashboard" element={<EmployeeDashboard />} />
<Route path="/employee/apply-leave" element={<ApplyLeave />} />
<Route path="/employee/leave-history" element={<LeaveHistory />} />
<Route path="/employee/team-calendar" element={<TeamCalendar />} />
```

### 3. Environment Variables

Ensure your `.env` file includes:

```
REACT_APP_API_URL=http://localhost:8000
```

## API Contract

### Backend Endpoints

#### GET /employee/dashboard
**Response:**
```json
{
  "leaveBalance": {
    "casual": 10,
    "sick": 5,
    "earned": 15
  },
  "workload": {
    "score": 75,
    "level": "High"
  },
  "teamAvailability": {
    "available": 15,
    "onLeave": 3,
    "total": 18
  },
  "upcomingLeaves": [
    {
      "type": "Casual",
      "startDate": "2026-03-01",
      "endDate": "2026-03-03",
      "status": "Approved"
    }
  ]
}
```

#### POST /leave/apply
**Request:**
```json
{
  "startDate": "2026-03-01",
  "endDate": "2026-03-03",
  "type": "Casual",
  "reason": "Family function"
}
```

**Response:**
```json
{
  "message": "Leave application submitted successfully",
  "id": "leave_123"
}
```

#### GET /leave/history
**Response:**
```json
[
  {
    "id": "leave_123",
    "startDate": "2026-03-01",
    "endDate": "2026-03-03",
    "type": "Casual",
    "reason": "Family function",
    "status": "Approved",
    "createdAt": "2026-02-15T10:30:00Z"
  }
]
```

#### GET /employee/team-calendar
**Response:**
```json
[
  {
    "date": "2026-03-01",
    "count": 2,
    "employees": [
      {
        "name": "John Doe",
        "leaveType": "Casual"
      },
      {
        "name": "Jane Smith",
        "leaveType": "Sick"
      }
    ]
  }
]
```

## Features

### ✅ Fully Responsive
- Mobile-first design
- Tailwind CSS for styling
- Clean corporate theme

### ✅ Error Handling
- Toast notifications for all errors
- API error messages displayed to user
- Fallback messages for unknown errors

### ✅ Loading States
- Loader component during API calls
- Improved user experience
- Full-screen loaders for page loads

### ✅ Form Validation
- All required fields validated
- Date range validation
- Error messages displayed inline

### ✅ User Experience
- Success messages after actions
- Auto-redirect after successful submissions
- Consistent spacing and design

## Styling

All components use Tailwind CSS with a corporate theme:
- Primary color: Blue (#2563eb)
- Success: Green (#22c55e)
- Warning: Yellow (#eab308)
- Error: Red (#ef4444)
- Gray scale for text and backgrounds

## Notes

- JWT authentication is automatically handled by Axios interceptor
- 401 responses trigger automatic logout and redirect to login
- All dates are formatted consistently using JavaScript Date API
- Table component is reusable for other modules
- Calendar supports navigation between months

## Development

No additional dependencies required beyond standard React and Tailwind CSS setup.

## Testing Checklist

- [ ] Dashboard loads without errors
- [ ] Leave balance displays correctly
- [ ] Workload badge shows correct color
- [ ] Apply leave form validates all fields
- [ ] Leave history table displays data
- [ ] Calendar shows leave counts
- [ ] Calendar modal shows employee names
- [ ] Toast notifications appear and dismiss
- [ ] Responsive design works on mobile
- [ ] API errors show appropriate messages
