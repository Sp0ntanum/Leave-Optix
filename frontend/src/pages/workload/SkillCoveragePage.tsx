import { Activity } from 'lucide-react'
import SkillCoverageMap from '@/components/ui/SkillCoverageMap'

export default function SkillCoveragePage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl shadow-lg">
            <Activity className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Skill-Based Coverage Mapping
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Real-time tracking of team skill availability and coverage levels
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-800 p-10">
        <SkillCoverageMap />
      </div>

      {/* Info Footer */}
      <div className="bg-gradient-to-r from-blue-600 to-slate-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-4">
          <Activity className="w-8 h-8 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-bold mb-1">AI-Powered Coverage Analysis</h3>
            <p className="text-blue-100">
              Track your team's skill distribution and identify coverage gaps before they impact productivity. 
              Get instant alerts when critical skills fall below optimal levels.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
