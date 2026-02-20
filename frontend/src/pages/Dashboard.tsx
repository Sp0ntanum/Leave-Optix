import { Calendar, Clock, CheckCircle, Users, TrendingUp, Brain, Activity } from 'lucide-react'
import EnhancedStatCard from '@/components/ui/EnhancedStatCard'
import AIInsights from '@/components/ui/AIInsights'
import AdvancedAnalytics from '@/components/ui/AdvancedAnalytics'
import WorkforceSimulation from '@/components/ui/WorkforceSimulation'
import AdaptiveLeaveAssistant from '@/components/ui/AdaptiveLeaveAssistant'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'workforce'>('overview')
  const navigate = useNavigate()

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/*Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-gray-600">Welcome back! Here's what's happening</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/leave/requests')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 hover:shadow-md transition-all font-medium"
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Apply for Leave
            </span>
          </button>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EnhancedStatCard
          title="Available Leave"
          value={15}
          icon={<Calendar className="w-6 h-6" />}
          trend={8}
          suffix="days"
          color="from-blue-600 to-blue-700"
          subtitle="Out of 20 total"
          onClick={() => navigate('/leave/requests')}
        />
        
        <EnhancedStatCard
          title="Pending Requests"
          value={2}
          icon={<Clock className="w-6 h-6" />}
          trend={-20}
          suffix="requests"
          color="from-amber-600 to-amber-700"
          subtitle="Awaiting approval"
          onClick={() => navigate('/leave/requests')}
        />
        
        <EnhancedStatCard
          title="Approved Requests"
          value={5}
          icon={<CheckCircle className="w-6 h-6" />}
          trend={25}
          suffix="this month"
          color="from-emerald-600 to-emerald-700"
          subtitle="94% approval rate"
          onClick={() => navigate('/leave/requests')}
        />
        
        <EnhancedStatCard
          title="Team Availability"
          value={87}
          icon={<Users className="w-6 h-6" />}
          trend={5}
          suffix="%"
          color="from-slate-600 to-slate-700"
          subtitle="Looking good"
          onClick={() => navigate('/calendar')}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'overview' as const, label: 'Overview', icon: TrendingUp },
          { id: 'analytics' as const, label: 'Analytics', icon: Activity },
          { id: 'workforce' as const, label: 'Workforce AI', icon: Brain },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-blue-600 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 border-transparent hover:bg-gray-50 rounded-t-lg'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-10 py-8">
          <AIInsights />
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-10 py-8">
          <AdvancedAnalytics />
        </div>
      )}

      {activeTab === 'workforce' && (
        <div className="space-y-10 py-8">
          {/* Workforce AI Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-1 rounded-2xl shadow-xl">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-8">
              <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent flex items-center gap-3">
                <Brain className="w-8 h-8 text-blue-600" />
                Advanced Workforce Intelligence
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                AI-powered workforce planning, coverage analysis, burnout prevention, and intelligent leave recommendations
              </p>
            </div>
          </div>

          {/* Adaptive Leave Assistant */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border-2 border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-shadow duration-300">
            <AdaptiveLeaveAssistant />
          </div>

          {/* Workforce Simulation */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 border-2 border-gray-100 dark:border-gray-800 hover:shadow-2xl transition-shadow duration-300">
            <WorkforceSimulation />
          </div>

          {/* Link to Full Workforce AI Page */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-[1.02]" onClick={() => navigate('/workforce-ai')}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Brain className="w-12 h-12 animate-pulse" />
                <div>
                  <h3 className="text-2xl font-bold mb-1">Explore Full Workforce AI</h3>
                  <p className="text-blue-100">
                    View comprehensive Skill Coverage Mapping and Burnout Risk Analysis
                  </p>
                </div>
              </div>
              <div className="text-4xl font-bold">→</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
