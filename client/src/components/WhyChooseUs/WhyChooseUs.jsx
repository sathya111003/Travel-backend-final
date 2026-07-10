import React from 'react';
import { ShieldCheck, Headphones, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <DollarSign className="w-8 h-8 text-primary" />,
    title: 'Best Price Guarantee',
    desc: 'We offer the most competitive prices for luxury travel experiences.'
  },
  {
    icon: <Headphones className="w-8 h-8 text-primary" />,
    title: '24/7 Customer Support',
    desc: 'Our travel experts are always available to help you during your trip.'
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-primary" />,
    title: 'Trusted & Secure',
    desc: '100% secure payments and verified travel partners worldwide.'
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text mb-4">Why Choose Us?</h2>
          <p className="text-text/60">We make your travel planning stress-free and exciting.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="glass p-10 rounded-3xl border border-primary/10 hover:border-primary/40 transition-all text-center group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold mb-4">{item.title}</h4>
              <p className="text-text/60 leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
