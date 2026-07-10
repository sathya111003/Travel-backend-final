import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, ShieldCheck, AlertTriangle } from 'lucide-react';
import { fetchAllUsers } from '../../../api/api';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const { data } = await fetchAllUsers();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Session expired or invalid. Please log out and log back in as admin.');
        } else {
          setError('Failed to load users. Please try again.');
        }
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">User Management</h1>
        <p className="text-text/60 mt-1">Manage all registered users and their account details.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="glass p-10 rounded-3xl border border-red-400/20 flex flex-col items-center space-y-6 text-center">
          <AlertTriangle size={48} className="text-red-400" />
          <div>
            <h3 className="text-xl font-bold text-red-400 mb-2">Authentication Error</h3>
            <p className="text-text/60">{error}</p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('userInfo');
              navigate('/admin/login');
            }}
            className="bg-red-400/10 border border-red-400/30 text-red-400 px-8 py-3 rounded-xl font-bold hover:bg-red-400/20 transition-all"
          >
            Log Out & Re-Login
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user) => (
            <div key={user._id} className="glass p-8 rounded-3xl border border-primary/10 relative group hover:border-primary/40 transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                  <User size={32} />
                </div>
                {user.role === 'admin' && (
                  <span className="flex items-center space-x-1 bg-accent/20 text-accent px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                    <ShieldCheck size={12} />
                    <span>Admin</span>
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-bold mb-1">{user.name}</h3>
              <p className="text-text/50 text-sm mb-6 flex items-center">
                <Mail size={14} className="mr-2" /> {user.email}
              </p>

              <div className="space-y-3 pt-6 border-t border-primary/10">
                <div className="flex items-center text-sm text-text/70">
                  <Phone size={14} className="mr-3 text-primary" />
                  <span>{user.phone || 'No phone added'}</span>
                </div>
                <div className="flex items-center text-sm text-text/70">
                  <Calendar size={14} className="mr-3 text-primary" />
                  <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserManagement;
