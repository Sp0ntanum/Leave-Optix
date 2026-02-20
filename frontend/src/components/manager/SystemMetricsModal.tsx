import { X, FileText, CheckCircle, Clock, Calendar, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { intelligenceService, SystemMetrics } from '@/services/intelligenceService'
import { toast } from 'react-toastify'

interface SystemMetricsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SystemMetricsModal({ isOpen, onClose }: SystemMetricsModalProps) {
  const [data, setData] = useState<SystemMetrics | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await intelligenceService.getSystemMetrics()
      setData(result)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to load system metrics')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-primary-800 dark:text-slate-100">System Metrics</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Platform-wide analytics and insights</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : data ? (
            <div className="grid grid-cols-2 gap-6">
              {/* Total Requests */}
              <div className="bg-gradient-to-br from-accent-50 to-accent-100 dark:from-accent-900/30 dark:to-accent-800/30 rounded-2xl p-6 border border-accent-200 dark:border-accent-800">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-accent-500 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-accent-700 dark:text-accent-400 font-medium">Total Requests</p>
                    <p className="text-3xl font-bold text-accent-900 dark:text-accent-300">{data.total_leave_requests}</p>
                  </div>
                </div>
                <p className="text-xs text-accent-600 dark:text-accent-400">All-time leave requests</p>
              </div>

              {/* Auto-Approved */}
              <div className="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/30 dark:to-success-800/30 rounded-2xl p-6 border border-success-200 dark:border-success-800">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-success-500 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-success-700 dark:text-success-400 font-medium">Auto-Approved</p>
                    <p className="text-3xl font-bold text-success-900 dark:text-success-300">{data.auto_approved_percentage}%</p>
                  </div>
                </div>
                <p className="text-xs text-success-600 dark:text-success-400">Automated approval rate</p>
              </div>

              {/* Response Time */}
              <div className="bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/30 dark:to-warning-800/30 rounded-2xl p-6 border border-warning-200 dark:border-warning-800">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-warning-500 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-warning-700 dark:text-warning-400 font-medium">Avg Response Time</p>
                    <p className="text-3xl font-bold text-warning-900 dark:text-warning-300">{data.avg_response_time}h</p>
                  </div>
                </div>
                <p className="text-xs text-warning-600 dark:text-warning-400">Average processing time</p>
              </div>

              {/* Peak Leave Day */}
              <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/30 dark:to-primary-800/30 rounded-2xl p-6 border border-primary-200 dark:border-primary-800">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-primary-700 dark:text-primary-400 font-medium">Peak Leave Day</p>
                    <p className="text-lg font-bold text-primary-900 dark:text-primary-300">
                      {data.peak_leave_day ? new Date(data.peak_leave_day).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-primary-600 dark:text-primary-400">{data.peak_leave_count} requests on this day</p>
              </div>

              {/* Most Overloaded */}
              <div className="col-span-2 bg-gradient-to-br from-danger-50 to-danger-100 dark:from-danger-900/30 dark:to-danger-800/30 rounded-2xl p-6 border border-danger-200 dark:border-danger-800">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-12 h-12 bg-danger-500 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-danger-700 dark:text-danger-400 font-medium">Most Overloaded Employee</p>
                    <p className="text-2xl font-bold text-danger-900 dark:text-danger-300">{data.most_overloaded_employee}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-4xl font-bold text-danger-900 dark:text-danger-300">{data.overload_task_count}</p>
                    <p className="text-xs text-danger-600 dark:text-danger-400">Active tasks</p>
                  </div>
                </div>
                <p className="text-xs text-danger-600 dark:text-danger-400">Consider workload redistribution</p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
