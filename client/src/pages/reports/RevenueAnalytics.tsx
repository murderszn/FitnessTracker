import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline';

interface RevenueMetric {
  id: string;
  category: string;
  amount: number;
  previousAmount: number;
  trend: number;
  breakdown: {
    label: string;
    value: number;
  }[];
}

const initialMetrics: RevenueMetric[] = [
  {
    id: '1',
    category: 'Total Revenue',
    amount: 1250000,
    previousAmount: 980000,
    trend: 27.6,
    breakdown: [
      { label: 'Product Sales', value: 750000 },
      { label: 'Services', value: 350000 },
      { label: 'Subscriptions', value: 150000 }
    ]
  },
  {
    id: '2',
    category: 'Average Deal Size',
    amount: 45000,
    previousAmount: 42000,
    trend: 7.1,
    breakdown: [
      { label: 'Enterprise', value: 75000 },
      { label: 'Mid-Market', value: 45000 },
      { label: 'Small Business', value: 15000 }
    ]
  },
  {
    id: '3',
    category: 'Customer Acquisition Cost',
    amount: 2500,
    previousAmount: 2800,
    trend: -10.7,
    breakdown: [
      { label: 'Marketing', value: 1200 },
      { label: 'Sales', value: 800 },
      { label: 'Operations', value: 500 }
    ]
  },
  {
    id: '4',
    category: 'Monthly Recurring Revenue',
    amount: 180000,
    previousAmount: 150000,
    trend: 20,
    breakdown: [
      { label: 'Basic Plan', value: 50000 },
      { label: 'Pro Plan', value: 80000 },
      { label: 'Enterprise Plan', value: 50000 }
    ]
  }
];

const RevenueAnalytics = () => {
  const [metrics, setMetrics] = useState<RevenueMetric[]>(initialMetrics);
  const [timeframe, setTimeframe] = useState('This Quarter');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const getMetricIcon = (category: string) => {
    switch (category) {
      case 'Total Revenue':
        return <CurrencyDollarIcon className="w-6 h-6" />;
      case 'Average Deal Size':
        return <ChartBarIcon className="w-6 h-6" />;
      case 'Customer Acquisition Cost':
        return <UserGroupIcon className="w-6 h-6" />;
      case 'Monthly Recurring Revenue':
        return <ArrowTrendingUpIcon className="w-6 h-6" />;
      default:
        return <CurrencyDollarIcon className="w-6 h-6" />;
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Revenue Analytics</h1>
        <div className="action-buttons">
          <select
            className="button secondary"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
            <option>Last Year</option>
          </select>
          <button className="button primary">
            <ChartBarIcon className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-black bg-opacity-5 rounded-full">
                  {getMetricIcon(metric.category)}
                </div>
                <div>
                  <h3 className="text-sm text-gray-500">{metric.category}</h3>
                  <div className="text-2xl font-semibold font-display">
                    {formatCurrency(metric.amount)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {metric.trend > 0 ? (
                  <ArrowUpIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDownIcon className="w-4 h-4 text-red-500" />
                )}
                <span className={metric.trend > 0 ? 'text-green-500' : 'text-red-500'}>
                  {Math.abs(metric.trend)}%
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {metric.breakdown.map((item, itemIndex) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-500">{item.label}</span>
                    <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                  </div>
                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.value / metric.amount) * 100}%` }}
                      transition={{ duration: 1, delay: itemIndex * 0.1 }}
                      className="absolute top-0 left-0 h-full bg-black"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <h2 className="text-lg font-semibold mb-6">Key Insights</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 rounded-full">
              <ArrowTrendingUpIcon className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <h3 className="font-medium">Strong Revenue Growth</h3>
              <p className="text-sm text-gray-500">
                Total revenue has increased by 27.6% compared to the previous period,
                driven primarily by product sales and services.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <ChartBarIcon className="w-5 h-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-medium">Improved Deal Size</h3>
              <p className="text-sm text-gray-500">
                Average deal size has grown by 7.1%, indicating successful up-selling
                and focus on higher-value customers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 rounded-full">
              <UserGroupIcon className="w-5 h-5 text-green-700" />
            </div>
            <div>
              <h3 className="font-medium">Reduced Acquisition Costs</h3>
              <p className="text-sm text-gray-500">
                Customer acquisition cost has decreased by 10.7%, showing improved
                efficiency in marketing and sales operations.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RevenueAnalytics; 