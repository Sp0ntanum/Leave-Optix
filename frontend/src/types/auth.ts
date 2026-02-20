export interface User {
  id: string
  email: string
  full_name: string
  role: 'employee' | 'manager' | 'admin'
  team_id?: string
  created_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  full_name: string
  role?: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}
