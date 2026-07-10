import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, User, Package, CheckCircle, Clock, XCircle } from 'lucide-react';
import { fetchAllBookings } from '../../../api/api';

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const { data } = await fetchAllBookings();
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getBookings();
  }, []);

  const getStatusIcon = (status) => {
    switch(status) {
      case 'booked': return <CheckCircle size={16} className="text-accent" />;
      case 'pending': return <Clock size={16} className="text-yellow-400" />;
      default: return <XCircle size={16} className="text-red-400" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Booking Management</h1>
        <p className="text-text/60 mt-1">Monitor and manage all customer bookings and payments.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="glass rounded-[2rem] overflow-hidden border border-primary/10">
          <table className="w-full text-left">
            <thead className="bg-primary/5 text-text/50 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Package</th>
                <th className="px-8 py-6">Travel Date</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Total Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {bookings.map((booking) => (
                <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                        <User size={20} />
                      </div>
                      <div>
                        <div className="font-bold">{booking.user?.name || 'Unknown'}</div>
                        <div className="text-xs text-text/50">{booking.user?.email || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-3">
                      <Package size={16} className="text-primary/50" />
                      <span className="font-medium">{booking.package?.title || 'Package Removed'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2 text-sm text-text/70">
                      <Calendar size={14} />
                      <span>{new Date(booking.travelDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(booking.status)}
                      <span className="text-xs font-bold uppercase tracking-wider">{booking.status}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right font-bold text-primary">
                    ₹{booking.totalPrice.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {bookings.length === 0 && (
            <div className="p-20 text-center text-text/30 italic">No bookings found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
