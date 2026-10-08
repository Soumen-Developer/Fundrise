import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-surface text-text-secondary py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <h4 className="font-bold text-primary mb-4">FundRise</h4>
            <p className="text-text-secondary">
              Connecting people with causes they care about. Small contributions, big change.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-primary mb-4">Platform</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/explore" className="text-text-hover hover:text-primary transition-colors">Explore Campaigns</Link>
              </li>
              <li>
                <Link to="/about" className="text-text-hover hover:text-primary transition-colors">About</Link>
              </li>
              <li>
                <Link to="/contact" className="text-text-hover hover:text-primary transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-primary mb-4">Quick Links</h5>
            <ul className="space-y-2">
              <li>
                <Link to="/how-it-works" className="text-text-hover hover:text-primary transition-colors">How It Works</Link>
              </li>
              <li>
                <Link to="/terms" className="text-text-hover hover:text-primary transition-colors">Terms</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-text-hover hover:text-primary transition-colors">Privacy</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} FundRise. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1 text-xs text-primary font-medium bg-emerald-500/10 px-3 py-1 rounded-full">
              Built with purpose for positive impact
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;