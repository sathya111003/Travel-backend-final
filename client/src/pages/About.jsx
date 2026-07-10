import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Wallet, 
  PhoneCall, 
  HeartHandshake, 
  MapPin, 
  Compass, 
  Plane, 
  Hotel, 
  Car, 
  Train,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import RecentTours from '../components/RecentTours/RecentTours';

const StatCard = ({ label, value }) => (
  <div className="glass p-6 rounded-2xl text-center border border-white/5 shadow-lg">
    <h4 className="text-3xl font-black text-primary mb-2">{value}</h4>
    <p className="text-sm font-bold text-text/60 uppercase tracking-wider">{label}</p>
  </div>
);

const FeatureCard = ({ icon: Icon, title }) => (
  <div className="glass p-6 rounded-3xl flex items-center space-x-4 border border-white/5 hover:border-primary/30 transition-all hover:-translate-y-1">
    <div className="w-14 h-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center shrink-0">
      <Icon size={28} />
    </div>
    <h4 className="font-bold text-lg text-white">{title}</h4>
  </div>
);

const ServiceTag = ({ icon: Icon, title }) => (
  <div className="flex items-center space-x-2 bg-background/50 border border-white/10 px-4 py-2 rounded-full">
    <Icon className="w-4 h-4 text-primary" />
    <span className="text-sm font-bold text-text/80">{title}</span>
  </div>
);

const About = () => {
  return (
    <div className="pt-32 pb-20 bg-background min-h-screen overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* PREMIUM UI HERO SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          
          {/* Left Side: Image/Video */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10"
          >
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover"
            >
              <source src="https://assets.mixkit.co/videos/preview/mixkit-set-of-friends-on-a-boat-enjoying-the-sea-view-43666-large.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
          </motion.div>

          {/* Right Side: Content */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-block px-6 py-2 bg-primary/10 border border-primary/20 rounded-full">
              <span className="text-primary text-xs font-black uppercase tracking-widest">About Us</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter text-white">
              Your Trusted <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#F97316]">
                Travel Partner
              </span>
            </h1>

            <div className="space-y-4 text-lg text-text/70 leading-relaxed font-light">
              <p>
                We are a passionate and trusted travel company offering unforgettable domestic and international tour experiences. Our goal is to make every journey comfortable, exciting, and stress-free.
              </p>
              <p>
                From honeymoon packages and family vacations to adventure trips and luxury holidays, we provide complete travel planning including transport, accommodation, sightseeing, and personalized support.
              </p>
              <p className="font-bold text-white border-l-4 border-primary pl-4 py-2 bg-primary/5">
                "Our mission is to make travel simple, affordable, and memorable for every traveler."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <StatCard label="Happy Travelers" value="10,000+" />
              <StatCard label="Destinations" value="150+" />
              <StatCard label="Tour Packages" value="500+" />
              <StatCard label="Years Experience" value="5+" />
            </div>

            <div className="pt-4 flex space-x-4">
              <Link to="/packages" className="bg-primary text-background px-8 py-4 rounded-xl font-bold flex items-center space-x-2 hover:bg-primary/90 transition-all hover:scale-105">
                <span>View Packages</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/contact" className="glass px-8 py-4 rounded-xl font-bold hover:bg-white/5 transition-all">
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>

        {/* SERVICES WE PROVIDE */}
        <div className="mb-24 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-10">Services We Provide</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <ServiceTag icon={MapPin} title="Domestic Tours" />
            <ServiceTag icon={Compass} title="International Tours" />
            <ServiceTag icon={HeartHandshake} title="Honeymoon Packages" />
            <ServiceTag icon={Hotel} title="Family Trips" />
            <ServiceTag icon={Hotel} title="Hotel Booking" />
            <ServiceTag icon={Plane} title="Flight/Train Arrangements" />
            <ServiceTag icon={Car} title="Cab Services" />
          </div>
        </div>

        {/* WHY CHOOSE US */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Why Choose Us</h2>
            <p className="text-text/60 text-lg">We ensure the best quality service for your perfect trip.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={ShieldCheck} title="Trusted Travel Partner" />
            <FeatureCard icon={Wallet} title="Affordable Packages" />
            <FeatureCard icon={PhoneCall} title="24/7 Support" />
            <FeatureCard icon={HeartHandshake} title="Safe & Comfortable Travel" />
            <FeatureCard icon={Compass} title="Experienced Guides" />
            <FeatureCard icon={MapPin} title="Custom Tour Planning" />
          </div>
        </div>

        {/* REAL PHOTOS / GALLERY (Replaced with Recent Tours) */}
        <div className="-mx-4">
          <RecentTours title="Memories We Created" subtitle="Real glimpses of our tours and happy customers." />
        </div>

      </div>
    </div>
  );
};

export default About;
