import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  getEmployeeDashboard,
  getLeaveHistory,
  getTeamCalendar,
} from '../services/employeeService';

interface DashboardContextType {
  employeeDashboard: any;
  leaveHistory: any[];
  teamCalendar: any[];
  loadingDashboard: boolean;
  loadingHistory: boolean;
  loadingCalendar: boolean;
  error: string | null;
  fetchEmployeeDashboard: () => Promise<void>;
  fetchLeaveHistory: () => Promise<void>;
  fetchTeamCalendar: () => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [employeeDashboard, setEmployeeDashboard] = useState<any>(null);
  const [leaveHistory, setLeaveHistory] = useState<any[]>([]);
  const [teamCalendar, setTeamCalendar] = useState<any[]>([]);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingCalendar, setLoadingCalendar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployeeDashboard = async () => {
    setLoadingDashboard(true);
    setError(null);
    try {
      const data = await getEmployeeDashboard();
      setEmployeeDashboard(data);
    } catch (err: any) {
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
    } catch (err: any) {
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
    } catch (err: any) {
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
