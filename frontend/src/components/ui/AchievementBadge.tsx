import { Award, Star, Zap, TrendingUp, Users, Calendar } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  earned: boolean
  progress?: number
  color: string
}

const achievementIcons = {
  award: Award,
  star: Star,
  zap: Zap,
  trending: TrendingUp,
  users: Users,
  calendar: Calendar,
}

export default function AchievementBadge() {
  const [showNotification, setShowNotification] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState<Achievement | null>(null)
  const [achievements] = useState<Achievement[]>([
    {
      id: '1',
      title: 'Early Bird',
      description: 'Submit 5 leave requests in advance',
      icon: 'calendar',
      earned: true,
      progress: 100,
      color: 'from-blue-600 to-blue-700',
    },
    {
      id: '2',
      title: 'Team Player',
      description: 'No leave conflicts for 3 months',
      icon: 'users',
      earned: true,
      progress: 100,
      color: 'from-emerald-600 to-emerald-700',
    },
    {
      id: '3',
      title: 'Planning Pro',
      description: 'Plan leaves 30 days ahead',
      icon: 'star',
      earned: false,
      progress: 67,
      color: 'from-amber-600 to-amber-700',
    },
    {
      id: '4',
      title: 'Workload Master',
      description: 'Maintain balanced workload',
      icon: 'trending',
      earned: false,
      progress: 45,
      color: 'from-slate-600 to-slate-700',
    },
  ])

  useEffect(() => {
    // Simulate earning an achievement
    const timer = setTimeout(() => {
      const newAchievement = achievements.find(a => !a.earned && (a.progress ?? 0) >= 50)
      if (newAchievement) {
        setCurrentAchievement(newAchievement)
        setShowNotification(true)
        setTimeout(() => setShowNotification(false), 5000)
      }
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const IconComponent = currentAchievement ? achievementIcons[currentAchievement.icon as keyof typeof achievementIcons] : Star

  return (
    <div className="relative">
      {/* Achievement Notification */}
      {showNotification && currentAchievement && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-right duration-500">
          <div className={`bg-gradient-to-r ${currentAchievement.color} p-6 rounded-xl shadow-2xl max-w-sm`}>
            <div className="flex items-start gap-4">
              <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm animate-bounce">
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 text-white">
                <h4 className="font-bold text-lg mb-1">🎉 Achievement Unlocked!</h4>
                <p className="font-semibold">{currentAchievement.title}</p>
                <p className="text-sm text-white/90">{currentAchievement.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Achievements Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievementIcons[achievement.icon as keyof typeof achievementIcons]
          return (
            <div
              key={achievement.id}
              className={`relative p-4 rounded-lg border-2 transition-all duration-300 hover:scale-105 ${
                achievement.earned
                  ? 'bg-gradient-to-r ' + achievement.color + ' text-white border-transparent shadow-lg'
                  : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${achievement.earned ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
                  <Icon className={`w-6 h-6 ${achievement.earned ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <div className="flex-1">
                  <h4 className={`font-semibold mb-1 ${achievement.earned ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-sm mb-2 ${achievement.earned ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'}`}>
                    {achievement.description}
                  </p>
                  {!achievement.earned && achievement.progress !== undefined && (
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="font-semibold text-gray-700 dark:text-gray-300">{achievement.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r ${achievement.color} transition-all duration-500`}
                          style={{ width: `${achievement.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                {achievement.earned && (
                  <div className="text-2xl animate-bounce">✨</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
