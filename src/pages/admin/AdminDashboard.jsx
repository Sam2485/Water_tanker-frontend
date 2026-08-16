// AdminDashboard.jsx (JavaScript)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestService } from '../../services/requestService';
import { tankerService } from '../../services/tankerService';
import { emergencyService } from '../../services/emergencyService';
import { analyticsService } from '../../services/analyticsService';
import { auditService } from '../../services/auditService';
import { mockStateManager } from '../../services/mockStateManager';
import { MetricCard } from '../../components/common/MetricCard';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LiveMap } from '../../components/maps/LiveMap';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Truck,
  Inbox,
  AlertOctagon,
  CheckCircle2,
  Activity,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [requests, setRequests] = useState([]);
  const [tankers, setTankers] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [analyticsData, reqsData, tankersData, emgsData, auditsData] = await Promise.all([
        analyticsService.getSummary(),
        requestService.getRequests(),
        tankerService.getTankers(),
        emergencyService.getEmergencies(),
        auditService.getAuditLogs(),
      ]);

      setMetrics(analyticsData);
      setRequests(reqsData);
      setTankers(tankersData);
      setEmergencies(emgsData);
      setAuditLogs(auditsData.slice(0, 5));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockStateManager.subscribe(loadData);
    return unsubscribe;
  }, []);

  if (loading || !metrics) return <LoadingSpinner text="Connecting to PMC Water Control Engine..." />;

  const activeEmergencies = emergencies.filter((e) => e.status === 'ACTIVE' || e.status === 'RESPONDING');
  const criticalRequests = requests.filter((r) => r.priorityLevel === 'CRITICAL' || r.priorityLevel === 'HIGH').slice(0, 5);

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Top Header */}
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
                Municipal Water Dispatch Control Center
              </h1>
              <span
                style={{
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  border: '1px solid #a7f3d0',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.725rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Zap size={13} /> AI OR-Tools Live
              </span>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Pune Municipal Corporation • Real-time AI Priority & PostGIS Geospatial Fleet Router
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              to="/admin/map"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-color)',
                color: 'var(--slate-700)',
                padding: '8px 14px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <Layers size={16} /> Full GIS Map
            </Link>

            <Link
              to="/admin/emergencies"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#be123c',
                color: '#ffffff',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem',
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <AlertOctagon size={16} /> Emergency Console
            </Link>
          </div>
        </div>

        {/* Active Emergency Alert Ribbon (If Active) */}
        {activeEmergencies.length > 0 && (
          <div
            style={{
              backgroundColor: '#fff1f2',
              border: '1.5px solid #fecdd3',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#e11d48',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertOctagon size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#9f1239' }}>
                  ACTIVE MEDICAL EMERGENCY: {activeEmergencies[0].facilityName}
                </div>
                <div style={{ fontSize: '0.775rem', color: '#881337' }}>
                  {activeEmergencies[0].reason} • Required: {activeEmergencies[0].requiredLiters}L
                </div>
              </div>
            </div>

            <Link
              to="/admin/emergencies"
              style={{
                backgroundColor: '#be123c',
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              Manage Override <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {/* KPI Metrics Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <MetricCard
            title="Active Fleet"
            value={metrics.activeTankers}
            subtext="Tankers on Road"
            icon={Truck}
            color="#0284c7"
          />
          <MetricCard
            title="Pending Queue"
            value={metrics.pendingRequests}
            subtext="Awaiting Allocation"
            icon={Inbox}
            color="#d97706"
          />
          <MetricCard
            title="Critical Requests"
            value={metrics.criticalRequests}
            subtext="AI Score ≥ 8.5/10"
            icon={AlertOctagon}
            color="#be123c"
          />
          <MetricCard
            title="In Transit"
            value={metrics.inTransit}
            subtext="Live GPS Monitored"
            icon={Activity}
            color="#4f46e5"
          />
          <MetricCard
            title="Completed Today"
            value={metrics.completedToday}
            subtext={`${(metrics.totalLitersDispensed / 1000).toFixed(0)}k Liters Dispensed`}
            icon={CheckCircle2}
            color="#059669"
          />
          <MetricCard
            title="Avg ETA"
            value={`${metrics.averageEtaMinutes}m`}
            subtext="Dynamic Route Optim"
            icon={Clock}
            color="#0891b2"
          />
        </div>

        {/* Middle Row: Live GIS Fleet Map + High Priority Queue */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.25fr 1fr',
            gap: '1.5rem',
            marginBottom: '1.75rem',
          }}
          className="admin-dashboard-grid"
        >
          {/* Live Fleet Map Preview */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  Live Municipal Fleet & Shortage Map
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                  Real-time telemetry tracking & demand heat cluster
                </span>
              </div>
              <Link to="/admin/map" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                Expand Map →
              </Link>
            </div>

            <div style={{ flex: 1, minHeight: '380px' }}>
              <LiveMap
                tankers={tankers}
                requests={requests}
                emergencies={emergencies}
                height="380px"
                zoom={12}
              />
            </div>
          </div>

          {/* AI-Ranked Priority Request Queue */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xl)',
              padding: '1.25rem',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={16} color="var(--primary-600)" />
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                    AI Priority Queue
                  </h3>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                  Ranked dynamically by vulnerability, dry days & facility criticality
                </span>
              </div>
              <Link to="/admin/requests" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)' }}>
                View All ({requests.length}) →
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
              {criticalRequests.map((req) => (
                <div
                  key={req.id}
                  style={{
                    backgroundColor: 'var(--slate-50)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.85rem 1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <strong style={{ fontSize: '0.875rem', color: 'var(--slate-900)' }}>
                          #{req.id} • {req.citizenName}
                        </strong>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{req.address}</span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <PriorityBadge level={req.priorityLevel} size="sm" />
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--slate-600)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                        Score: {req.priorityScore}/10
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--slate-600)', borderTop: '1px solid var(--slate-200)', paddingTop: '6px', marginTop: '6px' }}>
                    <span>{req.quantityLiters.toLocaleString()} L • {req.daysWithoutWater} days dry</span>
                    <StatusBadge status={req.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row: Recent Audit Events Stream */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.25rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Recent System Audit & Cryptographic Dispatch Ledger
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
                Immutable event stream ensuring transparency and accountability
              </span>
            </div>
            <Link to="/admin/audit" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-600)' }}>
              Full Audit Trail →
            </Link>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--slate-400)', fontSize: '0.75rem' }}>
                  <th style={{ padding: '8px 12px' }}>TIMESTAMP</th>
                  <th style={{ padding: '8px 12px' }}>ACTOR</th>
                  <th style={{ padding: '8px 12px' }}>ENTITY</th>
                  <th style={{ padding: '8px 12px' }}>ACTION</th>
                  <th style={{ padding: '8px 12px' }}>DETAILS</th>
                  <th style={{ padding: '8px 12px' }}>PROOF HASH</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', color: 'var(--slate-500)' }}>
                      {log.timestamp}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--slate-800)' }}>
                      {log.actorName}
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--slate-700)' }}>
                      {log.entity}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span
                        style={{
                          backgroundColor: log.status === 'CRITICAL' ? '#ffe4e6' : 'var(--primary-50)',
                          color: log.status === 'CRITICAL' ? '#be123c' : 'var(--primary-700)',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--slate-600)' }}>
                      {log.details}
                    </td>
                    <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--slate-400)' }}>
                      {log.txHash}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .admin-dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};
