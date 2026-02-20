import { useEffect, useState } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import { KPICardSkeleton, ChartSkeleton } from '@/components/ui/SkeletonLoader'
import KPICard from '@/components/ui/KPICard'
import RiskIndicator from '@/components/ui/RiskIndicator'
import StatusBadge from '@/components/ui/StatusBadge'
import TeamWorkloadBarChart from '@/components/charts/TeamWorkloadBarChart'
import LeaveHistoryPanel from '@/components/manager/LeaveHistoryPanel'
import SystemMetricsModal from '@/components/manager/SystemMetricsModal'
import { 
  ClipboardList, 
  Users, 
  AlertTriangle, 
  Clock,
  TrendingUp,
  History,
  BarChart2
} from 'lucide-react'

export default function ManagerDashboard() {
  const { managerDashboard, loadingManagerDashboard, fetchManagerDashboard } = useDashboard()
  const [showLeaveHistory, setShowLeaveHistory] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)

  useEffect(() => {
    fetchManagerDashboard()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loadingManagerDashboard) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-800">Executive Dashboard</h1>
            <p className="text-slate-600 mt-2">Real-time workforce insights and operational metrics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => <KPICardSkeleton key={i} />)}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartSkeleton />
            </div>
            <ChartSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-800 to-accent-600 dark:from-accent-400 dark:to-accent-600 bg-clip-text text-transparent">Executive Dashboard</h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 ml-15">Real-time workforce insights and operational metrics</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowLeaveHistory(true)}
                className="flex items-center space-x-2 bg-accent-600 dark:bg-accent-500 text-white px-4 py-2.5 rounded-xl hover:bg-accent-700 dark:hover:bg-accent-600 transition-all shadow-md hover:shadow-lg"
              >
                <History className="w-4 h-4" />
                <span>Leave History</span>
              </button>
              <button
                onClick={() => setShowMetrics(true)}
                className="flex items-center space-x-2 bg-primary-700 dark:bg-slate-700 text-white px-4 py-2.5 rounded-xl hover:bg-primary-800 dark:hover:bg-slate-600 transition-all shadow-md hover:shadow-lg"
              >
                <BarChart2 className="w-4 h-4" />
                <span>System Metrics</span>
              </button>
            </div>
          </div>
        </div>

        {/* Executive KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Pending Approvals"
            value={managerDashboard?.pendingApprovalsCount || 0}
            subtitle="Requires immediate attention"
            icon={ClipboardList}
            trend={{ value: -12, isPositive: true }}
          />
          <KPICard
            title="Team Capacity"
            value={`${managerDashboard?.teamCapacity || 85}%`}
            subtitle="Current operational capacity"
            icon={Users}
            trend={{ value: 5, isPositive: true }}
          />
          <KPICard
            title="High-Risk Projects"
            value={managerDashboard?.highRiskProjects || 2}
            subtitle="Projects requiring attention"
            icon={AlertTriangle}
            trend={{ value: -25, isPositive: true }}
          />
          <KPICard
            title="Avg Approval Time"
            value={`${managerDashboard?.avgApprovalTime || 2.4}h`}
            subtitle="Average processing time"
            icon={Clock}
            trend={{ value: -15, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Risk Indicator */}
          <div>
            <RiskIndicator
              level={managerDashboard?.riskIndicator?.level || 'Low'}
              description={managerDashboard?.riskIndicator?.description || 'Team operations are running smoothly with minimal risk factors.'}
              details={managerDashboard?.riskIndicator?.details || [
                'All critical projects are adequately staffed',
                'Leave requests are within normal parameters',
                'No resource conflicts detected'
              ]}
            />
          </div>

          {/* Team Workload Chart */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary-800 dark:text-slate-100">Team Workload Distribution</h2>
                <div className="w-10 h-10 bg-gradient-to-br from-accent-100 to-accent-200 dark:from-accent-900/50 dark:to-accent-800/50 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent-600 dark:text-accent-400" />
                </div>
              </div>
              <TeamWorkloadBarChart
                data={managerDashboard?.teamWorkloadDistribution?.map((item) => ({
                  member: item.member,
                  tasks: item.tasks,
                })) || []}
              />
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Current task distribution shows balanced workload across team members. Monitor for potential bottlenecks during peak periods.
              </p>
            </div>
          </div>
        </div>

        {/* Active Projects */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <h2 className="text-xl font-semibold text-primary-800 dark:text-slate-100 mb-6">Active Projects Overview</h2>
          {managerDashboard?.activeProjects && managerDashboard.activeProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {managerDashboard.activeProjects.map((project, index) => (
                <div key={index} className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-100 dark:border-slate-600">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary-800 dark:text-slate-100 mb-1">{project.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{project.status}</p>
                    </div>
                    <StatusBadge status={project.risk} size="sm" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                    <span>Risk Level</span>
                    <span className="font-medium">{project.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No active projects</p>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Projects will appear here when assigned</p>
            </div>
          )}
          <p className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-500 dark:text-slate-400">
            Project risk assessment is based on resource availability, deadline proximity, and team capacity. High-risk projects require immediate attention.
          </p>
        </div>
      </div>

      {/* Intelligence Modals */}
      <LeaveHistoryPanel isOpen={showLeaveHistory} onClose={() => setShowLeaveHistory(false)} />
      <SystemMetricsModal isOpen={showMetrics} onClose={() => setShowMetrics(false)} />
    </div>
  )
}
