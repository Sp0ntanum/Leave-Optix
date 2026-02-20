import { useState } from 'react'
import { Play, RefreshCw, Calendar, AlertTriangle, CheckCircle, Clock } from 'lucide-react'
import { toast } from 'react-toastify'

interface SimulationScenario {
  id: string
  name: string
  description: string
  parameters: {
    leaveRequests: number
    duration: number
    affectedTeams: string[]
  }
  results?: {
    coverage: number
    productivity: number
    risks: string[]
    recommendations: string[]
  }
}

export default function WorkforceSimulation() {
  const [isSimulating, setIsSimulating] = useState(false)
  const [activeScenario, setActiveScenario] = useState<string | null>(null)
  const [scenarios, setScenarios] = useState<SimulationScenario[]>([
    {
      id: '1',
      name: 'Holiday Season Peak',
      description: 'Simulate 40% team leave during December holidays',
      parameters: {
        leaveRequests: 8,
        duration: 14,
        affectedTeams: ['Engineering', 'Design', 'Marketing']
      }
    },
    {
      id: '2',
      name: 'Summer Vacation Wave',
      description: 'Extended leaves across all departments in July-August',
      parameters: {
        leaveRequests: 12,
        duration: 21,
        affectedTeams: ['All Departments']
      }
    },
    {
      id: '3',
      name: 'Project Crunch Period',
      description: 'Minimal leaves during critical project deadline',
      parameters: {
        leaveRequests: 2,
        duration: 30,
        affectedTeams: ['Engineering', 'QA']
      }
    }
  ])

  const runSimulation = (scenarioId: string) => {
    setIsSimulating(true)
    setActiveScenario(scenarioId)
    
    // Simulate analysis with AI processing
    setTimeout(() => {
      const scenario = scenarios.find(s => s.id === scenarioId)
      if (scenario) {
        const coverage = Math.floor(Math.random() * 30) + 60
        const productivity = Math.floor(Math.random() * 25) + 65
        
        const updatedScenario = {
          ...scenario,
          results: {
            coverage,
            productivity,
            risks: [
              coverage < 75 ? 'Low team coverage during peak period' : 'Adequate coverage maintained',
              productivity < 75 ? 'Potential productivity impact detected' : 'Productivity remains stable',
              'Senior developer overlap detected in weeks 2-3'
            ],
            recommendations: [
              'Consider hiring 2 temporary contractors for period coverage',
              'Reschedule non-critical meetings to conserve resources',
              'Enable remote work flexibility for remaining team members',
              'Implement knowledge transfer sessions before leave periods'
            ]
          }
        }
        
        setScenarios(prev => prev.map(s => s.id === scenarioId ? updatedScenario : s))
        setIsSimulating(false)
        toast.success('Simulation completed! Results are ready.')
      }
    }, 3000)
  }

  const resetSimulation = (scenarioId: string) => {
    setScenarios(prev => prev.map(s => 
      s.id === scenarioId ? { ...s, results: undefined } : s
    ))
    setActiveScenario(null)
    toast.info('Simulation reset')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Workforce Simulation Engine</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Test different scenarios and predict workforce outcomes
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-400">AI-Powered</span>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {scenario.name}
              </h4>
              <p className="text-sm text-blue-100 mt-1">{scenario.description}</p>
            </div>

            {/* Parameters */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Leave Requests</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {scenario.parameters.leaveRequests}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {scenario.parameters.duration}d
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Affected Teams</p>
                <div className="flex flex-wrap gap-1">
                  {scenario.parameters.affectedTeams.map((team, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full"
                    >
                      {team}
                    </span>
                  ))}
                </div>
              </div>

              {/* Results */}
              {scenario.results && (
                <div className="space-y-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Coverage</p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
                        {scenario.results.coverage}%
                      </p>
                    </div>
                    <div className="text-center p-3 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-lg">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Productivity</p>
                      <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                        {scenario.results.productivity}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      Key Risks
                    </p>
                    <ul className="space-y-1">
                      {scenario.results.risks.slice(0, 2).map((risk, idx) => (
                        <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-1">
                          <span className="text-amber-500 mt-0.5">•</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Recommendations
                    </p>
                    <ul className="space-y-1">
                      {scenario.results.recommendations.slice(0, 2).map((rec, idx) => (
                        <li key={idx} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-1">
                          <span className="text-blue-500 mt-0.5">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                {!scenario.results ? (
                  <button
                    onClick={() => runSimulation(scenario.id)}
                    disabled={isSimulating && activeScenario === scenario.id}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                  >
                    {isSimulating && activeScenario === scenario.id ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        Simulating...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Run Simulation
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => resetSimulation(scenario.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-all duration-300"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-blue-100 mb-1">Scenarios Run</p>
            <p className="text-3xl font-bold">{scenarios.filter(s => s.results).length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-blue-100 mb-1">Avg Coverage</p>
            <p className="text-3xl font-bold">
              {scenarios.filter(s => s.results).length > 0
                ? Math.round(
                    scenarios
                      .filter(s => s.results)
                      .reduce((acc, s) => acc + (s.results?.coverage || 0), 0) /
                      scenarios.filter(s => s.results).length
                  )
                : 0}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-blue-100 mb-1">Total Risks</p>
            <p className="text-3xl font-bold">
              {scenarios.filter(s => s.results).reduce((acc, s) => acc + (s.results?.risks.length || 0), 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-blue-100 mb-1">AI Insights</p>
            <p className="text-3xl font-bold">
              {scenarios.filter(s => s.results).reduce((acc, s) => acc + (s.results?.recommendations.length || 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
