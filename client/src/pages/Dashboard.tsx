import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import ContactModal from '../components/contacts/ContactModal';
import { contactsApi } from '../services/contactsApi';
import { toast } from 'react-hot-toast';

interface StatCard {
  title: string;
  value: string;
  trend: number;
  trendLabel: string;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive';
  lastContact: string;
}

const stats: StatCard[] = [
  {
    title: 'Total Deals',
    value: '127',
    trend: 12.5,
    trendLabel: 'vs last month'
  },
  {
    title: 'Revenue This Month',
    value: '$45,289',
    trend: -2.3,
    trendLabel: 'vs last month'
  },
  {
    title: 'Active Contacts',
    value: '1,893',
    trend: 8.1,
    trendLabel: 'vs last month'
  },
  {
    title: 'Tasks Due Today',
    value: '12',
    trend: 0,
    trendLabel: 'vs yesterday'
  }
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleSaveContact = async (contactData: Partial<Contact>) => {
    try {
      await contactsApi.create(contactData as Omit<Contact, 'id'>);
      toast.success('Contact created successfully');
      setIsContactModalOpen(false);
    } catch (error) {
      toast.error('Failed to create contact');
      console.error('Error creating contact:', error);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <div className="action-buttons">
          <button className="button secondary">Export</button>
          <button className="button primary" onClick={() => setIsContactModalOpen(true)}>
            + New Contact
          </button>
        </div>
      </div>

      <motion.div
        className="dashboard-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3>{stat.title}</h3>
            <div className="stat-value">{stat.value}</div>
            <div className={`stat-trend ${stat.trend > 0 ? 'trend-up' : stat.trend < 0 ? 'trend-down' : ''}`}>
              {stat.trend !== 0 && (
                <>
                  {stat.trend > 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                  <span>{Math.abs(stat.trend)}%</span>
                </>
              )}
              <span className="text-gray-500">{stat.trendLabel}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="table-container">
        <div className="table-toolbar">
          <div className="search-field">
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Contact Name</th>
              <th>Company</th>
              <th>Deal Value</th>
              <th>Status</th>
              <th>Last Contact</th>
            </tr>
          </thead>
          <tbody>
            <motion.tr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <td>Sarah Johnson</td>
              <td>Tech Solutions Inc.</td>
              <td>$25,000</td>
              <td><span className="status-tag status-active">Active</span></td>
              <td>Today</td>
            </motion.tr>
            <motion.tr
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <td>Michael Chen</td>
              <td>Global Systems</td>
              <td>$18,500</td>
              <td><span className="status-tag status-pending">Pending</span></td>
              <td>Yesterday</td>
            </motion.tr>
          </tbody>
        </table>

        <div className="table-pagination">
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>
          {[1, 2, 3].map(page => (
            <button
              key={page}
              className={`pagination-button ${currentPage === page ? 'active' : ''}`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="pagination-button"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={currentPage === 3}
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        onSave={handleSaveContact}
      />
    </div>
  );
};

export default Dashboard; 