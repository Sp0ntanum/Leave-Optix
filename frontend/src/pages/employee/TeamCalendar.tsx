import React, { useEffect, useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Card, Loader, Toast } from '../../components/ui';
import { ChevronLeft, ChevronRight, Users, Calendar as CalendarIcon } from 'lucide-react';

interface SelectedDate {
  date: Date;
  count: number;
  employees?: Array<{ name: string; leaveType: string }>;
}

const TeamCalendar: React.FC = () => {
  const { teamCalendar, loadingCalendar, fetchTeamCalendar } = useDashboard();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<SelectedDate | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        await fetchTeamCalendar();
      } catch (error: any) {
        setToast({ message: error.message, type: 'error' });
      }
    };
    loadCalendar();
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const getLeaveCountForDate = (date: Date) => {
    if (!teamCalendar || teamCalendar.length === 0) return null;

    const dateString = date.toISOString().split('T')[0];
    const leave = teamCalendar.find((item: any) => item.date === dateString);
    return leave || null;
  };

  const getHeatMapColor = (count?: number) => {
    if (!count || count === 0) return 'bg-white';
    if (count === 1) return 'bg-blue-100';
    if (count === 2) return 'bg-blue-300';
    if (count === 3) return 'bg-blue-500';
    return 'bg-blue-700';
  };

  const handleDateClick = (day: number) => {
    const { year, month } = getDaysInMonth(currentDate);
    const clickedDate = new Date(year, month, day);
    const leaveData = getLeaveCountForDate(clickedDate);

    if (leaveData && leaveData.count > 0) {
      setSelectedDate({ date: clickedDate, ...leaveData });
      setShowModal(true);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="p-4 border border-gray-100 bg-gray-50"></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const leaveData = getLeaveCountForDate(date);
      const hasLeaves = leaveData && leaveData.count > 0;
      const isToday = date.toDateString() === new Date().toDateString();
      const heatMapColor = getHeatMapColor(leaveData?.count);

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`p-4 border border-gray-200 min-h-[90px] relative transition-all duration-300 hover:shadow-lg hover:scale-105 ${
            isToday ? 'ring-2 ring-blue-500 bg-blue-50' : heatMapColor
          } ${hasLeaves ? 'cursor-pointer' : ''}`}
        >
          <div className={`text-sm font-semibold mb-2 ${
            isToday ? 'text-blue-600' : leaveData?.count >= 3 ? 'text-white' : 'text-gray-700'
          }`}>
            {day}
          </div>
          {hasLeaves && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`flex flex-col items-center ${
                leaveData.count >= 3 ? 'text-white' : 'text-gray-700'
              }`}>
                <Users className="w-6 h-6 mb-1" />
                <span className="text-lg font-bold">{leaveData.count}</span>
              </div>
            </div>
          )}
          {isToday && (
            <div className="absolute top-1 right-1">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
              </span>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  if (loadingCalendar) {
    return <Loader fullScreen />;
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-gray-50 p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold gradient-text mb-2">Team Calendar</h1>
          <p className="text-gray-600">Visualize team availability at a glance</p>
        </div>

        <Card>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={handlePrevMonth}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all hover-lift"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center space-x-2">
                <CalendarIcon className="w-8 h-8 text-blue-600" />
                <span>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
              </h2>
            </div>
            <button
              onClick={handleNextMonth}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg hover:from-gray-200 hover:to-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all hover-lift"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-0 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="p-3 text-center text-sm font-bold text-gray-600 bg-gradient-to-br from-gray-100 to-gray-200"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0 shadow-lg rounded-lg overflow-hidden">
            {renderCalendar()}
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Heat Map Legend</h3>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-white border border-gray-300 rounded mr-2"></div>
                <span>No leaves</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-100 rounded mr-2"></div>
                <span>1 person</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-300 rounded mr-2"></div>
                <span>2 people</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-500 rounded mr-2"></div>
                <span>3 people</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-blue-700 rounded mr-2"></div>
                <span>4+ people</span>
              </div>
              <div className="flex items-center">
                <div className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </div>
                <span className="ml-2">Today</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  {selectedDate.date.toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </h3>
                <p className="text-gray-600 mt-1">Team leave details</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-3xl transition-colors"
              >
                ×
              </button>
            </div>

            <div className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-500 rounded-full">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{selectedDate.count}</p>
                  <p className="text-sm text-gray-600">Team member(s) on leave</p>
                </div>
              </div>
            </div>

            {selectedDate.employees && selectedDate.employees.length > 0 ? (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {selectedDate.employees.map((employee, index) => (
                  <li
                    key={index}
                    className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg flex justify-between items-center hover-lift animate-slide-in-right"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                        {employee.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-gray-800">{employee.name}</span>
                    </div>
                    <span className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {employee.leaveType}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center py-8">No employee details available</p>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold transition-all hover-lift"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamCalendar;
