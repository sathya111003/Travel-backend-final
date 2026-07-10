import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import { fetchAllReviews } from '../../api/api';
import { Quote, Star } from 'lucide-react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Handle potential ESM default import issues
const SlickSlider = Slider.default || Slider;

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true
  };

  useEffect(() => {
    const getReviews = async () => {
      try {
        const { data } = await fetchAllReviews();
        setReviews(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    getReviews();
  }, []);

  if (loading) return null;
  if (reviews.length === 0) return null;

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-16"
        >
          What Our <span className="text-primary">Travelers Say</span>
        </motion.h2>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="glass p-10 md:p-16 rounded-[3rem] relative border border-primary/10 shadow-2xl"
        >
          <Quote className="w-16 h-16 text-primary/10 absolute top-8 left-8" />
          <SlickSlider {...settings}>
            {reviews.map((rev, i) => (
              <div key={i} className="space-y-8 outline-none">
                <div className="flex justify-center space-x-1 text-primary">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={18} className={idx < rev.rating ? 'fill-primary' : 'text-text/20'} />
                  ))}
                </div>
                
                <p className="text-xl md:text-2xl text-text/80 italic font-medium leading-relaxed px-4">
                  "{rev.comment}"
                </p>
                
                <div className="pt-4">
                  <h4 className="text-lg font-bold text-primary tracking-wide uppercase">{rev.name}</h4>
                  <p className="text-xs text-text/40 mt-1">Verified Traveler</p>
                </div>
              </div>
            ))}
          </SlickSlider>
        </motion.div>
      </div>
    </section>
  );
};

// Note: I'm adding motion imports if needed, but assuming it's available globally or imported correctly.
// Let's ensure motion is imported.
import { motion } from 'framer-motion';

export default Testimonials;
