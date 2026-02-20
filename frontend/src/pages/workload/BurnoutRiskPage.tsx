import { Heart } from 'lucide-react'
import BurnoutRiskDashboard from '@/components/ui/BurnoutRiskDashboard'

export default function BurnoutRiskPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-900/20 dark:to-amber-900/20 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-gradient-to-r from-rose-600 to-rose-700 rounded-xl shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Burnout Risk Index
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              AI-powered team wellness monitoring and burnout prevention system
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-800 p-10">
        <BurnoutRiskDashboard />
      </div>

      {/* Info Footer */}
      <div className="bg-gradient-to-r from-rose-600 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <Heart className="w-8 h-8 flex-shrink-0 animate-pulse" />
          <div>
            <h3 className="text-lg font-bold mb-1">Proactive Wellness Monitoring</h3>
            <p className="text-rose-100">
              Our AI continuously monitors workload patterns, overtime hours, and leave history to identify 
              burnout risks early. Get personalized recommendations to maintain team wellbeing and productivity.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
