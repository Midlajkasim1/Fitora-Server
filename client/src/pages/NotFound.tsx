import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#0a1810] flex flex-col items-center justify-center px-4 overflow-hidden relative selection:bg-[#00ff94] selection:text-[#0d1f17]">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#00ff94]/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#00ff94]/5 rounded-full blur-[100px]"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 2, 0, -2, 0]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <h1 className="text-[120px] sm:text-[150px] md:text-[200px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#00ff94] to-emerald-900/30 italic drop-shadow-2xl">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4 italic uppercase tracking-tighter">
            Out of <span className="text-[#00ff94]">Route</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-md mx-auto mb-10 leading-relaxed font-medium">
            The section you're looking for is currently unavailable in the Fitora database. Maybe it's still being calculated?
          </p>
        </motion.div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 bg-[#1a2e23] text-white px-8 py-4 rounded-full font-bold border border-white/5 hover:border-[#00ff94]/30 transition-all w-full sm:w-auto shadow-2xl"
          >
            <ArrowLeftIcon className="w-5 h-5" /> Go Back
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 bg-[#00ff94] text-[#0d1f17] px-8 py-4 rounded-full font-extrabold hover:shadow-[0_0_30px_rgba(0,255,148,0.4)] transition-all w-full sm:w-auto shadow-xl"
          >
            <HomeIcon className="w-5 h-5" /> Return Home
          </motion.button>
        </div>
      </motion.div>

      {/* Decorative Grid - subtle */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(#00ff94 1px, transparent 1px), linear-gradient(90deg, #00ff94 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      ></div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-gray-500 text-xs font-bold tracking-widest uppercase opacity-50"
      >
        <AlertCircle className="w-4 h-4" />
        <span>Status Code: 404 // Training Segment Missing</span>
      </motion.div>
    </div>
  );
};

export default NotFound;
