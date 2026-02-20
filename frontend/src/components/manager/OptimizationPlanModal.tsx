import { X, TrendingUp, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { intelligenceService, OptimizationPlan } from '@/services/intelligenceService'
import { toast } from 'react-toastify'

interface OptimizationPlanModalProps {
  isOpen: boolean
  onClose: () => void
  leaveRequestId: number
}

export default function OptimizationPlanModal({ isOpen, onClose, leaveRequestId }: OptimizationPlanModalProps) {
  const [data, setData] = useState<OptimizationPlan | null>(null)
  const [loading, setLoading] = useState(false)

  const generatePlan = async () => {
    setLoading(true)
    try {
      const result = await intelligenceService.optimizeWorkload(leaveRequestId)
      setData(result)
      toast.success('Optimization plan generated')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to generate plan')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-primary-800 dark:text-slate-100">Workload Optimization</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Smart task redistribution plan</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!data ? (
            <div className="text-center py-12">
              <TrendingUp className="w-16 h-16 text-accent-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary-800 dark:text-slate-100 mb-2">Generate Optimization Plan</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Analyze current workload and generate smart redistribution recommendations
              </p>
              <button
                onClick={generatePlan}
                disabled={loading}
                className="px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white rounded-xl font-medium hover:from-accent-600 hover:to-accent-700 disabled:opacity-50 flex items-center space-x-2 mx-auto"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <TrendingUp className="w-5 h-5" />
                )}
                <span>{loading ? 'Generating...' : 'Generate Plan'}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Before/After Comparison */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 text-center">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Before</p>
                  <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">{data.before_capacity}%</p>
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-accent-500" />
                </div>
                <div className="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/30 dark:to-success-800/30 rounded-xl p-4 text-center border border-success-200 dark:border-success-800">
                  <p className="text-sm text-success-700 dark:text-success-400 mb-2">After</p>
                  <p className="text-3xl font-bold text-success-900 dark:text-success-300">{data.after_capacity}%</p>
                </div>
              </div>

              {/* Improvement */}
              <div className="bg-accent-50 dark:bg-accent-900/20 border border-accent-200 dark:border-accent-800 rounded-xl p-4 text-center">
                <p className="text-sm text-accent-700 dark:text-accent-400 mb-1">Capacity Improvement</p>
                <p className="text-2xl font-bold text-accent-900 dark:text-accent-300">+{data.improvement_percentage}%</p>
              </div>

              {/* Transfer List */}
              <div>
                <h3 className="text-lg font-semibold text-primary-800 dark:text-slate-100 mb-4">
                  Recommended Transfers ({data.transfers.length})
                </h3>
                <div className="space-y-3">
                  {data.transfers.map((transfer, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-primary-800 dark:text-slate-100">{transfer.task_title}</p>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{transfer.hours}h</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-slate-600 dark:text-slate-400">
                        <span>{transfer.from_employee}</span>
                        <ArrowRight className="w-4 h-4" />
                        <span className="text-accent-600 dark:text-accent-400 font-medium">{transfer.to_employee}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {data.transfers.length === 0 && (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No transfers needed. Workload is already balanced.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
