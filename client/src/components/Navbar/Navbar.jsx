import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Menu, X, User, LogOut, LayoutDashboard, ChevronDown, Star, Phone, Mail } from 'lucide-react';
import { fetchDestinations, fetchAllPackagesAdmin } from '../../api/api';
import logo from '../../assets/logo.PNG';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [destinations, setDestinations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null); // 'domestic', 'international', or 'packages'

  const location = useLocation();
  const navigate = useNavigate();
  
  const { userInfo, logout, openAuthModal } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const getInitialData = async () => {
      try {
        const { data: destData } = await fetchDestinations();
        setDestinations(destData);

        // Fetch unique categories from packages
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className={`fixed left-0 right-0 ${scrolled ? 'top-[105px]' : 'top-[132px]'} bg-background/95 backdrop-blur-xl border-t border-white/10 shadow-2xl z-40 mx-auto max-w-5xl rounded-b-[2rem] overflow-hidden`}
        onMouseEnter={() => setActiveMenu(type)}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="p-12 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {filtered.map((region) => (
              <div key={region._id} className="space-y-6">
                <div className="space-y-1">
                  <h4 className="text-xl font-bold text-white border-b-2 border-primary/30 pb-2 inline-block">{region.region}</h4>
                  <div className="flex space-x-1 pt-1 opacity-40">
                    {[...Array(3)].map((_, i) => <div key={i} className="w-4 h-[1px] bg-white"></div>)}
                  </div>
                </div>
                <ul className="space-y-3">
                  {region.cities.map((city, idx) => (
                    <li key={idx} className="group">
                      <Link
                        to={`/packages?city=${city.name}`}
                        className="flex items-center space-x-2 text-white/70 hover:text-primary transition-all text-sm font-medium"
                        onClick={() => setActiveMenu(null)}
                      >
                        <Star size={12} className="opacity-40 group-hover:opacity-100 transition-opacity" />
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className={`fixed left-0 right-0 ${scrolled ? 'top-[105px]' : 'top-[132px]'} bg-background/95 backdrop-blur-xl border-t border-white/10 shadow-2xl z-40 mx-auto max-w-sm rounded-b-[2rem] overflow-hidden`}
      onMouseEnter={() => setActiveMenu('packages')}
      onMouseLeave={() => setActiveMenu(null)}
    >
      <div className="p-8 max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
        <h4 className="text-sm font-bold text-primary uppercase tracking-widest mb-4 sticky top-0 bg-background/95 pb-2">Browse Categories</h4>
        <ul className="space-y-4">
          {categories.map((cat, idx) => (
            <li key={idx}>
              <Link
                to={`/packages?category=${cat}`}
                className="text-white/70 hover:text-primary transition-all text-sm font-medium flex items-center space-x-2"
                onClick={() => setActiveMenu(null)}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
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
      {/* Top Scrolling Marquee Navbar */}
      <div className="w-full bg-primary text-white py-2 text-[10px] font-black tracking-widest uppercase overflow-hidden border-b border-white/5 select-none z-50">
        <div className="w-full flex overflow-hidden">
          <div className="animate-marquee whitespace-nowrap flex space-x-20 pr-20 min-w-full justify-around shrink-0">
            <span className="flex items-center gap-2">
              <Phone size={12} className="text-white" /> +91 93615 71902
            </span>
            <span className="flex items-center gap-2">
              <Mail size={12} className="text-white" /> ravanaholidaysofficial@gmail.com
            </span>
            <span className="flex items-center gap-2">
              <Phone size={12} className="text-white" /> +91 93615 71902
            </span>
            <span className="flex items-center gap-2">
              <Mail size={12} className="text-white" /> ravanaholidaysofficial@gmail.com
            </span>
          </div>
          <div className="animate-marquee whitespace-nowrap flex space-x-20 pr-20 min-w-full justify-around shrink-0" aria-hidden="true">
            <span className="flex items-center gap-2">
              <Phone size={12} className="text-white" /> +91 93615 71902
            </span>
            <span className="flex items-center gap-2">
              <Mail size={12} className="text-white" /> ravanaholidaysofficial@gmail.com
            </span>
            <span className="flex items-center gap-2">
              <Phone size={12} className="text-white" /> +91 93615 71902
            </span>
            <span className="flex items-center gap-2">
              <Mail size={12} className="text-white" /> ravanaholidaysofficial@gmail.com
            </span>
          </div>
        </div>
      </div>

      <div className={`w-full transition-all duration-500 ${scrolled ? 'py-1 bg-black/95 backdrop-blur-xl shadow-2xl border-b border-white/10' : 'py-2 bg-transparent'}`}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8">
          <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center group shrink-0 relative -top-2">
            <img src={logo} alt="Ravana Holidays" className="h-28 w-auto object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-2xl" />
          </Link>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center space-x-8 xl:space-x-12">
            <Link to="/" className={`text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-all relative group ${isActive('/') ? 'text-primary' : 'text-white/70'}`}>
              Home
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${isActive('/') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
            <Link to="/about" className={`text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-all relative group ${isActive('/about') ? 'text-primary' : 'text-white/70'}`}>
              About Us
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${isActive('/about') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>

            {/* Domestic Packages */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setActiveMenu('domestic')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className={`flex items-center space-x-1 text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-all ${activeMenu === 'domestic' ? 'text-primary' : 'text-white/70'}`}>
                <span>Domestic</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${activeMenu === 'domestic' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* International Packages */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setActiveMenu('international')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className={`flex items-center space-x-1 text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-all ${activeMenu === 'international' ? 'text-primary' : 'text-white/70'}`}>
                <span>International</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${activeMenu === 'international' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* All Packages Categories Hover */}
            <div
              className="relative group py-2"
              onMouseEnter={() => setActiveMenu('packages')}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <button className={`flex items-center space-x-1 text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-all ${activeMenu === 'packages' ? 'text-primary' : 'text-white/70'}`}>
                <span>Packages</span>
                <ChevronDown size={12} className={`transition-transform duration-300 ${activeMenu === 'packages' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <Link to="/contact" className={`text-xs font-bold uppercase tracking-[0.2em] hover:text-primary transition-all relative group ${isActive('/contact') ? 'text-primary' : 'text-white/70'}`}>
              Contact Us
              <span className={`absolute -bottom-1 left-0 h-[2px] bg-primary transition-all duration-300 ${isActive('/contact') ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          </div>

          {/* Action Section */}
          <div className="flex items-center space-x-6">
            <a
              href="https://wa.me/919361571902?text=Hi%20Ravana%20Holidays!%20I'm%20interested%20in%20booking%20a%20trip.%20Could%20you%20please%20share%20more%20details%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-green-500/20 hover:scale-105"
            >
              <Phone size={14} />
              <span>Enquire Now</span>
            </a>

            {userInfo ? (
              <div className="relative">
                <button onClick={() => setUserDropdown(!userDropdown)} className="flex items-center space-x-3 bg-white/5 px-5 py-2.5 rounded-2xl border border-white/10 hover:border-primary transition-all">
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">{userInfo.name.split(' ')[0]}</span>
                </button>
                <AnimatePresence>
                  {userDropdown && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-4 w-56 bg-background/95 backdrop-blur-xl border border-white/10 rounded-[1.5rem] overflow-hidden shadow-2xl py-3 z-50">
                      <Link to="/dashboard" onClick={() => setUserDropdown(false)} className="flex items-center space-x-3 px-6 py-3 hover:bg-primary/10 text-white text-xs font-bold uppercase tracking-widest">
                        <User size={14} className="text-primary" /> <span>My Account</span>
                      </Link>
                      {userInfo.role === 'admin' && (
                        <Link to="/admin/dashboard" onClick={() => setUserDropdown(false)} className="flex items-center space-x-3 px-6 py-3 hover:bg-primary/10 text-white text-xs font-bold uppercase tracking-widest">
                          <LayoutDashboard size={14} className="text-primary" /> <span>Admin Panel</span>
                        </Link>
                      )}
                      <button onClick={handleLogout} className="w-full flex items-center space-x-3 px-6 py-3 hover:bg-red-400/10 text-red-400 text-xs font-bold uppercase tracking-widest border-t border-white/5 mt-2">
                        <LogOut size={14} /> <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button 
                onClick={() => openAuthModal('login')} 
                className="hidden md:flex items-center space-x-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-black/20 hover:scale-105 active:scale-95"
              >
                <User size={14} />
                <span>Login</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white hover:text-primary transition-colors">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mega Menus */}
      <AnimatePresence>
        {activeMenu === 'domestic' && <MegaMenu type="domestic" />}
        {activeMenu === 'international' && <MegaMenu type="international" />}
        {activeMenu === 'packages' && <CategoryMenu />}
      </AnimatePresence>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, x: '100%' }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: '100%' }} className="fixed inset-0 bg-background z-[100] flex flex-col p-10">
            <div className="flex justify-between items-center mb-16">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white leading-none">MENU</span>
                <div className="w-12 h-1 bg-primary mt-2"></div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              {['Home', 'About', 'Packages', 'Contact'].map((item, i) => (
                <Link
                  key={i}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                  onClick={() => setIsOpen(false)}
                  className="block text-4xl font-black text-white hover:text-primary transition-colors tracking-tighter"
                >
                  {item.toUpperCase()}
                </Link>
              ))}
              <a
                href="https://wa.me/919361571902?text=Hi%20Ravana%20Holidays!%20I'm%20interested%20in%20booking%20a%20trip.%20Could%20you%20please%20share%20more%20details%3F"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsOpen(false)}
                className="block text-4xl font-black text-[#25D366] hover:text-[#128C7E] transition-colors tracking-tighter"
              >
                WHATSAPP ENQUIRE
              </a>
              <div className="pt-10 space-y-4">
                {userInfo ? (
                  <button onClick={handleLogout} className="text-red-400 font-bold uppercase tracking-widest text-lg">Sign Out</button>
                ) : (
                  <button onClick={() => { setIsOpen(false); openAuthModal('login'); }} className="block w-full bg-primary text-background text-center py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-primary/20">LOGIN / REGISTER</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default Navbar;
