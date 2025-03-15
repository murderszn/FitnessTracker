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
import { contactsApi, Contact } from '../../services/contactsApi';
import { toast } from 'react-hot-toast';

const ContactsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const data = await contactsApi.getAll();
      setContacts(Array.isArray(data.contacts) ? data.contacts : []);
    } catch (error) {
      toast.error('Failed to fetch contacts. Please try again later.');
      console.error('Error fetching contacts:', error);
      setContacts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await contactsApi.delete(id);
      setContacts(contacts.filter(contact => contact.id !== id));
      toast.success('Contact deleted successfully');
    } catch (error) {
      toast.error('Failed to delete contact');
      console.error('Error deleting contact:', error);
    }
  };

  const handleEdit = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
  };

  const handleSave = async (contactData: Partial<Contact>) => {
    try {
      if (selectedContact) {
        // Update existing contact
        const updatedContact = await contactsApi.update(selectedContact.id, contactData);
        setContacts(contacts.map(contact =>
          contact.id === selectedContact.id ? updatedContact : contact
        ));
        toast.success('Contact updated successfully');
      } else {
        // Create new contact
        const newContact = await contactsApi.create(contactData as Omit<Contact, 'id'>);
        setContacts([...contacts, newContact]);
        toast.success('Contact created successfully');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save contact');
      console.error('Error saving contact:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContact(undefined);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="page-header">
        <h1 className="page-title">Contacts</h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="button primary"
          onClick={() => setIsModalOpen(true)}
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Contact
        </motion.button>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between p-4">
          <div className="search-field">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
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

      <div className="card">
        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Status</th>
                <th>Last Contact</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map(contact => (
                <motion.tr
                  key={contact.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                >
                  <td>{`${contact.firstName} ${contact.lastName}`}</td>
                  <td>{contact.email}</td>
                  <td>{contact.phone}</td>
                  <td>{contact.company}</td>
                  <td>
                    <span className={`status-tag status-${contact.status}`}>
                      {contact.status}
                    </span>
                  </td>
                  <td>{contact.lastContact ? new Date(contact.lastContact).toLocaleDateString() : '-'}</td>
                  <td>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="icon-button"
                        onClick={() => handleEdit(contact)}
                      >
                        <PencilSquareIcon className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="icon-button text-red-500"
                        onClick={() => handleDelete(contact.id)}
                      >
                        <TrashIcon className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        contact={selectedContact}
      />
    </motion.div>
  );
};

export default ContactsPage; 