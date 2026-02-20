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
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <Outlet />
    </div>
  )
}
