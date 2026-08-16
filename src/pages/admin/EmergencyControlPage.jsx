// EmergencyControlPage.jsx (JavaScript)
import React, { useState, useEffect } from 'react';
import { emergencyService } from '../../services/emergencyService';
import { tankerService } from '../../services/tankerService';
import { requestService } from '../../services/requestService';
import { mockStateManager } from '../../services/mockStateManager';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  AlertOctagon,
  Sparkles,
  Building2,
  Phone,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Radio,
} from 'lucide-react';

export const EmergencyControlPage = () => {
  const [emergencies, setEmergencies] = useState([]);
  const [tankers, setTankers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTriggering, setIsTriggering] = useState(false);
  const [overrideResult, setOverrideResult] = useState(null);

  const loadData = async () => {
    try {
      const [emgs, tnks] = await Promise.all([
        emergencyService.getEmergencies(),
        tankerService.getTankers(),
      ]);
      setEmergencies(emgs);
      setTankers(tnks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockStateManager.subscribe(loadData);
    return unsubscribe;
  }, []);

  const handleTriggerOverride = async (emergencyId) => {
    setIsTriggering(true);
    try {
      const res = await emergencyService.triggerOverride(emergencyId);
      setOverrideResult(res);
      loadData();
    } catch (e) {
      alert('Error triggering override: ' + e.message);
    } finally {
      setIsTriggering(false);
    }
  };

  if (loading) return <LoadingSpinner text="Connecting to Municipal Emergency Dispatch Channel..." />;

  const activeEmergencies = emergencies.filter((e) => e.status === 'ACTIVE' || e.status === 'RESPONDING');
  const resolvedEmergencies = emergencies.filter((e) => e.status === 'RESOLVED');

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Top Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#be123c',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlertOctagon size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Emergency Override & Hospital Interception Control
              </h1>
              <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                Municipal Protocol PS-B20: Dynamic AI Interception & Standby Replacement Dispatch
              </p>
            </div>
          </div>
        </div>

        {/* Override Execution Success Card (If recently triggered) */}
        {overrideResult && (
          <div
            style={{
              backgroundColor: '#fff1f2',
              border: '2px solid #be123c',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              marginBottom: '1.75rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Sparkles size={20} color="#be123c" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#9f1239' }}>
                AI Emergency Interception Protocol Executed Successfully
              </h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#881337', marginBottom: '1rem', lineHeight: 1.45 }}>
              Active Tanker <strong>{overrideResult.interceptedTanker.registrationNumber}</strong> was intercepted and
              rerouted to <strong>{overrideResult.emergency.facilityName}</strong>. Original citizen request #
              <strong>{overrideResult.displacedRequest.id}</strong> has been reassigned to Standby Tanker{' '}
              <strong>{overrideResult.replacementTanker.registrationNumber}</strong>.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #fecdd3' }}>
                <div style={{ fontSize: '0.725rem', color: '#be123c', fontWeight: 700 }}>INTERCEPTED & REROUTED</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  {overrideResult.interceptedTanker.registrationNumber}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Target: {overrideResult.emergency.facilityName}</div>
              </div>

              <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #fecdd3' }}>
                <div style={{ fontSize: '0.725rem', color: '#059669', fontWeight: 700 }}>STANDBY REPLACEMENT DISPATCHED</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  {overrideResult.replacementTanker.registrationNumber}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Driver: {overrideResult.replacementTanker.driver.name}</div>
              </div>

              <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #fecdd3' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--primary-700)', fontWeight: 700 }}>CITIZEN DISPATCH STATUS</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  Notified via SMS & App
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ETA: 13 mins (Seamless Transition)</div>
              </div>
            </div>
          </div>
        )}

        {/* Active Emergency Facilities List */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              Active Critical Emergency Alerts ({activeEmergencies.length})
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              Priority Level 1 • Immediate Override Authority
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {activeEmergencies.map((emg) => (
              <div
                key={emg.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #fecdd3',
                  borderRadius: 'var(--radius-xl)',
                  padding: '1.5rem',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: '#ffe4e6',
                        color: '#be123c',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Building2 size={24} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                          {emg.facilityName}
                        </h3>
                        <span
                          style={{
                            backgroundColor: '#be123c',
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {emg.severity}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                        Contact: {emg.contactPerson} ({emg.contactPhone})
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleTriggerOverride(emg.id)}
                    disabled={isTriggering}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: '#be123c',
                      color: '#ffffff',
                      padding: '10px 20px',
                      borderRadius: 'var(--radius-md)',
                      fontSize: '0.875rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 12px rgba(190, 18, 60, 0.3)',
                    }}
                  >
                    <Sparkles size={16} />
                    <span>{isTriggering ? 'Executing AI Override...' : 'Trigger AI Emergency Override'}</span>
                  </button>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--slate-50)',
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.825rem',
                    color: 'var(--slate-700)',
                  }}
                >
                  <strong>Ground Situation: </strong>
                  {emg.reason} • <strong>Volume Required: </strong>
                  {emg.requiredLiters.toLocaleString()} Liters
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resolved Emergencies History */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '1rem' }}>
            Resolved Emergency Incidents
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {resolvedEmergencies.map((emg) => (
              <div
                key={emg.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                      {emg.facilityName}
                    </span>
                    <span
                      style={{
                        backgroundColor: '#ecfdf5',
                        color: '#047857',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      RESOLVED
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                    Fulfilled: {emg.requiredLiters.toLocaleString()} L • Contact: {emg.contactPerson}
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                  Resolved at {new Date(emg.resolvedAt || Date.now()).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
