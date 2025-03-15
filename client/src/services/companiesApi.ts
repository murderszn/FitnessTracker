import axios from 'axios';

export interface Company {
  _id: string;
  name: string;
  industry: string;
  location: string;
  website?: string;
  employees?: number;
  revenue?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Use environment variable for API URL with console logging for debugging
const BASE_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/companies` : 'http://localhost:5176/api/companies';
console.log('API Base URL:', BASE_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout and withCredentials
  timeout: 10000,
  withCredentials: true
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url, {
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle nested data structure
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    // If the response has a nested data structure, return the inner data
    if (response.data && response.data.data) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  (error) => {
    // Enhanced error handling with detailed logging
    console.error('Response error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        headers: error.config?.headers
      }
    });

    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        throw new Error('Unable to connect to the server. Please check if the server is running.');
      }
      if (error.response?.status === 404) {
        throw new Error('The requested resource was not found.');
      }
      if (error.response?.status === 500) {
        throw new Error('An internal server error occurred. Please try again later.');
      }
      const message = error.response?.data?.message || 
                     error.message || 
                     'An unexpected error occurred';
      throw new Error(message);
    }
    throw error;
  }
);

export const companiesApi = {
  getAll: async () => {
    try {
      console.log('Fetching all companies...');
      const response = await api.get<{ data: { companies: Company[] } }>('/');
      console.log('Raw response:', response);
      
      // Handle the nested response format from the server
      if (response.data?.data?.companies) {
        return { companies: response.data.data.companies };
      }
      
      console.error('Unexpected response format:', response);
      throw new Error('Invalid response format from server');
    } catch (error) {
      console.error('Error in getAll:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to fetch companies: ${error.message}`);
      }
      throw new Error('Failed to fetch companies');
    }
  },

  getById: async (id: string) => {
    try {
      const response = await api.get<Company>(`/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch company: ${error.message}`);
      }
      throw new Error('Failed to fetch company');
    }
  },

  create: async (company: Omit<Company, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('Creating company with data:', company);
      const response = await api.post<Company>('/', company);
      console.log('Company created:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in create:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create company: ${error.message}`);
      }
      throw new Error('Failed to create company');
    }
  },

  update: async (id: string, company: Partial<Omit<Company, '_id' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const response = await api.put<Company>(`/${id}`, company);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update company: ${error.message}`);
      }
      throw new Error('Failed to update company');
    }
  },

  delete: async (id: string) => {
    try {
      await api.delete(`/${id}`);
      return { message: 'Company deleted successfully' };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete company: ${error.message}`);
      }
      throw new Error('Failed to delete company');
    }
  },

  getStats: async () => {
    try {
      const response = await axios.get<ApiResponse<any>>(`${BASE_URL}/stats`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch company stats');
      }
      throw error;
    }
  }
}; 