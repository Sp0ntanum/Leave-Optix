import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  FileText,
  CheckSquare,
  BarChart3,
  Settings,
  Users,
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
    { name: 'Approvals', href: '/approvals', icon: CheckSquare },
    { name: 'Workload Analysis', href: '/workload', icon: BarChart3 },
    { name: 'Manager Dashboard', href: '/manager/dashboard', icon: Users },
    { name: 'Auto-Approval Rules', href: '/rules', icon: Settings },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="w-64 bg-black border-r border-gray-800">
      <div className="h-full flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white">Workload360</h1>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive(item.href)
                  ? 'bg-white text-black'
                  : 'text-gray-300 hover:bg-gray-900 hover:text-white'
              }`}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          ))}

          {(user?.role === 'manager' || user?.role === 'admin') && (
            <>
              <div className="pt-6 pb-2">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Manager Tools
                </p>
              </div>
              {managerNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-white text-black'
                      : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </>
          )}
        </nav>
      </div>
    </aside>
  )
}
