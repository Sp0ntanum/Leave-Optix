import { useEffect, useState } from 'react'
import { Sparkles, TrendingUp, Users, Award } from 'lucide-react'

interface WelcomeSplashProps {
  onComplete: () => void
}

export default function WelcomeSplash({ onComplete }: WelcomeSplashProps) {
  const [progress, setProgress] = useState(0)
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    { icon: Sparkles, text: 'AI-Powered Insights', color: 'from-blue-600 to-blue-800' },
    { icon: TrendingUp, text: 'Advanced Analytics', color: 'from-sky-600 to-blue-700' },
    { icon: Award, text: 'Professional Tools', color: 'from-slate-600 to-slate-800' },
    { icon: Users, text: 'Team Collaboration', color: 'from-emerald-600 to-emerald-800' },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(onComplete, 300)
          return 100
        }
        return prev + 2
      })
    }, 30)

    const featureInterval = setInterval(() => {
      setCurrentFeature(prev => (prev + 1) % features.length)
    }, 800)

    return () => {
      clearInterval(interval)
      clearInterval(featureInterval)
    }
  }, [onComplete])

  const CurrentIcon = features[currentFeature].icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-slate-50 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-sky-50 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-8">
        {/* Logo/Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${features[currentFeature].color} rounded-full blur-xl animate-pulse`} />
            <div className="relative bg-white p-8 rounded-full shadow-2xl border-4 border-gray-100 transform hover:scale-110 transition-transform duration-300">
              <CurrentIcon className={`w-16 h-16 bg-gradient-to-r ${features[currentFeature].color} bg-clip-text text-transparent animate-in zoom-in duration-300`} />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl font-bold text-gray-900 mb-4 animate-in fade-in slide-in-from-bottom duration-500">
          Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Leave-Optix</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 animate-in fade-in slide-in-from-bottom duration-500 delay-100">
          Intelligent Leave & Workforce Optimization
        </p>

        {/* Current Feature */}
        <div className="mb-8 h-8 animate-in fade-in duration-300">
          <p className="text-lg text-gray-700 font-medium">
            ✨ {features[currentFeature].text}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="max-w-md mx-auto mb-4">
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${features[currentFeature].color} rounded-full transition-all duration-300 shadow-lg`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="text-gray-500 text-sm font-medium">{progress}% loaded</p>

        {/* Feature Icons */}
        <div className="flex justify-center gap-6 mt-12">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className={`transition-all duration-300 ${
                  index === currentFeature 
                    ? 'scale-125 opacity-100' 
                    : 'scale-100 opacity-50'
                }`}
              >
                <div className={`p-3 bg-gradient-to-r ${feature.color} rounded-lg shadow-lg ${
                  index === currentFeature ? 'shadow-2xl' : ''
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
