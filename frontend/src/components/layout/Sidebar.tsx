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
  Activity,
  Heart,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

export default function Sidebar() {
  const location = useLocation()
  const { user } = useAuthStore()

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Leave Requests', href: '/leave/requests', icon: FileText },
    { name: 'Team Calendar', href: '/calendar', icon: Calendar },
    { name: 'Skill Coverage', href: '/skill-coverage', icon: Activity },
    { name: 'Burnout Risk', href: '/burnout-risk', icon: Heart },
  ]

  const managerNavigation = [
    { name: 'Approvals', href: '/approvals', icon: CheckSquare },
    { name: 'Workload Analysis', href: '/workload', icon: BarChart3 },
    { name: 'Manager Dashboard', href: '/manager/dashboard', icon: Users },
    { name: 'Auto-Approval Rules', href: '/rules', icon: Settings },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <aside className="w-64 bg-white border-r-2 border-gray-100 shadow-lg">
      <div className="h-full flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-2 rounded-lg shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                Leave-Optix
              </h1>
              <p className="text-xs text-gray-500">Professional HR Solution</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive(item.href)
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-50'
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
                <div className="px-4 flex items-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Manager Tools
                  </p>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
              </div>
              {managerNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-50'
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

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <p className="text-xs font-semibold text-gray-700">Pro Tip</p>
            </div>
            <p className="text-xs text-gray-600">
              Plan your leaves 30 days ahead for better team coordination.
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
