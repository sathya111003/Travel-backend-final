import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  CalendarCheck, 
  Users, 
  MessageSquare, 
  LogOut,
  Compass,
  Menu,
  ShieldCheck
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Packages', path: '/admin/packages', icon: <Package size={20} /> },
    { name: 'Bookings', path: '/admin/bookings', icon: <CalendarCheck size={20} /> },
    { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Enquiries', path: '/admin/enquiries', icon: <MessageSquare size={20} /> },
    { name: 'Recent Tours', path: '/admin/recent-tours', icon: <Compass size={20} /> },
    { name: 'Mega Menu', path: '/admin/mega-menu', icon: <Menu size={20} /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  return (
    <div className="w-64 glass h-screen fixed left-0 top-0 border-r border-primary/10 flex flex-col">
      <div className="p-6 border-b border-primary/10 flex flex-col items-center space-y-4">
        <img src="/src/assets/logo.PNG" alt="Ravana Holidays" className="h-20 w-auto object-contain" />
        <div className="flex items-center space-x-2">
          <ShieldCheck className="text-primary w-5 h-5" />
          <span className="text-lg font-bold tracking-tighter uppercase">Admin Console</span>
        </div>
      </div>

      <div className="flex-1 py-8 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path 
                ? 'bg-primary text-background font-bold shadow-lg shadow-primary/20' 
                : 'text-text/70 hover:bg-primary/10 hover:text-primary'
            }`}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </div>

      <div className="p-6 border-t border-primary/10">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all border border-red-400/20"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
