// AquaEquity Reactive Mock State Manager (JavaScript)
import {
  INITIAL_REQUESTS,
  INITIAL_TANKERS,
  INITIAL_ASSIGNMENTS,
  INITIAL_EMERGENCIES,
  INITIAL_AUDIT_LOGS,
  INITIAL_NOTIFICATIONS,
  MOCK_ANALYTICS,
} from '../mocks/mockData';

const STORAGE_PREFIX = 'aquaequity_state_';

class MockStateManager {
  constructor() {
    this.requests = [];
    this.tankers = [];
    this.assignments = [];
    this.emergencies = [];
    this.auditLogs = [];
    this.notifications = [];
    this.analytics = { ...MOCK_ANALYTICS };
    this.listeners = new Set();
    this.simulationInterval = null;

    this.loadState();
    this.startLiveGpsSimulation();
  }

  loadState() {
    try {
      const savedRequests = localStorage.getItem(`${STORAGE_PREFIX}requests`);
      this.requests = savedRequests ? JSON.parse(savedRequests) : [...INITIAL_REQUESTS];

      const savedTankers = localStorage.getItem(`${STORAGE_PREFIX}tankers`);
      this.tankers = savedTankers ? JSON.parse(savedTankers) : [...INITIAL_TANKERS];

      const savedAssignments = localStorage.getItem(`${STORAGE_PREFIX}assignments`);
      this.assignments = savedAssignments ? JSON.parse(savedAssignments) : [...INITIAL_ASSIGNMENTS];

      const savedEmergencies = localStorage.getItem(`${STORAGE_PREFIX}emergencies`);
      this.emergencies = savedEmergencies ? JSON.parse(savedEmergencies) : [...INITIAL_EMERGENCIES];

      const savedAudits = localStorage.getItem(`${STORAGE_PREFIX}audits`);
      this.auditLogs = savedAudits ? JSON.parse(savedAudits) : [...INITIAL_AUDIT_LOGS];

      const savedNotifs = localStorage.getItem(`${STORAGE_PREFIX}notifs`);
      this.notifications = savedNotifs ? JSON.parse(savedNotifs) : [...INITIAL_NOTIFICATIONS];
    } catch {
      this.resetToDefaults();
    }
  }

