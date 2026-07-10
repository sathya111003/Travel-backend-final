import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createEnquiry } from '../api/api';

const ContactPage = () => {
  const { userInfo, openAuthModal } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      openAuthModal('login');
      return;
    }
    
    setLoading(true);
    try {
      await createEnquiry(formData);
      alert('Enquiry sent successfully! We will contact you soon.');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to send enquiry. Try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="pt-32 pb-20 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4">Get In Touch</h1>
          <p className="text-text/60">Have questions? We're here to help you plan your perfect trip.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="glass p-8 rounded-3xl space-y-8">
              <h3 className="text-2xl font-bold">Contact Information</h3>
              
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">Phone</h4>
                  <p className="text-text/60">+91-9361571902</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">Email</h4>
                  <p className="text-text/60">ravanaholidaysofficial@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold">Head Office</h4>
                  <p className="text-text/60">Adventure City, India</p>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div className="h-[300px] glass rounded-3xl overflow-hidden relative">
              <iframe 
                width="100%" 
                height="100%" 
                frameBorder="0" 
                src="https://maps.google.com/maps?q=Ooty&hl=es&z=14&amp;output=embed"
                className="grayscale invert brightness-90 contrast-125"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass p-10 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            
            <h3 className="text-2xl font-bold mb-8">Send us a Message</h3>
            <form className="space-y-6" onSubmit={handleEnquirySubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text/60">Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-card border border-primary/20 rounded-xl px-4 py-4 focus:outline-none focus:border-primary text-text" 
                    placeholder="John Doe" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text/60">Email Address</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-card border border-primary/20 rounded-xl px-4 py-4 focus:outline-none focus:border-primary text-text" 
                    placeholder="john@example.com" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text/60">Phone</label>
                  <input 
                    type="text" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-card border border-primary/20 rounded-xl px-4 py-4 focus:outline-none focus:border-primary text-text" 
                    placeholder="+91 9876543210" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-text/60">Subject</label>
                  <input 
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-card border border-primary/20 rounded-xl px-4 py-4 focus:outline-none focus:border-primary text-text" 
                    placeholder="Query about Packages" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text/60">Message</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-card border border-primary/20 rounded-xl px-4 py-4 focus:outline-none focus:border-primary text-text h-40" 
                  placeholder="Tell us what you're looking for..."
                ></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-background font-bold py-4 rounded-2xl hover:bg-primary/90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
