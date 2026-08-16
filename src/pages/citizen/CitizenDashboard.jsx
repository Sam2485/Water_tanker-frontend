// CitizenDashboard.jsx (JavaScript)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { requestService } from '../../services/requestService';
import { assignmentService } from '../../services/assignmentService';
import { tankerService } from '../../services/tankerService';
import { mockStateManager } from '../../services/mockStateManager';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { GeofenceBadge } from '../../components/common/GeofenceBadge';
import {
  Droplet,
  PlusCircle,
  Truck,
  MapPin,
  Clock,
  ShieldCheck,
  AlertOctagon,
  ArrowRight,
  Phone,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [activeRequest, setActiveRequest] = useState(null);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [assignedTanker, setAssignedTanker] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const allReqs = await requestService.getRequestsByCitizen(user?.id || 'usr-cit-101');
      setRequests(allReqs);

      const active = allReqs.find(
        (r) => r.status !== 'COMPLETED' && r.status !== 'CANCELLED'
      );
      setActiveRequest(active || null);

      if (active) {
        const asg = await assignmentService.getAssignmentByRequestId(active.id);
        setActiveAssignment(asg || null);
        if (asg) {
          const tnk = await tankerService.getTankerById(asg.tankerId);
          setAssignedTanker(tnk || null);
        }
      }
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
  }, [user]);

  const isReassigned = activeAssignment?.isReassigned || activeRequest?.status === 'REASSIGNED';

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Welcome Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Namaste, {user?.name || 'Citizen'}
              </h1>
              <span
                style={{
                  backgroundColor: 'var(--primary-100)',
                  color: 'var(--primary-800)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                Ward 14 (Kothrud)
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              PMC Equitable Water Shortage Management & Dynamic Tanker Dispatch
            </p>
          </div>

          <Link
            to="/citizen/request"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--primary-600)',
              color: '#ffffff',
              padding: '10px 18px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 700,
              boxShadow: 'var(--shadow-sm)',
              textDecoration: 'none',
            }}
          >
            <PlusCircle size={18} />
            <span>Request Water Tanker</span>
          </Link>
        </div>

        {/* Emergency Reassignment Banner (If Displaced) */}
        {isReassigned && (
          <div
            style={{
              backgroundColor: '#fff1f2',
              border: '1.5px solid #fecdd3',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              marginBottom: '1.75rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: '#be123c',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <AlertOctagon size={24} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#9f1239' }}>
                    🚨 Emergency Priority Reassignment Notice
                  </h3>
                  <span
                    style={{
                      backgroundColor: '#be123c',
                      color: 'white',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    HOSPITAL OVERRIDE
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: '#881337', marginTop: '4px', lineHeight: 1.45 }}>
                  Your originally assigned tanker (<strong>MH-12-AB-1234</strong>) was intercepted and redirected to
                  <strong> Ruby Hall Clinic</strong> due to a critical medical life-support water shortage.
                </p>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    marginTop: '0.75rem',
                    padding: '0.75rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#9f1239', fontWeight: 600 }}>
                      STANDBY REPLACEMENT TANKER DISPATCHED:
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                      🚛 {assignedTanker?.registrationNumber || 'MH-12-CD-5678'} (Driver:{' '}
                      {assignedTanker?.driver.name || 'Suresh Gaikwad'})
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: '#9f1239' }}>NEW ESTIMATED ARRIVAL</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#be123c' }}>
                        {activeAssignment?.etaMinutes || 13} mins
                      </div>
                    </div>

                    <Link
                      to={`/citizen/track/${activeAssignment?.id || 'asg-demo-1'}`}
                      style={{
                        backgroundColor: '#be123c',
                        color: 'white',
                        padding: '8px 14px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      Track Replacement <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4 Core Questions Status Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <QuestionCard
            question="Do I have water supply?"
            answer={activeRequest ? `${activeRequest.daysWithoutWater} days without line supply` : 'Normal Ward Supply'}
            status={activeRequest ? 'CRITICAL' : 'OK'}
            icon={Droplet}
          />
          <QuestionCard
            question="Have I requested a tanker?"
            answer={activeRequest ? `Yes, Request #${activeRequest.id}` : 'No active water request'}
            status={activeRequest ? 'ACTIVE' : 'IDLE'}
            icon={MapPin}
          />
          <QuestionCard
            question="Where is my tanker?"
            answer={assignedTanker ? `${assignedTanker.registrationNumber} (En Route)` : 'Awaiting Allocation'}
            status={assignedTanker ? 'EN_ROUTE' : 'PENDING'}
            icon={Truck}
          />
          <QuestionCard
            question="When will it arrive?"
            answer={activeAssignment ? `${activeAssignment.etaMinutes} mins (${activeAssignment.distanceKm} km away)` : 'Calculating'}
            status={activeAssignment ? 'ESTIMATING' : 'PENDING'}
            icon={Clock}
          />
        </div>

        {/* Active Tanker Tracker Card (If request active) */}
        {activeRequest && activeAssignment && (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1.5px solid var(--primary-300)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-md)',
              marginBottom: '2rem',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                borderBottom: '1px solid var(--border-color)',
                paddingBottom: '1rem',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--primary-100)',
                    color: 'var(--primary-700)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Truck size={24} />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                      Tanker Dispatch: #{activeRequest.id}
                    </h3>
                    <StatusBadge status={activeAssignment.status} />
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    Destination: {activeRequest.address} • Required: {activeRequest.quantityLiters} Liters
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <PriorityBadge level={activeRequest.priorityLevel} size="md" />
                <GeofenceBadge status={activeAssignment.geofenceStatus} />
              </div>
            </div>

            {/* Middle Live Details */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
                marginBottom: '1.25rem',
              }}
            >
              {/* Tanker Details */}
              <div style={{ backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--slate-500)', fontWeight: 600 }}>VEHICLE DETAILS</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '2px' }}>
                  {assignedTanker?.registrationNumber || 'MH-12-AB-1234'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px' }}>
                  Capacity: {assignedTanker?.capacityLiters || 10000}L • Speed: {assignedTanker?.speedKmH || 28} km/h
                </div>
              </div>

              {/* Driver Details */}
              <div style={{ backgroundColor: 'var(--slate-50)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--slate-500)', fontWeight: 600 }}>ASSIGNED DRIVER</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', marginTop: '2px' }}>
                  {assignedTanker?.driver.name || 'Rahul Patil'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={12} /> {assignedTanker?.driver.phone || '+91 98221 44551'} ({assignedTanker?.driver.rating || 4.8} ★)
                </div>
              </div>

              {/* ETA */}
              <div style={{ backgroundColor: 'var(--primary-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--primary-200)' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--primary-800)', fontWeight: 700 }}>ESTIMATED ARRIVAL</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary-700)', marginTop: '2px' }}>
                  {activeAssignment.etaMinutes} mins
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary-600)', marginTop: '2px' }}>
                  Distance: {activeAssignment.distanceKm} km away
                </div>
              </div>

              {/* OTP preview */}
              <div style={{ backgroundColor: '#ecfdf5', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: '0.725rem', color: '#047857', fontWeight: 700 }}>DELIVERY OTP</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#047857', fontFamily: 'var(--font-mono)', letterSpacing: '0.15em', marginTop: '2px' }}>
                  {activeAssignment.otpCode || '849201'}
                </div>
                <div style={{ fontSize: '0.725rem', color: '#065f46' }}>Share with driver upon arrival</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'flex-end' }}>
              <Link
                to={`/citizen/track/${activeAssignment.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <MapPin size={16} />
                <span>Open Live GPS Tracking</span>
              </Link>

              <Link
                to={`/citizen/delivery/${activeAssignment.id}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                <ShieldCheck size={16} />
                <span>Delivery Verification & QR</span>
              </Link>
            </div>
          </div>
        )}

        {/* Recent Requests Section */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              Recent Water Requests
            </h3>
            <Link to="/citizen/requests" style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--primary-600)' }}>
              View All History →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {requests.map((req) => (
              <div
                key={req.id}
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
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: req.status === 'COMPLETED' ? '#ecfdf5' : 'var(--primary-50)',
                      color: req.status === 'COMPLETED' ? '#059669' : 'var(--primary-600)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {req.status === 'COMPLETED' ? <CheckCircle2 size={20} /> : <Droplet size={20} />}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                        #{req.id}
                      </span>
                      <PriorityBadge level={req.priorityLevel} size="sm" />
                      <StatusBadge status={req.status} />
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                      {req.quantityLiters} Liters • {new Date(req.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {req.activeAssignmentId ? (
                    <Link
                      to={`/citizen/track/${req.activeAssignmentId}`}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--primary-600)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      Track <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                      {req.status === 'COMPLETED' ? 'Delivered' : 'Submitted'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuestionCard = ({ question, answer, status, icon: Icon }) => {
  const isCritical = status === 'CRITICAL';
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: `1px solid ${isCritical ? '#fecdd3' : 'var(--border-color)'}`,
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: isCritical ? '#be123c' : 'var(--slate-500)', marginBottom: '6px' }}>
        <Icon size={16} />
        <span style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase' }}>{question}</span>
      </div>
      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isCritical ? '#be123c' : 'var(--slate-900)' }}>
        {answer}
      </div>
    </div>
  );
};
