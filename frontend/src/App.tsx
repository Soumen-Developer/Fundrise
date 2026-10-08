import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/components/auth/AuthProvider';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AboutPage from './pages/AboutPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

const AppContent: React.FC = () => {
  const { user, role, logout } = useAuth();

  // Route guard: redirect if not authenticated
  const requireAuth = (element: React.ReactElement) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return element;
  };

  // Route guard: redirect if not admin
  const requireAdmin = (element: React.ReactElement) => {
    if (!user || role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    return element;
  };

  return (
    <div className="min-h-screen bg-background text-text flex flex-col justify-between">
      <div>
        <Navbar user={user} role={role} logout={logout} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/campaign/:id" element={<CampaignDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Protected routes */}
            <Route
              path="/create-campaign"
              element={requireAuth(<CreateCampaignPage />)}
            />
            <Route
              path="/dashboard"
              element={requireAuth(<UserDashboard />)}
            />
            <Route
              path="/admin"
              element={requireAdmin(<AdminDashboard />)}
            />

            {/* Auth routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
};

export default App;