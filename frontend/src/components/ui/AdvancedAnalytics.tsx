import { BarChart3, Download, FileSpreadsheet, FileText, TrendingUp, Users } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function AdvancedAnalytics() {
  const [timeRange, setTimeRange] = useState('month')
  const [isExporting, setIsExporting] = useState(false)
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0])
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading and animate numbers
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [timeRange])

  useEffect(() => {
    if (!isLoading) {
      const targets = [68, 87, 94, 2.4]
      const duration = 1500
      const steps = 60
      const increment = duration / steps

      let currentStep = 0
      const interval = setInterval(() => {
        currentStep++
        const progress = currentStep / steps
        setAnimatedStats(targets.map(target => Math.floor(target * progress * 10) / 10))
        
        if (currentStep >= steps) {
          setAnimatedStats(targets)
          clearInterval(interval)
        }
      }, increment)

      return () => clearInterval(interval)
    }
  }, [isLoading])

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsExporting(true)
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Create a download (simulated)
    const blob = new Blob([`Leave Analytics Report - ${format.toUpperCase()}`], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `leave-analytics-${Date.now()}.${format === 'excel' ? 'xlsx' : format}`
    a.click()
    window.URL.revokeObjectURL(url)
    
    setIsExporting(false)
  }

  const stats = [
    {
      label: 'Leave Utilization',
      value: `${animatedStats[0]}%`,
      change: '+12%',
      color: 'bg-blue-600',
    },
    {
      label: 'Team Availability',
      value: `${animatedStats[1]}%`,
      change: '+5%',
      color: 'bg-emerald-600',
    },
    {
      label: 'Approval Rate',
      value: `${animatedStats[2]}%`,
      change: '+3%',
      color: 'bg-purple-600',
    },
    {
      label: 'Avg Response Time',
      value: `${animatedStats[3]}h`,
      change: '-18%',
      color: 'bg-amber-600',
    },
  ]

  const leaveTypes = [
    { name: 'Vacation', value: 45, color: 'bg-blue-600' },
    { name: 'Sick Leave', value: 25, color: 'bg-rose-600' },
    { name: 'Personal', value: 20, color: 'bg-purple-600' },
    { name: 'Other', value: 10, color: 'bg-slate-500' },
  ]

  const monthlyTrends = [
    { month: 'Jan', leaves: 12, approved: 10 },
    { month: 'Feb', leaves: 15, approved: 14 },
    { month: 'Mar', leaves: 18, approved: 16 },
    { month: 'Apr', leaves: 22, approved: 20 },
    { month: 'May', leaves: 25, approved: 24 },
    { month: 'Jun', leaves: 30, approved: 28 },
  ]

  return (
    <div className="space-y-8">
      {/* Header with Export Options */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                Analytics Overview
              </h3>
              <p className="text-white/80 text-sm mt-1">Track leave patterns and team metrics</p>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-white/20 p-1.5 rounded-lg">
            {['week', 'month', 'quarter', 'year'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 mt-5">
          <span className="text-white/70 text-sm mr-1">Export:</span>
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            <FileText className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={() => handleExport('excel')}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded">
                {stat.change}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Types Distribution */}
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
          <h4 className="text-lg font-semibold mb-5 text-gray-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Leave Types
          </h4>
          <div className="space-y-4">
            {leaveTypes.map((type) => (
              <div key={type.name}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{type.name}</span>
                  <span className="text-gray-600 dark:text-gray-400">{type.value}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full ${type.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: isLoading ? '0%' : `${type.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trends */}
        <div className="p-6 rounded-xl bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
          <h4 className="text-lg font-semibold mb-5 text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Monthly Trends
          </h4>
          <div className="flex items-end justify-between h-48 gap-2">
            {monthlyTrends.map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full h-full flex flex-col-reverse gap-1 items-center">
                  <div
                    className="w-full bg-amber-500 rounded-t transition-all duration-1000 hover:bg-amber-600 cursor-pointer"
                    style={{ height: isLoading ? '0px' : `${((item.leaves - item.approved) / 30) * 192}px` }}
                    title={`Pending: ${item.leaves - item.approved}`}
                  />
                  <div
                    className="w-full bg-blue-600 rounded-t transition-all duration-1000 hover:bg-blue-700 cursor-pointer"
                    style={{ height: isLoading ? '0px' : `${(item.approved / 30) * 192}px` }}
                    title={`Approved: ${item.approved}`}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-5 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded" />
              <span className="text-gray-600 dark:text-gray-400">Approved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded" />
              <span className="text-gray-600 dark:text-gray-400">Pending</span>
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="p-8 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-bold">Quick Stats</h4>
            <p className="text-white/80 text-sm">Current period performance</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/15 p-5 rounded-lg hover:bg-white/20 transition-colors">
            <p className="text-3xl font-bold mb-1">
              {animatedStats[2]}%
            </p>
            <p className="text-sm text-white/80">Approval Rate</p>
          </div>
          <div className="bg-white/15 p-5 rounded-lg hover:bg-white/20 transition-colors">
            <p className="text-3xl font-bold mb-1">
              {animatedStats[3]}h
            </p>
            <p className="text-sm text-white/80">Avg Response Time</p>
          </div>
          <div className="bg-white/15 p-5 rounded-lg hover:bg-white/20 transition-colors">
            <p className="text-3xl font-bold mb-1">
              {animatedStats[1]}%
            </p>
            <p className="text-sm text-white/80">Team Availability</p>
          </div>
        </div>
      </div>
    </div>
  )
}
