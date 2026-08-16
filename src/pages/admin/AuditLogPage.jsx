// AuditLogPage.jsx (JavaScript)
import React, { useState, useEffect } from 'react';
import { auditService } from '../../services/auditService';
import { mockStateManager } from '../../services/mockStateManager';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ShieldCheck, Search, Filter, Download, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

export const AuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState('');
  const [actorFilter, setActorFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await auditService.getAuditLogs();
      setLogs(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockStateManager.subscribe(loadData);
    return unsubscribe;
  }, []);

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.entity.toLowerCase().includes(search.toLowerCase()) ||
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.details.toLowerCase().includes(search.toLowerCase()) ||
      log.actorName.toLowerCase().includes(search.toLowerCase());
    const matchActor = actorFilter === 'ALL' || log.actor === actorFilter;
    return matchSearch && matchActor;
  });

  if (loading) return <LoadingSpinner text="Loading immutable audit logs..." />;

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Header */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                Municipal Dispatch Audit Ledger
              </h1>
            </div>
            <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Cryptographically verified event trail for equitable civic accountability & regulatory compliance
            </p>
          </div>

          <button
            type="button"
            onClick={() => alert('Exporting signed audit logs to CSV/JSON format...')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
              color: 'var(--slate-700)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <Download size={15} /> Export Audit Log
          </button>
        </div>

        {/* Toolbar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '1rem',
            marginBottom: '1.25rem',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
            <div style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--slate-400)' }}>
              <Search size={16} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail by entity, actor, action or details..."
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.825rem',
                outline: 'none',
              }}
            />
          </div>

          <select
            value={actorFilter}
            onChange={(e) => setActorFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              fontSize: '0.8rem',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="ALL">All Actors</option>
            <option value="SYSTEM">System / AI Engine</option>
            <option value="ADMIN">Municipal Admin</option>
            <option value="DRIVER">Driver</option>
            <option value="CITIZEN">Citizen</option>
          </select>
        </div>

        {/* Audit Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--slate-50)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', color: 'var(--slate-500)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px' }}>Time</th>
                  <th style={{ padding: '12px 14px' }}>Actor</th>
                  <th style={{ padding: '12px 14px' }}>Entity</th>
                  <th style={{ padding: '12px 14px' }}>Action</th>
                  <th style={{ padding: '12px 14px' }}>Details & Context</th>
                  <th style={{ padding: '12px 14px' }}>Cryptographic Proof</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--slate-100)' }}>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--slate-500)' }}>
                      {log.timestamp}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--slate-800)' }}>{log.actorName}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>Role: {log.actor}</div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--slate-800)' }}>
                      {log.entity}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span
                        style={{
                          backgroundColor:
                            log.status === 'CRITICAL' ? '#ffe4e6' : log.status === 'WARNING' ? '#fef3c7' : '#ecfdf5',
                          color:
                            log.status === 'CRITICAL' ? '#be123c' : log.status === 'WARNING' ? '#b45309' : '#047857',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                        }}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--slate-700)', maxWidth: '340px' }}>
                      {log.details}
                    </td>
                    <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--primary-700)' }}>
                      {log.txHash}
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
