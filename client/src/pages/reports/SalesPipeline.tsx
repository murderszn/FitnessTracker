import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FunnelIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface PipelineStage {
  name: string;
  count: number;
  value: number;
  conversion: number;
  trend: number;
}

const initialStages: PipelineStage[] = [
  {
    name: 'Lead',
    count: 245,
    value: 1250000,
    conversion: 60,
    trend: 12.5
  },
  {
    name: 'Qualified',
    count: 147,
    value: 850000,
    conversion: 45,
    trend: 8.3
  },
  {
    name: 'Proposal',
    count: 66,
    value: 520000,
    conversion: 35,
    trend: -2.1
  },
  {
    name: 'Negotiation',
    count: 23,
    value: 280000,
    conversion: 70,
    trend: 15.8
  },
  {
    name: 'Closed',
    count: 16,
    value: 180000,
    conversion: 0,
    trend: 5.4
  }
];

const SalesPipeline = () => {
  const [stages, setStages] = useState<PipelineStage[]>(initialStages);
  const [timeframe, setTimeframe] = useState('This Month');

  const totalValue = stages.reduce((sum, stage) => sum + stage.value, 0);
  const totalDeals = stages.reduce((sum, stage) => sum + stage.count, 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Sales Pipeline</h1>
        <div className="action-buttons">
          <select 
            className="button secondary"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option>This Week</option>
            <option>This Month</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button className="button primary">
            <FunnelIcon className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black bg-opacity-5 rounded-full">
              <CurrencyDollarIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Total Pipeline Value</h3>
              <div className="text-2xl font-semibold font-display">
                {formatCurrency(totalValue)}
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
              <UserGroupIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Total Deals</h3>
              <div className="text-2xl font-semibold font-display">
                {totalDeals}
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
              <ChartBarIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Avg. Deal Size</h3>
              <div className="text-2xl font-semibold font-display">
                {formatCurrency(totalValue / totalDeals)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="card p-6"
      >
        <div className="space-y-6">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{stage.name}</h3>
                  <div className="text-sm text-gray-500">
                    {stage.count} deals · {formatCurrency(stage.value)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    {stage.trend > 0 ? (
                      <ArrowUpIcon className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownIcon className="w-4 h-4 text-red-500" />
                    )}
                    <span className={stage.trend > 0 ? 'text-green-500' : 'text-red-500'}>
                      {Math.abs(stage.trend)}%
                    </span>
                  </div>
                  {stage.conversion > 0 && (
                    <div className="text-sm text-gray-500">
                      {stage.conversion}% conversion
                    </div>
                  )}
                </div>
              </div>
              <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(stage.count / stages[0].count) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className="absolute top-0 left-0 h-full bg-black"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SalesPipeline; 