// AquaEquity Emergency Service (JavaScript)
import { apiClient, USE_MOCK_API } from './apiClient';
import { mockStateManager } from './mockStateManager';

class EmergencyService {
  async getEmergencies() {
    if (USE_MOCK_API) {
      return mockStateManager.getEmergencies();
    }
    const res = await apiClient.get('/emergency/active');
    return res.data;
  }

  async triggerOverride(emergencyId) {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 600));
      return mockStateManager.triggerEmergencyOverride(emergencyId);
    }
    const res = await apiClient.post('/emergency/override', { emergencyId });
    return res.data;
  }
}

export const emergencyService = new EmergencyService();
