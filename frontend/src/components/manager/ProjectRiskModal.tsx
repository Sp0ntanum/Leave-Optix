import { X, AlertTriangle, Calendar, Users } from 'lucide-react'
import { useState, useEffect } from 'react'
import { intelligenceService, ProjectRisk } from '@/services/intelligenceService'
import { toast } from 'react-toastify'

interface ProjectRiskModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProjectRiskModal({ isOpen, onClose }: ProjectRiskModalProps) {
  const [data, setData] = useState<ProjectRisk[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchData()
    }
  }, [isOpen])

  const fetchData = async () => {
    setLoading(true)
    try {
      const result = await intelligenceService.getProjectRiskAnalysis()
      setData(result)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to load project risks')
    } finally {
      setLoading(false)
    }
  }

  const getRiskBadge = (risk: string) => {
    if (risk === 'High') return 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-400'
    if (risk === 'Medium') return 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-400'
    return 'bg-success-100 dark:bg-success-900/30 text-success-700 dark:text-success-400'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-2xl font-bold text-primary-800 dark:text-slate-100">Project Risk Analysis</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Team availability and deadline assessment</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-slate-200 dark:bg-slate-700 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : data.length > 0 ? (
            <div className="space-y-4">
              {data.map((project) => (
                <div key={project.project_id} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-primary-800 dark:text-slate-100">{project.project_name}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(project.deadline).toLocaleDateString()}</span>
                        </div>
                        <div className={`flex items-center space-x-1 ${
                          project.days_remaining < 7 ? 'text-danger-600 dark:text-danger-400 font-semibold' : ''
                        }`}>
                          <AlertTriangle className="w-4 h-4" />
                          <span>{project.days_remaining} days remaining</span>
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRiskBadge(project.risk_level)}`}>
                      {project.risk_level} Risk
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="bg-white dark:bg-slate-700 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">Team Availability</span>
                        </div>
                        <span className={`text-lg font-bold ${
                          project.team_availability < 70 ? 'text-danger-600 dark:text-danger-400' :
                          project.team_availability < 85 ? 'text-warning-600 dark:text-warning-400' :
                          'text-success-600 dark:text-success-400'
                        }`}>
                          {project.team_availability}%
                        </span>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-700 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600 dark:text-slate-400">On Leave</span>
                        <span className="text-lg font-bold text-primary-800 dark:text-slate-100">
                          {project.contributing_leaves} {project.contributing_leaves === 1 ? 'person' : 'people'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No active projects found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
