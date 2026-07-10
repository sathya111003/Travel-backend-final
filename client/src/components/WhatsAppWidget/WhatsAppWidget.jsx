import React from 'react';

const WhatsAppWidget = () => {
  return (
    <a 
      href="https://wa.me/919361571902?text=Hi%20Ravana%20Holidays!%20I'm%20interested%20in%20booking%20a%20trip.%20Could%20you%20please%20share%20more%20details%3F" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-[9999] group flex items-center"
      aria-label="WhatsApp Helpline"
    >
      <div className="absolute right-full mr-4 bg-white text-background px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 pointer-events-none whitespace-nowrap border-b-4 border-[#25D366]">
        Helpline
      </div>
      <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-2xl shadow-green-500/40 hover:scale-110 active:scale-95 transition-all relative">
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25"></div>
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.284l-.779 2.853 2.934-.769c.95.518 1.958.855 3.102.856h.004c3.179 0 5.765-2.586 5.767-5.766 0-3.18-2.585-5.77-5.769-5.77zm3.846 8.19c-.149.427-.852.793-1.156.843-.299.049-.595.089-2.12-.515-1.956-.771-3.215-2.77-3.312-2.902-.099-.133-.814-1.084-.814-2.069 0-.985.515-1.468.699-1.667.184-.199.4-.249.531-.249.133 0 .266.002.383.006.113.004.266-.043.416.319.15.362.515 1.256.565 1.355.049.1.082.216.017.348s-.099.149-.199.266c-.099.116-.208.261-.299.348-.103.103-.211.213-.091.419.119.206.53.874 1.139 1.418.785.699 1.445.915 1.651 1.015.206.099.328.082.449-.057.119-.142.515-.597.648-.8.133-.203.266-.17.445-.103s1.13.533 1.326.632c.196.1.326.149.373.23.047.081.047.469-.102.896z"/>
        </svg>
      </div>
    </a>
  );
};

export default WhatsAppWidget;
