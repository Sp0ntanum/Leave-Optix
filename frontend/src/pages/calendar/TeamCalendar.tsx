import { useState } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, Download, Filter, User } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  avatar: string
  role: string
  color: string
}

interface LeaveEvent {
  id: string
  userId: string
  userName: string
  type: string
  startDate: Date
  endDate: Date
  status: 'approved' | 'pending'
  color: string
}

export default function TeamCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1)) // March 2026
  const [view, setView] = useState<'month' | 'week'>('month')
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'pending'>('all')

  const teamMembers: TeamMember[] = [
    { id: '1', name: 'Demo User', avatar: 'DU', role: 'Employee', color: 'from-blue-600 to-blue-700' },
    { id: '2', name: 'Sarah Johnson', avatar: 'SJ', role: 'Manager', color: 'from-sky-600 to-sky-700' },
    { id: '3', name: 'Michael Chen', avatar: 'MC', role: 'Developer', color: 'from-emerald-600 to-emerald-700' },
    { id: '4', name: 'Emma Wilson', avatar: 'EW', role: 'Designer', color: 'from-amber-600 to-amber-700' },
    { id: '5', name: 'James Brown', avatar: 'JB', role: 'Developer', color: 'from-slate-600 to-slate-700' },
  ]

  const leaveEvents: LeaveEvent[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Demo User',
      type: 'Vacation',
      startDate: new Date(2026, 2, 15),
      endDate: new Date(2026, 2, 20),
      status: 'approved',
      color: 'bg-blue-500',
    },
    {
      id: '2',
      userId: '3',
      userName: 'Michael Chen',
      type: 'Sick Leave',
      startDate: new Date(2026, 2, 10),
      endDate: new Date(2026, 2, 11),
      status: 'approved',
      color: 'bg-red-500',
    },
    {
      id: '3',
      userId: '4',
      userName: 'Emma Wilson',
      type: 'Personal',
      startDate: new Date(2026, 2, 5),
      endDate: new Date(2026, 2, 7),
      status: 'pending',
      color: 'bg-yellow-500',
    },
    {
      id: '4',
      userId: '5',
      userName: 'James Brown',
      type: 'Vacation',
      startDate: new Date(2026, 2, 22),
      endDate: new Date(2026, 2, 28),
      status: 'approved',
      color: 'bg-purple-500',
    },
  ]

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()
    
    return { daysInMonth, startingDayOfWeek, firstDay, lastDay }
  }

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate)

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const isDateInRange = (date: Date, start: Date, end: Date) => {
    return date >= start && date <= end
  }

  const getEventsForDate = (date: Date) => {
    return leaveEvents.filter(event => {
      if (filterStatus !== 'all' && event.status !== filterStatus) return false
      return isDateInRange(date, event.startDate, event.endDate)
    })
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const totalLeaves = leaveEvents.length
  const approvedLeaves = leaveEvents.filter(e => e.status === 'approved').length
  const pendingLeaves = leaveEvents.filter(e => e.status === 'pending').length
  const availableMembers = teamMembers.length - new Set(leaveEvents.filter(e => 
    isDateInRange(new Date(), e.startDate, e.endDate)
  ).map(e => e.userId)).size

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            Team Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">View team availability and leave schedule</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Team Members', value: teamMembers.length, color: 'from-blue-600 to-blue-700', icon: Users },
          { label: 'Available Today', value: availableMembers, color: 'from-emerald-600 to-emerald-700', icon: User },
          { label: 'Approved Leaves', value: approvedLeaves, color: 'from-sky-600 to-sky-700', icon: CalendarIcon },
          { label: 'Pending Leaves', value: pendingLeaves, color: 'from-amber-600 to-amber-700', icon: CalendarIcon },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
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

      {/* Calendar Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Month Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white min-w-[200px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* View and Filter Controls */}
          <div className="flex items-center gap-3">
            {/* Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              {['all', 'approved', 'pending'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status as any)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filterStatus === status
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          {dayNames.map((day) => (
            <div key={day} className="p-4 text-center font-semibold text-sm">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 border-t border-gray-200 dark:border-gray-700">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="min-h-[120px] p-2 bg-gray-50 dark:bg-gray-900/50 border-r border-b border-gray-200 dark:border-gray-700" />
          ))}

          {/* Calendar days */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            const events = getEventsForDate(date)
            const isToday = date.toDateString() === new Date().toDateString()
            const isWeekend = date.getDay() === 0 || date.getDay() === 6

            return (
              <div
                key={day}
                className={`min-h-[120px] p-2 border-r border-b border-gray-200 dark:border-gray-700 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                  isWeekend ? 'bg-gray-50 dark:bg-gray-900/30' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-semibold ${
                      isToday
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {day}
                  </span>
                  {events.length > 0 && (
                    <span className="text-xs bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2 py-0.5 rounded-full font-medium">
                      {events.length}
                    </span>
                  )}
                </div>

                {/* Events for this day */}
                <div className="space-y-1">
                  {events.slice(0, 3).map((event) => {
                    const member = teamMembers.find(m => m.id === event.userId)
                    return (
                      <div
                        key={event.id}
                        className={`${event.color} ${event.status === 'pending' ? 'opacity-60' : ''} text-white text-xs p-1.5 rounded truncate cursor-pointer hover:shadow-lg transition-all`}
                        title={`${event.userName} - ${event.type} (${event.status})`}
                      >
                        <div className="flex items-center gap-1">
                          <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${member?.color} flex items-center justify-center text-[10px] font-bold`}>
                            {member?.avatar.charAt(0)}
                          </div>
                          <span className="truncate">{event.userName}</span>
                        </div>
                      </div>
                    )
                  })}
                  {events.length > 3 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 pl-1">
                      +{events.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Team Members Legend */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Team Members
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {teamMembers.map((member) => {
            const memberLeaves = leaveEvents.filter(e => e.userId === member.id)
            return (
              <div
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${member.color} flex items-center justify-center text-white font-bold shadow-lg`}>
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">{member.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{member.role}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                    {memberLeaves.length} {memberLeaves.length === 1 ? 'leave' : 'leaves'}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-4">Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm">Vacation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm">Sick Leave</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-sm">Personal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-sm">Other</span>
          </div>
        </div>
      </div>
    </div>
  )
}
