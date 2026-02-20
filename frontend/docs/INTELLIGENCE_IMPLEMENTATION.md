# Manager Intelligence Features - Implementation Guide

## ✅ COMPLETED

### Backend (FastAPI)
**File**: `backend/app/api/v1/endpoints/intelligence.py`

All 6 endpoints implemented with real SQL queries:
1. ✅ `GET /manager/employee/{employee_id}/leave-history`
2. ✅ `GET /manager/employee/{employee_id}/workload-analysis`
3. ✅ `GET /manager/project-risk-analysis`
4. ✅ `POST /manager/optimize-workload`
5. ✅ `POST /manager/what-if`
6. ✅ `GET /manager/system-metrics`

### Frontend Services
**File**: `frontend/src/services/intelligenceService.ts`
- All TypeScript interfaces defined
- All API service methods created

### Components Created
1. ✅ `LeaveHistoryPanel.tsx` - Full implementation with charts

## 🔨 REMAINING COMPONENTS TO CREATE

### 2. Workload Analysis Panel
**File**: `frontend/src/components/manager/WorkloadAnalysisPanel.tsx`
```tsx
- Capacity gauge (0-100%)
- Burnout risk badge
- 4-week trend chart
- Task breakdown table
```

### 3. Project Risk Modal
**File**: `frontend/src/components/manager/ProjectRiskModal.tsx`
```tsx
- Risk table with color-coded badges
- Deadline countdown
- Team availability percentage
- Contributing leaves count
```

### 4. Optimization Plan Modal
**File**: `frontend/src/components/manager/OptimizationPlanModal.tsx`
```tsx
- Before/After capacity comparison
- Transfer list table
- Improvement percentage
- Apply button (executes transfers)
```

### 5. What-If Simulator
**File**: `frontend/src/components/manager/WhatIfSimulator.tsx`
```tsx
- Employee multi-select dropdown
- Date range picker
- Simulate button
- Results dashboard with metrics
```

### 6. System Metrics Modal
**File**: `frontend/src/components/manager/SystemMetricsModal.tsx`
```tsx
- Analytics cards grid
- Peak day indicator
- Auto-approval stats
- Response time metrics
```

## 🔗 INTEGRATION STEPS

### 1. Register Backend Routes
**File**: `backend/app/api/v1/api.py`
```python
from app.api.v1.endpoints import intelligence

api_router.include_router(
    intelligence.router,
    prefix="/manager",
    tags=["intelligence"]
)
```

### 2. Update Approvals Page
**File**: `frontend/src/pages/manager/Approvals.tsx`

Add to each approval row:
```tsx
import LeaveHistoryPanel from '@/components/manager/LeaveHistoryPanel'

const [historyPanel, setHistoryPanel] = useState<{
  isOpen: boolean
  employeeId: number
  employeeName: string
} | null>(null)

// In table row:
<button
  onClick={() => setHistoryPanel({
    isOpen: true,
    employeeId: approval.employee_id,
    employeeName: approval.employeeName
  })}
  className="text-accent-600 hover:text-accent-700"
>
  View History
</button>

// Before closing div:
{historyPanel && (
  <LeaveHistoryPanel
    isOpen={historyPanel.isOpen}
    onClose={() => setHistoryPanel(null)}
    employeeId={historyPanel.employeeId}
    employeeName={historyPanel.employeeName}
  />
)}
```

### 3. Update Workload Visualization
**File**: `frontend/src/pages/manager/WorkloadVisualization.tsx`

Add analyze button to heatmap rows:
```tsx
import WorkloadAnalysisPanel from '@/components/manager/WorkloadAnalysisPanel'

<button
  onClick={() => openAnalysis(employee.id, employee.name)}
  className="text-accent-600 text-sm hover:underline"
>
  Analyze
</button>
```

### 4. Update Manager Dashboard
**File**: `frontend/src/pages/manager/ManagerDashboard.tsx`

