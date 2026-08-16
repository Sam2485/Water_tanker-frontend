// GeofenceBadge.jsx (JavaScript)
import React from 'react';
import { ShieldCheck, Radio, AlertTriangle } from 'lucide-react';

export const GeofenceBadge = ({ status = 'APPROACHING' }) => {
  const configs = {
    INSIDE: {
      label: 'Inside Verified Geofence (< 50m)',
      bg: '#ecfdf5',
      color: '#047857',
      border: '#a7f3d0',
      icon: ShieldCheck,
      dotColor: '#10b981',
    },
    APPROACHING: {
      label: 'Approaching Delivery Zone',
      bg: '#fffbeb',
      color: '#b45309',
      border: '#fde68a',
      icon: Radio,
      dotColor: '#f59e0b',
    },
    OUTSIDE: {
      label: 'Outside Delivery Perimeter',
      bg: '#fff1f2',
      color: '#be123c',
      border: '#fecdd3',
      icon: AlertTriangle,
      dotColor: '#f43f5e',
    },
  };

  const current = configs[status] || configs.APPROACHING;
  const Icon = current.icon;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: current.bg,
        color: current.color,
        border: `1px solid ${current.border}`,
        padding: '4px 10px',
        borderRadius: '9999px',
        fontSize: '0.775rem',
        fontWeight: 600,
      }}
    >
      <Icon size={14} />
      <span>{current.label}</span>
    </div>
  );
};
