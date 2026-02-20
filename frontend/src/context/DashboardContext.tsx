import { createContext, useContext, useState, ReactNode } from 'react'
import { toast } from 'react-toastify'
import {
  managerService,
  ManagerDashboardData,
  PendingApproval,
  WorkloadVisualization,
  ApprovalFilters,
} from '@/services/managerService'

interface DashboardContextType {
  managerDashboard: ManagerDashboardData | null
  pendingApprovals: PendingApproval[]
  workloadVisualization: WorkloadVisualization | null
  loadingManagerDashboard: boolean
  loadingApprovals: boolean
  loadingWorkload: boolean
  error: string | null
  fetchManagerDashboard: () => Promise<void>
  fetchPendingApprovals: (filters?: ApprovalFilters) => Promise<void>
  fetchWorkloadVisualization: () => Promise<void>
  updateLeaveStatus: (id: number, status: string) => Promise<void>
  exportApprovalsCSV: (filters?: ApprovalFilters) => Promise<void>
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [managerDashboard, setManagerDashboard] = useState<ManagerDashboardData | null>(null)
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([])
  const [workloadVisualization, setWorkloadVisualization] = useState<WorkloadVisualization | null>(null)
  const [loadingManagerDashboard, setLoadingManagerDashboard] = useState(false)
  const [loadingApprovals, setLoadingApprovals] = useState(false)
  const [loadingWorkload, setLoadingWorkload] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchManagerDashboard = async () => {
    setLoadingManagerDashboard(true)
    setError(null)
    try {
      const data = await managerService.getManagerDashboard()
      setManagerDashboard(data)
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load dashboard'
      setError(message)
      toast.error(message)
    } finally {
      setLoadingManagerDashboard(false)
    }
  }

  const fetchPendingApprovals = async (filters?: ApprovalFilters) => {
    setLoadingApprovals(true)
    setError(null)
    try {
      const data = await managerService.getPendingApprovals(filters)
      setPendingApprovals(data)
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load approvals'
      setError(message)
      toast.error(message)
    } finally {
      setLoadingApprovals(false)
    }
  }

  const fetchWorkloadVisualization = async () => {
    setLoadingWorkload(true)
    setError(null)
    try {
      const data = await managerService.getWorkloadVisualization()
      setWorkloadVisualization(data)
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to load workload data'
      setError(message)
      toast.error(message)
    } finally {
      setLoadingWorkload(false)
    }
  }

  const updateLeaveStatus = async (id: number, status: string) => {
    try {
      await managerService.updateLeaveStatus(id, status)
      toast.success(`Leave request ${status.toLowerCase()} successfully`)
      await fetchPendingApprovals()
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to update leave status'
      toast.error(message)
      throw err
    }
  }

  const exportApprovalsCSV = async (filters?: ApprovalFilters) => {
    try {
      const blob = await managerService.exportApprovalsCSV(filters)
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `approvals-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('Approvals exported successfully')
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to export approvals'
      toast.error(message)
    }
  }

  return (
    <DashboardContext.Provider
      value={{
        managerDashboard,
        pendingApprovals,
        workloadVisualization,
        loadingManagerDashboard,
        loadingApprovals,
        loadingWorkload,
        error,
        fetchManagerDashboard,
        fetchPendingApprovals,
        fetchWorkloadVisualization,
        updateLeaveStatus,
        exportApprovalsCSV,
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export const useDashboard = () => {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider')
  }
  return context
}
