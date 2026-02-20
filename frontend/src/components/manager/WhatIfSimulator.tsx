import { X, Play, Users, TrendingDown } from 'lucide-react'
import { useState } from 'react'
import { intelligenceService, WhatIfResult } from '@/services/intelligenceService'
import { toast } from 'react-toastify'

interface WhatIfSimulatorProps {
  isOpen: boolean
  onClose: () => void
}

export default function WhatIfSimulator({ isOpen, onClose }: WhatIfSimulatorProps) {
  const [leaves, setLeaves] = useState<Array<{ employee_id: number; start_date: string; end_date: string }>>([])
  const [result, setResult] = useState<WhatIfResult | null>(null)
  const [loading, setLoading] = useState(false)

  const addLeave = () => {
    setLeaves([...leaves, { employee_id: 0, start_date: '', end_date: '' }])
  }

  const updateLeave = (index: number, field: string, value: any) => {
    const updated = [...leaves]
    updated[index] = { ...updated[index], [field]: value }
    setLeaves(updated)
  }

  const removeLeave = (index: number) => {
    setLeaves(leaves.filter((_, i) => i !== index))
  }

  const simulate = async () => {
    if (leaves.length === 0) {
      toast.error('Add at least one hypothetical leave')
      return
    }

    setLoading(true)
    try {
      const result = await intelligenceService.simulateWhatIf(leaves)
      setResult(result)
      toast.success('Simulation complete')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Simulation failed')
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (risk: string) => {
    if (risk === 'High') return 'text-danger-600 dark:text-danger-400'
    if (risk === 'Medium') return 'text-warning-600 dark:text-warning-400'
    return 'text-success-600 dark:text-success-400'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-primary-800 dark:text-slate-100">What-If Simulator</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Simulate impact of hypothetical leaves</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Input Section */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-primary-800 dark:text-slate-100">Hypothetical Leaves</h3>
                <button
                  onClick={addLeave}
                  className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 text-sm font-medium"
                >
                  + Add Leave
                </button>
              </div>

              <div className="space-y-3">
                {leaves.map((leave, index) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-4 gap-3">
                      <input
                        type="number"
                        placeholder="Employee ID"
                        value={leave.employee_id || ''}
                        onChange={(e) => updateLeave(index, 'employee_id', parseInt(e.target.value))}
                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                      />
                      <input
                        type="date"
                        value={leave.start_date}
                        onChange={(e) => updateLeave(index, 'start_date', e.target.value)}
                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                      />
                      <input
                        type="date"
                        value={leave.end_date}
                        onChange={(e) => updateLeave(index, 'end_date', e.target.value)}
                        className="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200"
                      />
                      <button
                        onClick={() => removeLeave(index)}
                        className="px-3 py-2 bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400 rounded-lg hover:bg-danger-200 dark:hover:bg-danger-900/50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={simulate}
                disabled={loading || leaves.length === 0}
                className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-medium hover:from-accent-600 hover:to-accent-700 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Play className="w-5 h-5" />
                )}
                <span>{loading ? 'Simulating...' : 'Run Simulation'}</span>
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary-800 dark:text-slate-100">Simulation Results</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="w-5 h-5 text-accent-500" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">Team Capacity</p>
                    </div>
                    <p className="text-3xl font-bold text-primary-800 dark:text-slate-100">{result.team_capacity}%</p>
                  </div>

                  <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingDown className="w-5 h-5 text-warning-500" />
                      <p className="text-sm text-slate-600 dark:text-slate-400">Stability Score</p>
                    </div>
                    <p className="text-3xl font-bold text-primary-800 dark:text-slate-100">{result.stability_score}</p>
                  </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Affected</p>
                      <p className="text-2xl font-bold text-primary-800 dark:text-slate-100">{result.affected_employees}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Overloaded</p>
                      <p className="text-2xl font-bold text-warning-600 dark:text-warning-400">{result.overload_count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Risk Level</p>
                      <p className={`text-2xl font-bold ${getRiskColor(result.risk_level)}`}>{result.risk_level}</p>
                    </div>
                  </div>
                </div>

                <div className={`rounded-xl p-4 ${
                  result.risk_level === 'High' ? 'bg-danger-50 dark:bg-danger-900/20 border-danger-200 dark:border-danger-800' :
                  result.risk_level === 'Medium' ? 'bg-warning-50 dark:bg-warning-900/20 border-warning-200 dark:border-warning-800' :
                  'bg-success-50 dark:bg-success-900/20 border-success-200 dark:border-success-800'
                } border`}>
                  <p className="text-sm font-medium">
                    {result.risk_level === 'High' && 'High risk detected. Consider staggering leave dates or hiring temporary support.'}
                    {result.risk_level === 'Medium' && 'Moderate impact. Monitor closely and prepare contingency plans.'}
                    {result.risk_level === 'Low' && 'Low impact. Team can handle these leaves comfortably.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
