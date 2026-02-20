import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'

export default function AuthLayout() {
  useEffect(() => {
    const prev = document.body.style.overflowY
    document.body.style.overflowY = 'hidden'
    return () => {
      document.body.style.overflowY = prev || ''
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Leave-Optix</h1>
          <p className="text-primary-100">
            Intelligent Leave & Workforce Optimization
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
