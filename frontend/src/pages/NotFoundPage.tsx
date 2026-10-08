import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-text p-6 text-center flex items-center justify-center">
      <div className="max-w-md mx-auto">
        <div className="w-24 h-24 rounded-full bg-emerald-50 text-primary mx-auto mb-6 flex items-center justify-center">
          <AlertCircle className="h-12 w-12 text-primary" />
        </div>

        <h1 className="font-display text-5xl font-bold text-primary mb-2">
          404
        </h1>
        <p className="text-text-secondary mb-8">
          Page not found
        </p>

        <p className="text-text-secondary mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div>
          <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
            Go Home
          </Link>
          <Link to="/explore" className="ml-4 text-primary hover:underline">
            Browse Campaigns
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;