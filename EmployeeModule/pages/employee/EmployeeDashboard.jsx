import React, { useEffect, useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import Card from '../../components/ui/Card';
import Loader from '../../components/ui/Loader';
import Toast from '../../components/ui/Toast';
import StatusBadge from '../../components/ui/StatusBadge';
import AnimatedStatCard from '../../components/ui/AnimatedStatCard';
import ActivityTimeline from '../../components/ui/ActivityTimeline';
import { 
  LeaveBalanceChart, 
  WorkloadTrendChart, 
  TeamAvailabilityChart,
  LeaveStatusPieChart 
} from '../../components/ui/Charts';
import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  CalendarCheck,
  AlertCircle,
  Award,
  BarChart3
} from 'lucide-react';

const EmployeeDashboard = () => {
  const { employeeDashboard, loadingDashboard, fetchEmployeeDashboard } = useDashboard();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await fetchEmployeeDashboard();
      } catch (error) {
        setToast({ message: error.message, type: 'error' });
      }
    };
    loadDashboard();
  }, []);

  if (loadingDashboard) {
    return <Loader fullScreen />;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold gradient-text mb-2">Employee Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your overview</p>
        </div>

        {/* Animated Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <AnimatedStatCard
            title="Total Leaves"
            value={employeeDashboard?.stats?.totalLeaves || 32}
            icon={Calendar}
            color="blue"
            trend={employeeDashboard?.trends?.leaveTrend || 5}
            delay={0}
          />
          <AnimatedStatCard
            title="Used Leaves"
            value={employeeDashboard?.stats?.usedLeaves || 18}
            icon={CalendarCheck}
            color="green"
            trend={0}
            delay={100}
          />
          <AnimatedStatCard
            title="Pending Requests"
            value={employeeDashboard?.stats?.pendingRequests || 2}
            icon={Clock}
            color="orange"
            trend={0}
            delay={200}
          />
          <AnimatedStatCard
            title="Team Size"
            value={employeeDashboard?.stats?.teamSize || 18}
            icon={Users}
            color="purple"
            trend={employeeDashboard?.trends?.availabilityTrend || 2}
            delay={300}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Leave Balance with Chart */}
          <div className="lg:col-span-1">
            <Card title="📊 Leave Balance">
              <div className="space-y-4">
                {employeeDashboard?.leaveBalance ? (
                  <>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg hover-lift">
                        <span className="text-gray-700 font-medium">Casual</span>
                        <span className="text-2xl font-bold text-blue-600">
                          {employeeDashboard.leaveBalance.casual || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg hover-lift">
                        <span className="text-gray-700 font-medium">Sick</span>
                        <span className="text-2xl font-bold text-green-600">
                          {employeeDashboard.leaveBalance.sick || 0}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg hover-lift">
                        <span className="text-gray-700 font-medium">Earned</span>
                        <span className="text-2xl font-bold text-orange-600">
                          {employeeDashboard.leaveBalance.earned || 0}
                        </span>
                      </div>
                    </div>
                    <LeaveBalanceChart data={employeeDashboard.leaveBalance} />
                  </>
                ) : (
                  <p className="text-gray-500">No leave balance data available</p>
                )}
              </div>
            </Card>
          </div>

          {/* Workload with Trend */}
          <div className="lg:col-span-2">
            <Card title="📈 Workload Analysis">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center justify-center space-y-4 p-4">
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse-glow">
                      <div className="text-4xl font-bold text-white">
                        {employeeDashboard?.workload?.score || 0}%
                      </div>
                    </div>
                  </div>
                  <StatusBadge
                    status={employeeDashboard?.workload?.level || 'Medium'}
                    type="workload"
                  />
                  <p className="text-sm text-gray-600 text-center">Current Workload Status</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Weekly Trend</h4>
                  {employeeDashboard?.workloadHistory && (
                    <WorkloadTrendChart data={employeeDashboard.workloadHistory} />
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Team Availability with Chart */}
          <Card title="👥 Team Availability">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 bg-green-50 rounded-lg hover-lift">
                <p className="text-3xl font-bold text-green-600">
                  {employeeDashboard?.teamAvailability?.available || 0}
                </p>
                <p className="text-sm text-gray-600 mt-1">Available</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg hover-lift">
                <p className="text-3xl font-bold text-red-600">
                  {employeeDashboard?.teamAvailability?.onLeave || 0}
                </p>
                <p className="text-sm text-gray-600 mt-1">On Leave</p>
              </div>
            </div>
            {employeeDashboard?.teamAvailability && (
              <TeamAvailabilityChart 
                available={employeeDashboard.teamAvailability.available}
                onLeave={employeeDashboard.teamAvailability.onLeave}
              />
            )}
          </Card>

          {/* Leave Status Distribution */}
          <Card title="📋 Leave Status Distribution">
            {employeeDashboard?.leaveStatusDistribution ? (
              <LeaveStatusPieChart data={employeeDashboard.leaveStatusDistribution} />
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                No distribution data available
              </div>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Leaves */}
          <Card title="📅 Upcoming Leaves">
            {employeeDashboard?.upcomingLeaves && employeeDashboard.upcomingLeaves.length > 0 ? (
              <div className="space-y-3">
                {employeeDashboard.upcomingLeaves.map((leave, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg hover-lift animate-slide-in-right"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{leave.type}</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                      </p>
                    </div>
                    <StatusBadge status={leave.status} type="leave" />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No upcoming leaves</p>
            )}
          </Card>

          {/* Recent Activities */}
          <Card title="🔔 Recent Activities">
            {employeeDashboard?.recentActivities ? (
              <ActivityTimeline activities={employeeDashboard.recentActivities} />
            ) : (
              <p className="text-gray-500 text-center py-8">No recent activities</p>
            )}
          </Card>
        </div>

        {/* Achievement Badge */}
        <div className="mt-8 animate-scale-in">
          <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-xl p-6 text-white animate-gradient hover-lift">
            <div className="flex items-center space-x-4">
              <Award className="w-12 h-12" />
              <div>
                <h3 className="text-xl font-bold">Perfect Attendance! 🎉</h3>
                <p className="text-white/90">You've maintained excellent attendance this month</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
