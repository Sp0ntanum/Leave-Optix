import { useState } from 'react'
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'

interface RiskIndicatorProps {
  level: 'Low' | 'Moderate' | 'High'
  description: string
  details?: string[]
}

export default function RiskIndicator({ level, description, details = [] }: RiskIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getRiskConfig = (level: string) => {
    switch (level) {
      case 'Low':
        return {
          bgColor: 'bg-success-50',
          textColor: 'text-success-700',
          badgeColor: 'bg-success-100 text-success-800',
          icon: CheckCircle
        }
      case 'Moderate':
        return {
          bgColor: 'bg-warning-50',
          textColor: 'text-warning-700',
          badgeColor: 'bg-warning-100 text-warning-800',
          icon: AlertCircle
        }
      case 'High':
        return {
          bgColor: 'bg-danger-50',
          textColor: 'text-danger-700',
          badgeColor: 'bg-danger-100 text-danger-800',
          icon: AlertTriangle
        }
      default:
        return {
          bgColor: 'bg-slate-50',
          textColor: 'text-slate-700',
          badgeColor: 'bg-slate-100 text-slate-800',
          icon: AlertCircle
        }
    }
  }

  const config = getRiskConfig(level)
  const Icon = config.icon

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-2">Team Risk Level</p>
          <div className="flex items-center space-x-2">
            <Icon className={`w-5 h-5 ${config.textColor}`} />
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.badgeColor}`}>
              {level}
            </span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-slate-600 mb-3">{description}</p>
      
      {details.length > 0 && (
        <div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center text-sm text-accent-600 hover:text-accent-700 font-medium"
          >
            Why this risk?
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 ml-1" />
            ) : (
              <ChevronDown className="w-4 h-4 ml-1" />
            )}
          </button>
          
          {isExpanded && (
            <div className="mt-3 space-y-2">
              {details.map((detail, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                  <p className="text-sm text-slate-600">{detail}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}