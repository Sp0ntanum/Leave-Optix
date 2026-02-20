import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface LeaveStatusPieChartProps {
  data: Array<{ status: string; value: number }>
}

const mockData = [
  { status: 'Available', value: 12 },
  { status: 'On Leave', value: 3 },
  { status: 'Unavailable', value: 1 },
]

const COLORS: Record<string, string> = {
  Pending: '#f59e0b',
  Approved: '#16a34a',
  Rejected: '#dc2626',
  Available: '#2563eb',
  'On Leave': '#f59e0b',
  Unavailable: '#64748b',
}

export default function LeaveStatusPieChart({ data }: LeaveStatusPieChartProps) {
  const chartData = data && data.length > 0 ? data : mockData

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ status, percent }) => `${status}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.status] || '#2563eb'} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
