import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'error'
  title: string
  message: string
  time: string
  read: boolean
}

export default function SmartNotifications() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Leave Approved',
      message: 'Your vacation leave request for Dec 25-30 has been approved by Sarah Johnson.',
      time: '2 min ago',
      read: false,
    },
    {
      id: '2',
      type: 'info',
      title: 'Team Update',
      message: 'Michael Chen will be on leave next week. Workload has been redistributed.',
      time: '1 hour ago',
      read: false,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Conflict Detected',
      message: 'Your leave request overlaps with 2 other team members. Manager review required.',
      time: '3 hours ago',
      read: true,
    },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  useEffect(() => {
    // Simulate new notification
    const timer = setTimeout(() => {
      const newNotif: Notification = {
        id: Date.now().toString(),
        type: 'success',
        title: 'Achievement Unlocked',
        message: 'You earned the "Early Bird" badge for planning ahead!',
        time: 'Just now',
        read: false,
      }
      setNotifications(prev => [newNotif, ...prev])
    }, 5000)
    return () => clearTimeout(timer)
  }, [])

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-orange-500" />
      case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />
      default: return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBgColor = (type: string, read: boolean) => {
    if (read) return 'bg-gray-50 dark:bg-gray-800/50'
    switch (type) {
      case 'success': return 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500'
      case 'warning': return 'bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500'
      case 'error': return 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'
      default: return 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500'
    }
  }

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
      >
        <Bell className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-96 max-h-[600px] bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 animate-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-[500px]">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 border-b border-gray-100 dark:border-gray-800 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 ${getBgColor(notif.type, notif.read)}`}
                    onClick={() => !notif.read && markAsRead(notif.id)}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {notif.title}
                          </h4>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeNotification(notif.id)
                            }}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {notif.time}
                        </p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
