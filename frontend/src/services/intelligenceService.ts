import apiClient from '@/lib/api'

export interface LeaveHistoryData {
  total_leaves: number
  avg_leave_duration: number
  overlapping_leave_count: number
  leave_by_type: Array<{ type: string; count: number }>
  last_5_leaves: Array<{
    id: number
    type: string
    start_date: string
    end_date: string
    status: string
    reason: string
  }>
  monthly_leave_trend: Array<{ month: string; leaves: number }>
}

export interface WorkloadAnalysisData {
  workload_percentage: number
  total_tasks: number
  high_priority_tasks: number
  avg_weekly_hours: number
  burnout_risk: 'Low' | 'Medium' | 'High'
  last_4_week_trend: Array<{ week: string; tasks: number }>
}

export interface ProjectRisk {
  project_id: number
  project_name: string
  deadline: string
  days_remaining: number
  team_availability: number
  contributing_leaves: number
  risk_level: 'Low' | 'Medium' | 'High'
}

export interface OptimizationPlan {
  before_capacity: number
  after_capacity: number
  transfers: Array<{
    task_id: number
    task_title: string
    from_employee: string
    to_employee: string
    hours: number
  }>
  improvement_percentage: number
}

export interface WhatIfResult {
  team_capacity: number
  stability_score: number
  overload_count: number
  risk_level: 'Low' | 'Medium' | 'High'
  affected_employees: number
  total_team: number
}

export interface SystemMetrics {
  total_leave_requests: number
  auto_approved_percentage: number
  avg_response_time: number
  peak_leave_day: string | null
  peak_leave_count: number
  most_overloaded_employee: string
  overload_task_count: number
}

export const intelligenceService = {
  getEmployeeLeaveHistory: async (employeeId: number): Promise<LeaveHistoryData> => {
    const response = await apiClient.get<LeaveHistoryData>(
      `/manager/employee/${employeeId}/leave-history`
    )
    return response.data
  },

  getEmployeeWorkloadAnalysis: async (employeeId: number): Promise<WorkloadAnalysisData> => {
    const response = await apiClient.get<WorkloadAnalysisData>(
      `/manager/employee/${employeeId}/workload-analysis`
    )
    return response.data
  },

  getProjectRiskAnalysis: async (): Promise<ProjectRisk[]> => {
    const response = await apiClient.get<ProjectRisk[]>('/manager/project-risk-analysis')
    return response.data
  },

  optimizeWorkload: async (leaveRequestId: number): Promise<OptimizationPlan> => {
    const response = await apiClient.post<OptimizationPlan>('/manager/optimize-workload', {
      leave_request_id: leaveRequestId
    })
    return response.data
  },

  simulateWhatIf: async (hypotheticalLeaves: Array<{
    employee_id: number
    start_date: string
    end_date: string
  }>): Promise<WhatIfResult> => {
    const response = await apiClient.post<WhatIfResult>('/manager/what-if', {
      hypothetical_leaves: hypotheticalLeaves
    })
    return response.data
  },

  getSystemMetrics: async (): Promise<SystemMetrics> => {
    const response = await apiClient.get<SystemMetrics>('/manager/system-metrics')
    return response.data
  }
}
