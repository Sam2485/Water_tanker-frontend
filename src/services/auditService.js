// AquaEquity Audit Log Service (JavaScript)
import { mockStateManager } from './mockStateManager';

class AuditService {
  getAuditLogs() {
    return mockStateManager.getAuditLogs();
  }

  logEvent(data) {
    return mockStateManager.addAuditLog(data);
  }

  subscribe(callback) {
    return mockStateManager.subscribe(() => {
      callback(mockStateManager.getAuditLogs());
    });
  }
}

export const auditService = new AuditService();
