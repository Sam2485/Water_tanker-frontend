// NotificationDrawer.jsx (JavaScript)
import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { X, CheckCheck, AlertTriangle, AlertCircle, Info, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NotificationDrawer = () => {
  const { notifications, isDrawerOpen, closeDrawer, markAsRead, markAllAsRead } = useNotifications();

  if (!isDrawerOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'EMERGENCY':
      case 'REASSIGNMENT':
        return <AlertCircle size={18} color="#e11d48" />;
      case 'WARNING':
        return <AlertTriangle size={18} color="#d97706" />;
      case 'SUCCESS':
        return <CheckCircle2 size={18} color="#059669" />;
      default:
        return <Info size={18} color="#0284c7" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(2px)',
          zIndex: 250,
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#ffffff',
          boxShadow: 'var(--shadow-xl)',
          zIndex: 300,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.25s ease-out',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--slate-900)' }}>System Notifications</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>Live alerts & emergency notices</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={markAllAsRead}
              title="Mark all as read"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: 'var(--primary-700)',
                fontWeight: 600,
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--primary-50)',
              }}
            >
              <CheckCheck size={14} />
              Read all
            </button>
            <button
              onClick={closeDrawer}
              style={{
                padding: '6px',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--slate-500)',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--slate-400)' }}>
              No notifications at this time.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: `1px solid ${notif.read ? 'var(--border-color)' : 'var(--primary-300)'}`,
                  backgroundColor: notif.read ? '#ffffff' : notif.type === 'EMERGENCY' ? '#fff1f2' : 'var(--primary-50)',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ marginTop: '2px' }}>{getIcon(notif.type)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: notif.type === 'EMERGENCY' ? '#be123c' : 'var(--slate-900)' }}>
                        {notif.title}
                      </span>
                      <span style={{ fontSize: '0.675rem', color: 'var(--slate-400)' }}>{notif.timestamp}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--slate-600)', lineHeight: 1.4, margin: '4px 0' }}>
                      {notif.message}
                    </p>
                    {notif.actionUrl && (
                      <Link
                        to={notif.actionUrl}
                        onClick={closeDrawer}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: 'var(--primary-700)',
                          marginTop: '4px',
                        }}
                      >
                        View details <ArrowRight size={12} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
