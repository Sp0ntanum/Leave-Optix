import React, { createContext, useContext, useState } from 'react';
import {
  getEmployeeDashboard,
  getLeaveHistory,
  getTeamCalendar,
} from '../services/api';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [employeeDashboard, setEmployeeDashboard] = useState(null);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [teamCalendar, setTeamCalendar] = useState([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmployeeDashboard = async () => {
    setLoadingDashboard(true);
    setError(null);
    try {
      const data = await getEmployeeDashboard();
      setEmployeeDashboard(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
      throw err;
    } finally {
      setLoadingDashboard(false);
    }
  };

  const fetchLeaveHistory = async () => {
    setLoadingHistory(true);
    setError(null);
    try {
      const data = await getLeaveHistory();
      setLeaveHistory(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch leave history');
      throw err;
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchTeamCalendar = async () => {
    setLoadingCalendar(true);
    setError(null);
    try {
      const data = await getTeamCalendar();
      setTeamCalendar(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch team calendar');
      throw err;
    } finally {
      setLoadingCalendar(false);
    }
  };

  const value = {
    employeeDashboard,
    leaveHistory,
    teamCalendar,
    loadingDashboard,
    loadingHistory,
    loadingCalendar,
    error,
    fetchEmployeeDashboard,
    fetchLeaveHistory,
    fetchTeamCalendar,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};
