// TrackTankerPage.jsx (JavaScript)
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { assignmentService } from '../../services/assignmentService';
import { requestService } from '../../services/requestService';
import { tankerService } from '../../services/tankerService';
import { trackingService } from '../../services/trackingService';
import { mockStateManager } from '../../services/mockStateManager';
import { LiveMap } from '../../components/maps/LiveMap';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { GeofenceBadge } from '../../components/common/GeofenceBadge';
import { RequestTimeline } from '../../components/common/RequestTimeline';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorState } from '../../components/common/ErrorState';
import {
  Truck,
  Phone,
  Clock,
  MapPin,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  Radio,
  Share2,
  CheckCircle2,
} from 'lucide-react';

export const TrackTankerPage = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [request, setRequest] = useState(null);
  const [tanker, setTanker] = useState(null);
  const [originalTanker, setOriginalTanker] = useState(null);
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      const asg = (await assignmentService.getAssignmentById(assignmentId || 'asg-demo-1')) ||
        (await assignmentService.getAssignments())[0];
      if (!asg) {
        setError('Assignment record not found');
        return;
      }
      setAssignment(asg);

      const req = await requestService.getRequestById(asg.requestId);
      setRequest(req);

      const tnk = await tankerService.getTankerById(asg.tankerId);
      setTanker(tnk);

      if (asg.originalTankerId) {
        const origTnk = await tankerService.getTankerById(asg.originalTankerId);
        setOriginalTanker(origTnk);
      }

      const tel = await trackingService.getTankerLocation(asg.tankerId);
      setTelemetry(tel);
    } catch (err) {
      setError(err.message || 'Failed to load tracking data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Subscribe to state updates (emergencies, reassignments, completions)
    const unsubscribe = mockStateManager.subscribe(() => {
      loadData();
    });

    return unsubscribe;
  }, [assignmentId]);

  if (loading) return <LoadingSpinner text="Connecting to Live GPS Telemetry..." />;
  if (error || !assignment) return <ErrorState message={error || 'No active tracking stream available.'} onRetry={loadData} />;

  const isReassigned = assignment.isReassigned || request?.status === 'REASSIGNED';

  return (
    <div className="page-wrapper" style={{ paddingBottom: '4rem' }}>
      <div className="app-container">
        {/* Top Breadcrumb & Status Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Live Tanker Telemetry Tracking
              </h1>
              <StatusBadge status={assignment.status} />
              {isReassigned && (
                <span
                  style={{
                    backgroundColor: '#ffe4e6',
                    color: '#be123c',
                    border: '1px solid #fecdd3',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  REPLACEMENT ASSIGNED
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Tracking Assignment #{assignment.id} • Request #{request?.id || 'REQ-1024'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GeofenceBadge status={assignment.geofenceStatus} />
            <Link
              to={`/citizen/delivery/${assignment.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#059669',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <ShieldCheck size={16} />
              <span>Verify Delivery</span>
            </Link>
          </div>
        </div>

        {/* Prominent Emergency Reassignment Banner */}
        {isReassigned && (
          <div
            style={{
              backgroundColor: '#fff1f2',
              border: '2px solid #f43f5e',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#e11d48',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <AlertOctagon size={22} />
              </div>

              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#9f1239' }}>
                  🚨 Emergency Reassignment Notice
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#881337', margin: '4px 0 10px', lineHeight: 1.45 }}>
                  Your originally assigned tanker ({originalTanker?.registrationNumber || 'MH-12-AB-1234'}) was
                  intercepted by the AI Municipal Dispatcher and redirected to{' '}
                  <strong>Ruby Hall Clinic (Specialized ICU Wing)</strong> for emergency life-saving water replenishment.
                </p>

                <div
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.725rem', color: '#be123c', fontWeight: 700, textTransform: 'uppercase' }}>
                      NEW REPLACEMENT TANKER:
                    </span>
                    <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                      🚛 {tanker?.registrationNumber || 'MH-12-CD-5678'} (Driver: {tanker?.driver.name || 'Suresh Gaikwad'})
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: '#be123c', fontWeight: 600 }}>REVISED ETA</div>
                      <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#be123c' }}>
                        {assignment.etaMinutes} mins
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Grid: Left Info Panel, Right Large Live Map */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 380px) 1fr',
            gap: '1.5rem',
            alignItems: 'start',
          }}
          className="tracking-grid"
        >
          {/* LEFT: Cards & Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* ETA & Telemetry Badge */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase' }}>
                  Live Arrival Estimate
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>
                  <Radio size={14} className="animate-pulse" /> Live Telemetry
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'var(--font-mono)', lineHeight: 1 }}>
                  {assignment.etaMinutes}
                </span>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-600)' }}>minutes</span>
              </div>

              <div style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--slate-600)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Remaining Distance: <strong>{assignment.distanceKm} km</strong></span>
                <span>Speed: <strong>{tanker?.speedKmH || 28} km/h</strong></span>
              </div>

              <div
                style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  backgroundColor: '#ecfdf5',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #a7f3d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#047857', fontWeight: 700 }}>YOUR DELIVERY OTP:</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#047857', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em' }}>
                    {assignment.otpCode || '849201'}
                  </div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#065f46', maxWidth: '110px', textAlign: 'right' }}>
                  Give to driver upon arrival
                </div>
              </div>
            </div>

            {/* Vehicle & Driver Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '10px' }}>
                Vehicle & Driver Profile
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <img
                  src={tanker?.driver.photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80'}
                  alt={tanker?.driver.name || 'Driver'}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-500)' }}
                />
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    {tanker?.driver.name || 'Rahul Patil'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                    {tanker?.driver.totalDeliveries || 412} deliveries • {tanker?.driver.rating || 4.8} ★
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: 'var(--slate-700)', borderTop: '1px solid var(--slate-100)', paddingTop: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-400)' }}>Tanker Reg:</span>
                  <strong>{tanker?.registrationNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-400)' }}>Driver Contact:</span>
                  <a href={`tel:${tanker?.driver.phone}`} style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                    {tanker?.driver.phone}
                  </a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--slate-400)' }}>Total Capacity:</span>
                  <strong>{tanker?.capacityLiters.toLocaleString()} Liters</strong>
                </div>
              </div>
            </div>

            {/* Status Timeline */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '12px' }}>
                Trip Status Timeline
              </div>
              <RequestTimeline status={assignment.status} isReassigned={isReassigned} />
            </div>
          </div>

          {/* RIGHT: Large Live Map */}
          <div style={{ position: 'sticky', top: '88px' }}>
            <LiveMap
              tankers={tanker ? [tanker] : []}
              requests={request ? [request] : []}
              activeAssignment={assignment}
              height="640px"
              zoom={14}
              center={[assignment.currentLat || 18.5124, assignment.currentLng || 73.8184]}
            />
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .tracking-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
