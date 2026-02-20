export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Available Leave</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">15 days</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Pending Requests</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">2</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Approved Requests</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">5</p>
        </div>
        
        <div className="card">
          <h3 className="text-sm font-medium text-gray-500">Team Capacity</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">85%</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-gray-500">No recent activity</p>
      </div>
    </div>
  )
}
