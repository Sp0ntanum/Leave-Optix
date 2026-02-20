import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';
import Card from '../../components/ui/Card';
import Table from '../../components/ui/Table';
import Loader from '../../components/ui/Loader';
import Toast from '../../components/ui/Toast';
import StatusBadge from '../../components/ui/StatusBadge';

const LeaveHistory = () => {
  const { leaveHistory, loadingHistory, fetchLeaveHistory } = useDashboard();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        await fetchLeaveHistory();
      } catch (error) {
        setToast({ message: error.message, type: 'error' });
      }
    };
    loadHistory();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateRange = (startDate, endDate) => {
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const columns = [
    {
      header: 'Date Range',
      accessor: 'dateRange',
      render: (_, row) => formatDateRange(row.startDate, row.endDate),
    },
    {
      header: 'Type',
      accessor: 'type',
    },
    {
      header: 'Reason',
      accessor: 'reason',
      render: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (value) => <StatusBadge status={value} type="leave" />,
    },
    {
      header: 'Applied On',
      accessor: 'createdAt',
      render: (value) => formatDate(value),
    },
  ];

  if (loadingHistory) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Leave History</h1>
          <Link
            to="/employee/apply-leave"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Apply for Leave
          </Link>
        </div>

        <Card>
          <Table
            columns={columns}
            data={leaveHistory}
            emptyMessage="No leave history found. Apply for your first leave!"
          />
        </Card>
      </div>
    </div>
  );
};

export default LeaveHistory;
