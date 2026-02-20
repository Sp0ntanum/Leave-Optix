import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import { Card, Table, Loader, Toast, StatusBadge } from '../../components/ui';

const LeaveHistory: React.FC = () => {
  const { leaveHistory, loadingHistory, fetchLeaveHistory } = useDashboard();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        await fetchLeaveHistory();
      } catch (error: any) {
        setToast({ message: error.message, type: 'error' });
      }
    };
    loadHistory();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const columns = [
    { header: 'Date Range', accessor: 'dateRange', render: (_: any, row: any) => `${formatDate(row.startDate)} - ${formatDate(row.endDate)}` },
    { header: 'Type', accessor: 'type' },
    { header: 'Reason', accessor: 'reason', render: (value: string) => <div className="max-w-xs truncate" title={value}>{value}</div> },
    { header: 'Status', accessor: 'status', render: (value: string) => <StatusBadge status={value} type="leave" /> },
    { header: 'Applied On', accessor: 'createdAt', render: (value: string) => formatDate(value) },
  ];

  if (loadingHistory) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Leave History</h1>
          <Link to="/employee/apply-leave"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Apply for Leave
          </Link>
        </div>
        <Card>
          <Table columns={columns} data={leaveHistory} emptyMessage="No leave history found. Apply for your first leave!" />
        </Card>
      </div>
    </div>
  );
};

export default LeaveHistory;
