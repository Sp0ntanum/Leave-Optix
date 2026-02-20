import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { Mail, Lock, User as UserIcon } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const signupSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>
type SignupFormData = z.infer<typeof signupSchema>

export default function Login() {
  const navigate = useNavigate()
  const { setUser, setAccessToken } = useAuthStore()
  const [isActive, setIsActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onLogin = async (data: LoginFormData) => {
    setIsLoading(true)
    try {
      const response = await authService.login(data)
      setAccessToken(response.access_token)
      
      const user = await authService.getCurrentUser()
      setUser(user)
      
      toast.success('Login successful!')
      
      if (user.role === 'manager') {
        navigate('/manager/dashboard')
      } else {
        navigate('/')
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const onSignup = async (data: SignupFormData) => {
    setIsLoading(true)
    try {
      await authService.signup(data)
      toast.success('Account created! Please login.')
      setIsActive(false)
      signupForm.reset()
    } catch (error: any) {
      toast.error(error.message || 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center overflow-hidden m-0 p-0 bg-white">
      <div className={`relative bg-white rounded-[30px] shadow-2xl overflow-hidden w-[768px] h-[480px] transition-all duration-600 ${isActive ? 'active' : ''}`}>
        
        {/* Sign In Form */}
        <div className={`absolute top-0 left-0 h-full w-1/2 z-[2] transition-all duration-600 ease-in-out ${isActive ? 'translate-x-full' : 'translate-x-0'}`}>
          <form onSubmit={loginForm.handleSubmit(onLogin)} className="bg-white flex flex-col items-center justify-center px-10 h-full">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Sign In</h1>
            <p className="text-sm text-gray-600 mb-5">Use your email and password</p>
            
            <div className="w-full mb-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  {...loginForm.register('email')}
                  type="email"
                  placeholder="Email"
                  className="w-full bg-gray-100 border-none rounded-lg py-2.5 px-10 text-sm outline-none"
                />
              </div>
              {loginForm.formState.errors.email && (
                <p className="text-xs text-red-600 mt-1">{loginForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="w-full mb-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  {...loginForm.register('password')}
                  type="password"
                  placeholder="Password"
                  className="w-full bg-gray-100 border-none rounded-lg py-2.5 px-10 text-sm outline-none"
                />
              </div>
              {loginForm.formState.errors.password && (
                <p className="text-xs text-red-600 mt-1">{loginForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-teal-500 text-white text-xs font-semibold py-2.5 px-11 rounded-lg uppercase tracking-wide mt-2.5 cursor-pointer hover:bg-teal-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>

            <div className="mt-5 text-center">
              <p className="text-xs text-gray-500">Demo: employee@company.com / password</p>
              <p className="text-xs text-gray-500">manager@company.com / password</p>
            </div>
          </form>
        </div>

        {/* Sign Up Form */}
        <div className={`absolute top-0 left-0 h-full w-1/2 transition-all duration-600 ease-in-out ${isActive ? 'translate-x-full opacity-100 z-[5]' : 'translate-x-0 opacity-0 z-[1]'}`} style={{ animation: isActive ? 'move 0.6s' : 'none' }}>
          <form onSubmit={signupForm.handleSubmit(onSignup)} className="bg-white flex flex-col items-center justify-center px-10 h-full">
            <h1 className="text-3xl font-bold mb-2 text-gray-800">Create Account</h1>
            <p className="text-sm text-gray-600 mb-5">Use your email for registration</p>
            
            <div className="w-full mb-2">
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  {...signupForm.register('full_name')}
                  type="text"
                  placeholder="Name"
                  className="w-full bg-gray-100 border-none rounded-lg py-2.5 px-10 text-sm outline-none"
                />
              </div>
              {signupForm.formState.errors.full_name && (
                <p className="text-xs text-red-600 mt-1">{signupForm.formState.errors.full_name.message}</p>
              )}
            </div>

            <div className="w-full mb-2">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  {...signupForm.register('email')}
                  type="email"
                  placeholder="Email"
                  className="w-full bg-gray-100 border-none rounded-lg py-2.5 px-10 text-sm outline-none"
                />
              </div>
              {signupForm.formState.errors.email && (
                <p className="text-xs text-red-600 mt-1">{signupForm.formState.errors.email.message}</p>
              )}
            </div>

            <div className="w-full mb-2">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  {...signupForm.register('password')}
                  type="password"
                  placeholder="Password"
                  className="w-full bg-gray-100 border-none rounded-lg py-2.5 px-10 text-sm outline-none"
                />
              </div>
              {signupForm.formState.errors.password && (
                <p className="text-xs text-red-600 mt-1">{signupForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-teal-500 text-white text-xs font-semibold py-2.5 px-11 rounded-lg uppercase tracking-wide mt-2.5 cursor-pointer hover:bg-teal-600 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Creating...' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* Toggle Container */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-600 ease-in-out z-[1000] ${isActive ? '-translate-x-full rounded-r-[150px]' : 'translate-x-0 rounded-l-[150px]'}`}>
          <div className={`bg-gradient-to-r from-indigo-500 to-teal-500 h-full w-[200%] relative -left-full text-white transition-all duration-600 ease-in-out ${isActive ? 'translate-x-1/2' : 'translate-x-0'}`}>
            
            {/* Toggle Left Panel */}
            <div className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-8 text-center top-0 transition-all duration-600 ease-in-out ${isActive ? 'translate-x-0' : '-translate-x-[200%]'}`}>
              <h1 className="text-3xl font-bold mb-3">Welcome Back!</h1>
              <p className="text-sm leading-5 tracking-wide mb-5">Enter your personal details to use all of site features</p>
              <button
                onClick={() => setIsActive(false)}
                className="bg-transparent border border-white text-white text-xs font-semibold py-2.5 px-11 rounded-lg uppercase tracking-wide cursor-pointer hover:bg-white hover:text-teal-500 transition-all"
              >
                Sign In
              </button>
            </div>

            {/* Toggle Right Panel */}
            <div className={`absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-8 text-center top-0 transition-all duration-600 ease-in-out ${isActive ? 'translate-x-[200%]' : 'translate-x-0'}`}>
              <h1 className="text-3xl font-bold mb-3">Hello, Friend!</h1>
              <p className="text-sm leading-5 tracking-wide mb-5">Register with your personal details to use all of site features</p>
              <button
                onClick={() => setIsActive(true)}
                className="bg-transparent border border-white text-white text-xs font-semibold py-2.5 px-11 rounded-lg uppercase tracking-wide cursor-pointer hover:bg-white hover:text-teal-500 transition-all"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes move {
          0%, 49.99% {
            opacity: 0;
            z-index: 1;
          }
          50%, 100% {
            opacity: 1;
            z-index: 5;
          }
        }
      `}</style>
    </div>
  )
}
