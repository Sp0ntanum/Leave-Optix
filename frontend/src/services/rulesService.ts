import apiClient from '@/lib/api'

export interface AutoApprovalRule {
  id: string
  name: string
  description?: string
  leave_type?: string
  max_duration_days?: number
  min_notice_days?: number
  max_team_absence_percent?: number
  min_leave_balance?: number
  priority: number
  is_active: boolean
  created_by: string
  created_at: string
}

export interface RuleFormData {
  name: string
  description?: string
  leave_type?: string
  max_duration_days?: number
  min_notice_days?: number
  max_team_absence_percent?: number
  min_leave_balance?: number
  priority?: number
}

export const rulesService = {
  async getRules(): Promise<{ rules: AutoApprovalRule[] }> {
    const response = await apiClient.get('/rules/')
    return response.data
  },

  async createRule(data: RuleFormData): Promise<AutoApprovalRule> {
    const response = await apiClient.post('/rules/', data)
    return response.data
  },

  async updateRule(id: string, data: Partial<RuleFormData>): Promise<AutoApprovalRule> {
    const response = await apiClient.put(`/rules/${id}`, data)
    return response.data
  },

  async deleteRule(id: string): Promise<void> {
    await apiClient.delete(`/rules/${id}`)
  },

  async evaluateLeaveRequest(leaveRequest: any): Promise<any> {
    const response = await apiClient.post('/rules/evaluate', leaveRequest)
    return response.data
  }
}
