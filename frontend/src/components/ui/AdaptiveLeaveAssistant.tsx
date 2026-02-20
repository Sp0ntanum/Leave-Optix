import { useState } from 'react'
import { Sparkles, Calendar, Users, TrendingUp, AlertCircle, CheckCircle, Zap, Clock } from 'lucide-react'
import { toast } from 'react-toastify'

interface LeaveSuggestion {
  id: string
  startDate: string
  endDate: string
  duration: number
  optimalScore: number
  reasons: string[]
  teamImpact: {
    coverage: number
    productivity: number
    conflicts: number
  }
  alternatives: {
    date: string
    score: number
    reason: string
  }[]
}

export default function AdaptiveLeaveAssistant() {
  const [preferences, setPreferences] = useState({
    duration: 5,
    timeframe: 'quarter',
    flexibility: 'moderate',
    teamPriority: true
  })
  const [suggestions, setSuggestions] = useState<LeaveSuggestion[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null)

  const generateSuggestions = () => {
    setIsAnalyzing(true)
    toast.info('🤖 AI analyzing optimal leave windows...')

    setTimeout(() => {
      const newSuggestions: LeaveSuggestion[] = [
        {
          id: '1',
          startDate: '2026-03-15',
          endDate: '2026-03-19',
          duration: 5,
          optimalScore: 95,
          reasons: [
            'Perfect team coverage (92%)',
            'No critical project deadlines',
            'Low historical leave requests during this period',
            'Weather forecast: Excellent spring conditions'
          ],
          teamImpact: {
            coverage: 92,
            productivity: 88,
            conflicts: 0
          },
          alternatives: [
            { date: 'Mar 22-26', score: 88, reason: 'Similar coverage, slightly higher team load' },
            { date: 'Mar 29-Apr 2', score: 85, reason: 'Quarter-end activities may require attention' }
          ]
        },
        {
          id: '2',
          startDate: '2026-04-12',
          endDate: '2026-04-16',
          duration: 5,
          optimalScore: 89,
          reasons: [
            'Good team coverage (87%)',
            'Post-sprint recovery period',
            'Aligns with public holidays for extended break',
            'Historical data shows low workload'
          ],
          teamImpact: {
            coverage: 87,
            productivity: 90,
            conflicts: 1
          },
          alternatives: [
            { date: 'Apr 19-23', score: 82, reason: 'New sprint kickoff may need your input' },
            { date: 'Apr 5-9', score: 80, reason: 'Team member already scheduled off' }
          ]
        },
        {
          id: '3',
          startDate: '2026-05-10',
          endDate: '2026-05-14',
          duration: 5,
          optimalScore: 78,
          reasons: [
            'Moderate team coverage (78%)',
            'Between major project milestones',
            'Skills coverage adequate with backup',
            'Lower optimal score due to Q2 planning activities'
          ],
          teamImpact: {
            coverage: 78,
            productivity: 82,
            conflicts: 2
          },
          alternatives: [
            { date: 'May 17-21', score: 75, reason: 'Post-planning period, more stable' },
            { date: 'May 3-7', score: 72, reason: 'Close to month start, budget reviews' }
          ]
        }
      ]

      setSuggestions(newSuggestions)
      setIsAnalyzing(false)
      toast.success('✨ Found optimal leave windows for you!')
    }, 2500)
  }

  const applyLeaveRequest = (suggestion: LeaveSuggestion) => {
    toast.success(`🎉 Leave request created for ${suggestion.startDate} to ${suggestion.endDate}!`)
    // Would navigate to leave request form with pre-filled dates
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'from-emerald-600 to-emerald-700'
    if (score >= 75) return 'from-blue-600 to-blue-700'
    return 'from-amber-600 to-amber-700'
  }

  const getScoreTextColor = (score: number) => {
    if (score >= 90) return 'text-emerald-600 dark:text-emerald-400'
    if (score >= 75) return 'text-blue-600 dark:text-blue-400'
    return 'text-amber-600 dark:text-amber-400'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 90) return { icon: CheckCircle, label: 'Excellent', color: 'text-emerald-600' }
    if (score >= 75) return { icon: CheckCircle, label: 'Good', color: 'text-blue-600' }
    return { icon: AlertCircle, label: 'Fair', color: 'text-amber-600' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-blue-500 animate-pulse" />
            Adaptive Leave Suggestion Engine
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            AI-powered intelligent leave planning based on team dynamics and project timelines
          </p>
        </div>
      </div>

      {/* Preferences Panel */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Your Preferences
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm text-blue-100 mb-2 block">Duration</label>
            <select
              value={preferences.duration}
              onChange={(e) => setPreferences({ ...preferences, duration: Number(e.target.value) })}
              className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="3" className="text-gray-900">3 days</option>
              <option value="5" className="text-gray-900">5 days</option>
              <option value="7" className="text-gray-900">7 days</option>
              <option value="10" className="text-gray-900">10 days</option>
              <option value="14" className="text-gray-900">14 days</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-blue-100 mb-2 block">Timeframe</label>
            <select
              value={preferences.timeframe}
              onChange={(e) => setPreferences({ ...preferences, timeframe: e.target.value })}
              className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="month" className="text-gray-900">Next Month</option>
              <option value="quarter" className="text-gray-900">Next Quarter</option>
              <option value="halfyear" className="text-gray-900">Next 6 Months</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-blue-100 mb-2 block">Flexibility</label>
            <select
              value={preferences.flexibility}
              onChange={(e) => setPreferences({ ...preferences, flexibility: e.target.value })}
              className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="strict" className="text-gray-900">Specific Dates Only</option>
              <option value="moderate" className="text-gray-900">Somewhat Flexible</option>
              <option value="flexible" className="text-gray-900">Very Flexible</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={generateSuggestions}
              disabled={isAnalyzing}
              className="w-full px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <Clock className="w-4 h-4 animate-spin" />
                  Analyzing...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Get Suggestions
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Suggestions List */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI-Generated Leave Windows
            </h4>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {suggestions.length} optimal periods found
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {suggestions.map((suggestion, index) => {
              const scoreInfo = getScoreLabel(suggestion.optimalScore)
              const ScoreIcon = scoreInfo.icon
              const isSelected = selectedSuggestion === suggestion.id

              return (
                <div
                  key={suggestion.id}
                  onClick={() => setSelectedSuggestion(isSelected ? null : suggestion.id)}
                  className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-xl ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                      : 'border-gray-100 dark:border-gray-700'
                  }`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 bg-gradient-to-r ${getScoreColor(suggestion.optimalScore)} rounded-lg text-white font-bold text-2xl shadow-lg`}>
                          #{index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h5 className="text-xl font-bold text-gray-900 dark:text-white">
                              {new Date(suggestion.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(suggestion.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </h5>
                            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium rounded-full">
                              {suggestion.duration} days
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <ScoreIcon className={`w-4 h-4 ${scoreInfo.color}`} />
                            <span className={`text-sm font-semibold ${scoreInfo.color}`}>
                              {scoreInfo.label} Match - {suggestion.optimalScore}% Optimal
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          applyLeaveRequest(suggestion)
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        Apply Request
                      </button>
                    </div>

                    {/* Team Impact Metrics */}
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Team Coverage</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                          {suggestion.teamImpact.coverage}%
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Productivity</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                          {suggestion.teamImpact.productivity}%
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Conflicts</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                          {suggestion.teamImpact.conflicts}
                        </p>
                      </div>
                    </div>

                    {/* Reasons */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                      <h6 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Why This Period is Optimal
                      </h6>
                      <ul className="space-y-1">
                        {suggestion.reasons.map((reason, idx) => (
                          <li key={idx} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                            <span className="text-blue-500 font-bold mt-0.5">✓</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Alternatives */}
                    {isSelected && suggestion.alternatives.length > 0 && (
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 animate-in fade-in slide-in-from-top duration-300">
                        <h6 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                          Alternative Dates
                        </h6>
                        <div className="space-y-2">
                          {suggestion.alternatives.map((alt, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{alt.date}</p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">{alt.reason}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getScoreTextColor(alt.score)}`}>
                                {alt.score}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {suggestions.length === 0 && !isAnalyzing && (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Ready to Find Your Perfect Leave Window?
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            Set your preferences above and let AI analyze the best times for your leave
          </p>
          <button
            onClick={generateSuggestions}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate AI Suggestions
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
