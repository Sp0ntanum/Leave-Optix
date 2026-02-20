import apiClient from '@/lib/api'

export interface ManagerDashboardData {
  pendingApprovalsCount: number
  teamCapacity: number
  highRiskProjects: number
  avgApprovalTime: number
  teamWorkloadDistribution: Array<{
    member: string
    tasks: number
    workloadScore: string
  }>
  activeProjects: Array<{
    name: string
    status: string
    risk: string
  }>
  riskIndicator: {
    level: 'Low' | 'Moderate' | 'High'
    description: string
    details: string[]
  }
}

export interface PendingApproval {
  id: number
  employeeName: string
  startDate: string
  endDate: string
  type: string
  reason: string
  status: string
  employeeInfo?: {
    department: string
    role: string
    leaveBalance: number
  }
  impact?: {
    teamCapacity: number
    projectRisk: string
    overloadedEmployees: number
  }
  leaveHistory?: Array<{
    date: string
    type: string
    status: string
  }>
}

export interface WorkloadVisualization {
  taskDistribution: Array<{ member: string; tasks: number }>
  leaveOverlap: Array<{ month: string; leaves: number }>
  teamCapacity: Array<{ status: string; value: number }>
  heatmapData: Array<{
    employee: string
    workload: {
      monday: number
      tuesday: number
      wednesday: number
      thursday: number
      friday: number
    }
  }>
}

export interface ApprovalFilters {
  status?: string
  leaveType?: string
  dateRange?: {
    start: string
    end: string
  }
  employeeSearch?: string
}

export const managerService = {
  getManagerDashboard: async (): Promise<ManagerDashboardData> => {
    const response = await apiClient.get<ManagerDashboardData>('/dashboard/manager')
    return response.data
  },

  getPendingApprovals: async (filters?: ApprovalFilters): Promise<PendingApproval[]> => {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.leaveType) params.append('leave_type', filters.leaveType)
    if (filters?.employeeSearch) params.append('employee_search', filters.employeeSearch)
    if (filters?.dateRange) {
      params.append('start_date', filters.dateRange.start)
      params.append('end_date', filters.dateRange.end)
    }
    
    const response = await apiClient.get<PendingApproval[]>(`/manager/approvals?${params}`)
    return response.data
  },

  updateLeaveStatus: async (id: number, status: string): Promise<void> => {
    await apiClient.put(`/leave/update/${id}`, { status })
  },

  getWorkloadVisualization: async (): Promise<WorkloadVisualization> => {
    const response = await apiClient.get<WorkloadVisualization>('/manager/workload-visualization')
    return response.data
  },

  exportApprovalsCSV: async (filters?: ApprovalFilters): Promise<Blob> => {
    const params = new URLSearchParams()
    if (filters?.status) params.append('status', filters.status)
    if (filters?.leaveType) params.append('leave_type', filters.leaveType)
    if (filters?.employeeSearch) params.append('employee_search', filters.employeeSearch)
    if (filters?.dateRange) {
      params.append('start_date', filters.dateRange.start)
      params.append('end_date', filters.dateRange.end)
    }
    
    const response = await apiClient.get(`/manager/approvals/export?${params}`, {
      responseType: 'blob'
    })
    return response.data
  },
}
