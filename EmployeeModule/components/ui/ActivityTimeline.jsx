import React from 'react';
import { 
  Calendar, 
  CheckCircle, 
  XCircle, 
  Clock, 
  UserCheck,
  TrendingUp
} from 'lucide-react';

const ActivityTimeline = ({ activities }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'attendance':
        return <UserCheck className="w-5 h-5 text-blue-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  const getColorClasses = (type) => {
    switch (type) {
      case 'approved':
        return 'bg-green-100 border-green-200';
      case 'rejected':
        return 'bg-red-100 border-red-200';
      case 'pending':
        return 'bg-yellow-100 border-yellow-200';
      case 'attendance':
        return 'bg-blue-100 border-blue-200';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <div
          key={index}
          className={`flex items-start space-x-4 p-4 rounded-lg border hover-lift ${getColorClasses(
            activity.type
          )} animate-slide-in-right`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex-shrink-0 mt-1">{getIcon(activity.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">{activity.title}</p>
            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
            <p className="text-xs text-gray-500 mt-2">{activity.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTimeline;