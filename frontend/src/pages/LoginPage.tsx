import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import Input from '@/components/input/Input';
import Button from '@/components/button/Button';
import { useAuth } from '@/components/auth/AuthProvider';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast('Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      toast('Logged in successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      toast(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-surface rounded-2xl p-8 border border-border/50 shadow-sm">
        <h2 className="font-display text-3xl font-bold text-center mb-2">
          Welcome Back
        </h2>
        <p className="text-text-secondary text-center mb-6 text-sm">
          Log in to manage your campaigns and donations
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
          />

          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
          />

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border/40 text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Register here
          </Link>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 text-xs text-text-secondary">
          <p className="font-semibold text-text mb-1">Demo Accounts:</p>
          <p>Admin: <code className="text-primary">admin@fundrise.com</code> / <code>admin123</code></p>
          <p>User: <code className="text-primary">priya@example.com</code> / <code>password123</code></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;