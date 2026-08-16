// RequestTimeline.jsx (JavaScript)
import React from 'react';
import { Check, Clock, Truck, MapPin, ShieldCheck, CheckCircle2, AlertOctagon } from 'lucide-react';

const STEPS = [
  { key: 'REQUESTED', label: 'Request Submitted', icon: Clock },
  { key: 'PRIORITY_CALCULATED', label: 'AI Priority Assessed', icon: Check },
  { key: 'ASSIGNED', label: 'Tanker Assigned', icon: Truck },
  { key: 'IN_TRANSIT', label: 'In Transit', icon: Truck },
  { key: 'ARRIVED', label: 'Arrived at Zone', icon: MapPin },
  { key: 'VERIFICATION_PENDING', label: 'OTP Verification', icon: ShieldCheck },
  { key: 'COMPLETED', label: 'Delivery Completed', icon: CheckCircle2 },
];

const getStepIndex = (status) => {
  switch (status) {
    case 'REQUESTED':
      return 0;
    case 'PRIORITY_CALCULATED':
      return 1;
    case 'ASSIGNED':
      return 2;
    case 'IN_TRANSIT':
    case 'DISPLACED':
    case 'REASSIGNED':
      return 3;
    case 'ARRIVED':
      return 4;
    case 'VERIFICATION_PENDING':
    case 'VERIFIED':
      return 5;
    case 'COMPLETED':
      return 6;
    default:
      return 0;
  }
};

export const RequestTimeline = ({ status = 'IN_TRANSIT', isReassigned = false }) => {
  const currentIndex = getStepIndex(status);

  return (
    <div style={{ padding: '0.5rem 0' }}>
      {isReassigned && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            color: '#be123c',
            padding: '0.6rem 0.85rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '1.25rem',
          }}
        >
          <AlertOctagon size={16} />
          <span>Emergency Reroute: Standby replacement tanker dispatched</span>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
        {STEPS.map((step, idx) => {
          const isDone = idx < currentIndex || (idx === currentIndex && status === 'COMPLETED');
          const isCurrent = idx === currentIndex && status !== 'COMPLETED';
          const Icon = step.icon;

          let bulletBg = 'var(--slate-200)';
          let bulletColor = 'var(--slate-500)';
          let borderColor = 'var(--border-color)';

          if (isDone) {
            bulletBg = '#059669';
            bulletColor = '#ffffff';
            borderColor = '#059669';
          } else if (isCurrent) {
            bulletBg = isReassigned && idx === 3 ? '#e11d48' : '#0284c7';
            bulletColor = '#ffffff';
            borderColor = bulletBg;
          }

          return (
            <div key={step.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', position: 'relative' }}>
              {/* Connector line */}
              {idx < STEPS.length - 1 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '24px',
                    left: '12px',
                    width: '2px',
                    height: 'calc(100% + 2px)',
                    backgroundColor: idx < currentIndex ? '#059669' : 'var(--slate-200)',
                    zIndex: 0,
                  }}
                />
              )}

              {/* Bullet icon */}
              <div
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: bulletBg,
                  color: bulletColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  boxShadow: isCurrent ? '0 0 0 4px rgba(2, 132, 199, 0.2)' : 'none',
                  flexShrink: 0,
                }}
              >
                {isDone ? <Check size={14} strokeWidth={3} /> : <Icon size={13} />}
              </div>

              {/* Label */}
              <div style={{ paddingTop: '2px' }}>
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: isCurrent ? 700 : isDone ? 600 : 500,
                    color: isCurrent ? 'var(--slate-900)' : isDone ? 'var(--slate-700)' : 'var(--slate-400)',
                  }}
                >
                  {step.label}
                  {isCurrent && (
                    <span
                      style={{
                        marginLeft: '8px',
                        fontSize: '0.7rem',
                        padding: '1px 6px',
                        background: 'var(--primary-100)',
                        color: 'var(--primary-700)',
                        borderRadius: '4px',
                        fontWeight: 700,
                      }}
                    >
                      Active
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
