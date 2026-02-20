interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md' | 'lg'
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const getStatusColor = (status: string) => {
    const normalized = status.toLowerCase()
    if (normalized === 'approved' || normalized === 'active' || normalized === 'low') {
      return 'bg-gradient-to-r from-success-100 to-success-50 text-success-800 border border-success-200 shadow-sm'
    }
    if (normalized === 'pending' || normalized === 'moderate' || normalized === 'medium') {
      return 'bg-gradient-to-r from-warning-100 to-warning-50 text-warning-800 border border-warning-200 shadow-sm'
    }
    if (normalized === 'rejected' || normalized === 'high' || normalized === 'critical') {
      return 'bg-gradient-to-r from-danger-100 to-danger-50 text-danger-800 border border-danger-200 shadow-sm'
    }
    return 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-800 border border-slate-200 shadow-sm'
  }

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold ${getStatusColor(
        status
      )} ${sizeClasses[size]}`}
    >
      {status}
    </span>
  )
}
