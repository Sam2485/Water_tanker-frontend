// AdminMapPage.jsx (JavaScript)
import React, { useState, useEffect } from 'react';
import { tankerService } from '../../services/tankerService';
import { requestService } from '../../services/requestService';
import { emergencyService } from '../../services/emergencyService';
import { assignmentService } from '../../services/assignmentService';
import { mockStateManager } from '../../services/mockStateManager';
import { LiveMap } from '../../components/maps/LiveMap';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Layers,
  Truck,
  MapPin,
  AlertOctagon,
  X,
  Phone,
  Clock,
  ShieldCheck,
  Building2,
  Users,
} from 'lucide-react';

export const AdminMapPage = () => {
  const [tankers, setTankers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedTanker, setSelectedTanker] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [tankersData, reqsData, emgsData, asgsData] = await Promise.all([
        tankerService.getTankers(),
        requestService.getRequests(),
        emergencyService.getEmergencies(),
        assignmentService.getAssignments(),
      ]);

      setTankers(tankersData);
      setRequests(reqsData);
      setEmergencies(emgsData);
      setAssignments(asgsData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockStateManager.subscribe(loadData);
    return unsubscribe;
  }, []);

  if (loading) return <LoadingSpinner text="Initializing Full GIS Command Center..." />;

  return (
    <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 68px)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Banner Controls */}
      <div
        style={{
          padding: '8px 1.5rem',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            GIS Fleet & Shortage Command Center
          </h2>
          <span style={{ backgroundColor: 'var(--primary-100)', color: 'var(--primary-800)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
            {tankers.length} Active Tankers • {requests.length} Requests • {emergencies.length} Critical Facilities
          </span>
        </div>

        <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
          Click any tanker or request pin on the map to inspect live telemetries.
        </div>
      </div>

      {/* Full Map Canvas */}
      <div style={{ flex: 1, position: 'relative' }}>
        <LiveMap
          tankers={tankers}
          requests={requests}
          emergencies={emergencies}
          height="100%"
          zoom={13}
          onSelectTanker={(tanker) => {
            setSelectedTanker(tanker);
            setSelectedRequest(null);
          }}
          onSelectRequest={(req) => {
            setSelectedRequest(req);
            setSelectedTanker(null);
          }}
        />

        {/* Selected Tanker Inspection Drawer */}
        {selectedTanker && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              width: '320px',
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(6px)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
              zIndex: 300,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Truck size={18} color="var(--primary-600)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  {selectedTanker.registrationNumber}
                </h4>
              </div>
              <button onClick={() => setSelectedTanker(null)} style={{ color: 'var(--slate-400)' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <StatusBadge status={selectedTanker.status} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--slate-700)', borderTop: '1px solid var(--slate-100)', paddingTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-400)' }}>Driver:</span>
                <strong>{selectedTanker.driver.name} ({selectedTanker.driver.rating} ★)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-400)' }}>Phone:</span>
                <a href={`tel:${selectedTanker.driver.phone}`} style={{ color: 'var(--primary-600)', fontWeight: 600 }}>
                  {selectedTanker.driver.phone}
                </a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-400)' }}>Current Liters:</span>
                <strong>{selectedTanker.currentLiters.toLocaleString()} / {selectedTanker.capacityLiters.toLocaleString()} L</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-400)' }}>Speed / Heading:</span>
                <strong>{selectedTanker.speedKmH} km/h ({selectedTanker.heading}°)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-400)' }}>Battery / Fuel:</span>
                <strong>{selectedTanker.batteryLevel}%</strong>
              </div>
            </div>
          </div>
        )}

        {/* Selected Request Inspection Drawer */}
        {selectedRequest && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              width: '320px',
              backgroundColor: 'rgba(255, 255, 255, 0.96)',
              backdropFilter: 'blur(6px)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-xl)',
              border: '1px solid var(--border-color)',
              zIndex: 300,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={18} color="#e11d48" />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  #{selectedRequest.id}
                </h4>
              </div>
              <button onClick={() => setSelectedRequest(null)} style={{ color: 'var(--slate-400)' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
              <PriorityBadge level={selectedRequest.priorityLevel} size="sm" />
              <StatusBadge status={selectedRequest.status} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--slate-700)', borderTop: '1px solid var(--slate-100)', paddingTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-400)' }}>Requester:</span>
                <strong>{selectedRequest.citizenName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-400)' }}>Address:</span>
                <strong style={{ textAlign: 'right', maxWidth: '180px' }}>{selectedRequest.address}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-400)' }}>Quantity:</span>
                <strong>{selectedRequest.quantityLiters.toLocaleString()} Liters</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-400)' }}>Days Without Water:</span>
                <strong style={{ color: '#be123c' }}>{selectedRequest.daysWithoutWater} days</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--slate-400)' }}>AI Priority Score:</span>
                <strong style={{ color: 'var(--primary-700)' }}>{selectedRequest.priorityScore} / 10</strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
