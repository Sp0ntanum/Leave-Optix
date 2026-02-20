import apiClient from '@/lib/api'
import { LoginRequest, SignupRequest, TokenResponse, User } from '@/types/auth'

export const authService = {
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/login', data)
    return response.data
  },

  signup: async (data: SignupRequest): Promise<User> => {
    const response = await apiClient.post<User>('/auth/signup', data)
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me')
    return response.data
  },

  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await apiClient.post<TokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    })
    return response.data
  },
}
