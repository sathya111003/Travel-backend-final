import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, CalendarCheck, Users, IndianRupee } from 'lucide-react';
import { fetchAllPackagesAdmin, fetchAllBookings, fetchAllUsers } from '../../../api/api';

const StatCard = ({ title, value, icon, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass p-8 rounded-3xl border border-primary/10 relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-10 rounded-full blur-3xl -mr-16 -mt-16`}></div>
    <div className="flex items-center justify-between relative">
      <div>
        <p className="text-text/50 font-bold uppercase text-xs tracking-wider mb-2">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
      <div className={`p-4 rounded-2xl ${color.replace('bg-', 'bg-')}/20 text-text`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    packages: 0,
    bookings: 0,
    users: 0,
    revenue: 150000 // UI only placeholder
  });

  useEffect(() => {
    const getStats = async () => {
      try {
        const [pkgs, bks, usrs] = await Promise.all([
          fetchAllPackagesAdmin(),
          fetchAllBookings(),
          fetchAllUsers()
        ]);
        setStats({
          packages: pkgs.data.length,
          bookings: bks.data.length,
          users: usrs.data.length,
          revenue: bks.data.reduce((acc, b) => acc + b.totalPrice, 0)
        });
      } catch (error) {
        console.error(error);
      }
    };
    getStats();
  }, []);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">Welcome Back, Admin</h1>
          <p className="text-text/60 mt-2">Here's what's happening with your travel platform today.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-primary">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Packages" value={stats.packages} icon={<Package size={24} />} color="bg-primary" />
        <StatCard title="Total Bookings" value={stats.bookings} icon={<CalendarCheck size={24} />} color="bg-accent" />
        <StatCard title="Total Users" value={stats.users} icon={<Users size={24} />} color="bg-blue-400" />
        <StatCard title="Revenue" value={`₹${stats.revenue.toLocaleString()}`} icon={<IndianRupee size={24} />} color="bg-yellow-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-8 rounded-3xl h-80 flex items-center justify-center border border-primary/10">
          <p className="text-text/30 italic">Revenue Chart Placeholder</p>
        </div>
        <div className="glass p-8 rounded-3xl h-80 flex items-center justify-center border border-primary/10">
          <p className="text-text/30 italic">Booking Trends Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
