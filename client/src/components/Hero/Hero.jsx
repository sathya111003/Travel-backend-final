import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden bg-[#0B1120]">
      {/* Background with Overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/80 via-[#0B1120]/60 to-[#0B1120]/90"></div>
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 text-center mt-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, type: 'spring', bounce: 0.4 }}
        >
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-sm font-bold mb-8 backdrop-blur-md border border-primary/20 shadow-lg shadow-primary/10"
          >
            <MapPin className="w-4 h-4 animate-bounce" />
            <span>Discover Your Next Adventure</span>
          </motion.span>

          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tighter leading-[1.1]">
            Explore the World with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#F97316] to-primary animate-gradient-x">
              Premium Travel Packages
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-secondary-text mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Experience domestic and international trips with full planning,
            luxurious stays, and unforgettable cinematic memories.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
            <Link
              to="/packages"
              className="group bg-primary hover:bg-primary/90 text-background px-10 py-5 rounded-full font-black text-lg uppercase tracking-widest transition-all flex items-center space-x-3 shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95"
            >
              <span>Explore Packages</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="glass px-10 py-5 rounded-full font-black text-lg uppercase tracking-widest hover:bg-white/10 transition-all border border-white/20 hover:scale-105 active:scale-95"
            >
              Book Now
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements - Only Top Rated kept */}
      <motion.div
        animate={{ y: [0, -25, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 left-12 hidden lg:block z-20"
      >
        <div className="glass p-5 rounded-3xl flex items-center space-x-5 shadow-2xl border border-white/10 backdrop-blur-xl">
          <div className="w-14 h-14 bg-[#F97316]/20 rounded-full flex items-center justify-center">
            <span className="text-[#F97316] font-black text-xl">5★</span>
          </div>
          <div>
            <p className="text-lg font-bold text-white">Top Rated</p>
            <p className="text-sm text-secondary-text font-medium">10k+ Happy Clients</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;
