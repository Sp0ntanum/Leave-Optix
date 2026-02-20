import axios from 'axios';

const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock Data
const mockDashboardData = {
  leaveBalance: { casual: 10, sick: 7, earned: 15 },
  workload: { score: 75, level: 'High' },
  teamAvailability: { available: 15, onLeave: 3, total: 18 },
  upcomingLeaves: [
    { type: 'Casual', startDate: '2026-03-15', endDate: '2026-03-17', status: 'Approved' },
    { type: 'Sick', startDate: '2026-04-05', endDate: '2026-04-05', status: 'Pending' }
  ],
  stats: { totalLeaves: 32, usedLeaves: 18, pendingRequests: 2, teamSize: 18 },
  trends: { leaveTrend: 5, workloadTrend: -3, availabilityTrend: 2 },
  workloadHistory: [
    { day: 'Mon', workload: 65 }, { day: 'Tue', workload: 70 }, { day: 'Wed', workload: 75 },
    { day: 'Thu', workload: 78 }, { day: 'Fri', workload: 75 }, { day: 'Sat', workload: 60 }, { day: 'Sun', workload: 55 }
  ],
  leaveStatusDistribution: [
    { name: 'Approved', value: 12 }, { name: 'Pending', value: 2 }, { name: 'Rejected', value: 4 }
  ],
  recentActivities: [
    { type: 'approved', title: 'Leave Request Approved', description: '3 days casual leave approved by manager', time: '2 hours ago' },
    { type: 'pending', title: 'New Leave Application', description: 'Sick leave application submitted for review', time: '5 hours ago' },
    { type: 'attendance', title: 'Perfect Attendance', description: 'Completed 30 days without absence', time: '1 day ago' },
    { type: 'approved', title: 'Timesheet Approved', description: 'Weekly timesheet approved successfully', time: '2 days ago' }
  ]
};

const mockLeaveHistory = [
  { id: 'leave_001', startDate: '2026-02-10', endDate: '2026-02-12', type: 'Casual', reason: 'Family function', status: 'Approved', createdAt: '2026-02-01T10:30:00Z' },
  { id: 'leave_002', startDate: '2026-01-20', endDate: '2026-01-21', type: 'Sick', reason: 'Medical appointment', status: 'Approved', createdAt: '2026-01-15T14:20:00Z' },
  { id: 'leave_003', startDate: '2026-03-15', endDate: '2026-03-17', type: 'Casual', reason: 'Personal work', status: 'Pending', createdAt: '2026-02-18T09:15:00Z' },
  { id: 'leave_004', startDate: '2025-12-25', endDate: '2025-12-27', type: 'Earned', reason: 'Christmas vacation', status: 'Approved', createdAt: '2025-12-10T16:45:00Z' },
  { id: 'leave_005', startDate: '2025-11-10', endDate: '2025-11-11', type: 'Casual', reason: 'Festival celebration', status: 'Rejected', createdAt: '2025-11-01T11:30:00Z' }
];

const mockTeamCalendar = [
  { date: '2026-02-21', count: 2, employees: [{ name: 'John Doe', leaveType: 'Casual' }, { name: 'Jane Smith', leaveType: 'Sick' }] },
  { date: '2026-02-25', count: 1, employees: [{ name: 'Bob Johnson', leaveType: 'Earned' }] },
  { date: '2026-03-01', count: 3, employees: [{ name: 'Alice Williams', leaveType: 'Casual' }, { name: 'Charlie Brown', leaveType: 'Casual' }, { name: 'Diana Prince', leaveType: 'Sick' }] },
  { date: '2026-03-05', count: 1, employees: [{ name: 'Eve Adams', leaveType: 'Earned' }] },
  { date: '2026-03-15', count: 2, employees: [{ name: 'Frank Miller', leaveType: 'Casual' }, { name: 'Grace Lee', leaveType: 'Casual' }] }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getEmployeeDashboard = async () => {
  if (USE_MOCK_DATA) {
    await delay(500);
    return mockDashboardData;
  }
  
  try {
    const response = await api.get('/employee/dashboard');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to fetch dashboard data';
    throw new Error(message);
  }
};

export const applyLeave = async (payload: any) => {
  if (USE_MOCK_DATA) {
    await delay(800);
    return { message: 'Leave application submitted successfully', id: `leave_${Date.now()}` };
  }
  
  try {
    const response = await api.post('/leave/apply', payload);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to apply leave';
    throw new Error(message);
  }
};

export const getLeaveHistory = async () => {
  if (USE_MOCK_DATA) {
    await delay(500);
    return mockLeaveHistory;
  }
  
  try {
    const response = await api.get('/leave/history');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to fetch leave history';
    throw new Error(message);
  }
};

export const getTeamCalendar = async () => {
  if (USE_MOCK_DATA) {
    await delay(500);
    return mockTeamCalendar;
  }
  
  try {
    const response = await api.get('/employee/team-calendar');
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || 'Failed to fetch team calendar';
    throw new Error(message);
  }
};

export default api;
