// PriorityScoreCard.jsx (JavaScript)
import React, { useState } from 'react';
import { PriorityBadge } from './PriorityBadge';
import { BrainCircuit, Info, Sparkles } from 'lucide-react';

export const PriorityScoreCard = ({ factors, score = 8.7, level = 'CRITICAL' }) => {
  const [showFormula, setShowFormula] = useState(false);

  const safeFactors = factors || {
    vulnerability: 8.5,
    daysWithoutWater: 4,
    complaintDensity: 8.8,
    facilityCriticality: 8.0,
  };

  const getScoreColor = (val) => {
    if (val >= 8.5) return '#be123c';
    if (val >= 7.0) return '#c2410c';
    if (val >= 5.0) return '#b45309';
    return '#047857';
  };

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BrainCircuit size={18} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--slate-900)' }}>
              AI Equity Priority Score
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>
              Dynamic Multi-Factor Allocation
            </span>
          </div>
        </div>
        <PriorityBadge level={level} size="md" />
      </div>

      {/* Main Score Display */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '6px',
          padding: '0.85rem 1rem',
          background: 'var(--slate-50)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          marginBottom: '1.25rem',
        }}
      >
        <span
          style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: getScoreColor(score),
            fontFamily: 'var(--font-mono)',
            lineHeight: 1,
          }}
        >
          {score}
        </span>
        <span style={{ fontSize: '1rem', color: 'var(--slate-400)', fontWeight: 600 }}>/ 10</span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: '0.775rem',
            color: 'var(--slate-500)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Sparkles size={13} color="var(--primary-600)" />
          OR-Tools Priority Rank #1
        </span>
      </div>

      {/* Breakdown Factors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
        <FactorRow
          label="Vulnerability Weight"
          sublabel="Infants / Seniors / Health risk"
          value={`${safeFactors.vulnerability} / 10`}
          percentage={(safeFactors.vulnerability / 10) * 100}
          color="#0284c7"
        />
        <FactorRow
          label="Supply Deprivation"
          sublabel={`${safeFactors.daysWithoutWater} consecutive dry days`}
          value={`${safeFactors.daysWithoutWater} days`}
          percentage={Math.min(100, (safeFactors.daysWithoutWater / 5) * 100)}
          color="#e11d48"
        />
        <FactorRow
          label="Area Complaint Density"
          sublabel="Geospatial cluster intensity"
          value={`${safeFactors.complaintDensity} / 10`}
          percentage={(safeFactors.complaintDensity / 10) * 100}
          color="#d97706"
        />
        <FactorRow
          label="Facility Criticality"
          sublabel="Community / Institutional weight"
          value={`${safeFactors.facilityCriticality} / 10`}
          percentage={(safeFactors.facilityCriticality / 10) * 100}
          color="#4f46e5"
        />
      </div>

      {/* Formula Toggle */}
      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
        <button
          onClick={() => setShowFormula(!showFormula)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.775rem',
            color: 'var(--primary-700)',
            fontWeight: 600,
          }}
        >
          <Info size={13} />
          {showFormula ? 'Hide Priority Formula' : 'View AI Scoring Model'}
        </button>

        {showFormula && (
          <div
            style={{
              marginTop: '0.5rem',
              padding: '0.65rem',
              background: '#0f172a',
              color: '#38bdf8',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.725rem',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.5,
            }}
          >
            Score = w₁(Vulnerability) + w₂(Days Dry) + w₃(Density) + w₄(Facility)
            <div style={{ color: '#94a3b8', marginTop: '4px', fontSize: '0.7rem' }}>
              Weights: w₁=0.35, w₂=0.30, w₃=0.15, w₄=0.20 (PostgreSQL/PostGIS + AI)
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const FactorRow = ({ label, sublabel, value, percentage, color }) => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '2px' }}>
      <div>
        <span style={{ fontWeight: 600, color: 'var(--slate-800)' }}>{label}</span>
        <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--slate-400)' }}>{sublabel}</span>
      </div>
      <span style={{ fontWeight: 700, color: 'var(--slate-800)', fontFamily: 'var(--font-mono)' }}>{value}</span>
    </div>
    <div
      style={{
        width: '100%',
        height: '6px',
        backgroundColor: 'var(--slate-100)',
        borderRadius: '9999px',
        overflow: 'hidden',
        marginTop: '2px',
      }}
    >
      <div
        style={{
          width: `${percentage}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: '9999px',
          transition: 'width 0.5s ease-out',
        }}
      />
    </div>
  </div>
);
