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
import WorkforceAI from '@/pages/workload/WorkforceAI'
import SkillCoveragePage from '@/pages/workload/SkillCoveragePage'
import BurnoutRiskPage from '@/pages/workload/BurnoutRiskPage'
import ManagerDashboard from '@/pages/manager/ManagerDashboard'
import ManagerApprovals from '@/pages/manager/Approvals'
import WorkloadVisualization from '@/pages/manager/WorkloadVisualization'
import AutoApprovalRules from '@/pages/rules/AutoApprovalRules'
import { EmployeeDashboard, ApplyLeave, LeaveHistory, TeamCalendar as EmployeeTeamCalendar } from '@/pages/employee'

// Context
import { DashboardProvider } from '@/context/DashboardContext'

// Hooks
import { useAuthStore } from '@/store/authStore'

function App() {
  const { user } = useAuthStore()

  // Role-based default dashboard route
  const getDefaultRoute = () => {
    if (!user) return '/login'
    return user.role === 'manager' || user.role === 'admin' 
      ? '/manager/dashboard' 
      : '/employee/dashboard'
  }

  return (
    <DashboardProvider>
      <Routes>
        {/* Auth Routes (F1 - Login System) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Routes - Require Authentication */}
        {user ? (
          <Route element={<MainLayout />}>
            {/* Root redirects based on role */}
            <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
            
            {/* Manager Dashboard Routes (F3 - Manager Dashboard) */}
            {(user.role === 'manager' || user.role === 'admin') && (
              <>
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                <Route path="/manager/approvals" element={<ManagerApprovals />} />
                <Route path="/manager/workload" element={<WorkloadVisualization />} />
                <Route path="/approvals" element={<Approvals />} />
                <Route path="/workload" element={<WorkloadAnalysis />} />
                <Route path="/skill-coverage" element={<SkillCoveragePage />} />
                <Route path="/burnout-risk" element={<BurnoutRiskPage />} />
                <Route path="/workforce-ai" element={<WorkforceAI />} />
                <Route path="/rules" element={<AutoApprovalRules />} />
              </>
            )}
            
            {/* Employee Dashboard Routes (F2 - Employee Dashboard) */}
            <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
            <Route path="/employee/apply-leave" element={<ApplyLeave />} />
            <Route path="/employee/leave-history" element={<LeaveHistory />} />
            <Route path="/employee/team-calendar" element={<EmployeeTeamCalendar />} />
            
            {/* Common Routes - Available to all authenticated users */}
            <Route path="/leave/requests" element={<LeaveRequests />} />
            <Route path="/leave/new" element={<CreateLeaveRequest />} />
            <Route path="/calendar" element={<TeamCalendar />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}

        {/* Fallback */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} replace />} />
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
