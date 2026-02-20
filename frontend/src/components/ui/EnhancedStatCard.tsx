import { ReactNode } from 'react'
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react'

interface EnhancedStatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: number
  suffix?: string
  color: string
  subtitle?: string
  onClick?: () => void
}

export default function EnhancedStatCard({
  title,
  value,
  icon,
  trend,
  suffix,
  color,
  subtitle,
  onClick,
}: EnhancedStatCardProps) {
  const getTrendIcon = () => {
    if (!trend) return <Minus className="w-4 h-4" />
    if (trend > 0) return <TrendingUp className="w-4 h-4" />
    return <TrendingDown className="w-4 h-4" />
  }

  const getTrendColor = () => {
    if (!trend) return 'text-gray-500'
    if (trend > 0) return 'text-green-500'
    return 'text-red-500'
  }

  return (
    <div 
      onClick={onClick}
      title={onClick ? 'Click to view details' : undefined}
      className={`group relative bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 bg-gradient-to-br ${color} rounded-lg`}>
            <div className="text-white">{icon}</div>
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-1 ${getTrendColor()} font-semibold text-sm`}>
              {getTrendIcon()}
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {value}
            {suffix && <span className="text-xl text-gray-500 dark:text-gray-400 ml-1">{suffix}</span>}
          </h3>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
        </div>

        {/* Subtitle */}
        {subtitle && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              {subtitle}
            </p>
            {onClick && (
              <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        )}

        {/* Click Indicator for cards without subtitle */}
        {!subtitle && onClick && (
          <div className="mt-2 flex justify-end">
            <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        )}
      </div>
    </div>
  )
}
