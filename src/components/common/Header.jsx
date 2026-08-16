// Header.jsx (JavaScript)
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  Droplet,
  Bell,
  User,
  Shield,
  Layers,
  MapPin,
  Truck,
  FileText,
  AlertTriangle,
  BarChart3,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';

export const Header = () => {
  const { user, role, logout, switchDemoRole } = useAuth();
  const { unreadCount, toggleDrawer } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const isActive = (path) => location.pathname.startsWith(path);

  const handleRoleChange = (roleKey) => {
    switchDemoRole(roleKey);
    setShowRoleMenu(false);
    if (roleKey === 'citizen') navigate('/citizen');
    else if (roleKey === 'admin') navigate('/admin/dashboard');
    else if (roleKey === 'authority') navigate('/authority/dashboard');
  };

  return (
    <header
      style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid var(--border-color)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      <div className="app-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
        {/* Brand & Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
              }}
            >
              <Droplet size={22} fill="white" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--slate-900)', letterSpacing: '-0.02em' }}>
                  AquaEquity
                </span>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    backgroundColor: 'var(--primary-100)',
                    color: 'var(--primary-800)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                  }}
                >
                  AI-GIS
                </span>
              </div>
              <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', display: 'block', lineHeight: 1 }}>
                Team Victus (141167) • PS-B20
              </span>
            </div>
          </Link>

          {/* Navigation by Role */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {role === 'CITIZEN' && (
              <>
                <NavLink to="/citizen" label="Overview" active={location.pathname === '/citizen'} />
                <NavLink to="/citizen/request" label="Request Water" active={isActive('/citizen/request')} />
                <NavLink to="/citizen/requests" label="My Requests" active={isActive('/citizen/requests')} />
                <NavLink to="/citizen/track/asg-demo-1" label="Live Tracking" active={isActive('/citizen/track')} />
              </>
            )}

            {role === 'ADMIN' && (
              <>
                <NavLink to="/admin/dashboard" label="Command Center" active={isActive('/admin/dashboard')} />
                <NavLink to="/admin/map" label="Live Fleet Map" active={isActive('/admin/map')} />
                <NavLink to="/admin/requests" label="Priority Requests" active={isActive('/admin/requests')} />
                <NavLink to="/admin/tankers" label="Tanker Fleet" active={isActive('/admin/tankers')} />
                <NavLink to="/admin/emergencies" label="Emergency Override" active={isActive('/admin/emergencies')} />
                <NavLink to="/admin/analytics" label="Analytics" active={isActive('/admin/analytics')} />
                <NavLink to="/admin/audit" label="Audit Log" active={isActive('/admin/audit')} />
              </>
            )}

            {role === 'AUTHORITY' && (
              <>
                <NavLink to="/authority/dashboard" label="Authority Overview" active={isActive('/authority/dashboard')} />
                <NavLink to="/admin/analytics" label="Zonal Equity Metrics" active={isActive('/admin/analytics')} />
                <NavLink to="/admin/map" label="Macro GIS View" active={isActive('/admin/map')} />
                <NavLink to="/admin/audit" label="Compliance Log" active={isActive('/admin/audit')} />
              </>
            )}
          </nav>
        </div>

        {/* Right Section: Role Switcher & Notifications & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          {/* Quick Demo Switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 12px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--slate-100)',
                border: '1px solid var(--border-color)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--slate-700)',
                transition: 'all var(--transition-fast)',
              }}
            >
              <Sparkles size={14} color="var(--primary-600)" />
              <span>Role: <strong style={{ color: 'var(--slate-900)' }}>{role}</strong></span>
              <ChevronDown size={14} />
            </button>

            {showRoleMenu && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: '240px',
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: 'var(--shadow-xl)',
                  border: '1px solid var(--border-color)',
                  padding: '6px',
                  zIndex: 200,
                }}
              >
                <div style={{ padding: '6px 10px', fontSize: '0.7rem', fontWeight: 700, color: 'var(--slate-400)', textTransform: 'uppercase' }}>
                  Switch Demo Persona
                </div>
                <RoleMenuItem
                  label="Citizen / Beneficiary"
                  sub="Ramesh Jadhav (Kothrud)"
                  active={role === 'CITIZEN'}
                  onClick={() => handleRoleChange('citizen')}
                />
                <RoleMenuItem
                  label="Municipal Admin"
                  sub="Vijay Deshmukh (PMC HQ)"
                  active={role === 'ADMIN'}
                  onClick={() => handleRoleChange('admin')}
                />
                <RoleMenuItem
                  label="Water Authority"
                  sub="Dr. Neha Kulkarni (MWRRA)"
                  active={role === 'AUTHORITY'}
                  onClick={() => handleRoleChange('authority')}
                />
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <button
            onClick={toggleDrawer}
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--slate-50)',
              border: '1px solid var(--border-color)',
              color: 'var(--slate-700)',
            }}
            aria-label="View notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: '#e11d48',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid white',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Info / Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '8px', borderLeft: '1px solid var(--border-color)' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '1.5px solid var(--primary-500)',
              }}
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ display: 'none', lineHeight: 1.2, '@media (min-width: 768px)': { display: 'block' } }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--slate-900)' }}>{user?.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--slate-500)' }}>{user?.ward || role}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ to, label, active }) => (
  <Link
    to={to}
    style={{
      padding: '6px 12px',
      borderRadius: 'var(--radius-md)',
      fontSize: '0.85rem',
      fontWeight: active ? 700 : 500,
      color: active ? 'var(--primary-700)' : 'var(--slate-600)',
      backgroundColor: active ? 'var(--primary-50)' : 'transparent',
      transition: 'all var(--transition-fast)',
      textDecoration: 'none',
      whiteSpace: 'nowrap',
    }}
  >
    {label}
  </Link>
);

const RoleMenuItem = ({ label, sub, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: 'block',
      width: '100%',
      textAlign: 'left',
      padding: '8px 10px',
      borderRadius: 'var(--radius-sm)',
      backgroundColor: active ? 'var(--primary-50)' : 'transparent',
      border: 'none',
      cursor: 'pointer',
      marginBottom: '2px',
    }}
  >
    <div style={{ fontSize: '0.8125rem', fontWeight: active ? 700 : 600, color: active ? 'var(--primary-700)' : 'var(--slate-800)' }}>
      {label}
    </div>
    <div style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>{sub}</div>
  </button>
);
