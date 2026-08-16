// TankerManagementPage.jsx (JavaScript)
import React, { useState, useEffect } from 'react';
import { tankerService } from '../../services/tankerService';
import { mockStateManager } from '../../services/mockStateManager';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Truck,
  Phone,
  Battery,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  X,
  Gauge,
  MapPin,
  Calendar,
} from 'lucide-react';

export const TankerManagementPage = () => {
  const [tankers, setTankers] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [selectedTanker, setSelectedTanker] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await tankerService.getTankers();
      setTankers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockStateManager.subscribe(loadData);
    return unsubscribe;
  }, []);

  const filteredTankers = tankers.filter((t) => {
    if (filter === 'ALL') return true;
    return t.status === filter;
  });

  if (loading) return <LoadingSpinner text="Loading municipal fleet inventory..." />;

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Tanker Fleet Management
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            Real-time fleet status, GPS tracking telemetries, driver assignments and vehicle capacity gauges
          </p>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {['ALL', 'AVAILABLE', 'IN_TRANSIT', 'ASSIGNED', 'MAINTENANCE'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: filter === f ? 'var(--primary-600)' : '#ffffff',
                color: filter === f ? '#ffffff' : 'var(--slate-600)',
                border: `1px solid ${filter === f ? 'var(--primary-600)' : 'var(--border-color)'}`,
              }}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Tankers Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Registration</th>
                  <th style={{ padding: '12px 14px' }}>Driver</th>
                  <th style={{ padding: '12px 14px' }}>Capacity / Level</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px' }}>Telemetry Speed</th>
                  <th style={{ padding: '12px 14px' }}>GPS Coordinates</th>
                  <th style={{ padding: '12px 14px' }}>Battery</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {filteredTankers.map((tanker) => (
                  <tr key={tanker.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--slate-900)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Truck size={18} color="var(--primary-600)" />
                        <span>{tanker.registrationNumber}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--slate-800)' }}>{tanker.driver.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>{tanker.driver.phone} • {tanker.driver.rating} ★</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--slate-800)' }}>
                        {tanker.currentLiters.toLocaleString()} / {tanker.capacityLiters.toLocaleString()} L
                      </div>
                      <div style={{ width: '100px', height: '4px', backgroundColor: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden', marginTop: '3px' }}>
                        <div
                          style={{
                            width: `${(tanker.currentLiters / tanker.capacityLiters) * 100}%`,
                            height: '100%',
                            backgroundColor: 'var(--primary-600)',
                          }}
                        />
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <StatusBadge status={tanker.status} />
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--slate-700)' }}>
                      {tanker.speedKmH} km/h
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                      {tanker.latitude.toFixed(4)}, {tanker.longitude.toFixed(4)}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--slate-700)' }}>
                      {tanker.batteryLevel}%
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedTanker(tanker)}
                        style={{
                          backgroundColor: 'var(--slate-100)',
                          color: 'var(--slate-700)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tanker Details Modal */}
        {selectedTanker && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 350,
              padding: '1rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '480px',
                width: '100%',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={22} color="var(--primary-600)" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {selectedTanker.registrationNumber}
                  </h3>
                </div>
                <button onClick={() => setSelectedTanker(null)} style={{ color: 'var(--slate-400)' }}>
                  <X size={20} />
                </button>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <StatusBadge status={selectedTanker.status} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: 'var(--slate-700)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--slate-400)' }}>Driver:</span>
                  <strong>{selectedTanker.driver.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--slate-400)' }}>License:</span>
                  <strong>{selectedTanker.driver.licenseNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--slate-400)' }}>Total Completed Runs:</span>
                  <strong>{selectedTanker.driver.totalDeliveries} deliveries</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--slate-400)' }}>Current Water Volume:</span>
                  <strong>{selectedTanker.currentLiters} / {selectedTanker.capacityLiters} L</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--slate-100)', paddingBottom: '6px' }}>
                  <span style={{ color: 'var(--slate-400)' }}>Speed / Heading:</span>
                  <strong>{selectedTanker.speedKmH} km/h • {selectedTanker.heading}°</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-400)' }}>Last Telemetry Ping:</span>
                  <strong>{selectedTanker.lastPing}</strong>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setSelectedTanker(null)}
                  style={{
                    backgroundColor: 'var(--primary-600)',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
