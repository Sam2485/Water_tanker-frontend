// LoginPage.jsx (JavaScript)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Droplet, Phone, ShieldCheck, ArrowRight, Sparkles, User, Building, Landmark } from 'lucide-react';

export const LoginPage = () => {
  const [phone, setPhone] = useState('+91 98765 43210');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('PHONE'); // 'PHONE' | 'OTP'
  const [selectedRole, setSelectedRole] = useState('CITIZEN');
  const [countdown, setCountdown] = useState(45);
  const [error, setError] = useState('');

  const { login, loading, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Please enter a valid mobile phone number');
      return;
    }
    setError('');
    setStep('OTP');
    setOtp('123456'); // Pre-fill demo OTP for effortless hackathon evaluation
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError('Please enter the 6-digit verification code');
      return;
    }
    setError('');
    try {
      const user = await login(phone, otp, selectedRole);
      if (user.role === 'ADMIN') navigate('/admin/dashboard');
      else if (user.role === 'AUTHORITY') navigate('/authority/dashboard');
      else navigate('/citizen');
    } catch (err) {
      setError('Authentication failed. Please try again.');
    }
  };

  const handleQuickLogin = (roleKey) => {
    switchDemoRole(roleKey);
    if (roleKey === 'admin') navigate('/admin/dashboard');
    else if (roleKey === 'authority') navigate('/authority/dashboard');
    else navigate('/citizen');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-xl)',
          border: '1px solid var(--border-color)',
          overflow: 'hidden',
        }}
      >
        {/* Header Branding */}
        <div
          style={{
            padding: '2rem 2rem 1.5rem',
            textAlign: 'center',
            borderBottom: '1px solid var(--border-color)',
            background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)',
          }}
        >
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.35)',
              marginBottom: '1rem',
            }}
          >
            <Droplet size={30} fill="white" />
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
            AquaEquity
          </h1>
          <p style={{ fontSize: '0.825rem', color: 'var(--slate-500)', marginTop: '4px' }}>
            AI-Supported Geospatial Equitable Water Allocation
          </p>
          <div
            style={{
              display: 'inline-block',
              marginTop: '8px',
              fontSize: '0.7rem',
              fontWeight: 700,
              backgroundColor: 'var(--primary-100)',
              color: 'var(--primary-800)',
              padding: '2px 8px',
              borderRadius: '4px',
            }}
          >
            Team Victus (141167) • PS-B20
          </div>
        </div>

        {/* 1-Click Fast Persona Switcher for Judges */}
        <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Sparkles size={13} color="var(--primary-600)" />
            <span>1-CLICK QUICK ACCESS FOR EVALUATORS:</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            <button
              onClick={() => handleQuickLogin('citizen')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px 4px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--slate-800)',
                cursor: 'pointer',
              }}
            >
              <User size={16} color="#0284c7" />
              <span style={{ marginTop: '3px' }}>Citizen</span>
            </button>

            <button
              onClick={() => handleQuickLogin('admin')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px 4px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--slate-800)',
                cursor: 'pointer',
              }}
            >
              <Building size={16} color="#e11d48" />
              <span style={{ marginTop: '3px' }}>Admin</span>
            </button>

            <button
              onClick={() => handleQuickLogin('authority')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '8px 4px',
                backgroundColor: '#ffffff',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--slate-800)',
                cursor: 'pointer',
              }}
            >
              <Landmark size={16} color="#4f46e5" />
              <span style={{ marginTop: '3px' }}>Authority</span>
            </button>
          </div>
        </div>

        {/* Standard OTP Form */}
        <div style={{ padding: '1.75rem 2rem' }}>
          {error && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#fff1f2',
                color: '#be123c',
                border: '1px solid #fecdd3',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.8rem',
                marginBottom: '1.25rem',
              }}
            >
              {error}
            </div>
          )}

          {step === 'PHONE' ? (
            <form onSubmit={handleSendOtp}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  Mobile Phone Number
                </label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--slate-400)' }}>
                    <Phone size={18} />
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 38px',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--slate-700)', marginBottom: '6px' }}>
                  Select Portal Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <option value="CITIZEN">Citizen / Residential Ward Beneficiary</option>
                  <option value="ADMIN">Municipal Water Authority (PMC Admin)</option>
                  <option value="AUTHORITY">State Water Resources Regulator (MWRRA)</option>
                </select>
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: 'var(--primary-600)',
                  color: '#ffffff',
                  padding: '11px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                <span>Send OTP</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp}>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--slate-600)' }}>
                  Enter the 6-digit OTP sent to <strong>{phone}</strong>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 600, marginTop: '4px' }}>
                  Demo Mode OTP: <strong>123456</strong>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  style={{
                    width: '100%',
                    textAlign: 'center',
                    letterSpacing: '0.5em',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    padding: '10px',
                    borderRadius: 'var(--radius-md)',
                    border: '2px solid var(--primary-500)',
                    outline: 'none',
                    fontFamily: 'var(--font-mono)',
                  }}
                  autoFocus
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  padding: '11px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                }}
              >
                <ShieldCheck size={18} />
                <span>{loading ? 'Verifying...' : 'Verify & Enter Portal'}</span>
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.775rem' }}>
                <button
                  type="button"
                  onClick={() => setStep('PHONE')}
                  style={{ color: 'var(--slate-500)', textDecoration: 'underline' }}
                >
                  Change Mobile Number
                </button>
                <span style={{ color: 'var(--slate-400)' }}>Resend in 30s</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
