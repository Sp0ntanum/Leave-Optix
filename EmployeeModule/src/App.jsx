import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { DashboardProvider } from '../context/DashboardContext';
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';
import ApplyLeave from '../pages/employee/ApplyLeave';
import LeaveHistory from '../pages/employee/LeaveHistory';
import TeamCalendar from '../pages/employee/TeamCalendar';

// Simple Login Component
const Login = ({ onLogin }) => {
  const handleLogin = () => {
    // Store a dummy token
    localStorage.setItem('token', 'dummy-jwt-token-for-demo');
    onLogin();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center p-6 animate-gradient">
      <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 max-w-md w-full animate-scale-in">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 animate-pulse-glow">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Employee Portal</h1>
          <p className="text-gray-600">Modern Leave Management System</p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-blue-600">✨ Demo Features:</strong><br/>
              • Interactive Dashboard with Charts<br/>
              • Leave Management System<br/>
              • Team Calendar Heatmap<br/>
              • Real-time Animations
            </p>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-bold text-lg transition-all hover-lift shadow-lg"
        >
          🚀 Enter Demo
        </button>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Using mock data for demonstration • No backend required
          </p>
        </div>
      </div>
    </div>
  );
};

// Navigation Component
const Navigation = ({ onLogout }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navLinkClass = (path) => {
    return `px-4 py-2 rounded-lg transition-all font-medium ${
      isActive(path)
        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
        : 'text-gray-700 hover:bg-gray-100'
    }`;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold gradient-text">Employee Portal</h1>
            </div>
            <div className="flex space-x-2">
              <Link to="/employee/dashboard" className={navLinkClass('/employee/dashboard')}>
                📊 Dashboard
              </Link>
              <Link to="/employee/apply-leave" className={navLinkClass('/employee/apply-leave')}>
                ✍️ Apply Leave
              </Link>
              <Link to="/employee/leave-history" className={navLinkClass('/employee/leave-history')}>
                📋 History
              </Link>
              <Link to="/employee/team-calendar" className={navLinkClass('/employee/team-calendar')}>
                📅 Calendar
              </Link>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all font-medium"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

// Main Layout Component
const Layout = ({ children, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onLogout={onLogout} />
      {children}
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <DashboardProvider>
        {!isAuthenticated ? (
          <Login onLogin={handleLogin} />
        ) : (
          <Layout onLogout={handleLogout}>
            <Routes>
              <Route path="/" element={<Navigate to="/employee/dashboard" replace />} />
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/apply-leave" element={<ApplyLeave />} />
              <Route path="/employee/leave-history" element={<LeaveHistory />} />
              <Route path="/employee/team-calendar" element={<TeamCalendar />} />
              <Route path="*" element={<Navigate to="/employee/dashboard" replace />} />
            </Routes>
          </Layout>
        )}
      </DashboardProvider>
    </BrowserRouter>
  );
}

export default App;
