// AquaEquity Water Request Service (JavaScript)
import { apiClient, USE_MOCK_API } from './apiClient';
import { mockStateManager } from './mockStateManager';

class RequestService {
  async getRequests() {
    if (USE_MOCK_API) {
      return mockStateManager.getRequests();
    }
    const res = await apiClient.get('/requests');
    return res.data;
  }

  async getRequestById(id) {
    if (USE_MOCK_API) {
      return mockStateManager.getRequestById(id) || null;
    }
    const res = await apiClient.get(`/requests/${id}`);
    return res.data;
  }

  async createRequest(data) {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 600));
      return mockStateManager.createRequest(data);
    }
    const res = await apiClient.post('/requests', data);
    return res.data;
  }

  async getRequestsByCitizen(citizenId) {
    const all = await this.getRequests();
    return all.filter((r) => r.citizenId === citizenId || r.citizenPhone === '+91 98765 43210');
  }
}

export const requestService = new RequestService();
