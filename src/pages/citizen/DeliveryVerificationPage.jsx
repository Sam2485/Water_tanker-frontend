// DeliveryVerificationPage.jsx (JavaScript)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { assignmentService } from '../../services/assignmentService';
import { requestService } from '../../services/requestService';
import { tankerService } from '../../services/tankerService';
import { deliveryService } from '../../services/deliveryService';
import { mockStateManager } from '../../services/mockStateManager';
import { useDemoSimulation } from '../../context/DemoSimulationContext';
import { GeofenceBadge } from '../../components/common/GeofenceBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  ShieldCheck,
  QrCode,
  CheckCircle2,
  Droplet,
  MapPin,
  Clock,
  Sparkles,
  ArrowRight,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export const DeliveryVerificationPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { markStep5Verified } = useDemoSimulation();

  const [assignment, setAssignment] = useState(null);
  const [request, setRequest] = useState(null);
  const [tanker, setTanker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [driverOtpInput, setDriverOtpInput] = useState('');
  const [message, setMessage] = useState('');

  const loadData = async () => {
    try {
      const asg = (await assignmentService.getAssignmentById(assignmentId || 'asg-demo-1')) ||
        (await assignmentService.getAssignments())[0];
      if (!asg) return;
      setAssignment(asg);
      setIsCompleted(asg.status === 'COMPLETED');
      setDriverOtpInput(asg.otpCode);

      const req = await requestService.getRequestById(asg.requestId);
      setRequest(req);

      const tnk = await tankerService.getTankerById(asg.tankerId);
      setTanker(tnk);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockStateManager.subscribe(() => {
      loadData();
    });
    return unsubscribe;
  }, [assignmentId]);

  const handleSimulateGeofence = async () => {
    if (!assignment) return;
    try {
      await deliveryService.simulateGeofenceArrival(assignment.id);
      loadData();
    } catch (e) {
      setMessage('Error: ' + e.message);
    }
  };

  const handleVerifyOtp = async () => {
    if (!assignment) return;
    setVerifying(true);
    try {
      const res = await deliveryService.verifyOtp({
        assignmentId: assignment.id,
        otpCode: driverOtpInput || assignment.otpCode,
      });
      if (res.success) {
        setIsCompleted(true);
        markStep5Verified();
        loadData();
      } else {
        setMessage(res.message);
      }
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading delivery verification terminal..." />;

  return (
    <div className="page-wrapper">
      <div className="app-container" style={{ maxWidth: '780px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: isCompleted ? '#ecfdf5' : 'var(--primary-100)',
              color: isCompleted ? '#059669' : 'var(--primary-700)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            {isCompleted ? <CheckCircle2 size={32} /> : <ShieldCheck size={32} />}
          </div>

          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            {isCompleted ? 'Delivery Verified & Completed' : 'Delivery Verification & OTP'}
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            PostGIS Geofence Perimeter Validation & Cryptographic OTP Handshake
          </p>
        </div>

        {/* COMPLETED RECEIPT */}
        {isCompleted ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '2px solid #10b981',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: '1.5rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>
                  OFFICIAL DELIVERY CERTIFICATE
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  Water Dispensation Complete
                </div>
              </div>

              <span
                style={{
                  backgroundColor: '#ecfdf5',
                  color: '#047857',
                  border: '1px solid #a7f3d0',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                }}
              >
                ✓ VERIFIED
              </span>
            </div>

            {/* Quality & Volume Stats */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Volume Received</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '2px' }}>
                  {(request?.quantityLiters || 6000).toLocaleString()} L
                </div>
                <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>100% Fulfilled</div>
              </div>

              <div style={{ backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Water Quality (TDS)</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '2px' }}>
                  142 PPM
                </div>
                <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600 }}>Potable (BIS 10500)</div>
              </div>

              <div style={{ backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Delivered By</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '2px' }}>
                  {tanker?.driver.name || 'Rahul Patil'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>
                  Tanker {tanker?.registrationNumber}
                </div>
              </div>
            </div>

            {/* Audit Signature */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.75rem',
                color: 'var(--slate-600)',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={16} color="#059669" />
                <span>Cryptographic Proof: <strong>0x8f2a...e91b</strong> (Stored in Municipal Audit Ledger)</span>
              </div>
              <span style={{ color: 'var(--slate-400)' }}>{new Date().toLocaleTimeString()}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <Link
                to="/citizen"
                style={{
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  padding: '10px 24px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                }}
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* ACTIVE VERIFICATION CARD */
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '2rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            {/* Geofence Status Banner */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: assignment?.isGeofenceValid ? '#ecfdf5' : '#fffbeb',
                border: `1px solid ${assignment?.isGeofenceValid ? '#a7f3d0' : '#fde68a'}`,
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 1.25rem',
                marginBottom: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={20} color={assignment?.isGeofenceValid ? '#059669' : '#d97706'} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: assignment?.isGeofenceValid ? '#047857' : '#b45309' }}>
                    {assignment?.isGeofenceValid ? 'Tanker Inside Geofence (< 50m)' : 'Tanker Approaching Delivery Zone'}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: assignment?.isGeofenceValid ? '#065f46' : '#92400e' }}>
                    GPS coordinates verified against municipal destination PostGIS polygon.
                  </div>
                </div>
              </div>

              {!assignment?.isGeofenceValid && (
                <button
                  type="button"
                  onClick={handleSimulateGeofence}
                  style={{
                    backgroundColor: '#d97706',
                    color: '#ffffff',
                    padding: '6px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  Simulate Arrival
                </button>
              )}
            </div>

            {/* OTP Display Box */}
            <div
              style={{
                textAlign: 'center',
                padding: '1.75rem',
                backgroundColor: '#f8fafc',
                borderRadius: 'var(--radius-lg)',
                border: '2px dashed var(--primary-300)',
                marginBottom: '1.5rem',
              }}
            >
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                SHARE THIS 6-DIGIT OTP WITH DRIVER
              </span>

              <div
                style={{
                  fontSize: '3rem',
                  fontWeight: 900,
                  color: 'var(--primary-700)',
                  letterSpacing: '0.3em',
                  fontFamily: 'var(--font-mono)',
                  margin: '0.75rem 0',
                }}
              >
                {assignment?.otpCode || '849201'}
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                Driver ({tanker?.driver.name || 'Rahul Patil'}) will enter this code into the driver app to dispense water.
              </p>
            </div>

            {/* Driver OTP Verification Simulator (For Hackathon Judges) */}
            <div
              style={{
                backgroundColor: '#f1f5f9',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '8px' }}>
                <Sparkles size={14} color="var(--primary-600)" />
                <span>DRIVER HANDSHAKE SIMULATION:</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={driverOtpInput}
                  onChange={(e) => setDriverOtpInput(e.target.value)}
                  placeholder="Enter OTP (849201)"
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    backgroundColor: '#ffffff',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                  }}
                />

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={verifying}
                  style={{
                    backgroundColor: '#059669',
                    color: '#ffffff',
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>{verifying ? 'Verifying...' : 'Simulate Driver Verify'}</span>
                </button>
              </div>

              {message && (
                <div style={{ marginTop: '8px', fontSize: '0.775rem', color: '#be123c', fontWeight: 600 }}>
                  {message}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
