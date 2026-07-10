import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero/Hero';
import Destinations from '../components/Destinations/Destinations';
import PackageCard from '../components/PackageCard/PackageCard';
import WhyChooseUs from '../components/WhyChooseUs/WhyChooseUs';
import RecentTours from '../components/RecentTours/RecentTours';
import Testimonials from '../components/Testimonials/Testimonials';
import { fetchPackages } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { createReview, fetchAllReviews } from '../api/api';
import { X, Star, Send, Heart, Compass, Users, Globe, Map, Calendar, ChevronRight } from 'lucide-react';

const CategoryCard = ({ title, icon: Icon, path, count, image }) => (
  <Link to={path} className="group relative overflow-hidden rounded-[2.5rem] h-64 shadow-2xl">
    <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
      <div>
        <div className="w-12 h-12 bg-primary/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-primary mb-4 border border-primary/20">
          <Icon size={24} />
        </div>
        <h3 className="text-2xl font-bold text-text group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-text/50 text-xs font-bold uppercase tracking-widest mt-1">{count} Packages Available</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
        <ChevronRight size={20} />
      </div>
    </div>
  </Link>
);

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ packageId: '', rating: 5, comment: '' });
  const [recentPackages, setRecentPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await fetchPackages();
        setPackages(data);
        
        // Fetch recently added packages (first 4)
        const sorted = [...data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentPackages(sorted.slice(0, 4));
        
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleSearch = () => {
    if (searchKeyword.trim()) {
      navigate(`/packages?keyword=${searchKeyword}`);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await createReview(reviewData);
      alert('Review submitted successfully!');
      setShowReviewModal(false);
      setReviewData({ packageId: '', rating: 5, comment: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to submit review. Please login.');
    }
  };

  const categories = [
    { title: 'Honeymoon', icon: Heart, path: '/packages?category=honeymoon', count: 12, image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80' },
    { title: 'Family Trips', icon: Users, path: '/packages?category=family', count: 24, image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80' },
    { title: 'Adventure', icon: Compass, path: '/packages?category=adventure', count: 18, image: 'https://images.unsplash.com/photo-1533240332313-0dbf2645396d?auto=format&fit=crop&q=80' },
    { title: 'International', icon: Globe, path: '/packages?category=international', count: 32, image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="overflow-hidden bg-background">
      <Hero />
      
      {/* Search Bar Floating - GT Style */}
      <div className="max-w-6xl mx-auto px-4 -mt-16 relative z-30">
        <div className="glass p-8 rounded-[3rem] shadow-2xl border border-white/5 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-2 border-r border-white/5 pr-8 w-full">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center space-x-2">
              <Map size={12} />
              <span>Where to next?</span>
            </label>
            <input 
              placeholder="Search Destination (e.g. Goa, Munnar)..." 
              className="bg-transparent text-xl font-bold outline-none w-full placeholder:text-text/20"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className="flex-1 space-y-2 border-r border-white/5 pr-8 w-full">
            <label className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center space-x-2">
              <Calendar size={12} />
              <span>Travel Style</span>
            </label>
            <select className="bg-transparent text-xl font-bold outline-none w-full appearance-none cursor-pointer" onChange={(e) => navigate(`/packages?category=${e.target.value.toLowerCase()}`)}>
              <option className="bg-card">Any Style</option>
              <option className="bg-card">Honeymoon</option>
              <option className="bg-card">Family Trips</option>
              <option className="bg-card">Adventure</option>
            </select>
          </div>
          <button 
            onClick={handleSearch}
            className="w-full md:w-auto bg-primary text-background px-12 py-5 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            Find Experiences
          </button>
        </div>
      </div>

      {/* Discover Your Next Adventure Section */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Discover Your <span className="text-primary">Next Adventure</span></h2>
            <p className="text-text/60">Checkout our recently added packages based on your favorite locations.</p>
          </div>
          <button onClick={() => navigate('/packages?sort=latest')} className="bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl font-bold transition-all border border-white/10">
            View Latest
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {recentPackages.map((pkg) => (
              <PackageCard key={pkg._id} pkg={pkg} />
            ))}
          </div>
        )}
      </section>

      {/* Top Rated Section Trigger */}
      <section className="py-24 bg-primary/10 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8 relative z-10">
          <div className="flex justify-center space-x-2 text-primary">
            {[...Array(5)].map((_, i) => <Star key={i} fill="currentColor" size={24} />)}
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white">Top Rated Experiences</h2>
          <p className="text-text/70 text-lg">Your feedback helps us curate better journeys. Share your experience with Ravana Holidays.</p>
          <button 
            onClick={() => setShowReviewModal(true)}
            className="bg-primary text-background px-12 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
          >
            Add Your Review ⭐
          </button>
        </div>
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80" className="w-full h-full object-cover" />
        </div>
      </section>

      <Destinations />

      {/* Discover Categories Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48"></div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-text tracking-tighter">Discover Your <span className="text-primary italic">Travel Style</span></h2>
              <p className="text-text/60 max-w-lg">Tailored experiences designed for every kind of traveler. Pick your passion and start exploring.</p>
            </div>
            <Link to="/packages" className="mt-8 md:mt-0 flex items-center space-x-2 text-primary font-bold group">
              <span>View All Categories</span>
              <ChevronRight className="transition-transform group-hover:translate-x-2" size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, idx) => (
              <CategoryCard key={idx} {...cat} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Best Value Packages Section */}
      <section className="py-24 bg-card/30 relative">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter">Premium <span className="text-primary italic">Experiences</span></h2>
            <p className="text-text/60 max-w-2xl mx-auto">Hand-picked packages that offer the best balance of luxury, comfort, and exploration.</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {packages.slice(0, 3).map((pkg) => (
                <PackageCard key={pkg._id} pkg={pkg} />
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <Link to="/packages" className="inline-flex items-center space-x-4 glass px-10 py-5 rounded-[2rem] font-bold text-text hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all group">
              <span>Explore More Destinations</span>
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center group-hover:bg-primary transition-all group-hover:text-background">
                <ChevronRight size={16} />
              </div>
            </Link>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <RecentTours />
      <Testimonials />

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowReviewModal(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-card border border-white/10 p-8 md:p-12 rounded-[3rem] w-full max-w-xl shadow-2xl"
            >
              <button onClick={() => setShowReviewModal(false)} className="absolute top-6 right-6 text-text/40 hover:text-white"><X size={32} /></button>
              <h3 className="text-3xl font-bold mb-8 tracking-tighter">Share Your Journey</h3>
              
              <form onSubmit={submitReview} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Select Package</label>
                  <select 
                    required 
                    className="w-full bg-background border border-white/5 p-4 rounded-xl outline-none focus:border-primary transition-colors appearance-none"
                    onChange={(e) => setReviewData({...reviewData, packageId: e.target.value})}
                  >
                    <option value="">Choose a package you visited...</option>
                    {packages.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Rating</label>
                  <div className="flex space-x-2">
                    {[1,2,3,4,5].map((num) => (
                      <button 
                        key={num} 
                        type="button" 
                        onClick={() => setReviewData({...reviewData, rating: num})}
                        className={`w-12 h-12 rounded-xl border border-white/5 flex items-center justify-center transition-all ${reviewData.rating >= num ? 'bg-primary text-background border-primary shadow-lg shadow-primary/20' : 'bg-background hover:border-primary/50'}`}
                      >
                        <Star size={18} fill={reviewData.rating >= num ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-widest">Review Comment</label>
                  <textarea 
                    placeholder="Tell us about your experience..." 
                    className="w-full bg-background border border-white/5 p-4 rounded-xl outline-none focus:border-primary transition-colors h-32 resize-none"
                    value={reviewData.comment}
                    onChange={(e) => setReviewData({...reviewData, comment: e.target.value})}
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-primary text-background py-5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <span>Submit Review</span>
                  <Send size={18} />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
