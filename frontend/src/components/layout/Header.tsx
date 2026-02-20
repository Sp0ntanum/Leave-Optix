import { Bell, User, LogOut, ChevronDown, Moon, Sun } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useThemeStore } from '@/store/themeStore'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'

export default function Header() {
  const { user, logout } = useAuthStore()
  const { isDarkMode, toggleTheme } = useThemeStore()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowDropdown(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200/60 dark:border-slate-700/60 px-6 py-4 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div>
          <h2 className="text-xl font-bold text-primary-800 dark:text-slate-100 bg-gradient-to-r from-primary-800 to-accent-600 dark:from-accent-400 dark:to-accent-600 bg-clip-text text-transparent">
            Welcome back, {user?.full_name}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 capitalize mt-0.5">{user?.role}</p>
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={toggleTheme}
            className="p-2.5 text-slate-400 dark:text-slate-300 hover:text-accent-600 dark:hover:text-accent-400 rounded-xl hover:bg-accent-50 dark:hover:bg-slate-800 transition-all duration-200"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>

          <button className="relative p-2.5 text-slate-400 dark:text-slate-300 hover:text-accent-600 dark:hover:text-accent-400 rounded-xl hover:bg-accent-50 dark:hover:bg-slate-800 transition-all duration-200 group">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-danger-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl pr-3 py-2 transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center shadow-md ring-2 ring-accent-100 dark:ring-accent-900">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 block">
                    {user?.full_name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</span>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-slate-400 dark:text-slate-500 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-danger-50 dark:hover:bg-danger-900/20 hover:text-danger-600 dark:hover:text-danger-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
