interface WorkloadHeatmapProps {
  data: Array<{
    employee: string
    workload: {
      monday: number
      tuesday: number
      wednesday: number
      thursday: number
      friday: number
    }
  }>
}

const mockData = [
  {
    employee: 'John Smith',
    workload: { monday: 85, tuesday: 70, wednesday: 95, thursday: 60, friday: 80 }
  },
  {
    employee: 'Alice Johnson',
    workload: { monday: 60, tuesday: 75, wednesday: 65, thursday: 90, friday: 70 }
  },
  {
    employee: 'Bob Wilson',
    workload: { monday: 90, tuesday: 85, wednesday: 80, thursday: 95, friday: 85 }
  },
  {
    employee: 'Sarah Davis',
    workload: { monday: 70, tuesday: 65, wednesday: 75, thursday: 70, friday: 60 }
  }
]

export default function WorkloadHeatmap({ data }: WorkloadHeatmapProps) {
  const heatmapData = data && data.length > 0 ? data : mockData
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

  const getWorkloadColor = (workload: number) => {
    if (workload >= 90) return 'bg-gradient-to-br from-danger-500 to-danger-600 text-white shadow-md'
    if (workload >= 75) return 'bg-gradient-to-br from-warning-400 to-warning-500 text-white shadow-sm'
    if (workload >= 50) return 'bg-gradient-to-br from-accent-300 to-accent-400 text-white shadow-sm'
    return 'bg-gradient-to-br from-accent-100 to-accent-200 text-accent-800'
  }

  const getWorkloadLabel = (workload: number) => {
    if (workload >= 90) return 'Critical'
    if (workload >= 75) return 'High'
    if (workload >= 50) return 'Normal'
    return 'Low'
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-primary-800">Team Workload Heatmap</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gradient-to-br from-accent-100 to-accent-200 rounded shadow-sm"></div>
            <span className="text-slate-500 font-medium">Low</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gradient-to-br from-accent-300 to-accent-400 rounded shadow-sm"></div>
            <span className="text-slate-500 font-medium">Normal</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gradient-to-br from-warning-400 to-warning-500 rounded shadow-sm"></div>
            <span className="text-slate-500 font-medium">High</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gradient-to-br from-danger-500 to-danger-600 rounded shadow-sm"></div>
            <span className="text-slate-500 font-medium">Critical</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            <div className="font-medium text-sm text-slate-600 p-3">Employee</div>
            {days.map((day) => (
              <div key={day} className="font-medium text-sm text-slate-600 p-3 text-center">
                {day.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Data Rows */}
          <div className="space-y-2">
            {heatmapData.map((employee, index) => (
              <div key={index} className="grid grid-cols-6 gap-2">
                <div className="p-3 text-sm font-medium text-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200">
                  {employee.employee}
                </div>
                <div className={`p-3 text-center text-sm font-bold rounded-lg transition-transform hover:scale-105 ${getWorkloadColor(employee.workload.monday)}`}>
                  {employee.workload.monday}%
                </div>
                <div className={`p-3 text-center text-sm font-bold rounded-lg transition-transform hover:scale-105 ${getWorkloadColor(employee.workload.tuesday)}`}>
                  {employee.workload.tuesday}%
                </div>
                <div className={`p-3 text-center text-sm font-bold rounded-lg transition-transform hover:scale-105 ${getWorkloadColor(employee.workload.wednesday)}`}>
                  {employee.workload.wednesday}%
                </div>
                <div className={`p-3 text-center text-sm font-bold rounded-lg transition-transform hover:scale-105 ${getWorkloadColor(employee.workload.thursday)}`}>
                  {employee.workload.thursday}%
                </div>
                <div className={`p-3 text-center text-sm font-bold rounded-lg transition-transform hover:scale-105 ${getWorkloadColor(employee.workload.friday)}`}>
                  {employee.workload.friday}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200">
        <p className="text-sm text-slate-500">
          Workload distribution shows capacity utilization across the week. Critical levels (90%+) indicate potential burnout risk and need immediate attention.
        </p>
      </div>
    </div>
  )
}