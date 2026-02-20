import { useEffect, useState } from 'react'
import { useDashboard } from '@/context/DashboardContext'
import { ChartSkeleton } from '@/components/ui/SkeletonLoader'
import TeamWorkloadBarChart from '@/components/charts/TeamWorkloadBarChart'
import LeaveStatusPieChart from '@/components/charts/LeaveStatusPieChart'
import LeaveTrendsLineChart from '@/components/charts/LeaveTrendsLineChart'
import WorkloadHeatmap from '@/components/charts/WorkloadHeatmap'
import WorkloadAnalysisPanel from '@/components/manager/WorkloadAnalysisPanel'
import WhatIfSimulator from '@/components/manager/WhatIfSimulator'
import { BarChart3, PieChart, TrendingUp, Grid3X3, Activity, Lightbulb } from 'lucide-react'

export default function WorkloadVisualization() {
  const { workloadVisualization, loadingWorkload, fetchWorkloadVisualization } = useDashboard()
  const [showWorkloadAnalysis, setShowWorkloadAnalysis] = useState(false)
  const [showWhatIf, setShowWhatIf] = useState(false)

  useEffect(() => {
    fetchWorkloadVisualization()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loadingWorkload) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary-800">Workload Analytics</h1>
            <p className="text-slate-600 mt-2">Comprehensive workforce capacity and performance insights</p>
          </div>
          
          <div className="space-y-8">
            <ChartSkeleton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
            <ChartSkeleton />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-700 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-800 to-accent-600 bg-clip-text text-transparent">Workload Analytics</h1>
              </div>
              <p className="text-slate-600 ml-15">Comprehensive workforce capacity and performance insights</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowWorkloadAnalysis(true)}
                className="flex items-center space-x-2 bg-accent-600 text-white px-4 py-2.5 rounded-xl hover:bg-accent-700 transition-all shadow-md hover:shadow-lg"
              >
                <Activity className="w-4 h-4" />
                <span>Workload Analysis</span>
              </button>
              <button
                onClick={() => setShowWhatIf(true)}
                className="flex items-center space-x-2 bg-primary-700 text-white px-4 py-2.5 rounded-xl hover:bg-primary-800 transition-all shadow-md hover:shadow-lg"
              >
                <Lightbulb className="w-4 h-4" />
                <span>What-If Simulator</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Workload Heatmap */}
          <WorkloadHeatmap data={workloadVisualization?.heatmapData || []} />

          {/* Task Distribution and Team Capacity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-xl flex items-center justify-center shadow-md">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-primary-800">Task Distribution by Team Member</h2>
              </div>
              <TeamWorkloadBarChart data={workloadVisualization?.taskDistribution || []} />
              <div className="mt-6 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Task distribution analysis reveals workload balance across team members. Significant variations may indicate need for task redistribution or additional resources.
                </p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-success-400 to-success-600 rounded-xl flex items-center justify-center shadow-md">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-primary-800">Team Capacity Status</h2>
              </div>
              <LeaveStatusPieChart data={workloadVisualization?.teamCapacity || []} />
              <div className="mt-6 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-500">
                  Current team availability breakdown provides insight into resource allocation. Monitor capacity trends to ensure optimal project staffing.
                </p>
              </div>
            </div>
          </div>

          {/* Leave Trends */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-warning-400 to-warning-600 rounded-xl flex items-center justify-center shadow-md">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-primary-800">Leave Trends Over Time</h2>
            </div>
            <LeaveTrendsLineChart data={workloadVisualization?.leaveOverlap || []} />
            <div className="mt-6 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-500">
                Historical leave patterns help predict future resource constraints. Peak leave periods typically occur during holidays and summer months, requiring proactive planning.
              </p>
            </div>
          </div>

          {/* Key Insights Summary */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-primary-800 mb-4">Key Insights & Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-accent-50 to-accent-100 rounded-xl p-4 border border-accent-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-accent-500 rounded-full shadow-sm"></div>
                  <h4 className="font-medium text-primary-800">Workload Balance</h4>
                </div>
                <p className="text-sm text-slate-600">
                  Team workload is generally balanced with minor variations. Consider redistributing tasks from high-load members to optimize efficiency.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-warning-50 to-warning-100 rounded-xl p-4 border border-warning-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-warning-500 rounded-full shadow-sm"></div>
                  <h4 className="font-medium text-primary-800">Capacity Planning</h4>
                </div>
                <p className="text-sm text-slate-600">
                  Current team capacity is at 78%. Monitor upcoming leave requests to maintain adequate coverage for critical projects.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-success-50 to-success-100 rounded-xl p-4 border border-success-200 shadow-sm">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-2 h-2 bg-success-500 rounded-full shadow-sm"></div>
                  <h4 className="font-medium text-primary-800">Leave Patterns</h4>
                </div>
                <p className="text-sm text-slate-600">
                  Leave requests show seasonal patterns. Plan resource allocation 2-3 months ahead during peak vacation periods.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Intelligence Modals */}
      <WorkloadAnalysisPanel isOpen={showWorkloadAnalysis} onClose={() => setShowWorkloadAnalysis(false)} />
      <WhatIfSimulator isOpen={showWhatIf} onClose={() => setShowWhatIf(false)} />
    </div>
  )
}
