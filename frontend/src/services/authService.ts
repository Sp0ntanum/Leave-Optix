import { LoginRequest, SignupRequest, TokenResponse, User } from '@/types/auth'

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'employee@company.com': {
    password: 'password',
    user: {
      id: '1',
      email: 'employee@company.com',
      full_name: 'Employee User',
      role: 'employee',
      created_at: new Date().toISOString(),
    },
  },
  'manager@company.com': {
    password: 'password',
    user: {
      id: '2',
      email: 'manager@company.com',
      full_name: 'Manager User',
      role: 'manager',
      created_at: new Date().toISOString(),
    },
  },
}

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const authService = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    await delay(500)
    const mockUser = MOCK_USERS[data.email]
    if (!mockUser || mockUser.password !== data.password) {
      throw new Error('Invalid email or password')
    }
    localStorage.setItem('mock_user', JSON.stringify(mockUser.user))
    return {
      access_token: 'mock_token_' + Date.now(),
      refresh_token: 'mock_refresh_' + Date.now(),
      token_type: 'Bearer',
      expires_in: 3600,
    }
  },

  signup: async (data: SignupRequest): Promise<User> => {
    await delay(500)
    const newUser: User = {
      id: String(Date.now()),
      email: data.email,
      full_name: data.full_name,
      role: data.role as any || 'employee',
      created_at: new Date().toISOString(),
    }
    localStorage.setItem('mock_user', JSON.stringify(newUser))
    return newUser
  },

  logout: async (): Promise<void> => {
    await delay(200)
    localStorage.removeItem('mock_user')
  },

  getCurrentUser: async (): Promise<User> => {
    await delay(200)
    const stored = localStorage.getItem('mock_user')
    if (!stored) throw new Error('Not authenticated')
    return JSON.parse(stored)
  },

  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    await delay(200)
    return {
      access_token: 'mock_token_' + Date.now(),
      refresh_token: 'mock_refresh_' + Date.now(),
      token_type: 'Bearer',
      expires_in: 3600,
    }
  },
}
