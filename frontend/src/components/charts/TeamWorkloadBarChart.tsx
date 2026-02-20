import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

interface TeamWorkloadBarChartProps {
  data: Array<{ member: string; tasks: number }>
}

const mockData = [
  { member: 'John', tasks: 7 },
  { member: 'Alice', tasks: 5 },
  { member: 'Bob', tasks: 9 },
  { member: 'Sarah', tasks: 6 },
]

export default function TeamWorkloadBarChart({ data }: TeamWorkloadBarChartProps) {
  const chartData = data && data.length > 0 ? data : mockData

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis 
          dataKey="member" 
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
        <Bar dataKey="tasks" fill="#2563eb" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
