import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'task';
  title: string;
  description: string;
  date: string;
  duration?: number;
  status: 'completed' | 'scheduled' | 'cancelled';
  user: {
    name: string;
    avatar: string;
  };
}

const initialActivities: Activity[] = [
  {
    id: '1',
    type: 'call',
    title: 'Sales Follow-up Call',
    description: 'Discussed pricing options with client',
    date: '2024-03-15T10:30:00',
    duration: 30,
    status: 'completed',
    user: {
      name: 'Sarah Wilson',
      avatar: 'https://i.pravatar.cc/150?u=sarah'
    }
  },
  {
    id: '2',
    type: 'meeting',
    title: 'Product Demo',
    description: 'Demonstrated new features to potential client',
    date: '2024-03-15T14:00:00',
    duration: 60,
    status: 'completed',
    user: {
      name: 'Michael Chen',
      avatar: 'https://i.pravatar.cc/150?u=michael'
    }
  },
  {
    id: '3',
    type: 'email',
    title: 'Proposal Sent',
    description: 'Sent detailed proposal to client',
    date: '2024-03-15T16:45:00',
    status: 'completed',
    user: {
      name: 'Emily Rodriguez',
      avatar: 'https://i.pravatar.cc/150?u=emily'
    }
  },
  {
    id: '4',
    type: 'task',
    title: 'Contract Review',
    description: 'Review and update contract terms',
    date: '2024-03-16T09:00:00',
    status: 'scheduled',
    user: {
      name: 'David Kim',
      avatar: 'https://i.pravatar.cc/150?u=david'
    }
  }
];

const ActivityReport = () => {
  const [activities, setActivities] = useState<Activity[]>(initialActivities);
  const [timeframe, setTimeframe] = useState('Today');

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call':
        return <PhoneIcon className="w-5 h-5" />;
      case 'email':
        return <EnvelopeIcon className="w-5 h-5" />;
      case 'meeting':
        return <UserGroupIcon className="w-5 h-5" />;
      case 'task':
        return <DocumentTextIcon className="w-5 h-5" />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const activityStats = {
    total: activities.length,
    completed: activities.filter(a => a.status === 'completed').length,
    scheduled: activities.filter(a => a.status === 'scheduled').length,
    cancelled: activities.filter(a => a.status === 'cancelled').length
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Activity Report</h1>
        <div className="action-buttons">
          <select
            className="button secondary"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 Days</option>
            <option>This Month</option>
          </select>
          <button className="button primary">
            <CalendarIcon className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black bg-opacity-5 rounded-full">
              <DocumentTextIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Total Activities</h3>
              <div className="text-2xl font-semibold font-display">
                {activityStats.total}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black bg-opacity-5 rounded-full">
              <ClockIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Completed</h3>
              <div className="text-2xl font-semibold font-display">
                {activityStats.completed}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black bg-opacity-5 rounded-full">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Scheduled</h3>
              <div className="text-2xl font-semibold font-display">
                {activityStats.scheduled}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black bg-opacity-5 rounded-full">
              <UserGroupIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Team Members</h3>
              <div className="text-2xl font-semibold font-display">
                {new Set(activities.map(a => a.user.name)).size}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h2 className="text-lg font-semibold mb-6">Activity Timeline</h2>
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-black bg-opacity-5 flex items-center justify-center">
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{activity.title}</h3>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatDate(activity.date)}</div>
                    {activity.duration && (
                      <div className="text-sm text-gray-500">{activity.duration} min</div>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <img
                    src={activity.user.avatar}
                    alt={activity.user.name}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm text-gray-500">{activity.user.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                    activity.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ActivityReport; 