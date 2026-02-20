import { X, AlertTriangle, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { intelligenceService, WorkloadAnalysisData } from '@/services/intelligenceService'
import { toast } from 'react-toastify'

interface WorkloadAnalysisPanelProps {
  isOpen: boolean
  onClose: () => void
  employeeId: number
  employeeName: string
}

export default function WorkloadAnalysisPanel({ isOpen, onClose, employeeId, employeeName }: WorkloadAnalysisPanelProps) {
  const [data, setData] = useState<WorkloadAnalysisData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && employeeId) {
      fetchData()
    }
  }, [isOpen, employeeId])

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await intelligenceService.getEmployeeWorkloadAnalysis(employeeId)
      setData(result)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to load workload analysis')
    } finally {
      setLoading(false)
    }
  }

  const getBurnoutColor = (risk: string) => {
    if (risk === 'High') return 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400 border-danger-200 dark:border-danger-800'
    if (risk === 'Medium') return 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400 border-warning-200 dark:border-warning-800'
    return 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400 border-success-200 dark:border-success-800'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-slate-900 shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary-800 dark:text-slate-100">Workload Analysis</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{employeeName}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : data ? (
          <div className="p-6 space-y-6">
            {/* Capacity Gauge */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-primary-800 dark:text-slate-100 mb-4">Capacity Utilization</h3>
              <div className="flex items-center justify-center">
                <div className="relative w-48 h-48">
                  <svg className="transform -rotate-90 w-48 h-48">
                    <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="none" className="text-slate-200 dark:text-slate-700" />
                    <circle 
                      cx="96" 
                      cy="96" 
                      r="80" 
                      stroke="currentColor" 
                      strokeWidth="12" 
                      fill="none" 
                      strokeDasharray={`${2 * Math.PI * 80}`}
                      strokeDashoffset={`${2 * Math.PI * 80 * (1 - data.workload_percentage / 100)}`}
                      className={`${
                        data.workload_percentage > 85 ? 'text-danger-500' :
                        data.workload_percentage > 70 ? 'text-warning-500' :
                        'text-success-500'
                      } transition-all duration-1000`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-4xl font-bold text-primary-800 dark:text-slate-100">{data.workload_percentage}%</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Capacity</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Burnout Risk Badge */}
            <div className={`rounded-2xl p-6 border ${getBurnoutColor(data.burnout_risk)}`}>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Burnout Risk: {data.burnout_risk}</p>
                  <p className="text-sm mt-1">
                    {data.burnout_risk === 'High' && 'Immediate action required. Consider workload redistribution.'}
                    {data.burnout_risk === 'Medium' && 'Monitor closely. May need support soon.'}
                    {data.burnout_risk === 'Low' && 'Workload is manageable and sustainable.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Task Breakdown */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-primary-800 dark:text-slate-100 mb-4">Task Breakdown</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <p className="text-3xl font-bold text-accent-600 dark:text-accent-400">{data.total_tasks}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Total Tasks</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <p className="text-3xl font-bold text-danger-600 dark:text-danger-400">{data.high_priority_tasks}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">High Priority</p>
                </div>
                <div className="text-center p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
                  <p className="text-3xl font-bold text-success-600 dark:text-success-400">{data.avg_weekly_hours}h</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Avg Weekly</p>
                </div>
              </div>
            </div>

            {/* 4-Week Trend */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-primary-800 dark:text-slate-100 mb-4">4-Week Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.last_4_week_trend}>
                  <XAxis dataKey="week" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="tasks" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                Consistent high task counts may indicate sustained pressure. Consider balancing workload.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
