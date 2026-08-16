// AquaEquity Notification Service (JavaScript)
import { mockStateManager } from './mockStateManager';

class NotificationService {
  getNotifications() {
    return mockStateManager.getNotifications();
  }

  markAsRead(id) {
    mockStateManager.markNotificationAsRead(id);
  }

  markAllAsRead() {
    mockStateManager.markAllNotificationsAsRead();
  }

  subscribe(callback) {
    return mockStateManager.subscribe(() => {
      callback(mockStateManager.getNotifications());
    });
  }
}

export const notificationService = new NotificationService();
