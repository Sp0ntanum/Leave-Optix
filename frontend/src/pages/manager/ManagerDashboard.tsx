export default function ManagerDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your team and approve leave requests</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-black">
          <h3 className="text-sm font-medium text-gray-500">Pending Approvals</h3>
          <p className="text-3xl font-bold text-black mt-2">8</p>
          <p className="text-xs text-gray-400 mt-1">Requires immediate attention</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-700">
          <h3 className="text-sm font-medium text-gray-500">Team Workload</h3>
          <p className="text-3xl font-bold text-gray-700 mt-2">78%</p>
          <p className="text-xs text-gray-400 mt-1">Current capacity</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-gray-500">
          <h3 className="text-sm font-medium text-gray-500">Team Availability</h3>
          <p className="text-3xl font-bold text-gray-500 mt-2">12/15</p>
          <p className="text-xs text-gray-400 mt-1">Members available</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Leave Trends</h2>
          <p className="text-gray-600">Leave trends and analytics will appear here</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Critical Coverage</h2>
          <p className="text-gray-600">Critical coverage alerts will appear here</p>
        </div>
      </div>
    </div>
  )
}
