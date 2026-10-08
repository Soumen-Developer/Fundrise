import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'visitor' | 'user' | 'admin';
}

interface NavbarProps {
  user: User | null;
  role: 'visitor' | 'user' | 'admin';
  logout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, role, logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-sm py-3.5">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-primary text-2xl font-bold tracking-wider">
            FundRise
          </Link>
          <div className="hidden md:flex items-center gap-5">
            <Link to="/explore" className="text-text hover:text-primary transition-colors text-sm font-medium">Explore</Link>
            <Link to="/how-it-works" className="text-text hover:text-primary transition-colors text-sm font-medium">How It Works</Link>
            <Link to="/demo-payment" className="text-text hover:text-primary transition-colors text-sm font-medium inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Demo Payment
            </Link>
            <Link to="/about" className="text-text hover:text-primary transition-colors text-sm font-medium">About</Link>
            <Link to="/contact" className="text-text hover:text-primary transition-colors text-sm font-medium">Contact</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/create-campaign"
            className="hidden sm:inline-flex items-center justify-center text-sm font-medium text-primary hover:text-primary-dark transition-colors px-3 py-1.5"
          >
            Start a Campaign
          </Link>

          {user ? (
            <div className="flex items-center gap-2.5">
              <Link
                to="/dashboard"
                className="text-sm font-medium text-text hover:text-primary transition-colors px-2 py-1"
              >
                Dashboard
              </Link>
              {role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-xs inline-flex items-center gap-1 bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-semibold px-2.5 py-1 rounded-full hover:bg-amber-500/25 transition-colors"
                >
                  <ShieldCheck className="w-3 h-3" /> Admin Panel
                </Link>
              )}
              <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-border/40 text-xs font-medium text-text">
                <span className="w-4 h-4 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                  {user.name?.charAt(0) || 'U'}
                </span>
                <span className="max-w-[120px] truncate">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-text hover:text-primary font-medium transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="text-sm bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-sm cursor-pointer"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;