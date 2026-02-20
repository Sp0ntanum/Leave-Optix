import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  full_name: string
  role: string
}

interface AuthState {
  user: User | null
  accessToken: string | null
  setUser: (user: User | null) => void
  setAccessToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user) => set({ user }),
      setAccessToken: (token) => {
        if (token) {
          localStorage.setItem('access_token', token)
        } else {
          localStorage.removeItem('access_token')
        }
        set({ accessToken: token })
      },
      logout: () => {
        localStorage.removeItem('access_token')
        set({ user: null, accessToken: null })
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)
