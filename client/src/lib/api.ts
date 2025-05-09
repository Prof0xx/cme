import axios from 'axios';

const api = axios.create({
  baseURL: '/api'  // Always use relative path, let the browser handle it
});

export interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  features: string[];
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
  telegramHandle: string;
  description: string;
  referralCode?: string;
}

export const services = {
  getAll: async () => {
    const { data } = await api.get<Service[]>('/services');
    return data;
  },
  
  getByCategory: async (category: string) => {
    const { data } = await api.get<Service[]>(`/services?category=${encodeURIComponent(category)}`);
    return data;
  },

  createRequest: async (request: ServiceRequest) => {
    const { data } = await api.post('/service-requests', request);
    return data;
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