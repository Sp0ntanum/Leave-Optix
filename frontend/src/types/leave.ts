export enum LeaveType {
  VACATION = 'vacation',
  SICK = 'sick',
  PERSONAL = 'personal',
  UNPAID = 'unpaid',
  MATERNITY = 'maternity',
  PATERNITY = 'paternity',
}

export enum LeaveStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  AUTO_APPROVED = 'auto_approved',
}

export interface LeaveRequest {
  id: string
  user_id: string
  leave_type: LeaveType
  start_date: string
  end_date: string
  reason: string
  status: LeaveStatus
  is_half_day: boolean
  half_day_period?: 'morning' | 'afternoon'
  days_count: number
  approved_by?: string
  approved_at?: string
  rejection_reason?: string
  created_at: string
  updated_at: string
}

export interface CreateLeaveRequest {
  leave_type: LeaveType
  start_date: string
  end_date: string
  reason: string
  is_half_day?: boolean
  half_day_period?: 'morning' | 'afternoon'
}

export interface LeaveBalance {
  user_id: string
  balances: {
    [key in LeaveType]?: {
      total: number
      used: number
      pending: number
      available: number
    }
  }
}
