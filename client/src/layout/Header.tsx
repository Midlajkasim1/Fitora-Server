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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0d1f17]/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <ActivityIcon className="w-6 h-6 text-[#00ff94]" />
            <span className="text-white font-bold text-xl italic tracking-tighter uppercase">Fitora</span>
          </Link>
        </div>

        {/* Navigation */}
        {showNav && (
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
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
          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu logic remains the same, just wrap its Sign Up button with {showSignup && ...} */}
    </header>
  );
};