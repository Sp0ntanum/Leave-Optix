# Quick Start Guide

## Installation & Setup

### Step 1: Copy Files to Your React Project

Copy all the files from this module to your existing React project:

```
your-react-app/
├── src/
│   ├── services/
│   │   └── api.js                    ← Copy this
│   ├── context/
│   │   └── DashboardContext.jsx      ← Copy this
│   ├── pages/
│   │   └── employee/                 ← Copy entire folder
│   │       ├── EmployeeDashboard.jsx
│   │       ├── ApplyLeave.jsx
│   │       ├── LeaveHistory.jsx
│   │       ├── TeamCalendar.jsx
│   │       └── index.js
│   └── components/
│       └── ui/                        ← Copy entire folder
│           ├── Card.jsx
│           ├── Loader.jsx
│           ├── StatusBadge.jsx
│           ├── Table.jsx
│           ├── Toast.jsx
│           └── index.js
```

### Step 2: Update App.jsx

Wrap your app with the `DashboardProvider`:

```jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { DashboardProvider } from './context/DashboardContext';
import AppRoutes from './routes'; // Your existing routes

function App() {
  return (
    <BrowserRouter>
      <DashboardProvider>
        <AppRoutes />
      </DashboardProvider>
    </BrowserRouter>
  );
}

export default App;
```

### Step 3: Add Routes

Add these routes to your routing configuration (assuming they're already protected):

```jsx
import {
  EmployeeDashboard,
  ApplyLeave,
  LeaveHistory,
  TeamCalendar
} from './pages/employee';

// In your routes file
<Route path="/employee/dashboard" element={<EmployeeDashboard />} />
<Route path="/employee/apply-leave" element={<ApplyLeave />} />
<Route path="/employee/leave-history" element={<LeaveHistory />} />
<Route path="/employee/team-calendar" element={<TeamCalendar />} />
```

### Step 4: Configure Environment

Create or update `.env` file in your project root:

```env
REACT_APP_API_URL=http://localhost:8000
```

For production:
```env
REACT_APP_API_URL=https://your-api-domain.com
```

### Step 5: Verify Dependencies

Ensure these packages are installed:

```bash
npm install react-router-dom axios
```

### Step 6: Tailwind CSS (If Not Already Configured)

If you haven't set up Tailwind CSS yet:

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add to `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

## Usage Examples

### Using Context in Other Components

```jsx
import { useDashboard } from './context/DashboardContext';

function MyComponent() {
  const { 
    employeeDashboard, 
    loadingDashboard, 
    fetchEmployeeDashboard 
  } = useDashboard();

  useEffect(() => {
    fetchEmployeeDashboard();
  }, []);

  // Use the data...
}
```

### Using UI Components

```jsx
import { Card, Loader, Toast, StatusBadge, Table } from './components/ui';

// Card Example
<Card title="My Card">
  <p>Card content</p>
</Card>

// Loader Example
<Loader size="md" />
<Loader fullScreen />

// Toast Example
<Toast message="Success!" type="success" />

// StatusBadge Example
<StatusBadge status="Approved" type="leave" />
<StatusBadge status="High" type="workload" />

// Table Example
const columns = [
  { header: 'Name', accessor: 'name' },
  { header: 'Email', accessor: 'email' },
  { header: 'Status', accessor: 'status', render: (value) => <StatusBadge status={value} /> }
];

<Table columns={columns} data={myData} />
```

## Navigation Menu Example

Add these links to your navigation menu:

```jsx
function EmployeeMenu() {
  return (
    <nav>
      <Link to="/employee/dashboard">Dashboard</Link>
      <Link to="/employee/apply-leave">Apply Leave</Link>
      <Link to="/employee/leave-history">Leave History</Link>
      <Link to="/employee/team-calendar">Team Calendar</Link>
    </nav>
  );
}
```

## Troubleshooting

### Issue: 401 Unauthorized
- Ensure JWT token is stored in localStorage as 'token'
- Check that backend is sending valid JWT tokens
- Verify API_URL is correct

### Issue: CORS Errors
- Configure backend to allow CORS from your frontend domain
- In FastAPI, use `fastapi.middleware.cors.CORSMiddleware`

### Issue: Styles Not Applying
- Verify Tailwind CSS is properly configured
- Check that `@tailwind` directives are in your CSS
- Restart development server after Tailwind config changes

### Issue: Routes Not Working
- Ensure `react-router-dom` is installed
- Verify routes are wrapped in `<BrowserRouter>`
- Check that `ProtectedRoute` component is working

## Backend Setup Reminder

Ensure your FastAPI backend has these endpoints implemented:

1. `GET /employee/dashboard` - Returns employee dashboard data
2. `POST /leave/apply` - Accepts leave application
3. `GET /leave/history` - Returns leave history
4. `GET /employee/team-calendar` - Returns team calendar data

All endpoints should:
- Require JWT authentication
- Return proper error messages
- Follow the data structures in README.md

## Next Steps

1. ✅ Copy all files to your project
2. ✅ Wrap app with DashboardProvider
3. ✅ Add routes
4. ✅ Configure environment variables
5. ✅ Test each page in the browser
6. ✅ Verify API integration
7. ✅ Test error handling
8. ✅ Test responsive design

## Support & Customization

### Customizing Colors

Edit the color classes in components to match your brand:
- `bg-blue-600` → `bg-yourcolor-600`
- `text-blue-600` → `text-yourcolor-600`

### Adding More Leave Types

In [ApplyLeave.jsx](pages/employee/ApplyLeave.jsx), update the select options:

```jsx
<select ...>
  <option value="">Select leave type</option>
  <option value="Casual">Casual</option>
  <option value="Sick">Sick</option>
  <option value="Earned">Earned</option>
  <option value="Maternity">Maternity</option> {/* Add more */}
</select>
```

### Modifying API Endpoints

Edit [services/api.js](services/api.js) to change endpoint URLs or add new endpoints.

---

**Module Version:** 1.0.0  
**Last Updated:** February 2026  
**Compatible With:** React 17+, React Router v6+
