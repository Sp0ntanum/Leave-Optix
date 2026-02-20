# Manager Module - Viva Presentation Guide

## 1. Architecture Overview

**Question: "Explain the architecture of your Manager module"**

**Answer:**
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **State Management**: Context API (DashboardContext) for manager-specific state
- **API Layer**: Axios with JWT authentication and interceptors
- **Charts**: Recharts library for data visualization
- **Routing**: React Router with role-based protection

**Flow:**
1. User logs in → JWT token stored
2. Manager navigates to dashboard → Context fetches data
3. API client adds Bearer token to requests
4. Backend validates and returns data
5. Charts render with data or fallback mock data

## 2. Key Components Explanation

### Manager Dashboard
**What it does:**
- Shows overview of team status
- Displays pending approvals count
- Shows risk indicator (Low/Medium/High)
- Lists active projects with risk levels
- Visualizes team workload distribution

**Technical Implementation:**
- Uses `useDashboard` hook to access context
- Calls `fetchManagerDashboard()` on mount
- Shows loader while fetching
- Responsive grid layout (3 cols → 1 col on mobile)

### Approvals Page
**What it does:**
- Lists all pending leave requests
- Allows approve/reject actions
- Shows confirmation modal before action
- Refreshes list after action

**Technical Implementation:**
- Table with employee details and date ranges
- Action buttons trigger modal
- `updateLeaveStatus()` API call
- Disabled state during processing
- Toast notifications for feedback

### Workload Visualization
**What it does:**
- Shows 3 key metrics with charts:
  1. Task distribution across team
  2. Team capacity (available/on leave)
  3. Leave trends over time

**Technical Implementation:**
- Three Recharts components
- Educational text below each chart
- Fallback mock data for demo
- Responsive containers

## 3. Chart Explanations

### Bar Chart (Task Distribution)
**Purpose:** Identify workload imbalances
**Data:** `{ member: string, tasks: number }`
**Insight:** Shows who has too many/few tasks

### Pie Chart (Team Capacity)
**Purpose:** Show team availability at a glance
**Data:** `{ status: string, value: number }`
**Insight:** Percentage of team available vs on leave

### Line Chart (Leave Trends)
**Purpose:** Identify seasonal patterns
**Data:** `{ month: string, leaves: number }`
**Insight:** Plan for high-leave periods

## 4. API Integration

**Question: "How do you handle API calls?"**

**Answer:**
- Centralized Axios instance in `lib/api.ts`
- Request interceptor adds JWT token automatically
- Response interceptor handles 401/403 (auto-logout)
- Service layer (`managerService.ts`) wraps all endpoints
- Context layer handles loading states and errors
- Toast notifications for user feedback

**Error Handling:**
```typescript
try {
  const data = await managerService.getManagerDashboard()
  setManagerDashboard(data)
} catch (err) {
  const message = err.response?.data?.detail || 'Failed to load'
  toast.error(message)
}
```

## 5. State Management

**Question: "How do you manage state?"**

**Answer:**
- **Auth State**: Zustand store (user, token)
- **Manager State**: Context API (dashboard data, approvals, workload)
- **Local State**: useState for UI (modals, loading)

**Why Context for Manager?**
- Shared across multiple manager pages
- Centralized loading states
- Single source of truth
- Easy to test and maintain

## 6. UX Features

**Question: "What UX improvements did you implement?"**

**Answer:**
1. **Loading States**: Spinner while fetching data
2. **Error Handling**: Toast notifications with clear messages
3. **Confirmation Modals**: Prevent accidental actions
4. **Disabled States**: Buttons disabled during processing
5. **Responsive Design**: Mobile-first, works on all devices
6. **Status Colors**: Visual indicators (green/yellow/red)
7. **Fallback Data**: Mock data for demo when API empty

## 7. Security

**Question: "How do you ensure security?"**

**Answer:**
1. **JWT Authentication**: Bearer token in all requests
2. **Auto-logout**: 401/403 redirects to login
3. **Role-based Routing**: Manager routes protected
4. **Token Storage**: localStorage with cleanup on logout
5. **HTTPS**: Production uses secure connections

## 8. Responsive Design

**Question: "How did you make it responsive?"**

**Answer:**
- **Tailwind Breakpoints**: `md:`, `lg:` prefixes
- **Grid Layouts**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Responsive Charts**: `ResponsiveContainer` from Recharts
- **Mobile-first**: Stack vertically on small screens
- **Touch-friendly**: Large buttons and spacing

## 9. Code Quality

**Question: "How did you ensure code quality?"**

**Answer:**
1. **TypeScript**: Type safety, interfaces for all data
2. **Component Reusability**: Modal, StatusBadge, Loader
3. **Separation of Concerns**: Services, Context, Components
4. **Error Boundaries**: Try-catch in all async operations
5. **Clean Code**: Minimal, readable, no duplication
6. **Consistent Styling**: Tailwind utility classes

## 10. Future Enhancements

**Question: "What would you improve?"**

**Answer:**
1. **Real-time Updates**: WebSocket for live notifications
2. **Advanced Filters**: Filter approvals by date, type, employee
3. **Export Data**: Download charts as PDF/Excel
4. **Bulk Actions**: Approve/reject multiple requests
5. **Analytics Dashboard**: More detailed metrics and trends
6. **Mobile App**: React Native version
7. **Offline Support**: Service workers for offline access

## Demo Flow

1. **Login** as manager
2. **Navigate** to Manager Dashboard
   - Point out pending approvals count
   - Explain risk indicator
   - Show workload chart
3. **Go to Approvals**
   - Show table of requests
   - Click Approve → Show modal
   - Confirm → Show toast
   - Table refreshes
4. **Go to Workload Visualization**
   - Explain each chart
   - Point out educational text
   - Show responsive behavior

## Key Talking Points

✅ **Modern Stack**: React 18, TypeScript, Tailwind
✅ **Clean Architecture**: Separation of concerns
✅ **User Experience**: Loading states, toasts, confirmations
✅ **Data Visualization**: Recharts for insights
✅ **Security**: JWT, role-based access
✅ **Responsive**: Works on all devices
✅ **Production-ready**: No placeholders, full implementation
