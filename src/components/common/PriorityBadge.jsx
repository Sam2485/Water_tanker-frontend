// PriorityBadge.jsx (JavaScript)
import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

const config = {
  CRITICAL: {
    label: 'CRITICAL',
    bg: '#ffe4e6',
    color: '#be123c',
    border: '#fecdd3',
    icon: AlertCircle,
  },
  HIGH: {
    label: 'HIGH PRIORITY',
    bg: '#ffedd5',
    color: '#c2410c',
    border: '#fed7aa',
    icon: AlertTriangle,
  },
  MEDIUM: {
    label: 'MEDIUM',
    bg: '#fef3c7',
    color: '#b45309',
    border: '#fde68a',
    icon: Info,
  },
  LOW: {
    label: 'STANDARD',
    bg: '#d1fae5',
    color: '#047857',
    border: '#a7f3d0',
    icon: CheckCircle2,
  },
};

export const PriorityBadge = ({ level = 'MEDIUM', size = 'md', showIcon = true }) => {
  const current = config[level] || config.MEDIUM;
  const Icon = current.icon;

  const sizeStyles = {
    sm: { padding: '2px 8px', fontSize: '0.725rem', iconSize: 12 },
    md: { padding: '4px 10px', fontSize: '0.8125rem', iconSize: 14 },
    lg: { padding: '6px 14px', fontSize: '0.9rem', iconSize: 16 },
  }[size];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        backgroundColor: current.bg,
        color: current.color,
        border: `1px solid ${current.border}`,
        borderRadius: '9999px',
        fontWeight: 700,
        letterSpacing: '0.025em',
        lineHeight: 1,
        ...sizeStyles,
      }}
      aria-label={`Priority level: ${current.label}`}
    >
      {showIcon && <Icon size={sizeStyles.iconSize} />}
      <span>{current.label}</span>
    </span>
  );
};
