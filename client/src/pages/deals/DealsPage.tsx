import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import DealModal from '../../components/deals/DealModal';

interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  dueDate: string;
  assignee: string;
  stage: 'lead' | 'negotiation' | 'proposal' | 'closed';
}

const mockDeals: Deal[] = [
  {
    id: '1',
    title: 'Enterprise License Deal',
    company: 'TechCorp Solutions',
    value: 50000,
    dueDate: '2024-06-30',
    assignee: 'John Smith',
    stage: 'negotiation'
  },
  {
    id: '2',
    title: 'Software Implementation',
    company: 'Global Manufacturing Inc',
    value: 75000,
    dueDate: '2024-07-15',
    assignee: 'Emma Davis',
    stage: 'proposal'
  },
  {
    id: '3',
    title: 'Annual Contract Renewal',
    company: 'Retail Dynamics',
    value: 25000,
    dueDate: '2024-05-30',
    assignee: 'Sarah Wilson',
    stage: 'lead'
  }
];

const stages = [
  { id: 'lead', label: 'Lead', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-blue-100 text-blue-800' },
  { id: 'proposal', label: 'Proposal', color: 'bg-purple-100 text-purple-800' },
  { id: 'closed', label: 'Closed', color: 'bg-green-100 text-green-800' }
];

const DealsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [deals, setDeals] = useState<Deal[]>(mockDeals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | undefined>();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const handleSaveDeal = (dealData: Partial<Deal>) => {
    if (selectedDeal) {
      // Edit existing deal
      setDeals(deals.map(deal => 
        deal.id === selectedDeal.id 
          ? { ...deal, ...dealData }
          : deal
      ));
    } else {
      // Add new deal
      const newDeal: Deal = {
        id: String(Date.now()),
        ...dealData as Omit<Deal, 'id'>
      };
      setDeals([...deals, newDeal]);
    }
    setIsModalOpen(false);
    setSelectedDeal(undefined);
  };

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setIsModalOpen(true);
  };

  const filteredDeals = deals.filter(deal =>
    deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deal.assignee.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <h1 className="page-title">Deals</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="button primary"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Deal
        </motion.button>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between p-4">
          <div className="search-field">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none"
            />
          </div>
          <button className="button secondary">
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stages.map((stage) => (
          <div key={stage.id} className="card p-6">
            <h2 className={`inline-flex px-2 py-1 rounded text-sm font-medium ${stage.color} mb-4`}>
              {stage.label}
            </h2>
            <div className="space-y-4">
              {filteredDeals
                .filter((deal) => deal.stage === stage.id)
                .map((deal) => (
                  <motion.div
                    key={deal.id}
                    layoutId={deal.id}
                    onClick={() => handleEditDeal(deal)}
                    className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <h3 className="font-medium text-gray-900">{deal.title}</h3>
                    <p className="text-sm text-gray-500">{deal.company}</p>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center text-sm">
                        <CurrencyDollarIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="font-medium text-gray-900">
                          {formatCurrency(deal.value)}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">
                          Due {new Date(deal.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">{deal.assignee}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <DealModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDeal(undefined);
        }}
        onSave={handleSaveDeal}
        deal={selectedDeal}
      />
    </motion.div>
  );
};

export default DealsPage; 