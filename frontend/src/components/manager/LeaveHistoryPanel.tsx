import { X, AlertCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { intelligenceService, LeaveHistoryData } from '@/services/intelligenceService'
import { toast } from 'react-toastify'

interface LeaveHistoryPanelProps {
  isOpen: boolean
  onClose: () => void
  employeeId: number
  employeeName: string
}

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#8b5cf6']

export default function LeaveHistoryPanel({ isOpen, onClose, employeeId, employeeName }: LeaveHistoryPanelProps) {
  const [data, setData] = useState<LeaveHistoryData | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && employeeId) {
      fetchData()
    }
  }, [isOpen, employeeId])

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await intelligenceService.getEmployeeLeaveHistory(employeeId)
      setData(result)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to load leave history')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-white dark:bg-slate-900 shadow-xl overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-primary-800 dark:text-slate-100">Leave History</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{employeeName}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : data ? (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/30 rounded-2xl p-4 border border-accent-200 dark:border-accent-800">
                <p className="text-sm text-accent-700 dark:text-accent-400 font-medium">Total Leaves</p>
                <p className="text-3xl font-bold text-accent-900 dark:text-accent-300 mt-2">{data.total_leaves}</p>
              </div>
              <div className="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/30 dark:to-success-800/30 rounded-2xl p-4 border border-success-200 dark:border-success-800">
                <p className="text-sm text-success-700 dark:text-success-400 font-medium">Avg Duration</p>
                <p className="text-3xl font-bold text-success-900 dark:text-success-300 mt-2">{data.avg_leave_duration} days</p>
              </div>
            </div>

            {data.overlapping_leave_count > 0 && (
              <div className="bg-warning-50 dark:bg-warning-900/20 border border-warning-200 dark:border-warning-800 rounded-2xl p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-warning-600 dark:text-warning-400" />
                  <p className="text-sm font-medium text-warning-800 dark:text-warning-300">
                    {data.overlapping_leave_count} overlapping leave periods detected
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-primary-800 dark:text-slate-100 mb-4">Leave Types</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={data.leave_by_type} dataKey="count" nameKey="type" cx="50%" cy="50%" outerRadius={80} label>
                    {data.leave_by_type.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-primary-800 dark:text-slate-100 mb-4">Monthly Trend</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data.monthly_leave_trend}>
                  <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="leaves" stroke="#2563eb" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-primary-800 dark:text-slate-100 mb-4">Recent Leaves</h3>
              <div className="space-y-3">
                {data.last_5_leaves.map((leave) => (
                  <div key={leave.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{leave.type}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      leave.status === 'Approved' ? 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400' :
                      leave.status === 'Rejected' ? 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400' :
                      'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400'
                    }`}>
                      {leave.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