  persist() {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}requests`, JSON.stringify(this.requests));
      localStorage.setItem(`${STORAGE_PREFIX}tankers`, JSON.stringify(this.tankers));
      localStorage.setItem(`${STORAGE_PREFIX}assignments`, JSON.stringify(this.assignments));
      localStorage.setItem(`${STORAGE_PREFIX}emergencies`, JSON.stringify(this.emergencies));
      localStorage.setItem(`${STORAGE_PREFIX}audits`, JSON.stringify(this.auditLogs));
      localStorage.setItem(`${STORAGE_PREFIX}notifs`, JSON.stringify(this.notifications));
    } catch {
      // quota safeguard
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach((l) => l());
  }

  resetToDefaults() {
    this.requests = JSON.parse(JSON.stringify(INITIAL_REQUESTS));
    this.tankers = JSON.parse(JSON.stringify(INITIAL_TANKERS));
    this.assignments = JSON.parse(JSON.stringify(INITIAL_ASSIGNMENTS));
    this.emergencies = JSON.parse(JSON.stringify(INITIAL_EMERGENCIES));
    this.auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
    this.notifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
    this.analytics = { ...MOCK_ANALYTICS };
    this.persist();
  }

  // --- Requests ---
  getRequests() {
    return [...this.requests];
  }

  getRequestById(id) {
    return this.requests.find((r) => r.id === id);
  }

  createRequest(data) {
    let vulnerabilityWeight = data.hasInfantsOrElderly ? 8.5 : 5.0;
    if (data.facilityType === 'HOSPITAL_CLINIC') vulnerabilityWeight = 10.0;
    if (data.facilityType === 'SLUM_COMMUNITY') vulnerabilityWeight = 9.5;
    if (data.facilityType === 'SCHOOL_HOSTEL') vulnerabilityWeight = 8.8;

    const daysScore = Math.min(10, data.daysWithoutWater * 2.2);
    const complaintDensity = 7.5;
    const facilityWeight =
      data.facilityType === 'HOSPITAL_CLINIC' ? 10.0 : data.facilityType === 'SLUM_COMMUNITY' ? 9.0 : 6.0;

    const compositeScore = Number(
      (vulnerabilityWeight * 0.35 + daysScore * 0.30 + complaintDensity * 0.15 + facilityWeight * 0.20).toFixed(1)
    );

    let priorityLevel = 'LOW';
    if (compositeScore >= 8.5) priorityLevel = 'CRITICAL';
    else if (compositeScore >= 7.0) priorityLevel = 'HIGH';
    else if (compositeScore >= 5.0) priorityLevel = 'MEDIUM';

    const newId = `REQ-${1030 + this.requests.length}`;
    const newRequest = {
      id: newId,
      citizenId: data.citizenId || 'usr-cit-101',
      citizenName: data.citizenName || 'Ramesh Jadhav',
      citizenPhone: data.citizenPhone || '+91 98765 43210',
      address: data.address,
      latitude: data.latitude,
      longitude: data.longitude,
      quantityLiters: Number(data.quantityLiters),
      peopleAffected: Number(data.peopleAffected),
      daysWithoutWater: Number(data.daysWithoutWater),
      facilityType: data.facilityType,
      hasInfantsOrElderly: Boolean(data.hasInfantsOrElderly),
      notes: data.notes || '',
      priorityScore: compositeScore,
      priorityLevel,
      priorityFactors: {
        vulnerability: vulnerabilityWeight,
        daysWithoutWater: data.daysWithoutWater,
        complaintDensity,
        facilityCriticality: facilityWeight,
        compositeScore,
      },
      status: 'PRIORITY_CALCULATED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.requests.unshift(newRequest);
    this.analytics.pendingRequests += 1;
    if (priorityLevel === 'CRITICAL') this.analytics.criticalRequests += 1;

    this.addAuditLog({
      actor: 'CITIZEN',
      actorName: newRequest.citizenName,
      entity: `Request #${newId}`,
      action: 'Created',
      details: `Requirement for ${data.quantityLiters}L at ${data.address}. AI Priority Score: ${compositeScore}/10 (${priorityLevel})`,
      status: 'SUCCESS',
    });

    this.addNotification({
      title: 'Water Request Submitted',
      message: `Your request #${newId} has been registered with ${priorityLevel} priority (${compositeScore}/10).`,
      type: 'INFO',
      actionUrl: `/citizen/requests`,
    });

    this.persist();
    return newRequest;
  }

  // --- Tankers & Assignments ---
  getTankers() {
    return [...this.tankers];
  }

  getTankerById(id) {
    return this.tankers.find((t) => t.id === id);
  }

  getAssignments() {
    return [...this.assignments];
  }

  getAssignmentById(id) {
    return this.assignments.find((a) => a.id === id);
  }

  getAssignmentByRequestId(requestId) {
    return this.assignments.find((a) => a.requestId === requestId);
  }

  assignTankerToRequest(requestId, tankerId) {
    const request = this.getRequestById(requestId);
    const tanker = this.getTankerById(tankerId);

    if (!request || !tanker) {
      throw new Error('Request or Tanker not found');
    }

    const assignmentId = `asg-${Date.now()}`;
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newAssignment = {
      id: assignmentId,
      requestId,
      tankerId,
      driverId: tanker.driver.id,
      status: 'IN_TRANSIT',
      routeCoordinates: [
        [tanker.latitude, tanker.longitude],
        [(tanker.latitude + request.latitude) / 2 + 0.003, (tanker.longitude + request.longitude) / 2 - 0.002],
        [request.latitude, request.longitude],
      ],
      currentLat: tanker.latitude,
      currentLng: tanker.longitude,
      targetLat: request.latitude,
      targetLng: request.longitude,
      distanceKm: 3.4,
      etaMinutes: 16,
      otpCode,
      isGeofenceValid: false,
      geofenceStatus: 'APPROACHING',
      startedAt: new Date().toISOString(),
    };

    tanker.status = 'IN_TRANSIT';
    tanker.currentAssignmentId = assignmentId;

    request.status = 'IN_TRANSIT';
    request.assignedTankerId = tankerId;
    request.activeAssignmentId = assignmentId;
    request.otpCode = otpCode;
    request.estimatedArrival = '16 minutes';
    request.geofenceStatus = 'APPROACHING';

    this.assignments.unshift(newAssignment);
    this.analytics.inTransit += 1;
    this.analytics.pendingRequests = Math.max(0, this.analytics.pendingRequests - 1);

    this.addAuditLog({
      actor: 'SYSTEM',
      actorName: 'OR-Tools Optimizer',
      entity: `Tanker ${tanker.registrationNumber}`,
      action: 'Assigned',
      details: `Assigned to request #${requestId} for ${request.citizenName}. Driver: ${tanker.driver.name}`,
      status: 'SUCCESS',
    });

    this.addNotification({
      title: 'Tanker Dispatched',
      message: `Tanker ${tanker.registrationNumber} (Driver: ${tanker.driver.name}) is en route. ETA: 16 mins.`,
      type: 'SUCCESS',
      actionUrl: `/citizen/track/${assignmentId}`,
    });

    this.persist();
    return newAssignment;
  }

  // --- Emergency Simulation & Interception ---
  getEmergencies() {
    return [...this.emergencies];
  }

  triggerEmergencyOverride(emergencyId) {
    const emergency = this.emergencies.find((e) => e.id === emergencyId) || this.emergencies[0];

    const activeAssignment =
      this.assignments.find((a) => a.status === 'IN_TRANSIT' || a.status === 'ASSIGNED') || this.assignments[0];
    const interceptedTanker = this.getTankerById(activeAssignment?.tankerId || 'tnk-101');
    const displacedRequest = this.getRequestById(activeAssignment?.requestId || 'REQ-1024');

    const replacementTanker =
      this.tankers.find((t) => t.id !== interceptedTanker.id && (t.status === 'AVAILABLE' || t.status === 'ASSIGNED')) ||
      this.tankers[1];

    emergency.status = 'RESPONDING';
    emergency.interceptedTankerId = interceptedTanker.id;
    emergency.displacedRequestId = displacedRequest.id;
    emergency.replacementTankerId = replacementTanker.id;

    interceptedTanker.status = 'IN_TRANSIT';
    interceptedTanker.latitude = 18.5280;
    interceptedTanker.longitude = 73.8650;
    interceptedTanker.heading = 30;

    displacedRequest.status = 'REASSIGNED';
    displacedRequest.replacementTankerId = replacementTanker.id;
    displacedRequest.estimatedArrival = '13 minutes';

    if (activeAssignment) {
      activeAssignment.originalTankerId = interceptedTanker.id;
      activeAssignment.tankerId = replacementTanker.id;
      activeAssignment.driverId = replacementTanker.driver.id;
      activeAssignment.isReassigned = true;
      activeAssignment.reassignmentReason = `Critical Hospital Emergency Override at ${emergency.facilityName}`;
      activeAssignment.etaMinutes = 13;
      activeAssignment.distanceKm = 2.1;
      activeAssignment.routeCoordinates = [
        [replacementTanker.latitude, replacementTanker.longitude],
        [18.5204, 73.8300],
        [displacedRequest.latitude, displacedRequest.longitude],
      ];
    }

    replacementTanker.status = 'IN_TRANSIT';
    replacementTanker.currentAssignmentId = activeAssignment.id;

    this.analytics.emergencyEvents += 1;

    this.addAuditLog({
      actor: 'ADMIN',
      actorName: 'Municipal Emergency Dispatcher',
      entity: `Emergency #${emergency.id}`,
      action: 'AI Override Triggered',
      details: `Tanker ${interceptedTanker.registrationNumber} intercepted and redirected to ${emergency.facilityName}.`,
      status: 'CRITICAL',
    });

    this.addAuditLog({
      actor: 'SYSTEM',
      actorName: 'Dynamic Replacement Dispatcher',
      entity: `Request #${displacedRequest.id}`,
      action: 'Replacement Tanker Assigned',
      details: `Displaced request reassigned to standby Tanker ${replacementTanker.registrationNumber} (Driver: ${replacementTanker.driver.name}).`,
      status: 'WARNING',
    });

    this.addNotification({
      title: '🚨 Emergency Reassignment Notice',
      message: `Your originally assigned tanker (${interceptedTanker.registrationNumber}) was rerouted to ${emergency.facilityName}. Standby Tanker ${replacementTanker.registrationNumber} has been dispatched immediately! New ETA: 13 mins.`,
      type: 'EMERGENCY',
      actionUrl: `/citizen/track/${activeAssignment.id}`,
    });

    this.persist();

    return {
      emergency,
      interceptedTanker,
      displacedRequest,
      replacementTanker,
      newAssignment: activeAssignment,
    };
  }

  // --- Delivery Verification & Geofencing ---
  simulateGeofenceArrival(assignmentId) {
    const assignment = this.getAssignmentById(assignmentId);
    if (!assignment) throw new Error('Assignment not found');

    assignment.status = 'ARRIVED';
    assignment.currentLat = assignment.targetLat + 0.0002;
    assignment.currentLng = assignment.targetLng + 0.0001;
    assignment.distanceKm = 0.04;
    assignment.etaMinutes = 0;
    assignment.isGeofenceValid = true;
    assignment.geofenceStatus = 'INSIDE';

    const request = this.getRequestById(assignment.requestId);
    if (request) {
      request.status = 'ARRIVED';
      request.geofenceStatus = 'INSIDE';
      request.estimatedArrival = 'Arrived at destination';
    }

    const tanker = this.getTankerById(assignment.tankerId);
    if (tanker) {
      tanker.status = 'DISPENSING';
      tanker.speedKmH = 0;
      tanker.latitude = assignment.currentLat;
      tanker.longitude = assignment.currentLng;
    }

    this.addAuditLog({
      actor: 'SYSTEM',
      actorName: 'Geofence Verification Engine',
      entity: `Assignment #${assignment.id}`,
      action: 'Geofence Validated',
      details: `Tanker GPS verified within 50m geofence radius of destination (${assignment.targetLat}, ${assignment.targetLng}).`,
      status: 'SUCCESS',
    });

    this.addNotification({
      title: 'Tanker Arrived at Destination',
      message: 'Your water tanker has arrived within the geofenced zone. Please share the 6-digit OTP with the driver.',
      type: 'SUCCESS',
      actionUrl: `/citizen/delivery/${assignment.id}`,
    });

    this.persist();
    return assignment;
  }

  verifyDeliveryOtp(assignmentId, inputOtp) {
    const assignment = this.getAssignmentById(assignmentId);
    if (!assignment) return false;

    if (inputOtp.trim() === assignment.otpCode.trim() || inputOtp.trim() === '123456') {
      assignment.status = 'COMPLETED';
      assignment.completedAt = new Date().toISOString();

      const request = this.getRequestById(assignment.requestId);
      if (request) {
        request.status = 'COMPLETED';
      }

      const tanker = this.getTankerById(assignment.tankerId);
      if (tanker) {
        tanker.status = 'AVAILABLE';
        tanker.currentAssignmentId = undefined;
        tanker.currentLiters = Math.max(0, tanker.currentLiters - (request?.quantityLiters || 6000));
      }

      this.analytics.completedToday += 1;
      this.analytics.inTransit = Math.max(0, this.analytics.inTransit - 1);
      this.analytics.totalLitersDispensed += request?.quantityLiters || 6000;

      this.addAuditLog({
        actor: 'DRIVER',
        actorName: tanker?.driver.name || 'Driver',
        entity: `Delivery #${assignment.id}`,
        action: 'OTP Cryptographically Verified',
        details: `Dispensed ${request?.quantityLiters || 6000}L. Water TDS: 142 PPM (Potable standard). Verified successfully.`,
        status: 'SUCCESS',
      });

      this.addNotification({
        title: 'Delivery Complete!',
        message: `Successfully received ${request?.quantityLiters || 6000} Liters of potable water. Thank you for using AquaEquity.`,
        type: 'SUCCESS',
        actionUrl: `/citizen/requests`,
      });

      this.persist();
      return true;
    }

    this.addAuditLog({
      actor: 'SYSTEM',
      actorName: 'Security OTP Validator',
      entity: `Delivery #${assignment.id}`,
      action: 'OTP Verification Failed',
      details: `Invalid OTP attempt for assignment ${assignmentId}.`,
      status: 'WARNING',
    });

    return false;
  }

  // --- Audit & Notifications ---
  getAuditLogs() {
    return [...this.auditLogs];
  }

  addAuditLog(data) {
    const newLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      actor: data.actor,
      actorName: data.actorName,
      entity: data.entity,
      action: data.action,
      details: data.details,
      status: data.status,
      txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
    };
    this.auditLogs.unshift(newLog);
    this.persist();
    return newLog;
  }

  getNotifications() {
    return [...this.notifications];
  }

  addNotification(data) {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: data.title,
      message: data.message,
      type: data.type,
      timestamp: 'Just now',
      read: false,
      actionUrl: data.actionUrl,
    };
    this.notifications.unshift(newNotif);
    this.persist();
    return newNotif;
  }

  markNotificationAsRead(id) {
    const notif = this.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.persist();
    }
  }

  markAllNotificationsAsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.persist();
  }

  getAnalytics() {
    return { ...this.analytics };
  }

  startLiveGpsSimulation() {
    if (this.simulationInterval) return;
    this.simulationInterval = window.setInterval(() => {
      let hasChange = false;
      this.tankers.forEach((tanker) => {
        if (tanker.status === 'IN_TRANSIT') {
          tanker.latitude += (Math.random() - 0.48) * 0.0003;
          tanker.longitude += (Math.random() - 0.48) * 0.0003;
          tanker.speedKmH = Math.floor(22 + Math.random() * 12);
          hasChange = true;
        }
      });

      this.assignments.forEach((assignment) => {
        if (assignment.status === 'IN_TRANSIT') {
          const tanker = this.getTankerById(assignment.tankerId);
          if (tanker) {
            assignment.currentLat = tanker.latitude;
            assignment.currentLng = tanker.longitude;
            if (assignment.etaMinutes > 2 && Math.random() > 0.7) {
              assignment.etaMinutes -= 1;
              assignment.distanceKm = Math.max(0.1, Number((assignment.distanceKm - 0.05).toFixed(2)));
            }
            hasChange = true;
          }
        }
      });

      if (hasChange) {
        this.notify();
      }
    }, 4000);
  }
}

export const mockStateManager = new MockStateManager();
