import { useState } from 'react'
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Filter, Plus, Eye, Edit, Trash2, Download, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface LeaveRequest {
  id: string
  type: string
  startDate: string
  endDate: string
  days: number
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  reason: string
  approver?: string
  submittedDate: string
}

export default function LeaveRequests() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const leaveRequests: LeaveRequest[] = [
    {
      id: '1',
      type: 'Vacation',
      startDate: '2026-03-15',
      endDate: '2026-03-20',
      days: 5,
      status: 'approved',
      reason: 'Family vacation to Hawaii',
      approver: 'Sarah Johnson',
      submittedDate: '2026-02-10',
    },
    {
      id: '2',
      type: 'Sick Leave',
      startDate: '2026-02-25',
      endDate: '2026-02-26',
      days: 2,
      status: 'pending',
      reason: 'Medical appointment and recovery',
      submittedDate: '2026-02-20',
    },
    {
      id: '3',
      type: 'Personal',
      startDate: '2026-04-01',
      endDate: '2026-04-03',
      days: 3,
      status: 'pending',
      reason: 'Moving to new apartment',
      submittedDate: '2026-02-18',
    },
    {
      id: '4',
      type: 'Vacation',
      startDate: '2026-01-10',
      endDate: '2026-01-15',
      days: 5,
      status: 'approved',
      reason: 'Winter holiday',
      approver: 'Sarah Johnson',
      submittedDate: '2025-12-15',
    },
    {
      id: '5',
      type: 'Sick Leave',
      startDate: '2026-02-05',
      endDate: '2026-02-05',
      days: 1,
      status: 'rejected',
      reason: 'Flu symptoms',
      approver: 'Sarah Johnson',
      submittedDate: '2026-02-05',
    },
  ]

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          icon: CheckCircle,
          color: 'text-green-600 dark:text-green-400',
          bg: 'bg-green-50 dark:bg-green-900/20',
          border: 'border-green-200 dark:border-green-800',
          label: 'Approved',
        }
      case 'rejected':
        return {
          icon: XCircle,
          color: 'text-red-600 dark:text-red-400',
          bg: 'bg-red-50 dark:bg-red-900/20',
          border: 'border-red-200 dark:border-red-800',
          label: 'Rejected',
        }
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-600 dark:text-yellow-400',
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-200 dark:border-yellow-800',
          label: 'Pending',
        }
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600 dark:text-gray-400',
          bg: 'bg-gray-50 dark:bg-gray-900/20',
          border: 'border-gray-200 dark:border-gray-800',
          label: 'Cancelled',
        }
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Vacation':
        return 'from-blue-600 to-blue-700'
      case 'Sick Leave':
        return 'from-red-600 to-red-700'
      case 'Personal':
        return 'from-slate-600 to-slate-700'
      default:
        return 'from-gray-600 to-gray-700'
    }
  }

  const filteredRequests = leaveRequests.filter(req => {
    const matchesFilter = filter === 'all' || req.status === filter
    const matchesSearch = req.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         req.reason.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    total: leaveRequests.length,
    pending: leaveRequests.filter(r => r.status === 'pending').length,
    approved: leaveRequests.filter(r => r.status === 'approved').length,
    rejected: leaveRequests.filter(r => r.status === 'rejected').length,
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            Leave Requests
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your leave requests and history</p>
        </div>
        <button
          onClick={() => navigate('/leave/new')}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-medium"
        >
          <Plus className="w-5 h-5" />
          New Request
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: stats.total, color: 'from-blue-600 to-blue-700', icon: Calendar },
          { label: 'Pending', value: stats.pending, color: 'from-amber-600 to-amber-700', icon: Clock },
          { label: 'Approved', value: stats.approved, color: 'from-emerald-600 to-emerald-700', icon: CheckCircle },
          { label: 'Rejected', value: stats.rejected, color: 'from-red-600 to-red-700', icon: XCircle },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-5">
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10`} />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by type or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            {['all', 'pending', 'approved', 'rejected'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === f
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Leave Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No leave requests found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {filter !== 'all' ? `No ${filter} requests found.` : 'Start by creating your first leave request.'}
            </p>
            <button
              onClick={() => navigate('/leave/new')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-5 h-5" />
              Create Leave Request
            </button>
          </div>
        ) : (
          filteredRequests.map((request, index) => {
            const statusConfig = getStatusConfig(request.status)
            const StatusIcon = statusConfig.icon
            return (
              <div
                key={request.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden animate-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`h-2 bg-gradient-to-r ${getTypeColor(request.type)}`} />
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    {/* Left Section */}
                    <div className="flex-1 min-w-[250px]">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`bg-gradient-to-r ${getTypeColor(request.type)} p-2 rounded-lg`}>
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{request.type}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {request.days} {request.days === 1 ? 'day' : 'days'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">
                            Submitted on {new Date(request.submittedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                        <span className="font-medium">Reason: </span>
                        {request.reason}
                      </p>

                      {request.approver && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {request.status === 'approved' ? 'Approved' : 'Reviewed'} by {request.approver}
                        </p>
                      )}
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-end gap-3">
                      {/* Status Badge */}
                      <div className={`flex items-center gap-2 px-4 py-2 ${statusConfig.bg} ${statusConfig.border} border-2 rounded-lg`}>
                        <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                        <span className={`font-semibold text-sm ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {request.status === 'pending' && (
                          <>
                            <button
                              className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
