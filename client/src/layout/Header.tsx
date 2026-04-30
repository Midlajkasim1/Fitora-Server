import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ActivityIcon, Menu, X } from 'lucide-react';

interface HeaderProps {
  showNav?: boolean;
  showLogin?: boolean;
  showSignup?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  showNav = true, 
  showLogin = true, 
  showSignup = true 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d1f17] backdrop-blur-2xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between h-[73px]">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <ActivityIcon className="w-6 h-6 text-[#00ff94]" />
            <span className="text-white font-bold text-xl italic tracking-tighter uppercase">Fitora</span>
          </Link>
        </div>

        {/* Navigation */}
        {showNav && (
          <nav className="hidden lg:flex items-center gap-10 text-sm font-medium">
            <a href="#features" className="text-gray-300 hover:text-[#00ff94] transition-colors">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-[#00ff94] transition-colors">Pricing</a>
            <a href="#about" className="text-gray-300 hover:text-[#00ff94] transition-colors">About</a>
          </nav>
        )}

        <div className="flex items-center gap-6">
          {showLogin && (
            <Link to="/login" className="hidden sm:block text-white text-sm font-bold hover:text-[#00ff94] transition-colors">
              Log In
            </Link>
          )}
          
          {/* Conditional Sign Up Button */}
          {showSignup && (
            <Link to="/register">
              <button className="bg-[#00ff94] text-[#0d1f17] px-6 py-2.5 rounded-full font-black text-sm hover:scale-105 transition-all shadow-lg shadow-[#00ff94]/10">
                Sign Up
              </button>
            </Link>
          )}

          {/* Mobile Toggle */}
          <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>

    {/* Mobile Menu Overlay */}
    <div className={`lg:hidden fixed inset-0 z-[100] transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-[#07140f]/90 backdrop-blur-xl" 
        onClick={() => setIsOpen(false)}
      />
      
      {/* Menu Content */}
      <div className={`absolute right-0 top-0 bottom-0 w-[280px] bg-[#0d1f17] shadow-2xl border-l border-white/5 p-8 flex flex-col gap-6 transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between mb-4">
           <span className="text-white font-black italic uppercase tracking-tighter text-xl">Menu</span>
           <button onClick={() => setIsOpen(false)} className="p-2 text-gray-500 hover:text-white transition-colors">
             <X size={24} />
           </button>
        </div>

        {showNav && (
          <nav className="flex flex-col gap-6">
            <a href="#features" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-[#00ff94] font-bold uppercase italic tracking-widest transition-colors py-2 border-b border-white/5">Features</a>
            <a href="#pricing" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-[#00ff94] font-bold uppercase italic tracking-widest transition-colors py-2 border-b border-white/5">Pricing</a>
            <a href="#about" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-[#00ff94] font-bold uppercase italic tracking-widest transition-colors py-2 border-b border-white/5">About</a>
          </nav>
        )}
        
        <div className="mt-auto space-y-6">
          {showLogin && (
            <Link to="/login" onClick={() => setIsOpen(false)} className="block text-white text-center font-bold uppercase italic tracking-widest hover:text-[#00ff94] transition-colors py-4 border border-white/10 rounded-2xl">
              Log In
            </Link>
          )}
          {showSignup && (
            <Link to="/register" onClick={() => setIsOpen(false)}>
              <button className="w-full bg-[#00ff94] text-[#0d1f17] px-8 py-4 rounded-full font-black uppercase italic text-sm shadow-lg shadow-[#00ff94]/10">
                Sign Up Now
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  </>
  );
};