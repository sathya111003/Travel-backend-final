import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMyBookings } from '../api/api';
import { Package, Calendar, Clock, CreditCard, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo: user, logout, openAuthModal } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
      openAuthModal('login');
      return;
    }

    const getBookings = async () => {
      try {
        const { data } = await fetchMyBookings();
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getBookings();
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;

  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        {/* Profile Header */}
        <div className="glass p-8 md:p-12 rounded-3xl mb-12 flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="flex items-center space-x-6 relative">
            <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center border border-primary/30">
              <UserIcon className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{user?.name}</h1>
              <p className="text-text/60">{user?.email}</p>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-text/60 hover:text-primary transition-colors glass px-6 py-3 rounded-xl border-primary/10"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass p-8 rounded-3xl border-l-4 border-primary">
              <h4 className="text-sm font-bold text-text/50 uppercase mb-2">Total Bookings</h4>
              <p className="text-4xl font-bold">{bookings.length}</p>
            </div>
            <div className="glass p-8 rounded-3xl border-l-4 border-accent">
              <h4 className="text-sm font-bold text-text/50 uppercase mb-2">Active Trips</h4>
              <p className="text-4xl font-bold">
                {bookings.filter(b => new Date(b.travelDate) > new Date()).length}
              </p>
            </div>
          </div>

          {/* Booking History */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-bold">My Bookings</h2>
            
            {bookings.length === 0 ? (
              <div className="glass p-12 rounded-3xl text-center space-y-4">
                <Package className="w-12 h-12 text-text/20 mx-auto" />
                <p className="text-text/60">No bookings found. Start your first adventure!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="glass p-6 rounded-2xl hover:bg-white/5 transition-all group border border-primary/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                      <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                          <img src={booking.package?.images[0]} alt={booking.package?.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
                            {booking.package?.title}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-text/60 mt-1">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{new Date(booking.travelDate).toLocaleDateString()}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{booking.package?.duration}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">₹{booking.totalPrice.toLocaleString()}</p>
                        <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                          booking.status === 'booked' ? 'bg-accent/20 text-accent' : 'bg-primary/20 text-primary'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
