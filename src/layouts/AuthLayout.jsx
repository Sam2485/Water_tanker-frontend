// AuthLayout.jsx (JavaScript)
import React from 'react';
import { Outlet } from 'react-router-dom';
import { NotificationDrawer } from '../components/common/NotificationDrawer';
import { ToastNotification } from '../components/common/ToastNotification';

export const AuthLayout = () => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column' }}>
      <Outlet />
      <NotificationDrawer />
      <ToastNotification />
    </div>
  );
};
