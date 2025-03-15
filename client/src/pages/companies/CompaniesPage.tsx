import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  PlusIcon,
  PencilSquareIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import ContactModal from '../../components/contacts/ContactModal';
import CompanyModal from '../../components/companies/CompanyModal';
import { companiesApi, Company } from '../../services/companiesApi';
import { Contact } from '../../services/contactsApi';
import { toast } from 'react-hot-toast';

const CompaniesPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | undefined>();
  const [companyToEdit, setCompanyToEdit] = useState<Company | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching companies...');
      const response = await companiesApi.getAll();
      console.log('Companies response:', response);
      if (!response.companies) {
        throw new Error('Invalid response format');
      }
      setCompanies(response.companies);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch companies';
      console.error('Error in fetchCompanies:', error);
      setError(message);
      toast.error(message);
      setCompanies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await companiesApi.delete(id);
      setCompanies(companies.filter(company => company._id !== id));
      toast.success('Company deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete company';
      console.error('Error in handleDelete:', error);
      toast.error(message);
    }
  };

  const handleEdit = (company: Company) => {
    setCompanyToEdit(company);
    setIsCompanyModalOpen(true);
  };

  const handleContactClick = (company: Company) => {
    setSelectedCompany(company);
    setIsContactModalOpen(true);
  };

  const handleSaveContact = (contactData: Partial<Contact>) => {
    console.log('Saving contact for company:', selectedCompany?.name, contactData);
    setIsContactModalOpen(false);
    setSelectedCompany(undefined);
  };

  const handleSaveCompany = async (companyData: Partial<Company>) => {
    try {
      if (companyToEdit) {
        console.log('Updating company:', companyToEdit._id, companyData);
        const updatedCompany = await companiesApi.update(companyToEdit._id, companyData);
        setCompanies(companies.map(company =>
          company._id === companyToEdit._id ? updatedCompany : company
        ));
        toast.success('Company updated successfully');
      } else {
        console.log('Creating new company:', companyData);
        const newCompany = await companiesApi.create(companyData as Omit<Company, '_id' | 'createdAt' | 'updatedAt'>);
        setCompanies([...companies, newCompany]);
        toast.success('Company created successfully');
      }
      setIsCompanyModalOpen(false);
      setCompanyToEdit(undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save company';
      console.error('Error in handleSaveCompany:', error);
      toast.error(message);
    }
  };

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="page-header">
        <h1 className="page-title">Companies</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="button primary"
          onClick={() => setIsCompanyModalOpen(true)}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Company
        </motion.button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
          <button
            className="mt-2 text-sm text-red-600 hover:text-red-800"
            onClick={fetchCompanies}
          >
            Try Again
          </button>
        </div>
      )}

      <div className="card mb-6">
        <div className="flex items-center justify-between p-4">
          <div className="search-field">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="col-span-3 text-center py-8 text-gray-500">
            No companies found
          </div>
        ) : (
          filteredCompanies.map(company => (
            <motion.div
              key={company._id}
              className="card p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              layout
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{company.name}</h3>
                  <p className="text-gray-500">{company.industry}</p>
                </div>
                <span className={`status-tag status-${company.status}`}>
                  {company.status}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <span className="text-gray-500">Location:</span> {company.location}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Website:</span> {company.website}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Employees:</span> {company.employees}
                </p>
                <p className="text-sm">
                  <span className="text-gray-500">Revenue:</span> {company.revenue}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex justify-end gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="icon-button"
                    onClick={() => handleEdit(company)}
                  >
                    <PencilSquareIcon className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="icon-button text-red-500"
                    onClick={() => handleDelete(company._id)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </motion.button>
                  <button 
                    className="button primary text-sm"
                    onClick={() => handleContactClick(company)}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setSelectedCompany(undefined);
        }}
        onSave={handleSaveContact}
        contact={selectedCompany ? {
          id: '',
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          company: selectedCompany.id,
          status: 'active',
        } : undefined}
      />

      <CompanyModal
        isOpen={isCompanyModalOpen}
        onClose={() => {
          setIsCompanyModalOpen(false);
          setCompanyToEdit(undefined);
        }}
        onSave={handleSaveCompany}
        company={companyToEdit}
      />
    </motion.div>
  );
};

export default CompaniesPage; 