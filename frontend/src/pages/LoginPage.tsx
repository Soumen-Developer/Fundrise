import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, Shield, User, Loader2 } from 'lucide-react';
import Input from '@/components/input/Input';
import Button from '@/components/button/Button';
import { useAuth } from '@/components/auth/AuthProvider';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      const msg = 'Please enter both email and password';
      setErrorMessage(msg);
      toast(msg);
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password);
      toast('Logged in successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      setErrorMessage(msg);
      toast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage(null);
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

        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="leading-snug">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            label="Email Address"
          />

          <Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            label="Password"
          />

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-emerald-600 active:scale-[0.98] transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Log In'
            )}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border/40 text-center text-sm text-text-secondary">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Register here
          </Link>
        </div>

        {/* Demo Fast Fill */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border/40 text-xs text-text-secondary space-y-2">
          <p className="font-semibold text-text mb-2">Demo Credentials (Quick Fill):</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleFillDemo('admin@fundrise.com', 'admin123')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-surface border border-border/60 text-text hover:border-primary hover:text-primary transition-colors text-xs font-medium cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-primary" /> Admin Account
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('priya@example.com', 'password123')}
              className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-surface border border-border/60 text-text hover:border-primary hover:text-primary transition-colors text-xs font-medium cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-primary" /> User Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;