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
import AutoApprovalRules from '@/pages/rules/AutoApprovalRules'
import { EmployeeDashboard, ApplyLeave, LeaveHistory, TeamCalendar as EmployeeTeamCalendar } from '@/pages/employee'

// Hooks
import { useAuthStore } from '@/store/authStore'

function App() {
  const { user } = useAuthStore()

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        {/* Protected Routes */}
        <Route
          element={
            user ? <MainLayout /> : <Navigate to="/login" replace />
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/leave/requests" element={<LeaveRequests />} />
          <Route path="/leave/new" element={<CreateLeaveRequest />} />
          <Route path="/calendar" element={<TeamCalendar />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/workload" element={<WorkloadAnalysis />} />
          <Route path="/skill-coverage" element={<SkillCoveragePage />} />
          <Route path="/burnout-risk" element={<BurnoutRiskPage />} />
          <Route path="/workforce-ai" element={<WorkforceAI />} />
          <Route path="/manager/dashboard" element={<ManagerDashboard />} />
          <Route path="/rules" element={<AutoApprovalRules />} />
          <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
          <Route path="/employee/apply-leave" element={<ApplyLeave />} />
          <Route path="/employee/leave-history" element={<LeaveHistory />} />
          <Route path="/employee/team-calendar" element={<EmployeeTeamCalendar />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
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
    </>
  )
}

export default App
