// AquaEquity Analytics Service (JavaScript)
import { apiClient, USE_MOCK_API } from './apiClient';
import { mockStateManager } from './mockStateManager';
import {
  MOCK_ANALYTICS,
  MOCK_PRIORITY_DISTRIBUTION,
  MOCK_DAILY_DELIVERIES,
  MOCK_WARD_EQUITY,
} from '../mocks/mockData';

class AnalyticsService {
  async getSummary() {
    if (USE_MOCK_API) {
      return mockStateManager.getAnalytics();
    }
    const res = await apiClient.get('/admin/analytics/summary');
    return res.data;
  }

  async getPriorityDistribution() {
    if (USE_MOCK_API) {
      return MOCK_PRIORITY_DISTRIBUTION;
    }
    const res = await apiClient.get('/admin/analytics/priorities');
    return res.data;
  }

  async getDailyDeliveries() {
    if (USE_MOCK_API) {
      return MOCK_DAILY_DELIVERIES;
    }
    const res = await apiClient.get('/admin/analytics/daily');
    return res.data;
  }

  async getWardEquityMetrics() {
    if (USE_MOCK_API) {
      return MOCK_WARD_EQUITY;
    }
    const res = await apiClient.get('/admin/analytics/wards');
    return res.data;
  }
}

export const analyticsService = new AnalyticsService();
