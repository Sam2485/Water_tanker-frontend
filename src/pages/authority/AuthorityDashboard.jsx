// AuthorityDashboard.jsx (JavaScript)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import { tankerService } from '../../services/tankerService';
import { requestService } from '../../services/requestService';
import { MetricCard } from '../../components/common/MetricCard';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Landmark,
  ShieldCheck,
  TrendingUp,
  Droplet,
  MapPin,
  FileCheck,
  AlertTriangle,
  ArrowRight,
  Scale,
  Award,
} from 'lucide-react';

export const AuthorityDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [wardMetrics, setWardMetrics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [sum, wards] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getWardEquityMetrics(),
        ]);
        setSummary(sum);
        setWardMetrics(wards);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !summary) return <LoadingSpinner text="Loading Water Authority Regulatory Metrics..." />;

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--indigo-600)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Landmark size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                State Water Resources Regulatory Oversight (MWRRA)
              </h1>
              <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '2px' }}>
                Macro Governance, AI Equitable Distribution Index & Municipal Compliance Monitoring
              </p>
            </div>
          </div>
        </div>

        {/* Top High-level Indicators */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <MetricCard
            title="City Equity Index"
            value="91.8 / 100"
            subtext="Gini Shortage Disparity < 0.12"
            icon={Scale}
            color="#4f46e5"
          />
          <MetricCard
            title="Policy Compliance"
            value="98.4%"
            subtext="PostGIS Geofence Enforced"
            icon={Award}
            color="#059669"
          />
          <MetricCard
            title="Slum & High-Risk Coverage"
            value="96.2%"
            subtext="AI Priority Weighted"
            icon={ShieldCheck}
            color="#0284c7"
          />
          <MetricCard
            title="Total Volume Dispensed"
            value={`${(summary.totalLitersDispensed / 1000).toFixed(0)}k L`}
            subtext="Municipal Potable Standard"
            icon={Droplet}
            color="#0891b2"
          />
        </div>

        {/* Ward-Level Oversight Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '1.75rem',
          }}
        >
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Zonal Shortage & Equitable Allocation Breakdown
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                Live evaluation across PMC administrative wards
              </span>
            </div>
            <Link to="/admin/analytics" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)' }}>
              Detailed Chart Analysis →
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Ward / Administrative Zone</th>
                  <th style={{ padding: '12px 14px' }}>Population At Risk</th>
                  <th style={{ padding: '12px 14px' }}>Shortage Severity</th>
                  <th style={{ padding: '12px 14px' }}>Active Tankers</th>
                  <th style={{ padding: '12px 14px' }}>Equity Fulfillment</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {wardMetrics.map((w, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--slate-900)' }}>
                      {w.ward}
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--slate-700)' }}>
                      {w.populationAtRisk.toLocaleString()} residents
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '80px', height: '6px', backgroundColor: 'var(--slate-100)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${w.shortageSeverity}%`, height: '100%', backgroundColor: w.shortageSeverity >= 80 ? '#be123c' : '#d97706' }} />
                        </div>
                        <span style={{ fontWeight: 700, color: w.shortageSeverity >= 80 ? '#be123c' : 'var(--slate-800)' }}>
                          {w.shortageSeverity}%
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--slate-800)' }}>
                      {w.tankersAssigned} Tankers
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontWeight: 800, color: '#059669' }}>{w.equityFulfillmentRatio}%</span>
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      <span
                        style={{
                          backgroundColor: '#ecfdf5',
                          color: '#047857',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      >
                        Compliant
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
