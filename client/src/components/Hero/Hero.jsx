import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Shield, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background" aria-label="Hero">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 text-center pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-white/[0.06] backdrop-blur-md px-5 py-2 rounded-full mb-8 border border-white/[0.06]"
          >
            <MapPin className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-white/70 tracking-wide">India's Trusted Travel Partner</span>
          </motion.div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tight leading-[1.05]">
            Premium{' '}
            <span className="gradient-text">Travel Packages</span>
            <br />
            <span className="text-4xl md:text-5xl lg:text-6xl text-white/50 font-light tracking-normal">
              for Domestic & International Trips
            </span>
          </h1>

          {/* Subheading - SEO optimized */}
          <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Honeymoon packages, family vacations, adventure tours, and luxury holidays — all planned with transport, accommodation, and personalized support.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/packages"
              className="group bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center space-x-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98]"
            >
              <span>Explore Packages</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/80 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98]"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Floating Trust Cards */}
      <div className="absolute bottom-8 left-0 right-0 z-20 hidden md:block">
        <div className="max-w-5xl mx-auto px-4 flex justify-center gap-4">
          {[
            { icon: Shield, text: '100% Safe & Secure', sub: 'Verified Partners' },
            { icon: Clock, text: '24/7 Support', sub: 'Always Available' },
            { icon: Star, text: '4.8 Rated', sub: '10k+ Happy Clients' },
          ].map(({ icon: Icon, text, sub }, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.15, duration: 0.6 }}
              className="bg-white/[0.04] backdrop-blur-md px-6 py-3 rounded-xl border border-white/[0.05] flex items-center space-x-3"
            >
              <Icon size={16} className="text-primary shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">{text}</p>
                <p className="text-[10px] text-white/40">{sub}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
