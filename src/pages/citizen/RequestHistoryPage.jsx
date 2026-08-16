// RequestHistoryPage.jsx (JavaScript)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { requestService } from '../../services/requestService';
import { mockStateManager } from '../../services/mockStateManager';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { EmptyState } from '../../components/common/EmptyState';
import { Droplet, MapPin, PlusCircle, ArrowRight, Calendar, Users, Clock } from 'lucide-react';

export const RequestHistoryPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const loadData = async () => {
    try {
      const all = await requestService.getRequestsByCitizen(user?.id || 'usr-cit-101');
      setRequests(all);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockStateManager.subscribe(loadData);
    return unsubscribe;
  }, [user]);

  const filtered = requests.filter((r) => {
    if (filter === 'ACTIVE') return r.status !== 'COMPLETED' && r.status !== 'CANCELLED';
    if (filter === 'COMPLETED') return r.status === 'COMPLETED';
    return true;
  });

  if (loading) return <LoadingSpinner text="Loading your request history..." />;

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
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
              My Water Requests
            </h1>
            <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '2px' }}>
              Historical and active water tanker requests for {user?.name || 'Ramesh Jadhav'}
            </p>
          </div>

          <Link
            to="/citizen/request"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--primary-600)',
              color: '#ffffff',
              padding: '9px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            <PlusCircle size={16} />
            <span>New Request</span>
          </Link>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1.25rem' }}>
          {['ALL', 'ACTIVE', 'COMPLETED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                fontWeight: 600,
                backgroundColor: filter === f ? 'var(--primary-600)' : '#ffffff',
                color: filter === f ? '#ffffff' : 'var(--slate-600)',
                border: `1px solid ${filter === f ? 'var(--primary-600)' : 'var(--border-color)'}`,
              }}
            >
              {f === 'ALL' ? 'All Requests' : f === 'ACTIVE' ? 'Active / In-Transit' : 'Completed Deliveries'}
            </button>
          ))}
        </div>

        {/* Requests List */}
        {filtered.length === 0 ? (
          <EmptyState
            title="No requests in this category"
            description="You do not have any water requests matching the selected filter."
            actionLabel="Request Water Tanker"
            actionTo="/citizen/request"
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filtered.map((req) => (
              <div
                key={req.id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-xs)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                      #{req.id}
                    </span>
                    <PriorityBadge level={req.priorityLevel} size="sm" />
                    <StatusBadge status={req.status} />
                  </div>

                  <span style={{ fontSize: '0.75rem', color: 'var(--slate-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} /> {new Date(req.createdAt).toLocaleString()}
                  </span>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.825rem', color: 'var(--slate-700)' }}>
                  <div>
                    <span style={{ color: 'var(--slate-400)' }}>Location: </span>
                    <strong>{req.address}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--slate-400)' }}>Volume: </span>
                    <strong>{req.quantityLiters.toLocaleString()} Liters</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--slate-400)' }}>AI Priority Score: </span>
                    <strong style={{ color: 'var(--primary-700)' }}>{req.priorityScore} / 10</strong>
                  </div>
                </div>

                {req.notes && (
                  <div style={{ fontSize: '0.775rem', color: 'var(--slate-500)', backgroundColor: 'var(--slate-50)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                    Notes: {req.notes}
                  </div>
                )}

                {req.activeAssignmentId && req.status !== 'COMPLETED' && (
                  <div style={{ borderTop: '1px solid var(--slate-100)', paddingTop: '10px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                    <Link
                      to={`/citizen/track/${req.activeAssignmentId}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: 'var(--primary-50)',
                        color: 'var(--primary-700)',
                        padding: '6px 12px',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      Track on Live Map <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
