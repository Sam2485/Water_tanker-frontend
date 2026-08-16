// Footer.jsx (JavaScript)
import React from 'react';
import { Droplet, ShieldCheck, Cpu, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid var(--border-color)',
        padding: '2rem 0',
        marginTop: 'auto',
        fontSize: '0.8125rem',
        color: 'var(--slate-500)',
      }}
    >
      <div className="app-container">
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--slate-100)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Droplet size={18} color="var(--primary-600)" />
            <span style={{ fontWeight: 700, color: 'var(--slate-900)' }}>AquaEquity Platform</span>
            <span>— AI-Supported Geospatial Equitable Water Allocation</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Cpu size={14} color="var(--primary-600)" />
              OR-Tools Route Optimization
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} color="var(--primary-600)" />
              PostGIS Geofencing
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ShieldCheck size={14} color="var(--emerald-600)" />
              Cryptographic OTP Verification
            </span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            paddingTop: '1rem',
            fontSize: '0.75rem',
            color: 'var(--slate-400)',
          }}
        >
          <div>
            <strong>Team Victus (ID: 141167)</strong> • Problem Statement PS-B20: Equitable Water-Tanker Allocation During Urban Shortages
          </div>
          <div>
            FastAPI + PostGIS + React Frontend Client • Mode: <span style={{ color: 'var(--primary-600)', fontWeight: 600 }}>Interactive Demo Active</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
