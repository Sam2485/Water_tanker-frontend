// ToastNotification.jsx (JavaScript)
import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { AlertCircle, CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ToastNotification = () => {
  const { activeToast, dismissToast } = useNotifications();

  if (!activeToast) return null;

  const isEmergency = activeToast.type === 'EMERGENCY' || activeToast.type === 'REASSIGNMENT';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        maxWidth: '380px',
        width: 'calc(100% - 48px)',
        backgroundColor: isEmergency ? '#be123c' : '#0f172a',
        color: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-xl)',
        padding: '1rem',
        zIndex: 500,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
      }}
    >
      <div style={{ marginTop: '2px' }}>
        {isEmergency ? (
          <AlertCircle size={20} color="#fecdd3" />
        ) : activeToast.type === 'SUCCESS' ? (
          <CheckCircle2 size={20} color="#6ee7b7" />
        ) : (
          <Info size={20} color="#7dd3fc" />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '2px', color: '#ffffff' }}>
          {activeToast.title}
        </div>
        <div style={{ fontSize: '0.775rem', color: isEmergency ? '#ffe4e6' : '#cbd5e1', lineHeight: 1.35 }}>
          {activeToast.message}
        </div>
        {activeToast.actionUrl && (
          <Link
            to={activeToast.actionUrl}
            onClick={dismissToast}
            style={{
              display: 'inline-block',
              marginTop: '6px',
              fontSize: '0.75rem',
              fontWeight: 700,
              color: '#ffffff',
              textDecoration: 'underline',
            }}
          >
            Track on Map →
          </Link>
        )}
      </div>

      <button
        onClick={dismissToast}
        style={{
          color: 'rgba(255, 255, 255, 0.7)',
          padding: '2px',
          borderRadius: '4px',
        }}
        aria-label="Dismiss alert"
      >
        <X size={16} />
      </button>
    </div>
  );
};
