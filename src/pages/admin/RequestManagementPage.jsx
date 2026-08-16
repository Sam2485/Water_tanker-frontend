// RequestManagementPage.jsx (JavaScript)
import React, { useState, useEffect } from 'react';
import { requestService } from '../../services/requestService';
import { tankerService } from '../../services/tankerService';
import { assignmentService } from '../../services/assignmentService';
import { mockStateManager } from '../../services/mockStateManager';
import { PriorityBadge } from '../../components/common/PriorityBadge';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import {
  Inbox,
  Search,
  Filter,
  Truck,
  Sparkles,
  ArrowUpDown,
  X,
  CheckCircle2,
} from 'lucide-react';

export const RequestManagementPage = () => {
  const [requests, setRequests] = useState([]);
  const [tankers, setTankers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('PRIORITY'); // 'PRIORITY' | 'NEWEST' | 'QUANTITY'

  // Modal for Manual Dispatch
  const [selectedReqForAssign, setSelectedReqForAssign] = useState(null);
  const [selectedTankerId, setSelectedTankerId] = useState('');

  const loadData = async () => {
    try {
      const [reqs, tnks] = await Promise.all([
        requestService.getRequests(),
        tankerService.getTankers(),
      ]);
      setRequests(reqs);
      setTankers(tnks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const unsubscribe = mockStateManager.subscribe(loadData);
    return unsubscribe;
  }, []);

  const handleAssignTanker = async () => {
    if (!selectedReqForAssign || !selectedTankerId) return;
    try {
      await assignmentService.assignTanker(selectedReqForAssign.id, selectedTankerId);
      setSelectedReqForAssign(null);
      setSelectedTankerId('');
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const filteredRequests = requests
    .filter((r) => {
      const matchSearch =
        r.id.toLowerCase().includes(search.toLowerCase()) ||
        r.citizenName.toLowerCase().includes(search.toLowerCase()) ||
        r.address.toLowerCase().includes(search.toLowerCase());
      const matchPriority = priorityFilter === 'ALL' || r.priorityLevel === priorityFilter;
      const matchStatus = statusFilter === 'ALL' || r.status === statusFilter;
      return matchSearch && matchPriority && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'PRIORITY') return b.priorityScore - a.priorityScore;
      if (sortBy === 'NEWEST') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'QUANTITY') return b.quantityLiters - a.quantityLiters;
      return 0;
    });

  if (loading) return <LoadingSpinner text="Loading municipal request database..." />;

  const availableTankers = tankers.filter((t) => t.status === 'AVAILABLE' || t.status === 'ASSIGNED');

  return (
    <div className="page-wrapper">
      <div className="app-container">
        {/* Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)' }}>
            Water Request Queue & AI Priority Dispatch
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '2px' }}>
            Multi-factor equitable allocation engine based on vulnerability, shortage duration & complaint density
          </p>
        </div>

        {/* Filters & Search Toolbar */}
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
          {/* Search */}
          <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
            <div style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--slate-400)' }}>
              <Search size={16} />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search request ID, citizen name, address..."
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

          {/* Filters */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                backgroundColor: '#ffffff',
              }}
            >
              <option value="ALL">All Priorities</option>
              <option value="CRITICAL">Critical Priority</option>
              <option value="HIGH">High Priority</option>
              <option value="MEDIUM">Medium Priority</option>
              <option value="LOW">Standard Priority</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                backgroundColor: '#ffffff',
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value="REQUESTED">Requested</option>
              <option value="PRIORITY_CALCULATED">Priority Calculated</option>
              <option value="IN_TRANSIT">In Transit</option>
              <option value="COMPLETED">Completed</option>
              <option value="REASSIGNED">Reassigned</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8rem',
                backgroundColor: '#ffffff',
              }}
            >
              <option value="PRIORITY">Sort: Highest AI Priority</option>
              <option value="NEWEST">Sort: Newest First</option>
              <option value="QUANTITY">Sort: Largest Quantity</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
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
                  <th style={{ padding: '12px 14px' }}>Request ID</th>
                  <th style={{ padding: '12px 14px' }}>Requester</th>
                  <th style={{ padding: '12px 14px' }}>Location / Ward</th>
                  <th style={{ padding: '12px 14px' }}>AI Priority</th>
                  <th style={{ padding: '12px 14px' }}>Quantity</th>
                  <th style={{ padding: '12px 14px' }}>Dry Days</th>
                  <th style={{ padding: '12px 14px' }}>Status</th>
                  <th style={{ padding: '12px 14px' }}>Assigned Tanker</th>
                  <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((req) => (
                  <tr key={req.id} style={{ borderBottom: '1px solid var(--slate-100)', transition: 'background 0.15s' }}>
                    <td style={{ padding: '12px 14px', fontWeight: 800, color: 'var(--slate-900)' }}>
                      #{req.id}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--slate-800)' }}>{req.citizenName}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>{req.citizenPhone}</div>
                    </td>
                    <td style={{ padding: '12px 14px', maxWidth: '200px' }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {req.address}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>{req.facilityType}</div>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <PriorityBadge level={req.priorityLevel} size="sm" />
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.775rem', color: 'var(--slate-700)' }}>
                          {req.priorityScore}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--slate-800)' }}>
                      {req.quantityLiters.toLocaleString()} L
                    </td>
                    <td style={{ padding: '12px 14px', color: req.daysWithoutWater >= 3 ? '#be123c' : 'var(--slate-700)', fontWeight: 700 }}>
                      {req.daysWithoutWater} days
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <StatusBadge status={req.status} />
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {req.assignedTankerId ? (
                        <span style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
                          {tankers.find((t) => t.id === req.assignedTankerId)?.registrationNumber || req.assignedTankerId}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--slate-400)', fontSize: '0.75rem' }}>Unassigned</span>
                      )}
                    </td>
                    <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                      {!req.assignedTankerId && req.status !== 'COMPLETED' ? (
                        <button
                          onClick={() => {
                            setSelectedReqForAssign(req);
                            setSelectedTankerId(availableTankers[0]?.id || 'tnk-101');
                          }}
                          style={{
                            backgroundColor: 'var(--primary-600)',
                            color: '#ffffff',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                          }}
                        >
                          Dispatch Tanker
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>Active</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dispatch Tanker Modal */}
        {selectedReqForAssign && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 350,
              padding: '1rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-lg)',
                maxWidth: '460px',
                width: '100%',
                padding: '1.5rem',
                boxShadow: 'var(--shadow-xl)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)' }}>
                  Dispatch Tanker to #{selectedReqForAssign.id}
                </h3>
                <button onClick={() => setSelectedReqForAssign(null)} style={{ color: 'var(--slate-400)' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ fontSize: '0.825rem', color: 'var(--slate-600)', marginBottom: '1.25rem' }}>
                Destination: <strong>{selectedReqForAssign.address}</strong>
                <br />
                Required: <strong>{selectedReqForAssign.quantityLiters} Liters</strong> • AI Score: <strong>{selectedReqForAssign.priorityScore}/10</strong>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  Select Available Tanker (OR-Tools Optimal Match)
                </label>
                <select
                  value={selectedTankerId}
                  onChange={(e) => setSelectedTankerId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.85rem',
                  }}
                >
                  {tankers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.registrationNumber} — Driver: {t.driver.name} ({t.currentLiters}L / {t.status})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setSelectedReqForAssign(null)}
                  style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', color: 'var(--slate-600)', fontSize: '0.85rem' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAssignTanker}
                  style={{
                    backgroundColor: 'var(--primary-600)',
                    color: '#ffffff',
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                  }}
                >
                  Confirm Assignment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
