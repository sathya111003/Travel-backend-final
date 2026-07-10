import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Star, Phone, Mail } from 'lucide-react';
import { fetchDestinations, fetchAllPackagesAdmin } from '../../api/api';
import logo from '../../assets/logo.PNG';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo, logout, openAuthModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const getInitialData = async () => {
      try {
        const { data: destData } = await fetchDestinations();
        setDestinations(destData);
        const { data: pkgData } = await fetchAllPackagesAdmin();
        const uniqueCategories = [...new Set(pkgData.map(p => (p.category || '').trim().toLowerCase()))].filter(Boolean);
        setCategories(uniqueCategories);
      } catch (error) {
        console.error(error);
      }
    };
    window.addEventListener('scroll', handleScroll);
    getInitialData();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setUserDropdown(false);
  };

  const isActive = (path) => location.pathname === path;

  const MegaMenu = ({ type }) => {
    const filtered = destinations.filter(d => d.type === type);
    if (filtered.length === 0) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className={`fixed left-0 right-0 top-full bg-background/95 backdrop-blur-2xl border-t border-white/5 shadow-2xl z-40 mx-auto max-w-5xl rounded-b-3xl overflow-hidden`}
        onMouseEnter={() => setActiveMenu(type)}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="p-10 max-h-[55vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {filtered.map((region) => (
              <div key={region._id} className="space-y-5">
                <h4 className="text-sm font-bold text-primary uppercase tracking-widest border-b border-primary/20 pb-3">{region.region}</h4>
                <ul className="space-y-2.5">
                  {region.cities.map((city, idx) => (
                    <li key={idx}>
                      <Link
                        to={`/packages?city=${city.name}`}
                        className="flex items-center space-x-2 text-white/60 hover:text-primary transition-colors text-sm"
                        onClick={() => setActiveMenu(null)}
                      >
                        <Star size={10} className="opacity-30" />
                        <span>{city.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const CategoryMenu = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`fixed left-0 right-0 top-full bg-background/95 backdrop-blur-2xl border-t border-white/5 shadow-2xl z-40 mx-auto max-w-sm rounded-b-3xl overflow-hidden`}
      onMouseEnter={() => setActiveMenu('packages')}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="p-8">
        <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-4">Browse Categories</h4>
        <ul className="space-y-3">
          {categories.map((cat, idx) => (
            <li key={idx}>
              <Link
                to={`/packages?category=${cat}`}
                className="text-white/60 hover:text-primary transition-colors text-sm flex items-center space-x-2"
                onClick={() => setActiveMenu(null)}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                <span className="capitalize">{cat}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );

  return (
    <div className="fixed w-full z-50 top-0 left-0 flex flex-col">
      {/* Top Marquee */}
      <div className="w-full bg-primary text-white py-1.5 text-[10px] font-black tracking-widest uppercase overflow-hidden select-none z-50">
        <div className="w-full flex overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex space-x-20 pr-20 min-w-full justify-around shrink-0">
            <span className="flex items-center gap-2"><Phone size={10} /> +91 93615 71902</span>
            <span className="flex items-center gap-2"><Mail size={10} /> ravanaholidaysofficial@gmail.com</span>
            <span className="flex items-center gap-2"><Phone size={10} /> +91 93615 71902</span>
            <span className="flex items-center gap-2"><Mail size={10} /> ravanaholidaysofficial@gmail.com</span>
          </div>
          <div className="animate-marquee whitespace-nowrap flex space-x-20 pr-20 min-w-full justify-around shrink-0" aria-hidden="true">
            <span className="flex items-center gap-2"><Phone size={10} /> +91 93615 71902</span>
            <span className="flex items-center gap-2"><Mail size={10} /> ravanaholidaysofficial@gmail.com</span>
            <span className="flex items-center gap-2"><Phone size={10} /> +91 93615 71902</span>
            <span className="flex items-center gap-2"><Mail size={10} /> ravanaholidaysofficial@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className={`w-full transition-all duration-500 ${
        scrolled
          ? 'py-0.5 bg-black/90 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.4)] border-b border-white/[0.03]'
          : 'py-2 bg-transparent'
      }`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center shrink-0 relative -top-1">
              <img src={logo} alt="Ravana Holidays - Premium Travel Agency" className="h-24 w-auto object-contain drop-shadow-lg" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] rounded-lg transition-all relative ${
                    isActive(path) ? 'text-primary bg-primary/5' : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                  }`}
                >
                  {label}
                  {isActive(path) && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-primary rounded-full" />}
                </Link>
              ))}

              {/* Dropdown menus */}
              {[
                { key: 'domestic', label: 'Domestic' },
                { key: 'international', label: 'International' },
                { key: 'packages', label: 'Packages' },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(key)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <button className={`flex items-center space-x-1 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] rounded-lg transition-all ${
                    activeMenu === key ? 'text-primary bg-primary/5' : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
                  }`}>
                    <span>{label}</span>
                    <ChevronDown size={10} className={`transition-transform duration-200 ${activeMenu === key ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <a
                href="https://wa.me/919361571902?text=Hi%20Ravana%20Holidays!%20I'm%20interested%20in%20booking%20a%20trip.%20Could%20you%20please%20share%20more%20details%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center space-x-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-[#25D366]/20 hover:border-[#25D366]/40"
              >
                <Phone size={12} />
                <span>Enquire</span>
              </a>

              {userInfo ? (
                <div className="relative">
                  <button onClick={() => setUserDropdown(!userDropdown)} className="flex items-center space-x-2 bg-white/[0.04] px-4 py-2.5 rounded-xl border border-white/[0.06] hover:border-primary/30 transition-all">
                    <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest hidden sm:block">{userInfo.name.split(' ')[0]}</span>
                  </button>
                  <AnimatePresence>
                    {userDropdown && (
                      <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-3 w-52 bg-background/95 backdrop-blur-2xl border border-white/[0.06] rounded-2xl overflow-hidden shadow-2xl py-2 z-50">
                        <Link to="/dashboard" onClick={() => setUserDropdown(false)} className="flex items-center space-x-3 px-5 py-2.5 hover:bg-white/[0.04] text-white/70 text-xs font-medium transition-colors">
                          <User size={14} className="text-primary/60" /> <span>My Account</span>
                        </Link>
                        {userInfo.role === 'admin' && (
                          <Link to="/admin/dashboard" onClick={() => setUserDropdown(false)} className="flex items-center space-x-3 px-5 py-2.5 hover:bg-white/[0.04] text-white/70 text-xs font-medium transition-colors">
                            <LayoutDashboard size={14} className="text-primary/60" /> <span>Admin Panel</span>
                          </Link>
                        )}
                        <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-5 py-2.5 hover:bg-red-400/5 text-red-400/80 text-xs font-medium border-t border-white/[0.04] mt-1 transition-colors">
                          <LogOut size={14} /> <span>Sign Out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="hidden md:flex items-center space-x-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] text-white/80 px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                >
                  <User size={12} />
                  <span>Login</span>
                </button>
              )}

              <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white/80 hover:text-primary transition-colors p-1">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mega Menus */}
      <AnimatePresence>
        {activeMenu === 'domestic' && <MegaMenu type="domestic" />}
        {activeMenu === 'international' && <MegaMenu type="international" />}
        {activeMenu === 'packages' && <CategoryMenu />}
      </AnimatePresence>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-background z-[100] flex flex-col p-8"
          >
            <div className="flex justify-between items-center mb-12">
              <div>
                <span className="text-2xl font-black text-white tracking-tight">MENU</span>
                <div className="w-8 h-0.5 bg-primary mt-1.5 rounded-full" />
              </div>
              <button onClick={() => setIsOpen(false)} className="w-10 h-10 bg-white/[0.04] rounded-full flex items-center justify-center text-white/60">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-1">
              {[
                { label: 'HOME', path: '/' },
                { label: 'ABOUT', path: '/about' },
                { label: 'PACKAGES', path: '/packages' },
                { label: 'CONTACT', path: '/contact' },
              ].map(({ label, path }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 text-3xl font-black tracking-tight transition-colors ${
                    isActive(path) ? 'text-primary' : 'text-white/80 hover:text-primary'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <a
                href="https://wa.me/919361571902?text=Hi%20Ravana%20Holidays!%20I'm%20interested%20in%20booking%20a%20trip.%20Could%20you%20please%20share%20more%20details%3F"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="block py-3 text-3xl font-black text-[#25D366] hover:text-[#128C7E] transition-colors tracking-tight"
              >
                WHATSAPP
              </a>
            </div>
            <div className="mt-auto pt-10">
              {userInfo ? (
                <div className="space-y-3">
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="block w-full text-center py-4 bg-white/[0.04] rounded-xl font-bold text-white/80 text-sm border border-white/[0.06]">My Account</Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-center py-4 text-red-400/80 font-bold text-sm">Sign Out</button>
                </div>
              ) : (
                <button onClick={() => { setIsOpen(false); openAuthModal('login'); }} className="w-full bg-primary text-background py-4 rounded-xl font-black uppercase tracking-widest text-sm shadow-lg shadow-primary/20">
                  Login / Register
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
