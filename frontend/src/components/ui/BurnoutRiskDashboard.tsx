import { useState } from 'react'
import { AlertTriangle, Heart, Calendar, Clock, Zap, Shield, Activity } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  burnoutRisk: number
  factors: {
    overtimeHours: number
    consecutiveDays: number
    projectLoad: number
    lastLeave: number
  }
  trends: 'improving' | 'stable' | 'declining'
  recommendations: string[]
}

export default function BurnoutRiskDashboard() {
  const [sortBy, setSortBy] = useState<'risk' | 'name'>('risk')
  const [filterRisk, setFilterRisk] = useState<'all' | 'high' | 'medium' | 'low'>('all')

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      role: 'Senior Backend Developer',
      avatar: 'SC',
      burnoutRisk: 85,
      factors: {
        overtimeHours: 45,
        consecutiveDays: 28,
        projectLoad: 4,
        lastLeave: 90
      },
      trends: 'declining',
      recommendations: [
        'Urgent: Schedule 5-7 days leave within next 2 weeks',
        'Reduce project assignments from 4 to 2',
        'Implement no-meeting Wednesdays for focused work'
      ]
    },
    {
      id: '2',
      name: 'Michael Torres',
      role: 'DevOps Engineer',
      avatar: 'MT',
      burnoutRisk: 72,
      factors: {
        overtimeHours: 38,
        consecutiveDays: 35,
        projectLoad: 3,
        lastLeave: 75
      },
      trends: 'declining',
      recommendations: [
        'Plan 3-5 days leave in next month',
        'Delegate on-call rotation to junior team members',
        'Set boundaries for after-hours work'
      ]
    },
    {
      id: '3',
      name: 'Emma Wilson',
      role: 'UX Designer',
      avatar: 'EW',
      burnoutRisk: 45,
      factors: {
        overtimeHours: 15,
        consecutiveDays: 20,
        projectLoad: 2,
        lastLeave: 30
      },
      trends: 'stable',
      recommendations: [
        'Maintain current work-life balance',
        'Continue regular leave schedule',
        'Consider mentoring junior designers'
      ]
    },
    {
      id: '4',
      name: 'James Rodriguez',
      role: 'Frontend Developer',
      avatar: 'JR',
      burnoutRisk: 38,
      factors: {
        overtimeHours: 10,
        consecutiveDays: 15,
        projectLoad: 2,
        lastLeave: 14
      },
      trends: 'improving',
      recommendations: [
        'Excellent work-life balance maintained',
        'Share strategies with team members',
        'Ready for additional responsibilities if needed'
      ]
    },
    {
      id: '5',
      name: 'Lisa Martinez',
      role: 'Product Manager',
      avatar: 'LM',
      burnoutRisk: 68,
      factors: {
        overtimeHours: 32,
        consecutiveDays: 42,
        projectLoad: 5,
        lastLeave: 60
      },
      trends: 'declining',
      recommendations: [
        'Schedule 4-5 days leave within 3 weeks',
        'Redistribute 2 projects to associate PM',
        'Limit meetings to 4 hours per day maximum'
      ]
    },
    {
      id: '6',
      name: 'David Kim',
      role: 'QA Lead',
      avatar: 'DK',
      burnoutRisk: 25,
      factors: {
        overtimeHours: 5,
        consecutiveDays: 12,
        projectLoad: 1,
        lastLeave: 7
      },
      trends: 'stable',
      recommendations: [
        'Optimal work-life balance',
        'Continue regular leave pattern',
        'Best practices model for team'
      ]
    }
  ]

  const getRiskLevel = (risk: number): { label: string; color: string; bgColor: string; icon: any } => {
    if (risk >= 70) return {
      label: 'Critical',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'from-red-600 to-red-700',
      icon: AlertTriangle
    }
    if (risk >= 50) return {
      label: 'High',
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'from-amber-600 to-amber-700',
      icon: AlertTriangle
    }
    if (risk >= 30) return {
      label: 'Moderate',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'from-blue-600 to-blue-700',
      icon: Activity
    }
    return {
      label: 'Low',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'from-emerald-600 to-emerald-700',
      icon: Shield
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return { icon: '📈', color: 'text-emerald-600', label: 'Improving' }
      case 'declining': return { icon: '📉', color: 'text-red-600', label: 'Declining' }
      default: return { icon: '➡️', color: 'text-blue-600', label: 'Stable' }
    }
  }

  const filteredMembers = teamMembers
    .filter(member => {
      if (filterRisk === 'all') return true
      const risk = getRiskLevel(member.burnoutRisk).label.toLowerCase()
      return risk === filterRisk || (filterRisk === 'high' && risk === 'critical')
    })
    .sort((a, b) => {
      if (sortBy === 'risk') return b.burnoutRisk - a.burnoutRisk
      return a.name.localeCompare(b.name)
    })

  const avgRisk = Math.round(teamMembers.reduce((acc, m) => acc + m.burnoutRisk, 0) / teamMembers.length)
  const highRiskCount = teamMembers.filter(m => m.burnoutRisk >= 70).length
  const improvingCount = teamMembers.filter(m => m.trends === 'improving').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="w-7 h-7 text-red-500" />
            Burnout Risk Index
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            AI-powered wellness monitoring and prevention
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="risk">Sort by Risk</option>
            <option value="name">Sort by Name</option>
          </select>

          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value as any)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Levels</option>
            <option value="high">High Risk Only</option>
            <option value="medium">Moderate Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Summary Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl p-6 text-white">
          <p className="text-sm text-slate-100 mb-2">Average Risk</p>
          <p className="text-4xl font-bold mb-1">{avgRisk}%</p>
          <p className="text-xs text-slate-200">Team burnout index</p>
        </div>
        <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl p-6 text-white">
          <p className="text-sm text-red-100 mb-2">High Risk</p>
          <p className="text-4xl font-bold mb-1">{highRiskCount}</p>
          <p className="text-xs text-red-200">Members need attention</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
          <p className="text-sm text-emerald-100 mb-2">Improving</p>
          <p className="text-4xl font-bold mb-1">{improvingCount}</p>
          <p className="text-xs text-emerald-200">Positive trends</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <p className="text-sm text-blue-100 mb-2">AI Insights</p>
          <p className="text-4xl font-bold mb-1">
            {teamMembers.reduce((acc, m) => acc + m.recommendations.length, 0)}
          </p>
          <p className="text-xs text-blue-200">Active recommendations</p>
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMembers.map(member => {
          const riskLevel = getRiskLevel(member.burnoutRisk)
          const RiskIcon = riskLevel.icon
          const trendInfo = getTrendIcon(member.trends)

          return (
            <div
              key={member.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${riskLevel.bgColor} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {member.avatar}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{member.name}</h4>
                      <p className="text-sm text-white/80">{member.role}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <RiskIcon className="w-5 h-5 text-white" />
                      <span className="text-2xl font-bold text-white">{member.burnoutRisk}%</span>
                    </div>
                    <span className="text-xs text-white/80">{riskLevel.label} Risk</span>
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* Trend */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Trend (30 days)</span>
                  <span className={`flex items-center gap-2 text-sm font-semibold ${trendInfo.color}`}>
                    <span>{trendInfo.icon}</span>
                    {trendInfo.label}
                  </span>
                </div>

                {/* Risk Factors */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Overtime</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {member.factors.overtimeHours}h
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Days Worked</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {member.factors.consecutiveDays}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Projects</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {member.factors.projectLoad}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">Last Leave</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {member.factors.lastLeave}d
                    </p>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    AI Recommendations
                  </h5>
                  <ul className="space-y-2">
                    {member.recommendations.slice(0, 2).map((rec, idx) => (
                      <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2">
                        <span className="text-blue-500 font-bold mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                  {member.recommendations.length > 2 && (
                    <button className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-2 hover:underline">
                      +{member.recommendations.length - 2} more recommendations
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Panel */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <h4 className="text-xl font-bold mb-4">Wellness Action Plan</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="font-semibold mb-2">Immediate Actions</p>
            <p className="text-sm text-blue-100">
              {highRiskCount} team members need urgent intervention. Schedule 1-on-1s within 48 hours.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="font-semibold mb-2">Preventive Measures</p>
            <p className="text-sm text-blue-100">
              Implement flexible work hours and mandatory break policies for high-risk teams.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <p className="font-semibold mb-2">Success Stories</p>
            <p className="text-sm text-blue-100">
              {improvingCount} members showing improvement. Share their strategies in next team meeting.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
