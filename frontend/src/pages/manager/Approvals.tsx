import { useEffect, useState } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import { KPICardSkeleton } from '@/components/ui/SkeletonLoader'
import StatusBadge from '@/components/ui/StatusBadge'
import ApprovalDrawer from '@/components/ui/ApprovalDrawer'
import ProjectRiskModal from '@/components/manager/ProjectRiskModal'
import OptimizationPlanModal from '@/components/manager/OptimizationPlanModal'
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  User,
  FileText,
  Clock,
  CheckSquare,
  AlertTriangle,
  Zap
} from 'lucide-react'
import { ApprovalFilters } from '@/services/managerService'

export default function Approvals() {
  const { pendingApprovals, loadingApprovals, fetchPendingApprovals, updateLeaveStatus, exportApprovalsCSV } = useDashboard()
  const [selectedApproval, setSelectedApproval] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [filters, setFilters] = useState<ApprovalFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [showProjectRisk, setShowProjectRisk] = useState(false)
  const [showOptimization, setShowOptimization] = useState(false)

  useEffect(() => {
    fetchPendingApprovals(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const handleAction = async (approval: any, action: string) => {
    setIsProcessing(true)
    try {
      await updateLeaveStatus(approval.id, action)
      setSelectedApproval(null)
    } catch (error) {
      // Error handled in context
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFilterChange = (key: keyof ApprovalFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({})
  }

  const handleExport = () => {
    exportApprovalsCSV(filters)
  }

  const getApprovalWithMockData = (approval: any) => {
    return {
      ...approval,
      employeeInfo: {
        department: 'Engineering',
        role: 'Senior Developer',
        leaveBalance: 15
      },
      impact: {
        teamCapacity: 78,
        projectRisk: 'Medium',
        overloadedEmployees: 2
      },
      leaveHistory: [
        { date: '2024-01-15', type: 'Vacation', status: 'Approved' },
        { date: '2024-02-20', type: 'Sick Leave', status: 'Approved' },
        { date: '2024-03-10', type: 'Personal', status: 'Rejected' }
      ]
    }
  }

  if (loadingApprovals) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-800">Approval Management</h1>
            <p className="text-slate-600 mt-2">Review and process leave requests</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => <KPICardSkeleton key={i} />)}
          </div>
          
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-slate-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const pendingCount = pendingApprovals.filter(a => a.status === 'Pending').length
  const urgentCount = pendingApprovals.filter(a => {
    const startDate = new Date(a.startDate)
    const today = new Date()
    const diffTime = startDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 3
  }).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-success-500 to-success-700 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckSquare className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-800 to-accent-600 bg-clip-text text-transparent">Approval Management</h1>
            </div>
            <p className="text-slate-600 ml-15">Review and process leave requests</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowProjectRisk(true)}
              className="flex items-center space-x-2 bg-warning-600 text-white px-4 py-2.5 rounded-xl hover:bg-warning-700 transition-all shadow-md hover:shadow-lg"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Project Risks</span>
            </button>
            <button
              onClick={() => setShowOptimization(true)}
              className="flex items-center space-x-2 bg-success-600 text-white px-4 py-2.5 rounded-xl hover:bg-success-700 transition-all shadow-md hover:shadow-lg"
            >
              <Zap className="w-4 h-4" />
              <span>Optimize Workload</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 bg-accent-600 text-white px-4 py-2.5 rounded-xl hover:bg-accent-700 transition-all shadow-md hover:shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-warning-400 to-warning-600 rounded-2xl flex items-center justify-center shadow-md">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Pending</p>
                <p className="text-2xl font-bold text-primary-800">{pendingCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-danger-400 to-danger-600 rounded-2xl flex items-center justify-center shadow-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Urgent</p>
                <p className="text-2xl font-bold text-primary-800">{urgentCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-2xl flex items-center justify-center shadow-md">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Requests</p>
                <p className="text-2xl font-bold text-primary-800">{pendingApprovals.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-success-400 to-success-600 rounded-2xl flex items-center justify-center shadow-md">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Avg Process Time</p>
                <p className="text-2xl font-bold text-primary-800">2.4h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-primary-800">Filters</h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-accent-600 hover:text-accent-700"
            >
              <Filter className="w-4 h-4" />
              <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
            </button>
          </div>
          
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Leave Type</label>
                <select
                  value={filters.leaveType || ''}
                  onChange={(e) => handleFilterChange('leaveType', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                >
                  <option value="">All Types</option>
                  <option value="Vacation">Vacation</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Personal">Personal</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Employee Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={filters.employeeSearch || ''}
                    onChange={(e) => handleFilterChange('employeeSearch', e.target.value || undefined)}
                    placeholder="Search employee..."
                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  />
                </div>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Approvals Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg overflow-hidden">
          {pendingApprovals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Date Range
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {pendingApprovals.map((approval) => {
                    const startDate = new Date(approval.startDate)
                    const today = new Date()
                    const diffTime = startDate.getTime() - today.getTime()
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                    const isUrgent = diffDays <= 3
                    
                    return (
                      <tr key={approval.id} className={`hover:bg-slate-50 ${isUrgent ? 'bg-warning-50' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center mr-3">
                              <User className="w-5 h-5 text-accent-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-primary-800">{approval.employeeName}</div>
                              {isUrgent && (
                                <div className="text-xs text-warning-600 font-medium">Urgent - {diffDays} days</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {approval.startDate} to {approval.endDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-700 rounded-full">
                            {approval.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={approval.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedApproval(getApprovalWithMockData(approval))}
                            className="text-accent-600 hover:text-accent-700 font-medium"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-500 font-medium">No pending approvals</p>
              <p className="text-sm text-slate-400 mt-1">All requests have been processed</p>
            </div>
          )}
        </div>
      </div>

      {/* Approval Drawer */}
      <ApprovalDrawer
        isOpen={!!selectedApproval}
        onClose={() => setSelectedApproval(null)}
        approval={selectedApproval}
        onApprove={() => handleAction(selectedApproval, 'Approved')}
        onReject={() => handleAction(selectedApproval, 'Rejected')}
        isProcessing={isProcessing}
      />

      {/* Intelligence Modals */}
      <ProjectRiskModal isOpen={showProjectRisk} onClose={() => setShowProjectRisk(false)} />
      <OptimizationPlanModal isOpen={showOptimization} onClose={() => setShowOptimization(false)} />
    </div>
  )
}
