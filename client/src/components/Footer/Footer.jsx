import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Share2, Send, Users, Mail, Phone, MapPin, MessageCircle } from 'lucide-react';
import logo from '../../assets/logo.PNG';
import { subscribeNewsletter } from '../../api/api';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const { data } = await subscribeNewsletter(email);
      setMessage(data.message || 'Subscribed! Check your email.');
      setEmail('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to subscribe. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Ravana Holidays',
          text: 'Check out these amazing premium travel experiences!',
          url: window.location.href,
        });
      } else {
        // Fallback for desktop browsers that don't support native share
        await navigator.clipboard.writeText(window.location.href);
        alert('Website Link Copied to Clipboard! You can now paste and share it anywhere.');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  return (
    <footer className="bg-background pt-20 pb-10 border-t border-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Ravana Holidays" className="w-8 h-8 object-contain" />
              <span className="text-2xl font-bold tracking-tighter text-text uppercase">
                RAVANA<span className="text-primary">HOLIDAYS</span>
              </span>
            </Link>
            <p className="text-text/60 leading-relaxed">
              We provide premium travel experiences tailored to your dreams.
              From snowy mountains to tropical beaches, we plan it all.
            </p>
            <div className="flex space-x-4">
              <button onClick={handleShare} className="w-10 h-10 glass rounded-full flex items-center justify-center hover:text-primary transition-colors cursor-pointer border border-transparent hover:border-primary/20">
                <Share2 className="w-5 h-5" />
              </button>
              <a href="https://wa.me/919361571902?text=Hi%20Ravana%20Holidays!%20I'm%20interested%20in%20booking%20a%20trip.%20Could%20you%20please%20share%20more%20details%3F" target="_blank" rel="noopener noreferrer" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:text-primary transition-colors border border-transparent hover:border-primary/20">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/_ravana_holidays_official_?igsh=ZjU3Z3JuZjF6ZDJ3&utm_source=qr" target="_blank" rel="noopener noreferrer" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:text-primary transition-colors border border-transparent hover:border-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <Link to="/about" className="w-10 h-10 glass rounded-full flex items-center justify-center hover:text-primary transition-colors border border-transparent hover:border-primary/20">
                <Users className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-primary">Quick Links</h4>
            <ul className="space-y-4 text-text/70">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/packages" className="hover:text-primary transition-colors">Packages</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/dashboard" className="hover:text-primary transition-colors">User Dashboard</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-primary">Contact Us</h4>
            <ul className="space-y-4 text-text/70">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>123 Travel Street, Adventure City, India</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>+91 93615 71902</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>ravanaholidaysofficial@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-primary">Newsletter</h4>
            <p className="text-text/70 mb-4">Subscribe for latest deals and news.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-card border border-primary/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary text-text"
              />
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-background font-bold py-3 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
            {message && <p className="mt-3 text-sm text-primary">{message}</p>}
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-primary/10 text-center text-text/50 text-sm">
          <p>© {new Date().getFullYear()} Ravana Holidays. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
