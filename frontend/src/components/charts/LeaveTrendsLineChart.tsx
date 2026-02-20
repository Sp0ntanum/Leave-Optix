import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface LeaveTrendsLineChartProps {
  data: Array<{ month: string; leaves: number }>
}

const mockData = [
  { month: 'Jan', leaves: 10 },
  { month: 'Feb', leaves: 8 },
  { month: 'Mar', leaves: 12 },
  { month: 'Apr', leaves: 15 },
  { month: 'May', leaves: 9 },
  { month: 'Jun', leaves: 11 },
]

export default function LeaveTrendsLineChart({ data }: LeaveTrendsLineChartProps) {
  const chartData = data && data.length > 0 ? data : mockData

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="month" 
          tick={{ fill: '#64748b', fontSize: 12 }}
          axisLine={{ stroke: '#cbd5e1' }}
        />
        <YAxis 
          tick={{ fill: '#64748b', fontSize: 12 }}
          axisLine={{ stroke: '#cbd5e1' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="leaves" 
          stroke="#2563eb" 
          strokeWidth={3}
          dot={{ fill: '#2563eb', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#2563eb', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
