// AquaEquity Assignment Service (JavaScript)
import { apiClient, USE_MOCK_API } from './apiClient';
import { mockStateManager } from './mockStateManager';

class AssignmentService {
  async getAssignments() {
    if (USE_MOCK_API) {
      return mockStateManager.getAssignments();
    }
    const res = await apiClient.get('/assignments');
    return res.data;
  }

  async getAssignmentById(id) {
    if (USE_MOCK_API) {
      return mockStateManager.getAssignmentById(id) || null;
    }
    const res = await apiClient.get(`/assignments/${id}`);
    return res.data;
  }

  async getAssignmentByRequestId(requestId) {
    if (USE_MOCK_API) {
      return mockStateManager.getAssignmentByRequestId(requestId) || null;
    }
    const res = await apiClient.get(`/assignments/request/${requestId}`);
    return res.data;
  }

  async assignTanker(requestId, tankerId) {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 400));
      return mockStateManager.assignTankerToRequest(requestId, tankerId);
    }
    const res = await apiClient.post('/assignments', { requestId, tankerId });
    return res.data;
  }
}

export const assignmentService = new AssignmentService();
