import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  FileText,
  CheckSquare,
  BarChart3,
  Settings,
  Users,
  Sparkles,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function Sidebar() {
  const location = useLocation()
  const { user } = useAuthStore()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leave Requests', href: '/leave/requests', icon: FileText },
    { name: 'Team Calendar', href: '/calendar', icon: Calendar },
  ]

  const managerNavigation = [
    { name: 'Manager Dashboard', href: '/manager/dashboard', icon: Users },
    { name: 'Approvals', href: '/manager/approvals', icon: CheckSquare },
    { name: 'Workload Visualization', href: '/manager/workload', icon: BarChart3 },
    { name: 'Auto-Approval Rules', href: '/rules', icon: Settings },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="w-64 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 border-r border-slate-200/60 dark:border-slate-700/60 shadow-sm">
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-700 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-800 to-accent-600 dark:from-accent-400 dark:to-accent-600 bg-clip-text text-transparent">
                Leave-Optix
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Leave Management</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md shadow-accent-200 dark:shadow-accent-900/50'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm'
              }`}
            >
              <item.icon className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                isActive(item.href) ? '' : 'group-hover:scale-110'
              }`} />
              {item.name}
            </Link>
          ))}

          {(user?.role === 'manager' || user?.role === 'admin') && (
            <>
              <div className="pt-6 pb-2">
                <div className="flex items-center px-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent"></div>
                </div>
                <p className="px-4 mt-3 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center">
                  <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                  Manager Tools
                </p>
              </div>
              {managerNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white shadow-md shadow-accent-200 dark:shadow-accent-900/50'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 hover:shadow-sm'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 transition-transform duration-200 ${
                    isActive(item.href) ? '' : 'group-hover:scale-110'
                  }`} />
                  {item.name}
                </Link>
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60">
          <div className="bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/30 rounded-xl p-4 border border-accent-200 dark:border-accent-800">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <p className="text-sm font-bold text-accent-900 dark:text-accent-300">Pro Tip</p>
            </div>
            <p className="text-xs text-accent-700 dark:text-accent-400 leading-relaxed">
              Use filters to quickly find specific leave requests
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
