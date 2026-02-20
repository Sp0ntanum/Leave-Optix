import { useState } from 'react'
import { Code, Database, Palette, Settings, Shield, Zap, AlertCircle, CheckCircle, Users } from 'lucide-react'

interface Skill {
  id: string
  name: string
  icon: any
  category: string
  coverage: number
  available: number
  total: number
  critical: boolean
  members: string[]
}

export default function SkillCoverageMap() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today')

  const skills: Skill[] = [
    {
      id: '1',
      name: 'Frontend Development',
      icon: Code,
      category: 'Engineering',
      coverage: 85,
      available: 5,
      total: 6,
      critical: false,
      members: ['Alice Johnson', 'Bob Smith', 'Carol White', 'Dave Brown', 'Eve Davis']
    },
    {
      id: '2',
      name: 'Backend Development',
      icon: Database,
      category: 'Engineering',
      coverage: 60,
      available: 3,
      total: 5,
      critical: true,
      members: ['Frank Miller', 'Grace Lee', 'Henry Wilson']
    },
    {
      id: '3',
      name: 'UI/UX Design',
      icon: Palette,
      category: 'Design',
      coverage: 75,
      available: 3,
      total: 4,
      critical: false,
      members: ['Ivy Chen', 'Jack Taylor', 'Kelly Green']
    },
    {
      id: '4',
      name: 'DevOps',
      icon: Settings,
      category: 'Engineering',
      coverage: 50,
      available: 2,
      total: 4,
      critical: true,
      members: ['Liam Brown', 'Maya Patel']
    },
    {
      id: '5',
      name: 'Security',
      icon: Shield,
      category: 'Engineering',
      coverage: 66,
      available: 2,
      total: 3,
      critical: true,
      members: ['Nina Rodriguez', 'Oscar Kim']
    },
    {
      id: '6',
      name: 'QA Testing',
      icon: Zap,
      category: 'Quality',
      coverage: 100,
      available: 4,
      total: 4,
      critical: false,
      members: ['Paul Anderson', 'Quinn Martinez', 'Rita Singh', 'Sam Johnson']
    }
  ]

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return 'from-emerald-600 to-emerald-700'
    if (coverage >= 60) return 'from-blue-600 to-blue-700'
    if (coverage >= 40) return 'from-amber-600 to-amber-700'
    return 'from-red-600 to-red-700'
  }

  const getCoverageTextColor = (coverage: number) => {
    if (coverage >= 80) return 'text-emerald-600 dark:text-emerald-400'
    if (coverage >= 60) return 'text-blue-600 dark:text-blue-400'
    if (coverage >= 40) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getCoverageStatus = (coverage: number) => {
    if (coverage >= 80) return { icon: CheckCircle, label: 'Excellent', color: 'text-emerald-600' }
    if (coverage >= 60) return { icon: CheckCircle, label: 'Good', color: 'text-blue-600' }
    if (coverage >= 40) return { icon: AlertCircle, label: 'Moderate', color: 'text-amber-600' }
    return { icon: AlertCircle, label: 'Critical', color: 'text-red-600' }
  }

  const criticalSkills = skills.filter(s => s.critical && s.coverage < 70)
  const avgCoverage = Math.round(skills.reduce((acc, s) => acc + s.coverage, 0) / skills.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Skill-Based Coverage Mapping</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Monitor team skill availability and coverage levels
          </p>
        </div>
        
        {/* Time Range Filter */}
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {(['today', 'week', 'month'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                timeRange === range
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalSkills.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                Critical Coverage Alerts
              </h4>
              <div className="space-y-2">
                {criticalSkills.map(skill => (
                  <div key={skill.id} className="flex items-center justify-between text-sm">
                    <span className="text-red-800 dark:text-red-200">
                      {skill.name}: {skill.coverage}% coverage
                    </span>
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      {skill.available}/{skill.total} available
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <p className="text-sm text-blue-100 mb-2">Average Coverage</p>
          <p className="text-4xl font-bold mb-1">{avgCoverage}%</p>
          <p className="text-xs text-blue-200">Across all skills</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-white">
          <p className="text-sm text-emerald-100 mb-2">Full Coverage</p>
          <p className="text-4xl font-bold mb-1">{skills.filter(s => s.coverage >= 80).length}</p>
          <p className="text-xs text-emerald-200">Skills at optimal level</p>
        </div>
        <div className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl p-6 text-white">
          <p className="text-sm text-amber-100 mb-2">At Risk</p>
          <p className="text-4xl font-bold mb-1">{criticalSkills.length}</p>
          <p className="text-xs text-amber-200">Critical skills below 70%</p>
        </div>
        <div className="bg-gradient-to-br from-slate-600 to-slate-700 rounded-xl p-6 text-white">
          <p className="text-sm text-slate-100 mb-2">Total Team</p>
          <p className="text-4xl font-bold mb-1">
            {skills.reduce((acc, s) => acc + s.total, 0)}
          </p>
          <p className="text-xs text-slate-200">Team members tracked</p>
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => {
          const Icon = skill.icon
          const status = getCoverageStatus(skill.coverage)
          const StatusIcon = status.icon
          const isSelected = selectedSkill === skill.id

          return (
            <div
              key={skill.id}
              onClick={() => setSelectedSkill(isSelected ? null : skill.id)}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1 ${
                isSelected
                  ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-200 dark:ring-blue-800'
                  : 'border-gray-100 dark:border-gray-700'
              } ${skill.critical && skill.coverage < 70 ? 'ring-2 ring-red-200 dark:ring-red-900' : ''}`}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 bg-gradient-to-br ${getCoverageColor(skill.coverage)} rounded-lg shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{skill.name}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{skill.category}</p>
                    </div>
                  </div>
                  {skill.critical && (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold rounded-full">
                      Critical
                    </span>
                  )}
                </div>

                {/* Coverage Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Coverage</span>
                    <span className={`text-sm font-bold ${getCoverageTextColor(skill.coverage)}`}>
                      {skill.coverage}%
                    </span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getCoverageColor(skill.coverage)} rounded-full transition-all duration-1000 shadow-lg`}
                      style={{ width: `${skill.coverage}%` }}
                    />
                  </div>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Available</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {skill.available}/{skill.total}
                  </span>
                </div>

                {/* Status Badge */}
                <div className={`flex items-center gap-2 ${status.color}`}>
                  <StatusIcon className="w-4 h-4" />
                  <span className="text-sm font-semibold">{status.label} Coverage</span>
                </div>

                {/* Expanded Details */}
                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top duration-300">
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Team Members:</p>
                    <div className="flex flex-wrap gap-2">
                      {skill.members.map((member, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full"
                        >
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          AI-Powered Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              🎯 Hire for Backend Development
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Coverage at 60% (critical). Consider hiring 1-2 backend developers to maintain 80%+ coverage during peak periods.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">
              📚 Cross-Training Opportunity
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Train 2 frontend developers in DevOps to improve coverage from 50% to 75% and increase team flexibility.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
