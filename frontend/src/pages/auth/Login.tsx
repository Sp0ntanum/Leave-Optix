import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function Login() {
  const navigate = useNavigate()
  const { setUser, setAccessToken } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [demoMode, setDemoMode] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const useDemoAccount = async (role: 'employee' | 'manager') => {
    setDemoMode(true)
    setIsLoading(true)
    try {
      const credentials = role === 'manager' 
        ? { email: 'manager@company.com', password: 'password' }
        : { email: 'employee@company.com', password: 'password' }
      
      const response = await authService.login(credentials)
      setAccessToken(response.access_token)
      
      const user = await authService.getCurrentUser()
      setUser(user)
      
      toast.success(`Demo ${role} login successful!`)
      
      // Route based on role
      if (user.role === 'manager' || user.role === 'admin') {
        navigate('/manager/dashboard')
      } else {
        navigate('/employee/dashboard')
      }
    } catch (error: any) {
      toast.error('Demo account not available. Please contact admin.')
    } finally {
      setIsLoading(false)
      setDemoMode(false)
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await authService.login(data)
      setAccessToken(response.access_token)
      
      const user = await authService.getCurrentUser()
      setUser(user)
      
      toast.success('Login successful!')
      
      // Route based on role
      if (user.role === 'manager' || user.role === 'admin') {
        navigate('/manager/dashboard')
      } else {
        navigate('/employee/dashboard')
      }
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card">
      <h2 className="text-2xl font-bold text-center mb-6">Sign In</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            className="input"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            {...register('password')}
            type="password"
            className="input"
            placeholder="••••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-4 space-y-2">
        <button
          type="button"
          onClick={() => useDemoAccount('manager')}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg hover:from-primary-700 hover:to-accent-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {demoMode ? 'Logging in...' : '🎯 Demo Manager Login'}
        </button>
        
        <button
          type="button"
          onClick={() => useDemoAccount('employee')}
          disabled={isLoading}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {demoMode ? 'Logging in...' : '👤 Demo Employee Login'}
        </button>
      </div>

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
          Sign up
        </Link>
      </p>
    </div>
  )
}
