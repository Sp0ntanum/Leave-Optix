import { X, User, Calendar, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useState } from 'react'

interface ApprovalDrawerProps {
  isOpen: boolean
  onClose: () => void
  approval: {
    id: number
    employeeName: string
    startDate: string
    endDate: string
    type: string
    reason: string
    status: string
    employeeInfo?: {
      department: string
      role: string
      leaveBalance: number
    }
    impact?: {
      teamCapacity: number
      projectRisk: string
      overloadedEmployees: number
    }
    leaveHistory?: Array<{
      date: string
      type: string
      status: string
    }>
  }
  onApprove: () => void
  onReject: () => void
  isProcessing: boolean
}

export default function ApprovalDrawer({ 
  isOpen, 
  onClose, 
  approval, 
  onApprove, 
  onReject, 
  isProcessing 
}: ApprovalDrawerProps) {
  const [showImpact, setShowImpact] = useState(false)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-primary-800">Leave Request Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Employee Info */}
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-accent-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-accent-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-800">{approval.employeeName}</h3>
                  <p className="text-sm text-slate-500">
                    {approval.employeeInfo?.role} • {approval.employeeInfo?.department}
                  </p>
                </div>
              </div>
              <div className="text-sm text-slate-600">
                <p>Leave Balance: <span className="font-medium">{approval.employeeInfo?.leaveBalance || 0} days</span></p>
              </div>
            </div>

            {/* Leave Details */}
            <div>
              <h4 className="font-semibold text-primary-800 mb-3">Leave Details</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">
                    {approval.startDate} to {approval.endDate}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{approval.type}</span>
                </div>
                <div className="mt-3">
                  <p className="text-sm font-medium text-slate-700 mb-1">Reason:</p>
                  <p className="text-sm text-slate-600 bg-white p-3 rounded-lg border">
                    {approval.reason}
                  </p>
                </div>
              </div>
            </div>

            {/* Impact Preview */}
            {approval.impact && (
              <div>
                <button
                  onClick={() => setShowImpact(!showImpact)}
                  className="flex items-center justify-between w-full p-3 bg-warning-50 rounded-lg border border-warning-200"
                >
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-warning-600" />
                    <span className="font-medium text-warning-800">Impact Preview</span>
                  </div>
                  <span className="text-sm text-warning-600">
                    {showImpact ? 'Hide' : 'Show'}
                  </span>
                </button>
                
                {showImpact && (
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Team Capacity:</span>
                      <span className="font-medium">{approval.impact.teamCapacity}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Project Risk:</span>
                      <span className={`font-medium ${
                        approval.impact.projectRisk === 'High' ? 'text-danger-600' : 
                        approval.impact.projectRisk === 'Medium' ? 'text-warning-600' : 'text-success-600'
                      }`}>
                        {approval.impact.projectRisk}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Overloaded Employees:</span>
                      <span className="font-medium">{approval.impact.overloadedEmployees}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Leave History */}
            {approval.leaveHistory && approval.leaveHistory.length > 0 && (
              <div>
                <h4 className="font-semibold text-primary-800 mb-3">Recent Leave History</h4>
                <div className="space-y-2">
                  {approval.leaveHistory.slice(0, 3).map((leave, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{leave.type}</p>
                        <p className="text-xs text-slate-500">{leave.date}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        leave.status === 'Approved' ? 'bg-success-100 text-success-700' :
                        leave.status === 'Rejected' ? 'bg-danger-100 text-danger-700' :
                        'bg-warning-100 text-warning-700'
                      }`}>
                        {leave.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-slate-200 p-6">
            <div className="flex space-x-3">
              <button
                onClick={onApprove}
                disabled={isProcessing}
                className="flex-1 bg-success-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-success-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                <span>Approve</span>
              </button>
              <button
                onClick={onReject}
                disabled={isProcessing}
                className="flex-1 bg-danger-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-danger-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}