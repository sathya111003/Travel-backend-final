import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from './Sidebar/AdminSidebar';

const AdminLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(userInfo);
    if (user.role !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="bg-background text-text min-h-screen">
      <AdminSidebar />
      <main className="ml-64 p-12">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
