import { Brain, Activity, Users } from 'lucide-react'
import SkillCoverageMap from '@/components/ui/SkillCoverageMap'
import BurnoutRiskDashboard from '@/components/ui/BurnoutRiskDashboard'

export default function WorkforceAI() {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-10 text-white shadow-2xl">
        <div className="flex items-center gap-5 mb-6">
          <div className="p-5 bg-white/20 backdrop-blur-sm rounded-2xl">
            <Brain className="w-14 h-14" />
          </div>
          <div>
            <h1 className="text-5xl font-bold mb-3">Workforce AI Intelligence</h1>
            <p className="text-blue-100 text-xl">
              Advanced analytics for team skill coverage and burnout prevention
            </p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4">
              <Activity className="w-10 h-10 text-blue-200" />
              <div>
                <p className="text-sm text-blue-200 font-medium">AI Insights</p>
                <p className="text-3xl font-bold">Real-time</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4">
              <Users className="w-10 h-10 text-blue-200" />
              <div>
                <p className="text-sm text-blue-200 font-medium">Team Coverage</p>
                <p className="text-3xl font-bold">6 Skills</p>
              </div>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4">
              <Brain className="w-10 h-10 text-blue-200" />
              <div>
                <p className="text-sm text-blue-200 font-medium">Risk Monitoring</p>
                <p className="text-3xl font-bold">24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Skill-Based Coverage Mapping */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-3xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900/20 p-8 border-b-2 border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Activity className="w-8 h-8 text-blue-600" />
            Skill-Based Coverage Mapping
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            Real-time tracking of team skill availability and coverage levels
          </p>
        </div>
        <div className="p-10">
          <SkillCoverageMap />
        </div>
      </div>

      {/* Burnout Risk Index */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-3xl transition-shadow duration-300">
        <div className="bg-gradient-to-r from-rose-50 to-amber-50 dark:from-rose-900/20 dark:to-amber-900/20 p-8 border-b-2 border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Brain className="w-8 h-8 text-rose-600" />
            Burnout Risk Index
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
            AI-powered team wellness monitoring and burnout prevention system
          </p>
        </div>
        <div className="p-10">
          <BurnoutRiskDashboard />
        </div>
      </div>

      {/* AI Recommendations Footer */}
      <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
        <div className="flex items-center gap-5">
          <Brain className="w-12 h-12 animate-pulse flex-shrink-0" />
          <div>
            <h3 className="text-2xl font-bold mb-2">AI-Powered Insights</h3>
            <p className="text-emerald-100 text-lg leading-relaxed">
              Our advanced algorithms continuously analyze team dynamics, skill coverage, and workload patterns 
              to provide proactive recommendations for optimal workforce management and employee wellbeing.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
