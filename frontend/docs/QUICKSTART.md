# Quick Start Guide - Manager Module

## Installation

### 1. Install Dependencies

```bash
cd frontend
npm install
```

**Required packages (already in package.json):**
- react
- react-dom
- react-router-dom
- axios
- recharts
- react-toastify
- zustand
- tailwindcss
- typescript

### 2. Environment Setup

Create `frontend/.env` file:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=Workload360
VITE_APP_VERSION=1.0.0
```

## Running the Application

### Start Backend (Terminal 1)

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend will run on: http://localhost:8000

### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

Frontend will run on: http://localhost:3000

## First Time Setup

### 1. Create Manager User

Use backend API or database to create a user with role='manager':

```sql
INSERT INTO users (email, full_name, role, password_hash)
VALUES ('manager@example.com', 'Test Manager', 'manager', '<hashed_password>');
```

### 2. Login

1. Go to http://localhost:3000
2. Click "Sign In"
3. Enter manager credentials
4. You'll be redirected to dashboard

### 3. Access Manager Features

Navigate to:
- **Manager Dashboard**: http://localhost:3000/manager/dashboard
- **Approvals**: http://localhost:3000/manager/approvals
- **Workload Visualization**: http://localhost:3000/manager/workload

## File Structure

```
frontend/src/
├── lib/
│   └── api.ts                          # Axios client with JWT
├── services/
│   ├── authService.ts                  # Auth API calls
│   ├── leaveService.ts                 # Leave API calls
│   └── managerService.ts               # Manager API calls ✨ NEW
├── context/
│   └── DashboardContext.tsx            # Manager state ✨ NEW
├── components/
│   ├── ui/
│   │   ├── Modal.tsx                   # Confirmation modal ✨ NEW
│   │   ├── StatusBadge.tsx             # Status badges ✨ NEW
│   │   ├── Loader.tsx                  # Loading spinner ✨ NEW
│   │   └── index.ts                    # Exports ✨ NEW
│   ├── charts/
│   │   ├── TeamWorkloadBarChart.tsx    # Bar chart ✨ NEW
│   │   ├── LeaveStatusPieChart.tsx     # Pie chart ✨ NEW
│   │   ├── LeaveTrendsLineChart.tsx    # Line chart ✨ NEW
│   │   └── index.ts                    # Exports ✨ NEW
│   └── layout/
│       ├── Sidebar.tsx                 # Updated with new routes
│       └── ...
├── pages/
│   └── manager/
│       ├── ManagerDashboard.tsx        # Overview page ✨ NEW
│       ├── Approvals.tsx               # Approvals page ✨ NEW
│       └── WorkloadVisualization.tsx   # Charts page ✨ NEW
└── App.tsx                             # Updated with DashboardProvider
```

## API Endpoints Used

### Manager Dashboard
```
GET /dashboard/manager
Response: {
  pendingApprovalsCount: number,
  teamWorkloadDistribution: Array<{member, tasks, workloadScore}>,
  activeProjects: Array<{name, status, risk}>,
  riskIndicator: string
}
```

### Pending Approvals
```
GET /manager/approvals
Response: Array<{
  id, employeeName, startDate, endDate, type, reason, status
}>
```

### Update Leave Status
```
PUT /leave/update/:id
Body: { status: "Approved" | "Rejected" }
```

### Workload Visualization
```
GET /manager/workload-visualization
Response: {
  taskDistribution: Array<{member, tasks}>,
  leaveOverlap: Array<{month, leaves}>,
  teamCapacity: Array<{status, value}>
}
```

## Common Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Debugging
```bash
# Check TypeScript errors
npm run build

# View in browser
# Open DevTools (F12)
# Check Console for errors
# Check Network tab for API calls
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Kill process on port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### API Connection Failed
- Check backend is running on port 8000
- Check VITE_API_URL in .env
- Check CORS settings in backend

### Charts Not Rendering
```bash
# Verify recharts is installed
npm list recharts

# Reinstall if needed
npm install recharts
```

## Testing the Manager Module

### 1. Test Manager Dashboard
- Navigate to `/manager/dashboard`
- Verify cards show data
- Verify chart renders
- Check responsive layout

### 2. Test Approvals
- Navigate to `/manager/approvals`
- Click "Approve" on a request
- Confirm in modal
- Verify toast notification
- Verify table refreshes

### 3. Test Workload Visualization
- Navigate to `/manager/workload`
- Verify all 3 charts render
- Check descriptions below charts
- Test responsive behavior

## Production Build

```bash
# Build frontend
cd frontend
npm run build

# Output will be in frontend/dist/
# Deploy to your hosting service
```

## Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

## Support

For issues or questions:
1. Check console for errors
2. Check Network tab for failed API calls
3. Verify backend is running and accessible
4. Check TESTING_CHECKLIST.md for common issues
5. Review VIVA_GUIDE.md for architecture details

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure environment
3. ✅ Start backend and frontend
4. ✅ Create manager user
5. ✅ Login and test features
6. ✅ Review VIVA_GUIDE.md for presentation
7. ✅ Complete TESTING_CHECKLIST.md
8. ✅ Prepare demo data
9. ✅ Practice demo flow

Good luck with your presentation! 🚀
