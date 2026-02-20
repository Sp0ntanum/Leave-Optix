import { useState, useEffect } from 'react'
import { rulesService, AutoApprovalRule, RuleFormData } from '@/services/rulesService'
import { toast } from 'react-toastify'
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Settings } from 'lucide-react'

export default function AutoApprovalRules() {
  const [rules, setRules] = useState<AutoApprovalRule[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingRule, setEditingRule] = useState<AutoApprovalRule | null>(null)
  const [formData, setFormData] = useState<RuleFormData>({
    name: '',
    description: '',
    leave_type: '',
    max_duration_days: undefined,
    min_notice_days: undefined,
    max_team_absence_percent: undefined,
    min_leave_balance: undefined,
    priority: 1
  })

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      const data = await rulesService.getRules()
      setRules(data.rules)
    } catch (error) {
      toast.error('Failed to load rules')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingRule) {
        await rulesService.updateRule(editingRule.id, formData)
        toast.success('Rule updated successfully')
      } else {
        await rulesService.createRule(formData)
        toast.success('Rule created successfully')
      }
      setShowModal(false)
      resetForm()
      fetchRules()
    } catch (error) {
      toast.error('Failed to save rule')
    }
  }

  const handleEdit = (rule: AutoApprovalRule) => {
    setEditingRule(rule)
    setFormData({
      name: rule.name,
      description: rule.description,
      leave_type: rule.leave_type,
      max_duration_days: rule.max_duration_days,
      min_notice_days: rule.min_notice_days,
      max_team_absence_percent: rule.max_team_absence_percent,
      min_leave_balance: rule.min_leave_balance,
      priority: rule.priority
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this rule?')) return
    try {
      await rulesService.deleteRule(id)
      toast.success('Rule deleted successfully')
      fetchRules()
    } catch (error) {
      toast.error('Failed to delete rule')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      leave_type: '',
      max_duration_days: undefined,
      min_notice_days: undefined,
      max_team_absence_percent: undefined,
      min_leave_balance: undefined,
      priority: 1
    })
    setEditingRule(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded-xl w-1/3"></div>
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-800 to-accent-600 dark:from-accent-400 dark:to-accent-600 bg-clip-text text-transparent">Auto-Approval Rules</h1>
            </div>
            <p className="text-slate-600 dark:text-slate-400 ml-15">Configure automatic leave approval conditions</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true) }}
            className="flex items-center space-x-2 bg-accent-600 dark:bg-accent-500 text-white px-4 py-2.5 rounded-xl hover:bg-accent-700 dark:hover:bg-accent-600 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create Rule</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {rules.length === 0 ? (
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-12 text-center shadow-lg">
              <Settings className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No rules configured</h3>
              <p className="text-slate-500 dark:text-slate-400 mb-4">Create your first auto-approval rule to automate leave approvals</p>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center space-x-2 bg-accent-600 text-white px-4 py-2 rounded-lg hover:bg-accent-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create Rule</span>
              </button>
            </div>
          ) : (
            rules.map((rule) => (
              <div key={rule.id} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-primary-800 dark:text-slate-100">{rule.name}</h3>
                      <span className="px-2 py-1 text-xs font-medium bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-400 rounded-full">
                        Priority {rule.priority}
                      </span>
                    </div>
                    {rule.description && (
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{rule.description}</p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(rule)}
                      className="p-2 text-accent-600 dark:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id)}
                      className="p-2 text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                  {rule.leave_type && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Leave Type</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{rule.leave_type}</p>
                    </div>
                  )}
                  {rule.max_duration_days && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Max Duration</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{rule.max_duration_days} days</p>
                    </div>
                  )}
                  {rule.min_notice_days && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Min Notice</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{rule.min_notice_days} days</p>
                    </div>
                  )}
                  {rule.max_team_absence_percent && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Max Team Absence</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{rule.max_team_absence_percent}%</p>
                    </div>
                  )}
                  {rule.min_leave_balance && (
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Min Balance</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{rule.min_leave_balance} days</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold text-primary-800 dark:text-slate-100">
                {editingRule ? 'Edit Rule' : 'Create New Rule'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Rule Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent-500 dark:bg-slate-700 dark:text-slate-100"
                  placeholder="e.g., Auto-approve short notice leaves"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent-500 dark:bg-slate-700 dark:text-slate-100"
                  rows={2}
                  placeholder="Describe when this rule applies"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Leave Type</label>
                  <select
                    value={formData.leave_type}
                    onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent-500 dark:bg-slate-700 dark:text-slate-100"
                  >
                    <option value="">All Types</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Personal">Personal</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Priority</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent-500 dark:bg-slate-700 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Max Duration (days)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_duration_days || ''}
                    onChange={(e) => setFormData({ ...formData, max_duration_days: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent-500 dark:bg-slate-700 dark:text-slate-100"
                    placeholder="e.g., 5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Min Notice (days)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.min_notice_days || ''}
                    onChange={(e) => setFormData({ ...formData, min_notice_days: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent-500 dark:bg-slate-700 dark:text-slate-100"
                    placeholder="e.g., 7"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Max Team Absence (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.max_team_absence_percent || ''}
                    onChange={(e) => setFormData({ ...formData, max_team_absence_percent: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent-500 dark:bg-slate-700 dark:text-slate-100"
                    placeholder="e.g., 30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Min Leave Balance (days)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.min_leave_balance || ''}
                    onChange={(e) => setFormData({ ...formData, min_leave_balance: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-accent-500 dark:bg-slate-700 dark:text-slate-100"
                    placeholder="e.g., 5"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm() }}
                  className="px-4 py-2 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors"
                >
                  {editingRule ? 'Update Rule' : 'Create Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
