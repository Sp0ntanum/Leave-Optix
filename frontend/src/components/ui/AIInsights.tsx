import { Brain, TrendingUp, AlertCircle, CheckCircle, Sparkles, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

interface Insight {
  id: string
  type: 'prediction' | 'suggestion' | 'warning' | 'success'
  title: string
  description: string
  confidence: number
  action?: string
  actionType?: 'navigate' | 'apply' | 'resolve'
  route?: string
}

export default function AIInsights() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [actedInsights, setActedInsights] = useState<Set<string>>(new Set())
  const [expandedInsight, setExpandedInsight] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Simulate AI analysis
    setTimeout(() => {
      setInsights([
        {
          id: '1',
          type: 'prediction',
          title: 'Peak Leave Period Ahead',
          description: 'AI predicts 40% team leave requests in next 2 weeks (Holiday season). Consider workload redistribution.',
          confidence: 87,
          action: 'View Workload Plan',
          actionType: 'navigate',
          route: '/workload',
        },
        {
          id: '2',
          type: 'suggestion',
          title: 'Optimize Team Coverage',
          description: 'Based on historical data, scheduling 2 additional team members on Dec 15-20 will maintain 95% coverage.',
          confidence: 92,
          action: 'Apply Suggestion',
          actionType: 'apply',
        },
        {
          id: '3',
          type: 'warning',
          title: 'Resource Conflict Detected',
          description: '3 senior developers have overlapping leave requests. This may impact Project Alpha timeline.',
          confidence: 95,
          action: 'Resolve Conflict',
          actionType: 'resolve',
          route: '/calendar',
        },
        {
          id: '4',
          type: 'success',
          title: 'Balanced Workload Achievement',
          description: 'Your team has maintained 85% workload balance this month! 15% better than last quarter.',
          confidence: 98,
        },
      ])
      setIsAnalyzing(false)
    }, 2000)
  }, [])

  const handleAction = (insight: Insight) => {
    if (actedInsights.has(insight.id)) {
      toast.info('Action already performed!')
      return
    }

    switch (insight.actionType) {
      case 'navigate':
        if (insight.route) {
          toast.success(`Navigating to ${insight.action}...`)
          setTimeout(() => navigate(insight.route!), 500)
        }
        break
      case 'apply':
        toast.success('✅ Suggestion applied successfully! Team schedule optimized.')
        setActedInsights(prev => new Set(prev).add(insight.id))
        break
      case 'resolve':
        if (insight.route) {
          toast.info('Opening conflict resolution...')
          setTimeout(() => navigate(insight.route!), 500)
        }
        break
      default:
        toast.info('Action processed!')
    }
  }

  const toggleExpand = (insightId: string) => {
    setExpandedInsight(expandedInsight === insightId ? null : insightId)
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'prediction':
        return Brain
      case 'suggestion':
        return TrendingUp
      case 'warning':
        return AlertCircle
      case 'success':
        return CheckCircle
      default:
        return Sparkles
    }
  }

  const getColors = (type: string) => {
    switch (type) {
      case 'prediction':
        return {
          bg: 'from-blue-600 to-blue-700',
          text: 'text-blue-600 dark:text-blue-400',
          border: 'border-blue-200 dark:border-blue-800',
          iconBg: 'bg-blue-100 dark:bg-blue-900/50',
        }
      case 'suggestion':
        return {
          bg: 'from-slate-600 to-slate-700',
          text: 'text-slate-600 dark:text-slate-400',
          border: 'border-slate-200 dark:border-slate-800',
          iconBg: 'bg-slate-100 dark:bg-slate-900/50',
        }
      case 'warning':
        return {
          bg: 'from-orange-500 to-red-500',
          text: 'text-orange-600 dark:text-orange-400',
          border: 'border-orange-200 dark:border-orange-800',
          iconBg: 'bg-orange-100 dark:bg-orange-900/50',
        }
      case 'success':
        return {
          bg: 'from-green-500 to-emerald-500',
          text: 'text-green-600 dark:text-green-400',
          border: 'border-green-200 dark:border-green-800',
          iconBg: 'bg-green-100 dark:bg-green-900/50',
        }
      default:
        return {
          bg: 'from-gray-500 to-slate-500',
          text: 'text-gray-600 dark:text-gray-400',
          border: 'border-gray-200 dark:border-gray-800',
          iconBg: 'bg-gray-100 dark:bg-gray-900/50',
        }
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-3 rounded-lg shadow">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Insights</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Based on your team's patterns</p>
          </div>
        </div>
        {isAnalyzing && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
            Loading...
          </div>
        )}
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => {
          const Icon = getIcon(insight.type)
          const colors = getColors(insight.type)
          const isActed = actedInsights.has(insight.id)
          const isExpanded = expandedInsight === insight.id
          
          return (
            <div
              key={insight.id}
              onClick={() => toggleExpand(insight.id)}
              className={`relative p-5 rounded-xl border ${colors.border} bg-white dark:bg-gray-800 transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer ${
                isExpanded ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {/* Content */}
              <div className="flex items-start gap-4 mb-4">
                <div className={`${colors.iconBg} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${colors.text}`} />
                </div>
                <div className="flex-1 pt-1">
                  <h4 className={`font-semibold mb-2 ${colors.text}`}>{insight.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {insight.description}
                  </p>
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        💡 <strong>AI Analysis:</strong> This insight was generated by analyzing historical patterns, 
                        current team capacity, and upcoming project deadlines.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              {insight.action && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAction(insight)
                  }}
                  disabled={isActed}
                  className={`w-full mt-3 py-2 rounded-lg bg-gradient-to-r ${colors.bg} text-white font-medium text-sm hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                >
                  {isActed ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Completed
                    </>
                  ) : (
                    <>
                      {insight.action}
                      <ExternalLink className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}

              {/* Animated Border */}
              <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${colors.bg} opacity-0 hover:opacity-10 transition-opacity duration-300`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
