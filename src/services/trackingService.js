// AquaEquity Tracking Service (JavaScript)
import { apiClient, USE_MOCK_API } from './apiClient';
import { mockStateManager } from './mockStateManager';

class TrackingService {
  async getTankerLocation(tankerId) {
    if (USE_MOCK_API) {
      const tanker = mockStateManager.getTankerById(tankerId);
      if (!tanker) return null;
      const assignments = mockStateManager.getAssignments();
      const assignment = assignments.find((a) => a.tankerId === tankerId);

      return {
        tankerId,
        latitude: tanker.latitude,
        longitude: tanker.longitude,
        speedKmH: tanker.speedKmH,
        heading: tanker.heading,
        distanceKm: assignment?.distanceKm || 1.8,
        etaMinutes: assignment?.etaMinutes || 12,
        geofenceStatus: assignment?.geofenceStatus || 'APPROACHING',
        lastPing: 'Live Telemetry',
      };
    }

    const res = await apiClient.get(`/tracking/${tankerId}`);
    return res.data;
  }

  subscribeToTankerLocation(tankerId, callback) {
    if (USE_MOCK_API) {
      const unsubscribe = mockStateManager.subscribe(() => {
        this.getTankerLocation(tankerId).then((loc) => {
          if (loc) callback(loc);
        });
      });
      return unsubscribe;
    }

    const interval = setInterval(async () => {
      try {
        const loc = await this.getTankerLocation(tankerId);
        if (loc) callback(loc);
      } catch {
        // error handling
      }
    }, 4000);

    return () => clearInterval(interval);
  }
}

export const trackingService = new TrackingService();
