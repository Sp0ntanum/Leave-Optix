export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your employee workspace</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-black">
          <h3 className="text-sm font-medium text-gray-500">Available Leave</h3>
          <p className="text-3xl font-bold text-black mt-2">15 days</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-600">
          <h3 className="text-sm font-medium text-gray-500">Pending Requests</h3>
          <p className="text-3xl font-bold text-gray-600 mt-2">2</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-800">
          <h3 className="text-sm font-medium text-gray-500">Approved Requests</h3>
          <p className="text-3xl font-bold text-gray-800 mt-2">5</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-400">
          <h3 className="text-sm font-medium text-gray-500">Team Capacity</h3>
          <p className="text-3xl font-bold text-gray-400 mt-2">85%</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-black">Recent Activity</h2>
        <p className="text-gray-500">No recent activity</p>
      </div>
    </div>
  )
}
