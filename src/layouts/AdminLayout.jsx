// AdminLayout.jsx (JavaScript)
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { NotificationDrawer } from '../components/common/NotificationDrawer';
import { ToastNotification } from '../components/common/ToastNotification';
import { DemoSimulationControls } from '../components/common/DemoSimulationControls';

export const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '50px' }}>
      <Header />
      <main style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <Outlet />
      </main>
      <Footer />
      <NotificationDrawer />
      <ToastNotification />
      <DemoSimulationControls />
    </div>
  );
};
