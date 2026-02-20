import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, AlertCircle, CheckCircle, Sparkles, ArrowLeft, Send, FileText, Clock } from 'lucide-react'
import { toast } from 'react-toastify'

interface FormData {
  type: string
  startDate: string
  endDate: string
  reason: string
  attachments?: File[]
}

export default function CreateLeaveRequest() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    type: 'vacation',
    startDate: '',
    endDate: '',
    reason: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const leaveTypes = [
    { value: 'vacation', label: 'Vacation', icon: '🏖️', color: 'from-blue-600 to-blue-700', available: 15 },
    { value: 'sick', label: 'Sick Leave', icon: '🏥', color: 'from-red-600 to-red-700', available: 10 },
    { value: 'personal', label: 'Personal', icon: '👤', color: 'from-slate-600 to-slate-700', available: 5 },
    { value: 'other', label: 'Other', icon: '📋', color: 'from-gray-600 to-gray-700', available: 3 },
  ]

  const selectedLeaveType = leaveTypes.find(t => t.value === formData.type)

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  const days = calculateDays()

  const getSmartSuggestions = () => {
    const suggestions = []
    
    if (days > 5) {
      suggestions.push({
        type: 'info',
        message: 'Extended leave detected! Consider splitting into smaller periods for better team coverage.',
      })
    }
    
    const start = new Date(formData.startDate)
    if (start) {
      const daysUntilLeave = Math.ceil((start.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      if (daysUntilLeave < 7) {
        suggestions.push({
          type: 'warning',
          message: 'Submitting with less than 7 days notice. Manager approval may take longer.',
        })
      } else if (daysUntilLeave > 30) {
        suggestions.push({
          type: 'success',
          message: '🎉 Great planning! Early submissions help with better workload management.',
        })
      }
    }

    if (selectedLeaveType && days > selectedLeaveType.available) {
      suggestions.push({
        type: 'error',
        message: `Insufficient balance! You have ${selectedLeaveType.available} days available for ${selectedLeaveType.label}.`,
      })
    }

    return suggestions
  }

  const suggestions = getSmartSuggestions()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
      toast.error('Please fill in all required fields')
      return
    }

    if (days > (selectedLeaveType?.available || 0)) {
      toast.error('Insufficient leave balance')
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success('Leave request submitted successfully! 🎉')
    setIsSubmitting(false)
    navigate('/leave/requests')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/leave/requests')}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex-1">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent mb-2">
            Create Leave Request
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Submit a new leave request for approval</p>
        </div>
      </div>

      {/* AI Smart Suggestions */}
      {suggestions.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-1 rounded-xl">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">AI Smart Suggestions</h3>
            </div>
            <div className="space-y-2">
              {suggestions.map((suggestion, index) => {
                const Icon = suggestion.type === 'success' ? CheckCircle : AlertCircle
                const colors = {
                  success: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
                  warning: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
                  error: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20',
                  info: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
                }
                return (
                  <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${colors[suggestion.type]}`}>
                    <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{suggestion.message}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
            {/* Leave Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Leave Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {leaveTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                      formData.type === type.value
                        ? `border-transparent bg-gradient-to-r ${type.color} text-white shadow-lg scale-105`
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{type.icon}</span>
                      <div className="text-left flex-1">
                        <div className={`font-semibold ${formData.type === type.value ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                          {type.label}
                        </div>
                        <div className={`text-xs ${formData.type === type.value ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                          {type.available} days left
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  End Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Reason <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="Please provide a reason for your leave request..."
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {formData.reason.length}/500 characters
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                Preview
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Summary Sidebar */}
        <div className="space-y-6">
          {/* Request Summary */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Request Summary
            </h3>
            <div className="space-y-3">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-sm text-white/70 mb-1">Leave Type</p>
                <p className="font-semibold flex items-center gap-2">
                  <span className="text-xl">{selectedLeaveType?.icon}</span>
                  {selectedLeaveType?.label}
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-sm text-white/70 mb-1">Duration</p>
                <p className="text-2xl font-bold">
                  {days} {days === 1 ? 'Day' : 'Days'}
                </p>
              </div>
              {formData.startDate && formData.endDate && (
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                  <p className="text-sm text-white/70 mb-1">Date Range</p>
                  <p className="text-sm font-medium">
                    {new Date(formData.startDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                    {' → '}
                    {new Date(formData.endDate).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              )}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
                <p className="text-sm text-white/70 mb-1">Remaining Balance</p>
                <p className="text-xl font-bold">
                  {(selectedLeaveType?.available || 0) - days} Days
                </p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Pro Tips
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Submit requests at least 7 days in advance
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Check team calendar to avoid conflicts
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Provide detailed reasons for faster approval
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                Plan leaves during off-peak periods
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Request Preview</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{selectedLeaveType?.label}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{days} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Start Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formData.startDate ? new Date(formData.startDate).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">End Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {formData.endDate ? new Date(formData.endDate).toLocaleDateString() : 'Not set'}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Reason</p>
                <p className="text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                  {formData.reason || 'No reason provided'}
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPreview(false)}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