Add buttons:
```tsx
import ProjectRiskModal from '@/components/manager/ProjectRiskModal'
import SystemMetricsModal from '@/components/manager/SystemMetricsModal'

<button onClick={() => setShowRiskModal(true)}>
  See Risk Details
</button>

<button onClick={() => setShowMetricsModal(true)}>
  View System Metrics
</button>
```

## 📊 BUSINESS LOGIC FORMULAS

### Burnout Risk Calculation
```
IF workload_percentage > 85% AND high_workload_weeks >= 2:
    burnout_risk = "High"
ELIF workload_percentage > 70%:
    burnout_risk = "Medium"
ELSE:
    burnout_risk = "Low"

WHERE:
- workload_percentage = (avg_weekly_hours / 40) * 100
- high_workload_weeks = weeks with >15 tasks
```

### Project Risk Calculation
```
team_availability = ((total_team - on_leave) / total_team) * 100

IF team_availability < 70% AND days_remaining < 7:
    risk_level = "High"
ELIF team_availability < 80% AND days_remaining < 14:
    risk_level = "Medium"
ELSE:
    risk_level = "Low"
```

### Workload Optimization (Greedy Algorithm)
```
1. Identify overloaded employees (capacity > 85%)
2. Identify underutilized employees (capacity < 60%)
3. For each overloaded employee:
   - Get top 3 tasks (by priority, then hours)
   - Assign to underutilized employees
   - Update capacities
   - Stop when no underutilized employees remain
4. Calculate improvement percentage
```

### What-If Simulation
```
team_capacity = ((total_team - affected_count) / total_team) * 100
stability_score = 100 - (affected_count / total_team * 100)
overload_count = max(0, affected_count - (total_team * 0.2))

IF team_capacity < 70%: risk = "High"
ELIF team_capacity < 85%: risk = "Medium"
ELSE: risk = "Low"
```

## 🎨 DESIGN PATTERNS USED

### Loading States
```tsx
{loading ? (
  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
) : (
  <span>Button Text</span>
)}
```

### Error Handling
```tsx
try {
  const result = await intelligenceService.method()
  setData(result)
  toast.success('Success message')
} catch (error: any) {
  toast.error(error.response?.data?.detail || 'Error message')
} finally {
  setLoading(false)
}
```

### Skeleton Loaders
```tsx
{loading ? (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
    ))}
  </div>
) : (
  // Actual content
)}
```

## 🔐 SECURITY CONSIDERATIONS

1. All endpoints require authentication (`Depends(get_current_user)`)
2. Manager role verification needed (add to endpoints)
3. SQL injection prevented (using parameterized queries)
4. Input validation on all POST endpoints
5. Rate limiting recommended for optimization endpoint

## 📝 DATABASE REQUIREMENTS

### Required Tables
- `leave_requests` (id, user_id, start_date, end_date, status, leave_type, auto_approved, created_at, updated_at)
- `tasks` (id, assigned_to, status, priority, estimated_hours, created_at)
- `projects` (id, name, deadline, status)
- `team_members` (project_id, user_id)
- `users` (id, full_name, role)

### Indexes Recommended
```sql
CREATE INDEX idx_leave_requests_user_status ON leave_requests(user_id, status);
CREATE INDEX idx_leave_requests_dates ON leave_requests(start_date, end_date);
CREATE INDEX idx_tasks_assigned_status ON tasks(assigned_to, status);
CREATE INDEX idx_team_members_project ON team_members(project_id);
```

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Add intelligence router to FastAPI
- [ ] Run database migrations
- [ ] Create all remaining frontend components
- [ ] Integrate components into manager pages
- [ ] Test all endpoints with Postman
- [ ] Test frontend flows
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test dark mode compatibility
- [ ] Test responsive design
- [ ] Add analytics tracking
- [ ] Performance testing

## 📈 NEXT STEPS

1. Create remaining 5 frontend components
2. Integrate all components into manager pages
3. Add manager role verification middleware
4. Test complete user flows
5. Add unit tests for business logic
6. Document API endpoints
7. Create user guide

---

**Status**: Backend complete, 1/6 frontend components done
**Estimated Time to Complete**: 4-6 hours
**Priority**: High - Core intelligence features
