// DemoSimulationControls.jsx (JavaScript)
import React from 'react';
import { useDemoSimulation } from '../../context/DemoSimulationContext';
import {
  Play,
  RotateCcw,
  Sparkles,
  AlertOctagon,
  MapPin,
  ShieldCheck,
  Truck,
  ChevronUp,
  ChevronDown,
  Eye,
  EyeOff,
} from 'lucide-react';

export const DemoSimulationControls = () => {
  const {
    isDemoBarVisible,
    setIsDemoBarVisible,
    currentStep,
    isExecuting,
    lastMessage,
    runStep1_CreateCitizenRequest,
    runStep2_AssignTanker,
    runStep3_TriggerHospitalEmergency,
    runStep4_SimulateArrivalAndGeofence,
    runStep5_VerifyOtpAndComplete,
    resetSimulation,
  } = useDemoSimulation();

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#0f172a',
        color: '#ffffff',
        borderTop: '2px solid var(--primary-600)',
        boxShadow: '0 -10px 25px rgba(0, 0, 0, 0.3)',
        zIndex: 400,
        transition: 'transform 0.3s ease',
        transform: isDemoBarVisible ? 'translateY(0)' : 'translateY(calc(100% - 36px))',
      }}
    >
      {/* Top Toggle Strip */}
      <div
        onClick={() => setIsDemoBarVisible(!isDemoBarVisible)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 1.5rem',
          backgroundColor: '#1e293b',
          cursor: 'pointer',
          borderBottom: '1px solid #334155',
          fontSize: '0.75rem',
          fontWeight: 700,
          color: '#94a3b8',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Sparkles size={14} color="#38bdf8" />
          <span style={{ color: '#ffffff' }}>HACKATHON DEMO SCENARIO RUNNER</span>
          <span style={{ backgroundColor: '#0284c7', color: 'white', padding: '1px 6px', borderRadius: '4px', fontSize: '0.65rem' }}>
            Interactive Demo Mode
          </span>
          {lastMessage && (
            <span style={{ color: '#38bdf8', fontWeight: 500, marginLeft: '12px' }}>
              ℹ️ {lastMessage}
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>{isDemoBarVisible ? 'Collapse Bar' : 'Expand Simulation Controls'}</span>
          {isDemoBarVisible ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </div>
      </div>

      {/* Main Buttons Toolbar */}
      {isDemoBarVisible && (
        <div
          className="app-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 0',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Action Step Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <DemoButton
              number="1"
              label="1. Create Request"
              icon={MapPin}
              active={currentStep === 1}
              onClick={runStep1_CreateCitizenRequest}
              disabled={isExecuting}
            />

            <DemoButton
              number="2"
              label="2. Assign Tanker"
              icon={Truck}
              active={currentStep === 2}
              onClick={runStep2_AssignTanker}
              disabled={isExecuting}
            />

            <DemoButton
              number="3"
              label="3. Hospital Emergency"
              icon={AlertOctagon}
              active={currentStep === 3}
              onClick={runStep3_TriggerHospitalEmergency}
              disabled={isExecuting}
              isCritical
            />

            <DemoButton
              number="4"
              label="4. Geofence Arrival"
              icon={MapPin}
              active={currentStep === 4}
              onClick={runStep4_SimulateArrivalAndGeofence}
              disabled={isExecuting}
            />

            <DemoButton
              number="5"
              label="5. Verified OTP Delivery"
              icon={ShieldCheck}
              active={currentStep === 5}
              onClick={runStep5_VerifyOtpAndComplete}
              disabled={isExecuting}
              isSuccess
            />
          </div>

          {/* Reset button */}
          <button
            onClick={resetSimulation}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#334155',
              color: '#cbd5e1',
              padding: '6px 12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem',
              fontWeight: 600,
              border: '1px solid #475569',
              transition: 'background 0.2s',
            }}
          >
            <RotateCcw size={13} />
            Reset State
          </button>
        </div>
      )}
    </div>
  );
};

const DemoButton = ({ number, label, icon: Icon, active, onClick, disabled, isCritical, isSuccess }) => {
  let bg = '#1e293b';
  let border = '#334155';
  let text = '#cbd5e1';

  if (active) {
    bg = isCritical ? '#be123c' : isSuccess ? '#059669' : '#0284c7';
    border = isCritical ? '#f43f5e' : isSuccess ? '#10b981' : '#38bdf8';
    text = '#ffffff';
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        backgroundColor: bg,
        color: text,
        border: `1px solid ${border}`,
        padding: '6px 12px',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.775rem',
        fontWeight: active ? 700 : 500,
        boxShadow: active ? '0 0 12px rgba(2, 132, 199, 0.4)' : 'none',
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.15s ease',
      }}
    >
      <Icon size={14} />
      <span>{label}</span>
    </button>
  );
};
