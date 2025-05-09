import React from 'react';
import TopNavbar from './TopNavbar';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div>
      <TopNavbar />
      <Sidebar />
      <div style={{ marginTop: '80px' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
