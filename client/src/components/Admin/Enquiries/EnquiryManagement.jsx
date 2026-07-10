import React, { useState, useEffect } from 'react';
import { MessageSquare, Mail, Phone, Calendar, User } from 'lucide-react';
import { fetchAllEnquiries } from '../../../api/api';

const EnquiryManagement = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getEnquiries = async () => {
      try {
        const { data } = await fetchAllEnquiries();
        setEnquiries(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getEnquiries();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Enquiries</h1>
        <p className="text-text/60 mt-1">Review and respond to messages from potential travelers.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {enquiries.map((enquiry) => (
            <div key={enquiry._id} className="glass p-8 rounded-3xl border border-primary/10 hover:bg-white/5 transition-all">
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="space-y-6 flex-1">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <User size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{enquiry.name}</h4>
                      <p className="text-xs text-text/50">Submitted on {new Date(enquiry.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="bg-background/50 p-6 rounded-2xl border border-primary/5">
                    <p className="text-text/80 leading-relaxed italic">"{enquiry.message}"</p>
                  </div>
                </div>

                <div className="md:w-64 space-y-3 pt-6 md:pt-0 md:border-l border-primary/10 md:pl-8">
                  <h5 className="text-xs font-bold uppercase text-text/30 tracking-widest mb-4">Contact Info</h5>
                  <div className="flex items-center text-sm text-text/70">
                    <Mail size={14} className="mr-3 text-primary" />
                    <span>{enquiry.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-text/70">
                    <Phone size={14} className="mr-3 text-primary" />
                    <span>{enquiry.phone || 'Not provided'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {enquiries.length === 0 && (
            <div className="glass p-20 text-center text-text/30 italic rounded-3xl border border-primary/10">
              No enquiries found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnquiryManagement;
