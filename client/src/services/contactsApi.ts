import axios from 'axios';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string; // This will be the company ID
  title?: string;
  status: 'active' | 'inactive' | 'lead';
  assignedTo?: string; // User ID
  lastContact?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const contactsApi = {
  getAll: async () => {
    try {
      const response = await api.get<ApiResponse<{ contacts: Contact[] }>>('/api/contacts');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw new Error('Failed to fetch contacts');
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get<ApiResponse<Contact>>(`/api/contacts/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching contact:', error);
      throw new Error('Failed to fetch contact');
    }
  },

  create: async (contact: Omit<Contact, 'id'>) => {
    try {
      const response = await api.post<ApiResponse<Contact>>('/api/contacts', {
        ...contact,
        assignedTo: '1', // TODO: Replace with actual logged-in user ID
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating contact:', error);
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to create contact');
      }
      throw new Error('Failed to create contact');
    }
  },

  update: async (id: string, contact: Partial<Contact>) => {
    try {
      const response = await api.put<ApiResponse<Contact>>(`/api/contacts/${id}`, contact);
      return response.data.data;
    } catch (error) {
      console.error('Error updating contact:', error);
      throw new Error('Failed to update contact');
    }
  },

  delete: async (id: string) => {
    try {
      const response = await api.delete<ApiResponse<void>>(`/api/contacts/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw new Error('Failed to delete contact');
    }
  },

  getStats: async () => {
    try {
      const response = await api.get<ApiResponse<any>>('/api/contacts/stats');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching contact stats:', error);
      throw new Error('Failed to fetch contact stats');
    }
  }
}; 