// AquaEquity Tanker Service (JavaScript)
import { apiClient, USE_MOCK_API } from './apiClient';
import { mockStateManager } from './mockStateManager';

class TankerService {
  async getTankers() {
    if (USE_MOCK_API) {
      return mockStateManager.getTankers();
    }
    const res = await apiClient.get('/tankers');
    return res.data;
  }

  async getTankerById(id) {
    if (USE_MOCK_API) {
      return mockStateManager.getTankerById(id) || null;
    }
    const res = await apiClient.get(`/tankers/${id}`);
    return res.data;
  }

  async updateTankerStatus(id, status) {
    if (USE_MOCK_API) {
      const tanker = mockStateManager.getTankerById(id);
      if (!tanker) throw new Error('Tanker not found');
      tanker.status = status;
      mockStateManager.persist();
      return tanker;
    }
    const res = await apiClient.patch(`/tankers/${id}/status`, { status });
    return res.data;
  }
}

export const tankerService = new TankerService();
