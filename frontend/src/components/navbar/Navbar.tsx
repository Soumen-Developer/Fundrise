import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/90 backdrop-blur-sm py-4">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-primary text-2xl font-bold tracking-wider">
            FundRise
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/explore" className="text-text hover:text-primary transition-colors text-sm font-medium">Explore</Link>
            <Link to="/how-it-works" className="text-text hover:text-primary transition-colors text-sm font-medium">How It Works</Link>
            <Link to="/about" className="text-text hover:text-primary transition-colors text-sm font-medium">About</Link>
            <Link to="/contact" className="text-text hover:text-primary transition-colors text-sm font-medium">Contact</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/create-campaign"
            className="hidden sm:inline-flex items-center justify-center text-sm font-medium text-primary hover:text-primary-dark transition-colors px-3 py-1.5"
          >
            Start a Campaign
          </Link>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="text-sm font-medium text-text hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              {role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-xs bg-secondary/15 text-secondary font-semibold px-2.5 py-1 rounded hover:bg-secondary/25 transition-colors"
                >
                  Admin Panel
                </Link>
              )}
              <span className="text-text-secondary text-sm hidden lg:inline">
                ({user.name})
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-error hover:underline ml-1"
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
                className="text-sm bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors shadow-sm"
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