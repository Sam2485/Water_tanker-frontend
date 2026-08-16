// AquaEquity Delivery Verification Service (JavaScript)
import { apiClient, USE_MOCK_API } from './apiClient';
import { mockStateManager } from './mockStateManager';

class DeliveryService {
  async verifyOtp(dto) {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 700));
      const isValid = mockStateManager.verifyDeliveryOtp(dto.assignmentId, dto.otpCode);
      if (isValid) {
        return {
          success: true,
          message: 'Delivery Verified and Completed successfully.',
          completedAt: new Date().toISOString(),
          volumeDispensed: 6000,
          waterQualityTds: 142,
        };
      }
      return {
        success: false,
        message: 'Invalid OTP code. Please enter the 6-digit OTP provided in the citizen portal.',
      };
    }

    const res = await apiClient.post('/delivery/verify', dto);
    return res.data;
  }

  async simulateGeofenceArrival(assignmentId) {
    if (USE_MOCK_API) {
      await new Promise((r) => setTimeout(r, 400));
      return mockStateManager.simulateGeofenceArrival(assignmentId);
    }
    const res = await apiClient.post(`/delivery/simulate-geofence/${assignmentId}`);
    return res.data;
  }
}

export const deliveryService = new DeliveryService();
