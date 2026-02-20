import apiClient from '@/lib/api'
import { LeaveRequest, CreateLeaveRequest, LeaveBalance } from '@/types/leave'

interface LeaveRequestsResponse {
  items: LeaveRequest[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export const leaveService = {
  getLeaveRequests: async (params?: {
    status?: string
    start_date?: string
    end_date?: string
    page?: number
    page_size?: number
  }): Promise<LeaveRequestsResponse> => {
    const response = await apiClient.get<LeaveRequestsResponse>('/leaves', {
      params,
    })
    return response.data
  },

  getLeaveRequest: async (id: string): Promise<LeaveRequest> => {
    const response = await apiClient.get<LeaveRequest>(`/leaves/${id}`)
    return response.data
  },

  createLeaveRequest: async (data: CreateLeaveRequest): Promise<LeaveRequest> => {
    const response = await apiClient.post<LeaveRequest>('/leaves', data)
    return response.data
  },

  updateLeaveRequest: async (
    id: string,
    data: Partial<CreateLeaveRequest>
  ): Promise<LeaveRequest> => {
    const response = await apiClient.put<LeaveRequest>(`/leaves/${id}`, data)
    return response.data
  },

  cancelLeaveRequest: async (id: string): Promise<void> => {
    await apiClient.delete(`/leaves/${id}`)
  },

  getLeaveBalance: async (): Promise<LeaveBalance> => {
    const response = await apiClient.get<LeaveBalance>('/leaves/balance/summary')
    return response.data
  },
}
