// ErrorState.jsx (JavaScript)
import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export const ErrorState = ({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while communicating with the service.',
  onRetry,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '3rem 1.5rem',
        backgroundColor: '#fff1f2',
        border: '1px solid #fecdd3',
        borderRadius: 'var(--radius-lg)',
        color: '#be123c',
      }}
    >
      <AlertTriangle size={32} style={{ marginBottom: '0.75rem' }} />
      <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{title}</h3>
      <p style={{ fontSize: '0.825rem', color: '#9f1239', maxWidth: '380px', marginBottom: '1.25rem', lineHeight: 1.4 }}>
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#be123c',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          <RotateCcw size={14} /> Retry Request
        </button>
      )}
    </div>
  );
};
