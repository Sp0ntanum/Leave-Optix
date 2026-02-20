import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Layouts
import MainLayout from '@/components/layout/MainLayout'
import AuthLayout from '@/components/layout/AuthLayout'

// Pages
import Dashboard from '@/pages/Dashboard'
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'
import LeaveRequests from '@/pages/leave/LeaveRequests'
import CreateLeaveRequest from '@/pages/leave/CreateLeaveRequest'
import TeamCalendar from '@/pages/calendar/TeamCalendar'
import Approvals from '@/pages/approvals/Approvals'
import WorkloadAnalysis from '@/pages/workload/WorkloadAnalysis'
import ManagerDashboard from '@/pages/manager/ManagerDashboard'
import ManagerApprovals from '@/pages/manager/Approvals'
import WorkloadVisualization from '@/pages/manager/WorkloadVisualization'
import AutoApprovalRules from '@/pages/rules/AutoApprovalRules'

// Context
import { DashboardProvider } from '@/context/DashboardContext'

// Hooks
import { useAuthStore } from '@/store/authStore'

function App() {
  const { user, setUser } = useAuthStore()

  // Auto-login demo user
  if (!user) {
    setUser({
      id: 'demo_user',
      email: 'manager@demo.com',
      full_name: 'Demo Manager',
      role: 'manager'
    })
  }

  return (
    <DashboardProvider>
      <Routes>
        {/* All routes accessible without login */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/manager/dashboard" replace />} />
          <Route path="/leave/requests" element={<LeaveRequests />} />
          <Route path="/leave/new" element={<CreateLeaveRequest />} />
          <Route path="/calendar" element={<TeamCalendar />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/workload" element={<WorkloadAnalysis />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/manager/approvals" element={<ManagerApprovals />} />
          <Route path="/manager/workload" element={<WorkloadVisualization />} />
          <Route path="/rules" element={<AutoApprovalRules />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/manager/dashboard" replace />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </DashboardProvider>
  )
}

export default App
