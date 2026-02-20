interface SkeletonLoaderProps {
  className?: string
}

export default function SkeletonLoader({ className = '' }: SkeletonLoaderProps) {
  return (
    <div className={`animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 bg-[length:200%_100%] rounded ${className}`} 
         style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, shimmer 2s linear infinite' }} />
  )
}

export function KPICardSkeleton() {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-lg">
      <SkeletonLoader className="h-4 w-24 mb-3" />
      <SkeletonLoader className="h-8 w-16 mb-2" />
      <SkeletonLoader className="h-3 w-32" />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-700/60 p-6 shadow-lg">
      <SkeletonLoader className="h-6 w-48 mb-4" />
      <SkeletonLoader className="h-64 w-full mb-4" />
      <SkeletonLoader className="h-3 w-full" />
      <SkeletonLoader className="h-3 w-3/4 mt-2" />
    </div>
  )
}