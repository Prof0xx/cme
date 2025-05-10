import axios from 'axios';

const api = axios.create({
  baseURL: '/api'  // Always use relative path, let the browser handle it
});

export interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number | string;
  example_type?: string;
  example_content?: string;
}

export interface Lead {
  telegram: string;
  message?: string;
  selectedServices: any[];
  totalValue: number;
  referralCode?: string;
  discountApplied?: number;
}

export interface ServiceRequest {
  telegram: string;
  requestedService: string;
  referralCode?: string;
}

export const services = {
  getAll: async () => {
    try {
      console.log('API: Fetching all services');
      const { data } = await api.get<Service[]>('/services');
      console.log('API: Successfully fetched all services');
      return data;
    } catch (error) {
      console.error('API: Error fetching all services:', error);
      throw error;
    }
  },
  
  getByCategory: async (category: string) => {
    try {
      console.log(`API: Fetching services for category '${category}'`);
      const { data } = await api.get<{services: Service[], totalPrice: number}>(`/services/${encodeURIComponent(category)}`);
      console.log(`API: Successfully fetched services for category '${category}':`, data.services?.length || 0, 'services');
      return data;
    } catch (error) {
      console.error(`API: Error fetching services for category '${category}':`, error);
      throw error;
    }
  },

  createRequest: async (request: ServiceRequest) => {
    try {
      console.log('API: Creating service request');
      const { data } = await api.post('/service-requests', request);
      console.log('API: Successfully created service request');
      return data;
    } catch (error) {
      console.error('API: Error creating service request:', error);
      throw error;
    }
  }
};

export const leads = {
  create: async (lead: Lead) => {
    const { data } = await api.post('/leads', lead);
    return data;
  }
};

export const referral = {
  validateCode: async (code: string) => {
    try {
      const { data } = await api.get(`/referral/codes?code=${encodeURIComponent(code)}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
}; 