// StatusBadge.jsx (JavaScript)
import React from 'react';

const STATUS_MAP = {
  REQUESTED: { label: 'Requested', bg: '#f1f5f9', color: '#475569', border: '#cbd5e1' },
  PRIORITY_CALCULATED: { label: 'Priority Calculated', bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' },
  ASSIGNED: { label: 'Tanker Assigned', bg: '#e0e7ff', color: '#4338ca', border: '#c7d2fe' },
  IN_TRANSIT: { label: 'In Transit', bg: '#e0f2fe', color: '#0284c7', border: '#7dd3fc' },
  ARRIVED: { label: 'Arrived at Zone', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  VERIFICATION_PENDING: { label: 'Verification Pending', bg: '#fef3c7', color: '#b45309', border: '#fde68a' },
  VERIFIED: { label: 'Verified', bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
  COMPLETED: { label: 'Completed', bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
  DISPLACED: { label: 'Displaced (Emergency)', bg: '#ffe4e6', color: '#be123c', border: '#fecdd3' },
  REASSIGNED: { label: 'Replacement Assigned', bg: '#fdf4ff', color: '#86198f', border: '#f5d0fe' },
  CANCELLED: { label: 'Cancelled', bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' },
  AVAILABLE: { label: 'Available', bg: '#d1fae5', color: '#065f46', border: '#6ee7b7' },
  DISPENSING: { label: 'Dispensing Water', bg: '#e0f2fe', color: '#0284c7', border: '#7dd3fc' },
  MAINTENANCE: { label: 'Maintenance', bg: '#f1f5f9', color: '#64748b', border: '#e2e8f0' },
  OFFLINE: { label: 'Offline', bg: '#f8fafc', color: '#94a3b8', border: '#e2e8f0' },
};

export const StatusBadge = ({ status = 'REQUESTED' }) => {
  const current = STATUS_MAP[status] || {
    label: status,
    bg: '#f1f5f9',
    color: '#475569',
    border: '#cbd5e1',
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 9px',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 700,
        backgroundColor: current.bg,
        color: current.color,
        border: `1px solid ${current.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: current.color,
        }}
      />
      {current.label}
    </span>
  );
};
