import { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
}

export default function KPICard({ title, value, subtitle, icon: Icon, trend }: KPICardProps) {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wide">{title}</p>
          <p className="text-3xl font-bold text-primary-800 dark:text-slate-100 mt-3 bg-gradient-to-r from-primary-800 to-accent-600 dark:from-accent-400 dark:to-accent-600 bg-clip-text text-transparent">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">{subtitle}</p>
          )}
        </div>
        <div className="flex-shrink-0 ml-4">
          <div className="w-14 h-14 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Icon className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>
      {trend && (
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center">
          <span className={`text-sm font-bold px-2 py-1 rounded-lg ${
            trend.isPositive ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400' : 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-2 font-medium">vs last month</span>
        </div>
      )}
    </div>
  )
}